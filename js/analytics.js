/* BVT-12 — optional GA4, explicit opt-in, bounded commercial telemetry. */
(() => {
    'use strict';
    if (window.BauViTechAnalytics) return;
    const config = window.BauViTechAnalyticsConfig || {};
    const id = typeof config.measurementId === 'string' ? config.measurementId.trim() : '';
    const location = window.location || {};
    const pages = {
        '/': ['inicio', 'https://www.bauvitech.com/'],
        '/index.html': ['inicio', 'https://www.bauvitech.com/'],
        '/portfolio.html': ['portfolio', 'https://www.bauvitech.com/portfolio.html'],
        '/contacto.html': ['contacto', 'https://www.bauvitech.com/contacto.html'],
        '/desarrollador.html': ['perfil', 'https://www.bauvitech.com/desarrollador.html'],
        '/developer.html': ['perfil', 'https://www.bauvitech.com/developer.html']
    };
    const page = Object.hasOwn(pages, location.pathname) ? pages[location.pathname] : null;
    const eligible = config.enabled === true && /^G-[A-Z0-9]{6,20}$/.test(id)
        && location.protocol === 'https:' && ['bauvitech.com', 'www.bauvitech.com'].includes(location.hostname) && !!page;
    const products = ['kineos360', 'omnidate', 'parksoft', 'bauvi-notify', 'saliya'];
    const interests = [...products, 'developer', 'custom', 'general'];
    const sources = ['inicio', 'portfolio', 'perfil', 'contacto'];
    const allowed = {
        product_interest: { interests: products, actions: ['details', 'inquiry'] },
        product_site_visit: { interests: ['kineos360', 'omnidate'], actions: ['official_site'] },
        developer_interest: { interests: ['developer'], actions: ['profile', 'inquiry'] },
        service_interest: { interests: ['custom'], actions: ['inquiry', 'quote'] },
        inquiry_start: { interests: [...products, 'developer', 'custom'], actions: ['form'] },
        whatsapp_contact_click: { interests, actions: ['whatsapp'] },
        quote_request_click: { interests: ['custom'], actions: ['quote'] },
        email_contact_click: { interests: ['developer', 'general'], actions: ['email'] }
    };
    const text = {
        es: {settings:'Preferencias de analítica',title:'Tu elección de analítica',description:'Con tu permiso, Google Analytics mide visitas y acciones comerciales. Es opcional y no recibe el texto que escribís en los formularios de contacto. Podés cambiar tu elección cuando quieras.',accept:'Aceptar analítica',reject:'Rechazar analítica',privacy:'Privacidad de Google',accepted:'Analítica aceptada.',rejected:'Analítica rechazada.'},
        en: {settings:'Analytics preferences',title:'Your analytics choice',description:'With your permission, Google Analytics measures visits and commercial actions. It is optional and does not receive the text you enter in contact forms. You can change your choice at any time.',accept:'Accept analytics',reject:'Reject analytics',privacy:'Google privacy information',accepted:'Analytics accepted.',rejected:'Analytics rejected.'}
    };
    const language = () => document.documentElement.lang === 'en' ? 'en' : 'es';
    const consentKey = 'bvt-analytics-consent-v1';
    let consent = '', loaded = false, pageViewSent = false, script = null;
    const lastEvents = new Map();
    let tag = null;
    const readConsent = () => { try { const value = window.localStorage.getItem(consentKey); return ['accepted','rejected'].includes(value) ? value : ''; } catch { return ''; } };
    const writeConsent = value => { try { window.localStorage.setItem(consentKey, value); } catch { /* Current-page consent still applies. */ } };
    // Never forward location.search, document.referrer, link href, form inputs or user text.
    // Only curated campaign tokens can be used, not arbitrary UTM values.
    function campaign() {
        const params = new URLSearchParams(location.search || '');
        const source = params.get('utm_source'), medium = params.get('utm_medium'), name = params.get('utm_campaign');
        if (['linkedin','facebook','instagram','whatsapp','google','email'].includes(source)
            && ['social','organic','referral','email','cpc'].includes(medium)
            && ['clubes_deportivos','comercios_san_carlos','contratacion_dotnet','desarrollador_remoto','parksoft','bauvi_notify','saliya'].includes(name)) {
            return {campaign_source:source,campaign_medium:medium,campaign_name:name};
        }
        return {};
    }
    function safeReferrer() {
        // Output constants only; never transmit a raw referrer, path, query or fragment.
        const value = document.referrer || '';
        for (const [pattern, origin] of [
            [/^https:\/\/(?:www\.)?bauvitech\.com(?:[/?#]|$)/i,'https://www.bauvitech.com/'],
            [/^https:\/\/(?:www\.)?linkedin\.com(?:[/?#]|$)/i,'https://www.linkedin.com/'],
            [/^https:\/\/(?:www\.|m\.|l\.)?facebook\.com(?:[/?#]|$)/i,'https://www.facebook.com/'],
            [/^https:\/\/(?:www\.)?instagram\.com(?:[/?#]|$)/i,'https://www.instagram.com/'],
            [/^https:\/\/(?:www\.)?google\.(?:com|com\.uy)(?:[/?#]|$)/i,'https://www.google.com/'],
            [/^https:\/\/(?:www\.)?whatsapp\.com(?:[/?#]|$)/i,'https://www.whatsapp.com/']
        ]) if (pattern.test(value)) return origin;
        return '';
    }
    function baseParams() {
        return {page_location:page[1],page_referrer:safeReferrer(),page_title:'BauViTech - '+page[0],site_page:page[0],site_language:language()};
    }
    function start() {
        if (!eligible || consent !== 'accepted' || loaded) return;
        try {
            // This site owns one Google tag; don't attach to unexpected existing integrations.
            if (window.gtag || window.dataLayer) return;
            window['ga-disable-' + id] = false;
            const queue = [];
            window.dataLayer = queue;
            tag = window.gtag = function() { queue.push(arguments); };
            tag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
            tag('js',new Date());
            const safe = {...baseParams(),...campaign()};
            tag('set',safe);
            tag('config',id,{...safe,send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,restricted_data_processing:true,cookie_prefix:'bvt',cookie_expires:15552000,cookie_update:false});
            script = document.createElement('script');
            script.async = true;
            script.referrerPolicy = 'no-referrer';
            script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
            script.addEventListener('error',() => { loaded=false; tag=null; window['ga-disable-'+id]=true; });
            document.head.appendChild(script);
            loaded = true;
            if (!pageViewSent) {
                tag('event','page_view',{...baseParams(),...campaign(),send_to:id});
                pageViewSent = true;
            }
        } catch { loaded=false; tag=null; window['ga-disable-'+id]=true; }
    }
    function stop() {
        // Set Google's documented opt-out flag first; no additional telemetry or consent pings.
        window['ga-disable-' + id] = true;
        loaded = false;
        tag = null;
        script?.remove();
        script = null;
        // Clear queued commands and remove only this site's analytics cookies (best effort).
        if (Array.isArray(window.dataLayer)) window.dataLayer.length = 0;
        try {
            for (const part of document.cookie.split(';')) {
                const name = part.split('=')[0].trim();
                if (!/^bvt_(?:_?ga(?:_[A-Za-z0-9]+)?|_?gid)$/.test(name)) continue;
                for (const domain of ['', '; Domain=bauvitech.com', '; Domain='+location.hostname]) {
                    document.cookie = name+'=; Max-Age=0; Path=/; Secure; SameSite=Lax'+domain;
                }
            }
        } catch { /* Browser settings may prevent cookie access. */ }
    }
    function track(event, interest, source, action) {
        try {
            if (!eligible || consent !== 'accepted' || !loaded || !tag || window['ga-disable-'+id]) return false;
            const rule = Object.hasOwn(allowed,event) ? allowed[event] : null;
            if (!rule || !rule.interests.includes(interest) || !rule.actions.includes(action) || !sources.includes(source)) return false;
            const key = [event,interest,source,action].join('|'), now = Date.now();
            if (lastEvents.has(key) && now-lastEvents.get(key)<700) return false;
            lastEvents.set(key,now);
            tag('event',event,{...baseParams(),commercial_interest:interest,commercial_source:source,commercial_action:action,send_to:id});
            return true;
        } catch { return false; }
    }
    window.BauViTechAnalytics = Object.freeze({track});
    if (!eligible) return;
    const wrapper = document.getElementById('analytics-preferences'), panel = document.getElementById('analytics-panel');
    const settings = document.getElementById('analytics-settings'), accept = document.getElementById('analytics-accept'), reject = document.getElementById('analytics-reject'), status = document.getElementById('analytics-status');
    if (!wrapper || !panel || !settings || !accept || !reject || !status) return;
    consent = readConsent();
    window['ga-disable-'+id] = consent !== 'accepted';
    function render() {
        const words = text[language()];
        document.querySelectorAll('[data-analytics-text]').forEach(el => { el.textContent = words[el.dataset.analyticsText] || ''; });
        status.textContent = words[consent] || '';
        accept.setAttribute('aria-pressed',String(consent==='accepted'));
        reject.setAttribute('aria-pressed',String(consent==='rejected'));
    }
    function show(open) { panel.hidden = !open; settings.setAttribute('aria-expanded',String(open)); }
    function choose(value) {
        const previous = consent;
        consent = value;
        writeConsent(value);
        if (value === 'rejected') stop();
        else if (previous === 'rejected' && window.gtag) {
            // Reload only on explicit re-accept after a tag was previously loaded and revoked.
            // A fresh document avoids reusing Google's already initialized tag or duplicated views.
            window.location.reload();
            return;
        } else start();
        render();
        show(false);
        settings.focus();
    }
    wrapper.hidden = false;
    render();
    show(!consent);
    settings.addEventListener('click',() => show(panel.hidden));
    accept.addEventListener('click',() => choose('accepted'));
    reject.addEventListener('click',() => choose('rejected'));
    document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click',render));
    window.addEventListener('storage',event => {
        if (event.key !== consentKey && event.key !== null) return;
        const next=readConsent();
        if (next===consent) return;
        consent=next;
        if (consent !== 'accepted') stop();
        // A grant in another tab is applied on next navigation; never start a new tag silently here.
        render();show(!consent);
    });
    document.addEventListener('click',event => {
        const anchor=event.target?.closest?.('a[data-analytics-event]');
        if (!anchor) return;
        track(anchor.dataset.analyticsEvent,anchor.dataset.analyticsInterest,page[0],anchor.dataset.analyticsAction);
    });
    if (consent === 'accepted') start();
})();
