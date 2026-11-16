// ── BUDGET PILLS ──────────────────────────────────────────────────

document.querySelectorAll('.budget-pill').forEach(pill => {
    pill.addEventListener('click', () => {
        const selected = !pill.classList.contains('selected');
        document.querySelectorAll('.budget-pill').forEach(p => { p.classList.remove('selected'); p.setAttribute('aria-pressed','false'); });
        pill.classList.toggle('selected', selected);
        pill.setAttribute('aria-pressed', String(selected));
    });
});

// ── VALIDATION ────────────────────────────────────────────────────
function validate() {
    let ok = true;

    const name = document.getElementById('f-name');
    const errName = document.getElementById('err-name');
    if (!name.value.trim()) {
        name.classList.add('error'); name.setAttribute('aria-invalid','true'); errName.classList.add('show'); ok = false;
    } else { name.classList.remove('error'); name.removeAttribute('aria-invalid'); errName.classList.remove('show'); }

    const email = document.getElementById('f-email');
    const errEmail = document.getElementById('err-email');
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(email.value.trim())) {
        email.classList.add('error'); email.setAttribute('aria-invalid','true'); errEmail.classList.add('show'); ok = false;
    } else { email.classList.remove('error'); email.removeAttribute('aria-invalid'); errEmail.classList.remove('show'); }

    const type = document.getElementById('f-type');
    const errType = document.getElementById('err-type');
    if (!type.value) {
        type.classList.add('error'); type.setAttribute('aria-invalid','true'); errType.classList.add('show'); ok = false;
    } else { type.classList.remove('error'); type.removeAttribute('aria-invalid'); errType.classList.remove('show'); }

    const desc = document.getElementById('f-desc');
    const errDesc = document.getElementById('err-desc');
    if (!desc.value.trim()) {
        desc.classList.add('error'); desc.setAttribute('aria-invalid','true'); errDesc.classList.add('show'); ok = false;
    } else { desc.classList.remove('error'); desc.removeAttribute('aria-invalid'); errDesc.classList.remove('show'); }

    return ok;
}

// ── FORM SUBMIT → WHATSAPP ─────────────────────────────────────────
document.getElementById('budgetForm').addEventListener('submit', e => {
    e.preventDefault();
    if (!validate()) { document.querySelector('#budgetForm .error')?.focus(); return; }

    const name  = document.getElementById('f-name').value.trim();
    const email = document.getElementById('f-email').value.trim();
    const phone = document.getElementById('f-phone').value.trim();
    const type = document.getElementById('f-type').selectedOptions[0].textContent;
    const desc  = document.getElementById('f-desc').value.trim();
    const budget = document.querySelector('.budget-pill.selected')?.textContent.trim() || '';

    const isEs = document.documentElement.lang === 'es';
    const lines = [
        `${isEs ? '¡Hola! Quiero solicitar un presupuesto.' : 'Hi! I\'d like to request a quote.'}`,
        ``,
        `👤 ${isEs ? 'Nombre' : 'Name'}: ${name}`,
        `📧 Email: ${email}`,
        phone ? `📱 ${isEs ? 'Teléfono' : 'Phone'}: ${phone}` : null,
        `🛠️ ${isEs ? 'Tipo de proyecto' : 'Project type'}: ${type}`,
        budget ? `💰 ${isEs ? 'Presupuesto' : 'Budget'}: ${budget}` : null,
        ``,
        `📝 ${isEs ? 'Descripción' : 'Description'}:`,
        desc
    ].filter(l => l !== null).join('\n');

    window.BauViTechAnalytics?.track('quote_request_click', 'custom', 'contacto', 'quote');
    const url = `https://wa.me/59891850930?text=${encodeURIComponent(lines)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
});

// Clear error on input
['f-name','f-email','f-type','f-desc'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => {
        el.classList.remove('error');
        el.removeAttribute('aria-invalid');
        const err = document.getElementById('err-' + id.replace('f-',''));
        if (err) err.classList.remove('show');
    });
});

