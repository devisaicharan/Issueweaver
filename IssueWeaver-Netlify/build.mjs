import fs from 'node:fs/promises';import {build} from 'esbuild';
const url=process.env.SUPABASE_URL||'https://flyxghrdeldpnlgwgoyg.supabase.co';
const key=process.env.SUPABASE_PUBLISHABLE_KEY||'sb_publishable_EaiBmyQWmTdS_HivJf6tcg_oeMW3SYR';
if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url)||!key.startsWith('sb_publishable_'))throw Error('Set the Supabase project URL and publishable key.');
await fs.mkdir('public',{recursive:true});
let html=await fs.readFile('src/page.html','utf8');
const app=html.match(/<script>([\s\S]*?)<\/script>/)[1];
// Keep account SDK, app, and tested cloud UI in one lexical scope.
const account=await fs.readFile('src/account.js','utf8'),cloud=await fs.readFile('src/cloud-ui.js','utf8');
await build({stdin:{contents:account+'\n'+app+'\n'+cloud+'\nwindow.iwAccountInit();',resolveDir:process.cwd(),sourcefile:'issueweaver.js'},bundle:true,format:'iife',platform:'browser',target:'es2022',outfile:'public/app.js',minify:true,define:{SUPABASE_URL:JSON.stringify(url),SUPABASE_PUBLISHABLE_KEY:JSON.stringify(key)}});
html=html.replace(/<script>[\s\S]*?<\/script>/,'<script src="/app.js" defer></script>');
await fs.writeFile('public/index.html',html);
const csp="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; media-src 'self' blob:; connect-src 'self' "+url+' '+url.replace('https:','wss:')+"; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'";
await fs.writeFile('public/_headers','/*\n  Content-Security-Policy: '+csp+'\n  Cache-Control: no-store\n');
console.log('Built IssueWeaver 1.7.0 for Netlify + Supabase.');
