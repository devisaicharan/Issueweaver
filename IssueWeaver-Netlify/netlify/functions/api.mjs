import voiceWorker from '../../src/voice-worker.mjs';
const reply=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
export async function handle(request,env,fetcher=fetch){
 const url=new URL(request.url),path=url.pathname;
 if(!['/api/status','/api/speak','/api/transcribe'].includes(path))return reply({error:'Not found'},404);
 if(path==='/api/status'&&request.method!=='GET'||path!=='/api/status'&&request.method!=='POST')return reply({error:'Method not allowed'},405);
 if(path!=='/api/status'&&request.headers.get('Origin')!==url.origin)return reply({error:'Invalid origin'},403);
 const token=request.headers.get('Authorization');let user=null;
 if(token?.startsWith('Bearer ')&&env.SUPABASE_URL&&env.SUPABASE_PUBLISHABLE_KEY){try{const response=await fetcher(env.SUPABASE_URL+'/auth/v1/user',{headers:{apikey:env.SUPABASE_PUBLISHABLE_KEY,Authorization:token},signal:AbortSignal.timeout(5000)});if(response.ok)user=await response.json()}catch{return reply({error:'Sign-in service unavailable. Try again.'},503)}}
 const voiceEnabled=!!env.GNANI_API_KEY&&env.VOICE_ENABLED==='true';
 if(path==='/api/status')return reply({configured:voiceEnabled&&!!user?.id,local:false,voiceAccess:'signed-in'});
 if(!user?.id)return reply({error:'Sign in with Google before using voice.'},401);
 if(!voiceEnabled)return reply({error:'Voice is not enabled by the app owner. Typed reports remain available.'},503);
 if(Number(request.headers.get('Content-Length')||0)>4.2*1024*1024)return reply({error:'Audio must be under 4 MB.'},413);
 // Validate before spending a daily allowance or calling Gnani.
 try{if(path==='/api/speak'){const data=await request.clone().json();const languages=await import('../../src/languages.json',{with:{type:'json'}});const language=languages.default.find(l=>l.code===data.language&&l.voice);if(!language||!language.questions.includes(data.text))return reply({error:'Choose a supported question.'},400)}else{const form=await request.clone().formData(),file=form.get('audio_file');if(!file||typeof file==='string'||!file.size||file.size>4*1024*1024)return reply({error:'Audio must be under 4 MB.'},400)}}catch{return reply({error:'Invalid voice request.'},400)}
 try{const quota=await fetcher(env.SUPABASE_URL+'/rest/v1/rpc/iw_take_voice_request',{method:'POST',headers:{apikey:env.SUPABASE_PUBLISHABLE_KEY,Authorization:token,'Content-Type':'application/json'},body:'{}',signal:AbortSignal.timeout(5000)});if(!quota.ok)return reply({error:'Voice allowance service unavailable. Retry later.'},503);if(await quota.json()!==true)return reply({error:'Daily voice limit reached (20 requests). You can still type and save reports.'},429)}catch{return reply({error:'Voice allowance service unavailable. Retry later.'},503)}
 return voiceWorker.fetch(request,{GNANI_API_KEY:env.GNANI_API_KEY,LOCAL_MODE:'true'});
}
export default request=>handle(request,process.env);
export const config={path:'/api/*',rateLimit:{windowLimit:30,windowSize:60,aggregateBy:['ip','domain'],action:'rate_limit'}};
