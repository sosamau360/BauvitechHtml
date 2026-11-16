const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const pages = ['index.html','portfolio.html','contacto.html'];
const scripts = ['js/developer.i18n.js','js/shared.js','js/index.i18n.js','js/portfolio.i18n.js','js/contacto.i18n.js','js/contacto.js'];
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

test('BauVi.Notify uses the approved local banner without cropping', () => {
 const html=read('portfolio.html');
 const start=html.indexOf('data-i18n="notify.title"');
 const card=html.slice(html.lastIndexOf('<article class="project-card">',start),html.indexOf('</article>',start));
 assert.ok(card.includes('class="project-img notify-banner-cover"'));
 assert.ok(card.includes('src="img/bauvi-notify-banner.webp" alt="BauVi.Notify" width="960" height="573"'));
 const css=read('portfolio.css');
 const image=css.match(/\.notify-banner-cover img\s*\{([^}]+)\}/)[1];
 assert.ok(image.includes('object-fit: contain') && image.includes('object-position: center'));
 assert.ok(css.includes('.project-card:hover .notify-banner-cover img { transform: none; }'));
});

test('SaliYa stays in development with provisional logo and bilingual capabilities', () => {
 const html=read('portfolio.html');
 const start=html.indexOf('data-i18n="saliya.title"');
 const card=html.slice(html.lastIndexOf('<article class="project-card">',start),html.indexOf('</article>',start));
 assert.ok(start>html.indexOf('id="en-desarrollo"') && start<html.indexOf('id="casos"'));
 assert.ok(card.includes('data-i18n="product.development"') && card.includes('data-i18n="saliya.availability"'));
 assert.ok(card.includes('src="img/saliya-logo.svg"'));
 assert.ok(card.includes('data-i18n="saliya.feature3"'));
 assert.ok(card.includes('href="contacto.html" data-i18n="saliya.interest"'));
 assert.ok(read('img/saliya-logo.svg').includes('logotipo provisional'));
});

test('commercial v2 prioritizes developer services and preserves catalog',()=>{
 const h=read('index.html'),p=read('portfolio.html');
 assert.ok(h.indexOf('id="inicio"')<h.indexOf('id="servicios"')&&h.indexOf('id="servicios"')<h.indexOf('id="productos"'));
 assert.ok(h.includes('href="desarrollador.html" class="btn-primary" data-profile-link data-i18n="hero.talk"'));
 assert.ok(h.includes('href="#productos" class="btn-outline" data-i18n="hero.products"'));
 const s=h.slice(h.indexOf('id="productos"'),h.indexOf('id="sobre"'));
 assert.equal((s.match(/class="product-card"/g)||[]).length,2);
 for(const id of ['kineos360','omnidate','parksoft','bauvi-notify','saliya']){assert.ok(s.includes('href="portfolio.html#'+id+'"'));assert.ok(p.includes('id="'+id+'"'));}
 for(const asset of ['img/logoParkSoft.png','img/bauvi-notify-banner.webp','img/saliya-logo.svg'])assert.ok(p.includes(asset));
 assert.ok(s.includes('img/omnidate-logo.svg')&&s.includes('data-logo-light='));
 assert.ok(s.includes('https://www.kineos360.uy/')&&s.includes('https://omnidate.com.uy/'));
 assert.ok(s.includes('En desarrollo'));
 for(const id of ['problema','servicios','sobre','proceso','contacto'])assert.ok(h.includes('id="'+id+'"'));
});
test('landing product grid and image rules retain mobile layout and theme fallback', () => {
 const css=read('index.css');
 assert.ok(css.includes('.home-products .products-grid { grid-template-columns: repeat(2, minmax(0, 1fr))'));
 assert.ok(css.includes('.home-products .products-grid, .home-products .home-upcoming-card { grid-template-columns: minmax(0, 1fr)'));
 assert.ok(css.includes('.home-products .project-logo-cover [hidden] { display: none !important; }'));
 assert.ok(css.includes('.home-products .notify-banner-cover img { object-fit: contain; object-position: center; }'));
});

test('BVT-05 all pages expose accessible controls and main landmark', () => {
 for(const page of pages) {
  const html=read(page);
  assert.ok(html.includes('<html lang="es" class="dark">'));
  assert.ok(html.includes('class="skip-link" href="#contenido-principal"'));
  assert.ok(/<main[^>]+id="contenido-principal" tabindex="-1"/.test(html));
  assert.ok(html.includes('data-i18n-aria-label="a11y.nav"'));
  assert.ok(html.includes('data-i18n-aria-label="a11y.mobileNav"'));
  assert.equal((html.match(/class="floating-whatsapp"/g)||[]).length,1);
  assert.ok(html.includes('aria-label="Contactar por WhatsApp"'));
  assert.ok(!/onmouseover=|onmouseout=/.test(html));
  assert.equal((html.match(/id="theme-toggle(?:-m)?" title="Tema claro" aria-label="Tema claro" aria-pressed="false"/g)||[]).length,2);
  const w={};new Function('window',read('js/'+page.replace('.html','')+'.i18n.js'))(w);
  for(const m of html.matchAll(/data-i18n-aria-label="([^"]+)"/g))for(const lang of ['es','en']) assert.ok(Object.hasOwn(w.BauViTechTranslations[lang],m[1]));
 }
 assert.ok(!read('portfolio.html').includes('cdn.tailwindcss.com'));
 assert.ok(read('shared.css').includes('min-width: 1024px'));
 assert.ok(read('shared.css').includes('animation-iteration-count: 1 !important'));
 assert.ok(read('contacto.css').includes('font-size: 16px'));
});
test('BVT-06 each public page has unique canonical SEO metadata and valid JSON-LD', () => {
 const urls=['https://www.bauvitech.com/','https://www.bauvitech.com/portfolio.html','https://www.bauvitech.com/contacto.html'];
 const titles=new Set(), descriptions=new Set();
 pages.forEach((page,i)=>{
  const h=read(page), url=urls[i];
  const title=h.match(/<title>([^<]+)<\/title>/)[1];
  const desc=h.match(/<meta name="description" content="([^"]+)"/)[1];
  titles.add(title);descriptions.add(desc);
  assert.equal((h.match(/rel="canonical"/g)||[]).length,1);
  assert.ok(h.includes('rel="canonical" href="'+url+'"'));
  assert.ok(h.includes('property="og:url" content="'+url+'"'));
  assert.ok(h.includes('property="og:title" content="'+title+'"'));
  assert.ok(h.includes('property="og:description" content="'+desc+'"'));
  assert.ok(h.includes('name="robots" content="index, follow"'));
  assert.ok(h.includes('name="twitter:card" content="summary_large_image"'));
  const ld=JSON.parse(h.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(ld['@context'],'https://schema.org');
  assert.ok(ld['@graph'].some(x=>x['@type']==='WebPage' && x.url===url));
  assert.ok(!h.includes('hreflang='));
 });
 assert.equal(titles.size,3);assert.equal(descriptions.size,3);
 const sitemap=read('sitemap.xml');
 assert.equal((sitemap.match(/<loc>/g)||[]).length,5);
 for(const url of urls)assert.ok(sitemap.includes('<loc>'+url+'</loc>'));
 assert.ok(read('robots.txt').includes('Sitemap: https://www.bauvitech.com/sitemap.xml'));
});

test('IIS default document resolves index.html without clearing inherited documents or enabling directory browsing', () => {
 const config=read('web.config');
 assert.ok(read('index.html').includes('<!DOCTYPE html>'));
 assert.ok(/<defaultDocument\s+enabled="true">\s*<files>\s*<remove value="index\.html"\s*\/>\s*<add value="index\.html"\s*\/>\s*<\/files>\s*<\/defaultDocument>/.test(config));
 assert.ok(!/<clear\b|<directoryBrowse\b|<rewrite\b/.test(config));
});

test('BVT-10 static bilingual profile, reciprocal hreflang and valid local links',()=>{
 ['desarrollador.html','developer.html'].forEach((file,i)=>{
  const h=read(file),lang=i?'en':'es',url='https://www.bauvitech.com/'+file;
  assert.ok(h.includes('<html lang="'+lang+'" class="dark" data-page-lang="'+lang+'">'));
  assert.ok(h.includes('rel="canonical" href="'+url+'"'));
  assert.ok(h.includes('hreflang="es" href="https://www.bauvitech.com/desarrollador.html"'));
  assert.ok(h.includes('hreflang="en" href="https://www.bauvitech.com/developer.html"'));
  assert.ok(h.includes('href="desarrollador.html" lang="es" hreflang="es"'));
  assert.ok(h.includes('href="developer.html" lang="en" hreflang="en"'));
  assert.ok(h.includes('id="contenido-principal"')&&h.includes('src="js/shared.js"'));
  assert.ok(h.includes('href="mailto:sosamau360@gmail.com"')&&h.includes('https://wa.me/59891850930?text='));
  assert.ok(h.includes(i?'A .NET developer for your team':'Desarrollador .NET para tu equipo'));
  const ids=[...h.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);
  for(const m of h.matchAll(/(?:href|src)="([^"]+)"/g)){const v=m[1];if(/^(https?:|mailto:|data:)/.test(v))continue;const [p,frag]=v.split('#');if(!p&&frag)assert.ok(ids.includes(frag));if(p&&/\.(html|css|js)$/.test(p)){const c=read(p);if(frag)assert.ok(c.includes('id="'+frag+'"'));}}
  const ld=JSON.parse(h.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);assert.equal(ld.inLanguage,lang);assert.equal(ld.url,url);
  assert.ok(read('sitemap.xml').includes('<loc>'+url+'</loc>'));
 });
});

test('commercial navigation replaces the legacy about link without adding menu width',()=>{
 for(const file of ['index.html','portfolio.html','contacto.html']){
  const h=read(file), nav=h.slice(h.indexOf('<nav'),h.indexOf('<main'));
  assert.equal((nav.match(/data-profile-link/g)||[]).length,2);
  assert.ok(!nav.includes('data-i18n="nav.about"'));
 }
});
