-- IssueWeaver 1.7.0. Additive migration; run once in this project's SQL editor.
begin;
create table if not exists public.iw_reports (
 owner_id uuid not null references auth.users(id) on delete cascade,
 id text not null check (id ~ '^[a-zA-Z0-9_-]{1,80}$'),
 kind text not null check (kind in ('draft','report')),
 draft jsonb not null,
 revision integer not null default 1,
 updated_at timestamptz not null default now(),
 attachment_name text,
 primary key (owner_id,id)
);
alter table public.iw_reports enable row level security;
revoke all on public.iw_reports from anon, authenticated;
grant select on public.iw_reports to authenticated;
drop policy if exists iw_reports_read on public.iw_reports;
create policy iw_reports_read on public.iw_reports for select to authenticated using (owner_id=(select auth.uid()));

create or replace function public.iw_save_report(p_id text,p_kind text,p_draft jsonb,p_revision integer)
returns jsonb language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); existing public.iw_reports; k text; part text; clean jsonb; result public.iw_reports;
begin
 if u is null then raise exception 'Sign in required' using errcode='42501'; end if;
 if p_id is null or p_id !~ '^[a-zA-Z0-9_-]{1,80}$' or p_kind is null or p_kind not in ('draft','report') or p_revision is null or p_revision<0 or p_draft is null or octet_length(p_draft::text)>100000 then raise exception 'Invalid report'; end if;
 if jsonb_typeof(p_draft->'answers') is distinct from 'object' or jsonb_typeof(p_draft->'sources') is distinct from 'object' or jsonb_typeof(p_draft->'language') is distinct from 'string' or length(p_draft->>'language')>20 then raise exception 'Invalid report'; end if;
 clean:=jsonb_build_object('answers','{}'::jsonb,'sources','{}'::jsonb,'language',p_draft->>'language');
 foreach part in array array['answers','sources'] loop
  foreach k in array array['title','actual','steps','expected','environment','frequency'] loop
   if p_draft->part ? k then
    if jsonb_typeof(p_draft->part->k) is distinct from 'string' or length(p_draft->part->>k)>(case when part='answers' then 5000 else 10000 end) then raise exception 'Invalid report field'; end if;
    clean:=jsonb_set(clean,array[part,k],p_draft->part->k);
   end if;
  end loop;
 end loop;
 perform pg_advisory_xact_lock(hashtextextended(u::text,0));
 select * into existing from public.iw_reports where owner_id=u and id=p_id;
 if found then
  if existing.revision<>p_revision then raise exception 'Report changed on another device. Restore the cloud draft.' using errcode='40001'; end if;
  update public.iw_reports set draft=clean,kind=p_kind,revision=revision+1,updated_at=now() where owner_id=u and id=p_id returning * into result;
 else
  if p_revision<>0 then raise exception 'Report changed. Refresh cloud reports.' using errcode='40001'; end if;
  if (select count(*) from public.iw_reports where owner_id=u)>=500 then raise exception 'Account report limit reached (500).'; end if;
  insert into public.iw_reports(owner_id,id,kind,draft) values(u,p_id,p_kind,clean) returning * into result;
 end if;
 return jsonb_build_object('id',result.id,'revision',result.revision,'updated_at',result.updated_at);
end $$;

create or replace function public.iw_attachment_name(p_id text,p_name text)
returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'Sign in required' using errcode='42501'; end if;
 if p_name is not null and (length(p_name)>180 or p_name ~ '[[:cntrl:]/\\]') then raise exception 'Invalid filename'; end if;
 update public.iw_reports set attachment_name=p_name where owner_id=auth.uid() and id=p_id;
 if not found then raise exception 'Report not found'; end if;
end $$;
create or replace function public.iw_delete_report(p_id text)
returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'Sign in required' using errcode='42501'; end if;
 delete from public.iw_reports where owner_id=auth.uid() and id=p_id;
end $$;
revoke all on function public.iw_save_report(text,text,jsonb,integer),public.iw_attachment_name(text,text),public.iw_delete_report(text) from public,anon;
grant execute on function public.iw_save_report(text,text,jsonb,integer),public.iw_attachment_name(text,text),public.iw_delete_report(text) to authenticated;

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values('issueweaver-evidence','issueweaver-evidence',false,5242880,array['image/png','image/jpeg','image/webp'])
on conflict(id) do update set public=false,file_size_limit=5242880,allowed_mime_types=array['image/png','image/jpeg','image/webp'];
drop policy if exists iw_evidence_select on storage.objects;
drop policy if exists iw_evidence_insert on storage.objects;
drop policy if exists iw_evidence_update on storage.objects;
drop policy if exists iw_evidence_delete on storage.objects;
create policy iw_evidence_select on storage.objects for select to authenticated using (
 bucket_id='issueweaver-evidence' and (storage.foldername(name))[1]=(select auth.uid())::text
 and exists(select 1 from public.iw_reports r where r.owner_id=(select auth.uid()) and r.id=(storage.foldername(name))[2])
);
create policy iw_evidence_insert on storage.objects for insert to authenticated with check (
 bucket_id='issueweaver-evidence' and (storage.foldername(name))[1]=(select auth.uid())::text
 and exists(select 1 from public.iw_reports r where r.owner_id=(select auth.uid()) and r.id=(storage.foldername(name))[2])
);
create policy iw_evidence_update on storage.objects for update to authenticated using (
 bucket_id='issueweaver-evidence' and (storage.foldername(name))[1]=(select auth.uid())::text
) with check (
 bucket_id='issueweaver-evidence' and (storage.foldername(name))[1]=(select auth.uid())::text
 and exists(select 1 from public.iw_reports r where r.owner_id=(select auth.uid()) and r.id=(storage.foldername(name))[2])
);
create policy iw_evidence_delete on storage.objects for delete to authenticated using (
 bucket_id='issueweaver-evidence' and (storage.foldername(name))[1]=(select auth.uid())::text
);
-- Durable per-account daily voice allowance. Failed upstream calls still consume a request.
create table if not exists public.iw_voice_usage(owner_id uuid not null references auth.users(id) on delete cascade,day date not null,used integer not null,primary key(owner_id,day));
alter table public.iw_voice_usage enable row level security;
revoke all on public.iw_voice_usage from anon,authenticated;
create or replace function public.iw_take_voice_request()
returns boolean language plpgsql security definer set search_path='' as $$
declare n integer;
begin
 if auth.uid() is null then return false; end if;
 insert into public.iw_voice_usage(owner_id,day,used) values(auth.uid(),(now() at time zone 'UTC')::date,1)
 on conflict(owner_id,day) do update set used=public.iw_voice_usage.used+1 where public.iw_voice_usage.used<20 returning used into n;
 return n is not null;
end $$;
revoke all on function public.iw_take_voice_request() from public,anon;
grant execute on function public.iw_take_voice_request() to authenticated;
commit;
