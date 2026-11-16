/* BVT-11 — quick inquiry; no storage, backend or automatic send. */
(() => {
    'use strict';
    const form = document.getElementById('quickInquiry');
    if (!form) return;
    const products = ['kineos360', 'omnidate', 'parksoft', 'bauvi-notify', 'saliya'];
    const intents = ['developer', 'product', 'custom'];
    const sources = ['inicio', 'portfolio', 'perfil', 'contacto'];
    const params = new URLSearchParams(window.location?.search || '');
    const requested = params.get('interes');
    const source = sources.includes(params.get('origen')) ? params.get('origen') : 'contacto';
    const radios = Object.fromEntries(intents.map(key => [key, document.getElementById('quick-intent-' + key)]));
    const product = document.getElementById('quick-product');
    const group = document.getElementById('quick-product-group');
    const name = document.getElementById('quick-name');
    const message = document.getElementById('quick-message');
    const preview = document.getElementById('quick-preview');
    const translations = window.BauViTechTranslations;
    const selected = products.includes(requested) ? 'product' : intents.includes(requested) ? requested : 'custom';
    radios[selected].checked = true;
    product.value = products.includes(requested) ? requested : products[0];
    const bounded = (value, limit) => Array.from(value.trim()).slice(0, limit).join('');
    function currentIntent() { return intents.find(key => radios[key].checked) || 'custom'; }
    function buildMessage() {
        const lang = document.documentElement.lang === 'en' ? 'en' : 'es';
        const t = translations[lang];
        const intent = currentIntent();
        const key = intent === 'product' ? (products.includes(product.value) ? product.value : products[0]) : intent;
        const displayName = bounded(name.value, 100);
        const details = bounded(message.value, 1000);
        return [t['quick.greeting.' + key], displayName ? t['quick.message.name'] + ': ' + displayName : '', details, t['quick.message.source'] + ': ' + t['quick.source.' + source]].filter(Boolean).join('\n');
    }
    function refresh() {
        const isProduct = currentIntent() === 'product';
        group.hidden = !isProduct;
        product.disabled = !isProduct;
        preview.textContent = buildMessage();
    }
    Object.values(radios).forEach(radio => radio.addEventListener('change', refresh));
    product.addEventListener('change', refresh);
    name.addEventListener('input', refresh);
    message.addEventListener('input', refresh);
    document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', refresh));
    form.addEventListener('submit', event => {
        event.preventDefault();
        const query = new URLSearchParams({text: buildMessage()});
        window.open('https://wa.me/59891850930?' + query.toString(), '_blank', 'noopener,noreferrer');
    });
    refresh();
    form.hidden = false;
})();
