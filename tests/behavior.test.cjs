const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const read = name => fs.readFileSync(path.join(__dirname,'..',name),'utf8');
function el(tag='div',dataset={}) {
 const classes=new Set(), attrs=new Map(), events=new Map();
 return {dataset,style:{},value:'',textContent:'',placeholder:'',selectedOptions:[],focused:false,
 classList:{add:c=>classes.add(c),remove:c=>classes.delete(c),contains:c=>classes.has(c),toggle(c,force){const v=force===undefined?!classes.has(c):force;v?classes.add(c):classes.delete(c);return v;}},
 setAttribute:(k,v)=>attrs.set(k,v),getAttribute:k=>attrs.get(k),removeAttribute:k=>attrs.delete(k),
 matches:s=>s.split(',').map(x=>x.trim()).includes(tag),focus(){this.focused=true;},
 addEventListener:(k,fn)=>{if(!events.has(k))events.set(k,[]);events.get(k).push(fn);},
 fire(k,e={}){for(const fn of events.get(k)||[])fn({preventDefault(){},...e});},querySelectorAll:()=>[]};
}
function fixture(initial={},blocked=false,initialize=true) {
 const ids=Object.fromEntries(['hamburger','mobileMenu','theme-toggle','theme-toggle-m','icon-sun','icon-sun-m','icon-moon','icon-moon-m','budgetForm','err-name','err-email','err-type','err-desc'].map(id=>[id,el()]));
 ids['f-name']=el('input',{i18n:'name.placeholder'});ids['f-email']=el('input',{i18n:'email.placeholder'});
 ids['f-phone']=el('input');ids['f-type']=el('select');ids['f-desc']=el('textarea');
 const option=el('option',{i18n:'type.1'});ids['f-type'].selectedOptions=[option];
 const es=el('button',{lang:'es'}),en=el('button',{lang:'en'});
 const budget=[el('button',{i18n:'budget.1'}),el('button',{i18n:'budget.2'})],anchor=el('a');
 ids.mobileMenu.querySelectorAll=()=>[anchor];
 const html=el('html');html.lang='es';
 const doc=el();Object.assign(doc,{documentElement:html,getElementById:id=>ids[id]||null,
 querySelectorAll:s=>s==='[data-lang]'?[es,en]:s==='[data-i18n]'?[ids['f-name'],ids['f-email'],option,...budget]:s==='.budget-pill'?budget:[],
 querySelector:s=>s==='.budget-pill.selected'?budget.find(p=>p.classList.contains('selected')):s==='#budgetForm .error'?['f-name','f-email','f-type','f-desc'].map(id=>ids[id]).find(p=>p.classList.contains('error')):null});
 const data=new Map(Object.entries(initial)),opened=[];
 const storage={getItem(k){if(blocked)throw Error('blocked');return data.get(k);},setItem(k,v){if(blocked)throw Error('blocked');data.set(k,v);}};
 const window={open(...args){opened.push(args);}};
 new Function('window',read('js/contacto.i18n.js'))(window);
 if(initialize) new Function('window','document','localStorage',read('js/shared.js'))(window,doc,storage);
 new Function('window','document',read('js/contacto.js'))(window,doc);
 return {ids,doc,html,es,en,budget,anchor,data,opened,option};
}
test('language and theme persistence, menu and Escape',()=>{
 const x=fixture({'bvt-lang':'en','bvt-theme':'light'});
 assert.equal(x.html.lang,'en');assert.ok(x.html.classList.contains('light'),'initial light');
 assert.equal(x.ids['f-name'].placeholder,'Your name');
 x.es.fire('click');assert.equal(x.data.get('bvt-lang'),'es');assert.equal(x.ids['f-email'].placeholder,'tu@email.com');
 x.ids['theme-toggle'].fire('click');assert.equal(x.data.get('bvt-theme'),'dark');
 x.ids.hamburger.fire('click');assert.equal(x.ids.hamburger.getAttribute('aria-expanded'),'true');
 x.doc.fire('keydown',{key:'Escape'});assert.equal(x.ids.hamburger.getAttribute('aria-expanded'),'false');assert.ok(x.ids.hamburger.focused,'focus returned');
 x.ids.hamburger.fire('click');x.anchor.fire('click');assert.ok(!x.ids.mobileMenu.classList.contains('open'),'anchor closes menu');
});
test('storage unavailable and invalid preference',()=>{
 const x=fixture({},true);x.en.fire('click');assert.equal(x.html.lang,'en');x.ids['theme-toggle-m'].fire('click');assert.ok(x.html.classList.contains('light'),'theme works without storage');
 assert.equal(fixture({'bvt-lang':'invalid'}).html.lang,'es');
});
test('invalid quote marks fields and focuses the first, without opening WhatsApp',()=>{
 const x=fixture();x.ids.budgetForm.fire('submit');
 assert.equal(x.opened.length,0);assert.equal(x.ids['f-name'].getAttribute('aria-invalid'),'true');
 assert.ok(x.ids['f-name'].focused,'first invalid field');assert.ok(x.ids['err-email'].classList.contains('show'),'email error');
 x.ids['f-name'].value='Test';x.ids['f-name'].fire('input');assert.equal(x.ids['f-name'].getAttribute('aria-invalid'),undefined);
});
test('valid quote preserves translated selection and encoded text, budget optional',()=>{
 const x=fixture({'bvt-lang':'en'});
 x.ids['f-name'].value='Test & Co';x.ids['f-email'].value='test@example.com';x.ids['f-type'].value='Sistema de gestión';x.ids['f-desc'].value='Need a quote? #1';
 x.budget[0].fire('click');x.budget[1].fire('click');
 assert.equal(x.budget[0].getAttribute('aria-pressed'),'false');assert.equal(x.budget[1].getAttribute('aria-pressed'),'true');
 x.ids.budgetForm.fire('submit');assert.equal(x.opened.length,1);
 const message=decodeURIComponent(x.opened[0][0].split('?text=')[1]);
 for(const expected of ['Test & Co','Management system',x.budget[1].textContent,'Need a quote? #1'])assert.ok(message.includes(expected),'Missing '+expected+' in '+message);
 assert.equal(x.opened[0][2],'noopener,noreferrer');
 x.budget[1].fire('click');x.ids.budgetForm.fire('submit');assert.ok(!decodeURIComponent(x.opened[1][0]).includes('Budget:'),'budget deselected');
});

test('official logo fallback remains visible if load fails and hides on success',()=>{
 const image=el('img'), fallback=el('span'); image.complete=true; image.naturalWidth=0; image.hidden=true; fallback.hidden=false;
 const cover=el(); cover.querySelector=s=>s==='img'?image:fallback;
 const x=fixture(); const query=x.doc.querySelectorAll;
 x.doc.querySelectorAll=s=>s==='[data-product-logo]'?[cover]:query(s);
 const window={}; new Function('window',read('js/contacto.i18n.js'))(window);
 const storage={getItem:()=>null,setItem:()=>{}};
 new Function('window','document','localStorage',read('js/shared.js'))(window,x.doc,storage);
 assert.equal(image.hidden,true); assert.equal(fallback.hidden,false);
 image.naturalWidth=100; image.fire('load'); assert.equal(image.hidden,false); assert.equal(fallback.hidden,true);
 image.fire('error'); assert.equal(image.hidden,true); assert.equal(fallback.hidden,false);
});

test('Kineos360 switches both theme logos, restores persisted theme and retains fallback',()=>{
 const image=el('img',{logoDark:'https://www.kineos360.uy/assets/img/logo.png',logoLight:'https://www.kineos360.uy/assets/img/logoB.png'}), fallback=el('span');
 image.complete=true; image.naturalWidth=100; image.setAttribute('src',image.dataset.logoDark);
 const set=image.setAttribute; image.setAttribute=(k,v)=>{set(k,v);if(k==='src'){image.complete=false;image.naturalWidth=0;}};
 const cover=el();cover.querySelector=s=>s==='img'?image:fallback;
 const x=fixture({'bvt-theme':'light'},false,false); const query=x.doc.querySelectorAll;
 x.doc.querySelectorAll=s=>s==='[data-product-logo]'?[cover]:query(s);
 const window={};new Function('window',read('js/contacto.i18n.js'))(window);
 const storage={getItem:k=>x.data.get(k),setItem:(k,v)=>x.data.set(k,v)};
 new Function('window','document','localStorage',read('js/shared.js'))(window,x.doc,storage);
 assert.equal(image.getAttribute('src'),image.dataset.logoLight);assert.equal(image.hidden,true);assert.equal(fallback.hidden,false);
 image.complete=true;image.naturalWidth=100;image.fire('load');assert.equal(image.hidden,false);assert.equal(fallback.hidden,true);
 x.ids['theme-toggle'].fire('click');assert.equal(image.getAttribute('src'),image.dataset.logoDark);assert.equal(x.data.get('bvt-theme'),'dark');assert.equal(fallback.hidden,false);
 image.fire('error');assert.equal(fallback.hidden,false);assert.equal(image.hidden,true);
 x.ids['theme-toggle-m'].fire('click');assert.equal(image.getAttribute('src'),image.dataset.logoLight);
 image.complete=true;image.naturalWidth=100;image.fire('load');assert.equal(fallback.hidden,true);
});

test('theme buttons announce localized state and desktop resizing resets menu',()=>{
 const x=fixture({'bvt-lang':'en','bvt-theme':'light'},false,false);
 const media=el(), window={matchMedia:()=>media};
 new Function('window',read('js/contacto.i18n.js'))(window);
 const storage={getItem:k=>x.data.get(k),setItem:(k,v)=>x.data.set(k,v)};
 const nav=el('nav',{i18nAriaLabel:'a11y.nav'}), query=x.doc.querySelectorAll;
 x.doc.querySelectorAll=s=>s==='[data-i18n-aria-label]'?[nav]:query(s);
 new Function('window','document','localStorage',read('js/shared.js'))(window,x.doc,storage);
 assert.equal(x.ids['theme-toggle'].getAttribute('aria-pressed'),'true');
 assert.equal(x.ids['theme-toggle'].getAttribute('aria-label'),'Light theme');
 assert.equal(nav.getAttribute('aria-label'),'Main navigation');
 assert.equal(x.doc.title,'Contact and software quote | BauViTech');
 x.es.fire('click');assert.equal(nav.getAttribute('aria-label'),'Navegación principal');
 x.ids['theme-toggle-m'].fire('click');assert.equal(x.ids['theme-toggle'].getAttribute('aria-pressed'),'false');
 assert.equal(x.ids['theme-toggle'].getAttribute('aria-label'),'Tema claro');
 x.ids.hamburger.fire('click');media.fire('change',{matches:true});
 assert.equal(x.ids.hamburger.getAttribute('aria-expanded'),'false');
 assert.ok(!x.ids.mobileMenu.classList.contains('open'));
});

test('professional links follow language, fixed profile locale overrides preference',()=>{
 const x=fixture({'bvt-lang':'en'},false,false),link=el('a');
 const query=x.doc.querySelectorAll;x.doc.querySelectorAll=s=>s==='[data-profile-link]'?[link]:query(s);
 const window={};new Function('window',read('js/developer.i18n.js'))(window);
 const storage={getItem:k=>x.data.get(k),setItem:(k,v)=>x.data.set(k,v)};
 new Function('window','document','localStorage',read('js/shared.js'))(window,x.doc,storage);
 assert.equal(link.getAttribute('href'),'developer.html');
 x.es.fire('click');assert.equal(link.getAttribute('href'),'desarrollador.html');
 x.html.dataset.pageLang='en';x.data.set('bvt-lang','es');
 new Function('window','document','localStorage',read('js/shared.js'))(window,x.doc,storage);
 assert.equal(x.html.lang,'en');assert.equal(x.doc.title,'Remote .NET Developer | Mauricio Sosa · BauViTech');
});
