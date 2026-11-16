const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const read = name => fs.readFileSync(path.join(__dirname,'..',name),'utf8');
function element(dataset={}) {
 const events = new Map(), attrs = new Map();
 return {dataset,hidden:true,textContent:'',src:'',focused:false,addEventListener(k,fn){events.set(k,fn);},fire(k,e={}){events.get(k)?.(e);},setAttribute(k,v){attrs.set(k,v);},getAttribute(k){return attrs.get(k);},focus(){this.focused=true;},remove(){this.removed=true;}};
}
function fixture({enabled=true,id='G-TEST123456',hostname='www.bauvitech.com',protocol='https:',pathname='/contacto.html',search='',referrer='',stored='',lang='es',blocked=false}={}) {
 const ids=Object.fromEntries(['analytics-preferences','analytics-panel','analytics-settings','analytics-accept','analytics-reject','analytics-status'].map(k=>[k,element()]));
 const scripts=[],labels=[element({analyticsText:'title'}),element({analyticsText:'accept'})],langButton=element(),data=new Map(),docEvents=new Map();
 if(stored)data.set('bvt-analytics-consent-v1',stored);
 const document={documentElement:{lang},referrer,cookie:'',getElementById:k=>ids[k],querySelectorAll:s=>s==='[data-analytics-text]'?labels:s==='[data-lang]'?[langButton]:[],createElement:()=>element(),head:{appendChild:s=>scripts.push(s)},addEventListener:(k,fn)=>docEvents.set(k,fn)};
 const events=new Map(),window={BauViTechAnalyticsConfig:{enabled,measurementId:id},location:{hostname,protocol,pathname,search,reload(){this.reloaded=true;}},localStorage:{getItem:k=>{if(blocked)throw Error('blocked');return data.get(k)||null;},setItem:(k,v)=>{if(blocked)throw Error('blocked');data.set(k,v);}},addEventListener:(k,fn)=>events.set(k,fn)};
 new Function('window','document',read('js/analytics.js'))(window,document);
 const commands=()=>Array.from(window.dataLayer||[],x=>Array.from(x));
 return {window,document,ids,scripts,labels,langButton,data,events,docEvents,commands,track:(...x)=>window.BauViTechAnalytics.track(...x)};
}
test('analytics is off by default, invalid ID, local host, HTTP or unknown page',()=>{
 for(const opts of [{enabled:false},{id:''},{id:'G-INVALID?'},{hostname:'localhost'},{protocol:'http:'},{pathname:'/private.html'}]){
  const x=fixture(opts);assert.equal(x.scripts.length,0);assert.equal(x.ids['analytics-preferences'].hidden,true);assert.equal(x.track('product_interest','kineos360','inicio','details'),false);
 }
});
test('explicit consent loads one tag and one manual page view; reject sends nothing',()=>{
 const x=fixture();assert.equal(x.scripts.length,0);assert.equal(x.ids['analytics-panel'].hidden,false);
 x.ids['analytics-reject'].fire('click');assert.equal(x.scripts.length,0);assert.equal(x.track('product_interest','kineos360','inicio','details'),false);
 x.ids['analytics-settings'].fire('click');x.ids['analytics-accept'].fire('click');
 assert.equal(x.scripts.length,1);assert.equal(x.scripts[0].referrerPolicy,'no-referrer');
 assert.equal(x.commands().filter(c=>c[0]==='event'&&c[1]==='page_view').length,1);
 const config=x.commands().find(c=>c[0]==='config')[2];assert.equal(config.send_page_view,false);assert.equal(config.allow_google_signals,false);
 x.ids['analytics-accept'].fire('click');assert.equal(x.scripts.length,1);
});
test('bounded events discard personal fields, unknown tokens, arbitrary URLs and duplicate clicks',()=>{
 const x=fixture({stored:'accepted',search:'?utm_source=alice%40example.com&text=SECRET&phone=123',referrer:'https://evil.example/?email=alice@example.com'});
 assert.equal(x.track('product_interest','omnidate','portfolio','inquiry'),true);
 assert.equal(x.track('product_interest','omnidate','portfolio','inquiry'),false);
 assert.equal(x.track('product_interest','alice@example.com','portfolio','inquiry'),false);
 assert.equal(x.track('purchase','omnidate','portfolio','inquiry'),false);
 assert.equal(x.track('whatsapp_contact_click','developer','private','whatsapp'),false);
 assert.equal(x.track('quote_request_click','custom','contacto','quote'),true);
 const serialized=JSON.stringify(x.commands());
 for(const forbidden of ['alice','SECRET','evil.example','phone=','?utm_'])assert.ok(!serialized.includes(forbidden),forbidden);
 const event=x.commands().find(c=>c[1]==='product_interest')[2];assert.equal(event.commercial_interest,'omnidate');assert.equal(event.page_location,'https://www.bauvitech.com/contacto.html');
 assert.equal(event.page_referrer,'');
});
test('campaigns and known referrers use only approved values; locale follows selector',()=>{
 const x=fixture({stored:'accepted',lang:'en',search:'?utm_source=linkedin&utm_medium=social&utm_campaign=contratacion_dotnet',referrer:'https://www.linkedin.com/private?email=person@example.com'});
 const view=x.commands().find(c=>c[1]==='page_view')[2];assert.equal(view.campaign_source,'linkedin');assert.equal(view.campaign_name,'contratacion_dotnet');assert.equal(view.page_referrer,'https://www.linkedin.com/');
 assert.ok(!JSON.stringify(x.commands()).includes('person@example.com'));
 x.document.documentElement.lang='es';x.langButton.fire('click');assert.equal(x.labels[0].textContent,'Tu elección de analítica');
 assert.equal(x.track('developer_interest','developer','perfil','profile'),true);assert.equal(x.commands().find(c=>c[1]==='developer_interest')[2].site_language,'es');
});
test('revocation, cross-tab rejection and blocked storage preserve fail-closed behavior',()=>{
 const x=fixture({stored:'accepted'});
 x.ids['analytics-reject'].fire('click');assert.equal(x.window['ga-disable-G-TEST123456'],true);assert.equal(x.scripts[0].removed,true);assert.equal(x.track('inquiry_start','custom','contacto','form'),false);
 x.ids['analytics-accept'].fire('click');assert.equal(x.window.location.reloaded,true);
 const y=fixture({stored:'accepted'});y.data.set('bvt-analytics-consent-v1','rejected');y.events.get('storage')({key:'bvt-analytics-consent-v1'});assert.equal(y.track('developer_interest','developer','perfil','profile'),false);
 const z=fixture({blocked:true});assert.equal(z.scripts.length,0);z.ids['analytics-accept'].fire('click');assert.equal(z.scripts.length,1);
});
test('link click uses only declared categorical attributes and tag failure does not block contact',()=>{
 const x=fixture({stored:'accepted'});
 const anchor=element({analyticsEvent:'whatsapp_contact_click',analyticsInterest:'developer',analyticsAction:'whatsapp'});anchor.href='https://wa.me/123?text=PERSONAL';
 x.docEvents.get('click')({target:{closest:()=>anchor}});
 assert.ok(x.commands().some(c=>c[1]==='whatsapp_contact_click'));assert.ok(!JSON.stringify(x.commands()).includes('PERSONAL'));
 x.scripts[0].fire('error');assert.equal(x.track('email_contact_click','developer','perfil','email'),false);
});

test('cross-tab reaccept requires fresh document after revocation',()=>{
 const x=fixture({stored:'accepted'});
 x.data.set('bvt-analytics-consent-v1','rejected');x.events.get('storage')({key:'bvt-analytics-consent-v1'});
 x.data.set('bvt-analytics-consent-v1','accepted');x.events.get('storage')({key:'bvt-analytics-consent-v1'});
 assert.equal(x.track('developer_interest','developer','perfil','profile'),false);
 x.ids['analytics-accept'].fire('click');assert.equal(x.window.location.reloaded,true);
});
