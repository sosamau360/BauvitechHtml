const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const pages = ['index.html','portfolio.html','contacto.html'];
const scripts = ['js/shared.js','js/index.i18n.js','js/portfolio.i18n.js','js/contacto.i18n.js','js/contacto.js'];
test('all JavaScript parses', () => { for (const name of scripts) assert.doesNotThrow(() => new Function(read(name)), name); });
test('pages have unique IDs, shared scripts and valid local HTML/CSS/JS links', () => {
 for (const name of pages) {
  const html = read(name);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size, ids.length, name);
  assert.ok(html.includes('src="js/shared.js"'), name);
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
   const value=m[1]; if (/^(?:https?:|mailto:|data:)/.test(value)) continue;
   const [file,fragment]=value.split('#');
   if (!file && fragment) assert.ok(ids.includes(fragment), name+': '+value);
   if (file && /\.(?:html|css|js)$/.test(file)) {
    const target=read(file); if(fragment) assert.ok(target.includes('id="'+fragment+'"'),value);
   }
  }
 }
});
test('approved product catalogue and both languages', () => {
 const html=read('portfolio.html');
 for (const name of ['Kineos360','OmniDate','ParkSoft','BauVi.Notify','SaliYa','Laserwork','Mazur','Licenciamiento']) assert.ok(html.includes(name),name);
 assert.ok(!/HydrateMe2|Tu Farmacólogo/.test(html));
 assert.equal((html.match(/class="project-card"/g)||[]).length,8);
 for (const page of pages) {
  const w={}; new Function('window',read('js/'+page.replace('.html','')+'.i18n.js'))(w);
  const d=w.BauViTechTranslations;
  for(const m of read(page).matchAll(/data-i18n="([^"]+)"/g)) for(const lang of ['es','en']) assert.ok(Object.hasOwn(d[lang],m[1]),page+': '+lang+': '+m[1]);
 }
});

test('Kineos360 uses official logo with text fallback', () => {
 const html = read('portfolio.html');
 assert.ok(html.includes('src="https://www.kineos360.uy/assets/img/logo.png" alt="Kineos360"'));
 assert.ok(html.includes('class="project-logo-fallback">Kineos360'));
 assert.ok(read('js/shared.js').includes("image.addEventListener('error'"));
});
