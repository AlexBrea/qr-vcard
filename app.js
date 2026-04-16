let lastVcard = '';

function v(id) { return (document.getElementById(id)?.value || '').trim(); }

function initials(fn, ln) {
  return ((fn[0] || '') + (ln[0] || '')).toUpperCase() || '?';
}

function buildVCard() {
  const fn = v('fn'), ln = v('ln');
  const fullName = [fn, ln].filter(Boolean).join(' ');
  if (!fullName) return null;

  let c = 'BEGIN:VCARD\r\nVERSION:3.0\r\n';
  c += `FN:${fullName}\r\n`;
  c += `N:${ln};${fn};;;\r\n`;
  if (v('title'))    c += `TITLE:${v('title')}\r\n`;
  if (v('org'))      c += `ORG:${v('org')}\r\n`;
  if (v('tel'))      c += `TEL;TYPE=CELL,VOICE:${v('tel')}\r\n`;
  if (v('tel2'))     c += `TEL;TYPE=WORK,VOICE:${v('tel2')}\r\n`;
  if (v('fax'))      c += `TEL;TYPE=FAX:${v('fax')}\r\n`;
  if (v('email'))    c += `EMAIL;TYPE=PREF,INTERNET:${v('email')}\r\n`;
  if (v('url'))      c += `URL:${v('url')}\r\n`;
  if (v('linkedin')) {
    const li = v('linkedin');
    c += `URL;type=LinkedIn:${li.startsWith('http') ? li : 'https://linkedin.com/in/' + li}\r\n`;
  }
  if (v('twitter')) {
    const tw = v('twitter').replace('@','');
    c += `URL;type=Twitter:https://x.com/${tw}\r\n`;
  }

  const street = v('street'), city = v('city'), zip = v('zip'), region = v('region'), country = v('country');
  if (street || city || zip || region || country) {
    c += `ADR;TYPE=WORK:;;${street};${city};${region};${zip};${country}\r\n`;
  }

  if (v('bday')) {
    const d = v('bday').replace(/-/g, '');
    c += `BDAY:${d}\r\n`;
  }
  if (v('note')) c += `NOTE:${v('note')}\r\n`;
  c += 'END:VCARD';
  return c;
}

function updatePreview() {
  const fn = v('fn'), ln = v('ln');
  const fullName = [fn, ln].filter(Boolean).join(' ');
  document.getElementById('avatar').textContent = initials(fn, ln);
  document.getElementById('preview-name').textContent = fullName || '—';

  const sub = [v('title'), v('org')].filter(Boolean).join(' · ');
  document.getElementById('preview-sub').textContent = sub || '—';

  const fields = [];
  if (v('tel'))   fields.push(['Móvil', v('tel')]);
  if (v('email')) fields.push(['Email', v('email')]);
  if (v('url'))   fields.push(['Web', v('url')]);
  if (v('city'))  fields.push(['Ciudad', v('city')]);

  const pf = document.getElementById('preview-fields');
  pf.innerHTML = fields.map(([k, val]) =>
    `<div class="preview-row"><span class="text-ink-faint">${k}</span><span class="text-ink text-right truncate max-w-[160px]">${val}</span></div>`
  ).join('');
}

function generate() {
  const vcard = buildVCard();
  if (!vcard) { alert('Introduce al menos el nombre.'); return; }
  lastVcard = vcard;

  updatePreview();

  const out = document.getElementById('qr-output');
  out.innerHTML = '';
  const qr = qrcode(0, 'L');
  qr.addData(vcard);
  qr.make();
  out.innerHTML = qr.createImgTag(3, 4);

  const sec = document.getElementById('qr-section');
  sec.classList.add('visible');
  setTimeout(() => sec.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
}

function getQRImage() {
  return document.querySelector('#qr-output img') || document.querySelector('#qr-output canvas');
}

function downloadPNG() {
  const el = getQRImage();
  if (!el) return;
  const fn = [v('fn'), v('ln')].filter(Boolean).join('_') || 'contacto';

  if (el.tagName === 'IMG') {
    const a = document.createElement('a');
    a.href = el.src;
    a.download = `qr_${fn}.png`;
    a.click();
  } else {
    const a = document.createElement('a');
    a.href = el.toDataURL('image/png');
    a.download = `qr_${fn}.png`;
    a.click();
  }
}

function downloadSVG() {
  if (!lastVcard) { alert('Genera el QR primero.'); return; }
  const fn = [v('fn'), v('ln')].filter(Boolean).join('_') || 'contacto';
  const qr = qrcode(0, 'L');
  qr.addData(lastVcard);
  qr.make();
  const svg = qr.createSvgTag({ scalable: true });
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `qr_${fn}.svg`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function downloadVCF() {
  if (!lastVcard) { alert('Genera el QR primero.'); return; }
  const fn = [v('fn'), v('ln')].filter(Boolean).join('_') || 'contacto';
  const blob = new Blob([lastVcard], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fn}.vcf`;
  a.click();
  URL.revokeObjectURL(url);
}

function clearAll() {
  ['fn','ln','title','org','tel','tel2','fax','email','url','linkedin','twitter','street','city','zip','region','country','bday','note']
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  document.getElementById('qr-output').innerHTML = '';
  document.getElementById('qr-section').classList.remove('visible');
  lastVcard = '';
}

// Live preview on any input change
document.querySelectorAll('input').forEach(el => {
  el.addEventListener('input', () => {
    if (document.getElementById('qr-section').classList.contains('visible')) {
      updatePreview();
    }
  });
});
