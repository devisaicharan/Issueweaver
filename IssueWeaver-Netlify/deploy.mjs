import {spawnSync} from 'node:child_process';import fs from 'node:fs';
const CLI='netlify-cli@27.14.2';
function run(exe,args){const r=spawnSync(exe,args,{stdio:'inherit',shell:process.platform==='win32',env:Object.fromEntries(Object.entries(process.env).filter(([key])=>key!=='NETLIFY_SITE_ID'))});if(r.status!==0)throw Error('Deployment stopped. Read the message above, then retry.');}
if(Number(process.versions.node.split('.')[0])<22)throw Error('Install Node.js 22 or newer first.');
console.log('IssueWeaver deployment. Create a NEW Netlify site when asked. Do not select CampusOS.');
run('npm',['ci']);
run('npx',['--yes',CLI,'login']);
if(fs.existsSync('.netlify/state.json'))throw Error('Existing Netlify site detected. Helper stopped to protect live configuration.');
run('npx',['--yes',CLI,'sites:create']);
// Only public Supabase configuration is sent here. No Gnani key is read.
run('npx',['--yes',CLI,'env:set','SUPABASE_URL','https://flyxghrdeldpnlgwgoyg.supabase.co']);
run('npx',['--yes',CLI,'env:set','SUPABASE_PUBLISHABLE_KEY','sb_publishable_EaiBmyQWmTdS_HivJf6tcg_oeMW3SYR']);
run('npx',['--yes',CLI,'env:set','VOICE_ENABLED','false']);
run('npx',['--yes',CLI,'deploy','--prod']);
console.log('Send the production URL shown above in our chat. Google redirect configuration comes next.');
