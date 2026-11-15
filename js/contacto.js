// ── BUDGET PILLS ──────────────────────────────────────────────────

document.querySelectorAll('.budget-pill').forEach(pill => {
    pill.addEventListener('click', () => {
        document.querySelectorAll('.budget-pill').forEach(p => p.classList.remove('selected'));
        pill.classList.add('selected');
    });
});

// ── VALIDATION ────────────────────────────────────────────────────
function validate() {
    let ok = true;

    const name = document.getElementById('f-name');
    const errName = document.getElementById('err-name');
    if (!name.value.trim()) {
        name.classList.add('error'); errName.classList.add('show'); ok = false;
    } else { name.classList.remove('error'); errName.classList.remove('show'); }

    const email = document.getElementById('f-email');
    const errEmail = document.getElementById('err-email');
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(email.value.trim())) {
        email.classList.add('error'); errEmail.classList.add('show'); ok = false;
    } else { email.classList.remove('error'); errEmail.classList.remove('show'); }

    const type = document.getElementById('f-type');
    const errType = document.getElementById('err-type');
    if (!type.value) {
        type.classList.add('error'); errType.classList.add('show'); ok = false;
    } else { type.classList.remove('error'); errType.classList.remove('show'); }

    const desc = document.getElementById('f-desc');
    const errDesc = document.getElementById('err-desc');
    if (!desc.value.trim()) {
        desc.classList.add('error'); errDesc.classList.add('show'); ok = false;
    } else { desc.classList.remove('error'); errDesc.classList.remove('show'); }

    return ok;
}

// ── FORM SUBMIT → WHATSAPP ─────────────────────────────────────────
document.getElementById('budgetForm').addEventListener('submit', e => {
    e.preventDefault();
    if (!validate()) return;

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

    const url = `https://wa.me/59891850930?text=${encodeURIComponent(lines)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
});

// Clear error on input
['f-name','f-email','f-type','f-desc'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => {
        el.classList.remove('error');
        const err = document.getElementById('err-' + id.replace('f-',''));
        if (err) err.classList.remove('show');
    });
});

