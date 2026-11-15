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
 assert.ok(html.includes('data-logo-dark="https://www.kineos360.uy/assets/img/logo.png"'));
 assert.ok(html.includes('data-logo-light="https://www.kineos360.uy/assets/img/logoB.png"'));
 assert.ok(html.includes('data-i18n="kineos.feature3"'));
 assert.ok(html.includes('class="project-logo-fallback">Kineos360'));
 assert.ok(read('js/shared.js').includes("image.addEventListener('error'"));
});

test('Kineos360 links to its official site and keeps contact action', () => {
 const html=read('portfolio.html');
 const card=html.slice(html.indexOf('data-product-logo'),html.indexOf('</article>',html.indexOf('data-product-logo')));
 assert.ok(card.includes('href="https://www.kineos360.uy/" data-i18n="kineos.visit"'));
 assert.ok(card.includes('href="contacto.html" data-i18n="product.contact"'));
});

test('OmniDate card uses official local SVG, bilingual features and official link', () => {
 const html=read('portfolio.html');
 const start=html.indexOf('src="img/omnidate-logo.svg"');
 assert.ok(start>=0);
 const card=html.slice(start,html.indexOf('</article>',start));
 assert.ok(card.includes('href="https://omnidate.com.uy/"'));
 assert.ok(card.includes('href="contacto.html"'));
 assert.ok(card.includes('consultar disponibilidad'));
 assert.ok(card.includes('data-i18n="omnidate.feature3"'));
 assert.ok(read('img/omnidate-logo.svg').includes('viewBox="0 0 8816 4277"'));
 assert.ok(!read('img/omnidate-logo.svg').includes('<!DOCTYPE'));
 assert.ok(!html.includes('img/omnidate.jfif'));
});

test('ParkSoft retains the exact original image configuration and improved product information', () => {
 const html=read('portfolio.html');
 const start=html.indexOf('src="img/logoParkSoft.png"');
 assert.ok(start>=0);
 const card=html.slice(html.lastIndexOf('<article class="project-card">',start),html.indexOf('</article>',start));
 assert.ok(card.includes('<div class="project-img">'));
 assert.ok(card.includes('<div class="project-img-fallback" style="background: linear-gradient(135deg,#3b82f6,#06b6d4,#14b8a6);">'));
 assert.ok(card.includes('<img src="img/logoParkSoft.png" alt="ParkSoft" style="width:100%;height:100%;object-fit:cover;">'));
 assert.ok(card.includes('data-i18n="parksoft.feature3"'));
 assert.ok(card.includes('href="contacto.html" data-i18n="parksoft.demo"'));
 assert.ok(card.includes('SQLite'));
 assert.ok(!card.includes('data-product-logo'));
 assert.ok(!read('portfolio.css').includes('parksoft-original-cover'));
});

test('BauVi.Notify card distinguishes implemented WhatsApp from evolving capabilities', () => {
 const html=read('portfolio.html');
 const start=html.indexOf('data-i18n="notify.title"');
 assert.ok(start>=0);
 const card=html.slice(html.lastIndexOf('<article class="project-card">',start),html.indexOf('</article>',start));
 assert.ok(card.includes('WhatsApp') && card.includes('REST API'));
 assert.ok(card.includes('data-i18n="notify.feature3"'));
 assert.ok(card.includes('data-i18n="notify.roadmap"') && card.includes('disponibilidad sujeta a validación'));
 assert.ok(card.includes('href="contacto.html" data-i18n="notify.demo"'));
 assert.ok(!/\bSMS\b|Email|correo electrónico/.test(card));
});
