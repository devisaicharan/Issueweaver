import {createClient} from '@supabase/supabase-js';
const sb=createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{auth:{flowType:'pkce',detectSessionInUrl:true,persistSession:true,autoRefreshToken:true}});
let authenticatedUser=null,accountInitializationError=null;
const accountReady=(async()=>{try{const {data:{session},error}=await sb.auth.getSession();if(error)throw error;if(session){const {data,error}=await sb.auth.getUser();if(error)throw error;authenticatedUser=data.user}}catch(e){accountInitializationError=e}})();
window.iwVoiceFetch=async(input,options={})=>{await accountReady;const {data:{session}}=await sb.auth.getSession();const headers=new Headers(options.headers);if(session)headers.set('Authorization','Bearer '+session.access_token);return fetch(input,{...options,headers})};
function sbError(error){if(!error)return;const e=Error(error.code==='40001'?'This report changed on another device. Restore the cloud draft.':error.message||'Cloud storage is unavailable. Your browser copy is safe.');e.status=error.code==='40001'?409:error.status||503;throw e}
async function supabaseTransport(path,options={}){
 await accountReady;if(accountInitializationError)throw accountInitializationError;
 const method=options.method||'GET',json=data=>Response.json(data),bucket=sb.storage.from('issueweaver-evidence');
 if(path==='session')return json({user:authenticatedUser?{id:authenticatedUser.id,email:authenticatedUser.email}:null,ready:true});
 if(!authenticatedUser){const error=Error('Sign in with Google to use your account.');error.status=401;throw error}
 const parts=path.split('/'),id=decodeURIComponent(parts[1]||'');
 if(parts[0]!=='reports')throw Error('Unknown account request');
 if(!id){const {data,error}=await sb.from('iw_reports').select('id,kind,draft,revision,updated_at,attachment_name').order('updated_at',{ascending:false}).limit(501);sbError(error);return json({reports:data})}
 if(!/^[a-zA-Z0-9_-]{1,80}$/.test(id))throw Error('Invalid report ID');
 const object=authenticatedUser.id+'/'+id+'/screenshot';
 if(parts[2]==='attachment'){
  if(method==='GET'){const {data,error}=await bucket.download(object);sbError(error);return new Response(data,{headers:{'Content-Type':data.type}})}
  if(method==='DELETE'){const {error}=await bucket.remove([object]);sbError(error);const result=await sb.rpc('iw_attachment_name',{p_id:id,p_name:null});sbError(result.error);return json({ok:true})}
  if(method==='PUT'){const file=options.body;if(!(file instanceof Blob)||file.size>5*1024*1024)throw Error('Choose a screenshot under 5 MB.');const bytes=new Uint8Array(await file.slice(0,16).arrayBuffer());const valid=file.type==='image/png'&&[137,80,78,71,13,10,26,10].every((b,i)=>bytes[i]===b)||file.type==='image/jpeg'&&bytes[0]===255&&bytes[1]===216&&bytes[2]===255||file.type==='image/webp'&&String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP';if(!valid)throw Error('Choose a valid PNG, JPEG or WebP.');const {error}=await bucket.upload(object,file,{upsert:true,contentType:file.type});sbError(error);const name=decodeURIComponent(options.headers?.['X-Filename']||'screenshot').replace(/[\x00-\x1f\x7f/\\]/g,'_').slice(0,180);const result=await sb.rpc('iw_attachment_name',{p_id:id,p_name:name});sbError(result.error);return json({ok:true})}
 }
 if(method==='PUT'){const body=JSON.parse(options.body);const {data,error}=await sb.rpc('iw_save_report',{p_id:id,p_kind:body.kind,p_draft:body.draft,p_revision:body.revision});sbError(error);return json(data)}
 if(method==='DELETE'){const storage=await bucket.remove([object]);sbError(storage.error);const {error}=await sb.rpc('iw_delete_report',{p_id:id});sbError(error);return json({ok:true})}
 throw Error('Unknown account request');
}
async function downloadEvidence(item){try{const response=await supabaseTransport('reports/'+encodeURIComponent(item.id)+'/attachment');const url=URL.createObjectURL(await response.blob());const link=document.createElement('a');link.href=url;link.download=item.attachment_name||'screenshot';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000)}catch(e){toast(e.message)}}
async function refreshVoice(){try{const response=await window.iwVoiceFetch('/api/status'),data=await response.json();serverReady=!!data.configured;voiceReady=serverReady;syncVoiceControls();$('connectionBadge').textContent=voiceReady?'Voice ready':authenticatedUser?'Text mode':'Sign in for voice';$('connectionBadge').classList.toggle('pending',!voiceReady)}catch{status('Voice connection unavailable. Typed reports still work.',true)}}
window.iwAccountInit=()=>{
 $('accountLink').onclick=async event=>{event.preventDefault();await accountReady;try{
 if(authenticatedUser){if(busy||cloudWriting){toast('Wait for the current operation to finish.');return}if(cloudDirty&&!confirm('Some changes are only saved in this browser. Sign out anyway?'))return;cloudReady=false;cloudPaused=true;clearTimeout(cloudTimer);const {error}=await sb.auth.signOut({scope:'local'});if(error)throw error;cloudDirty=false;location.replace('/');return}
 if(accountInitializationError)accountInitializationError=null;
 const {error}=await sb.auth.signInWithOAuth({provider:'google',options:{redirectTo:location.origin+'/'}});if(error)throw error;
 }catch(e){cloudMessage(e.message)}};
 sb.auth.onAuthStateChange((event,session)=>{if(event==='SIGNED_OUT'&&authenticatedUser){authenticatedUser=null;cloudReady=false;cloudPaused=true;clearTimeout(cloudTimer);$('cloudActions').classList.add('hidden');$('cloudList').replaceChildren();$('accountName').textContent='';$('accountLink').textContent='Continue with Google';cloudMessage('Signed out. Browser recovery copies remain on this device.');setTimeout(refreshVoice,0)}});
 accountReady.then(()=>{const params=new URLSearchParams(location.search);if(params.has('error_description'))cloudMessage(params.get('error_description'));if(params.has('code')||params.has('error_description'))history.replaceState(null,'','/');refreshVoice()});
};
