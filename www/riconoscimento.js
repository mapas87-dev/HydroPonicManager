// Riconoscimento delle piante da foto con Pl@ntNet (https://my.plantnet.org).
// La specie botanica trovata viene collegata alle schede dell'archivio (SP) con la tabella SCI;
// le piante personalizzate create da qui ricordano la specie nel campo `sci`.
// Legge e usa lo stato dell'app definito in index.html (SP, act, setAct, plR, lvR, spOpt, gerR, ld, sv, esc, $).

const PN_URL = 'https://my-api.plantnet.org/v2/identify/all';
const PN_MIN = 0.2; // sotto questa probabilità il risultato è incerto

// Specie (o genere, chiave che termina con " *") → schede dell'archivio.
// Più schede per la stessa specie = varietà diverse: l'app le propone e sceglie la persona.
const SCI = {
  'Spinacia oleracea': ['Spinaci'],
  'Beta vulgaris': ['Bieta'],
  'Lactuca sativa': ['Insalata (lattuga)', 'Canasta rossa'],
  'Eruca vesicaria': ['Rucola'], 'Eruca sativa': ['Rucola'], 'Diplotaxis tenuifolia': ['Rucola'],
  'Ocimum basilicum': ['Basilico'],
  'Coriandrum sativum': ['Coriandolo'],
  'Petroselinum crispum': ['Prezzemolo'],
  'Allium schoenoprasum': ['Erba cipollina'],
  'Mentha *': ['Menta'],
  'Brassica rapa': ['Pak choi'], 'Brassica chinensis': ['Pak choi'],
  'Brassica oleracea': ['Cavolo riccio (kale)', 'Cavolo napoletano'],
  'Fragaria *': ['Fragole'],
  'Cichorium intybus': ['Radicchio'], 'Cichorium endivia': ['Scarola riccia'], 'Cichorium *': ['Radicchio', 'Scarola riccia'],
};
const LV_RANGE = { Alto: '1–3', Medio: '4–7', Basso: '8–10' };

// Schede che corrispondono a una specie: prima la specie esatta, poi il genere; più le piante personalizzate con la stessa specie.
function schedePer(specie, genere) {
  const da = SCI[specie] || SCI[genere + ' *'] || [];
  const pers = Object.keys(SP).filter(k => SP[k].sci && (SP[k].sci === specie || (!SCI[specie] && SP[k].sci.split(' ')[0] === genere)));
  return [...new Set([...da, ...pers])].filter(k => SP[k]);
}

// Riduce la foto (lato lungo 1280 px, JPEG): meno dati da inviare, stessa qualità per il riconoscimento.
function riduci(file) {
  return new Promise((ok, ko) => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const k = Math.min(1, 1280 / Math.max(img.width, img.height)), c = document.createElement('canvas');
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      c.toBlob(b => (b ? ok(b) : ko(new Error('foto non leggibile'))), 'image/jpeg', 0.85);
    };
    img.onerror = () => { URL.revokeObjectURL(url); ko(new Error('foto non leggibile')); };
    img.src = url;
  });
}

async function identifica(blob, chiave) {
  const fd = new FormData();
  fd.append('images', blob, 'pianta.jpg');
  fd.append('organs', 'auto');
  let r;
  try { r = await fetch(`${PN_URL}?lang=it&nb-results=3&api-key=${encodeURIComponent(chiave)}`, { method: 'POST', body: fd }); }
  catch (e) { throw new Error('Nessuna connessione: il riconoscimento richiede internet.'); }
  if (r.status === 404) return [];
  // Il testo esatto di Pl@ntNet distingue una chiave sbagliata da un dominio non autorizzato.
  const dettaglio = async () => { try { const j = await r.json(); return j.message ? ` (Pl@ntNet: “${j.message}”)` : ''; } catch (e) { return ''; } };
  if (r.status === 401 || r.status === 403) throw new Error('Chiave Pl@ntNet rifiutata: controlla di averla copiata intera qui sotto' + await dettaglio() + '.');
  if (r.status === 429) throw new Error('Hai superato il limite giornaliero di Pl@ntNet (500 foto). Riprova domani.');
  if (!r.ok) throw new Error(`Pl@ntNet non risponde (errore ${r.status}${await dettaglio()}). Riprova più tardi.`);
  const j = await r.json();
  return (j.results || []).slice(0, 3).map(x => ({
    score: x.score || 0,
    specie: x.species && x.species.scientificNameWithoutAuthor || '',
    genere: x.species && x.species.genus && x.species.genus.scientificNameWithoutAuthor || '',
    comuni: (x.species && x.species.commonNames || []).slice(0, 2),
  }));
}

// --- Interfaccia nella sezione Piante
const RC = { foto: '', esiti: null, errore: '', attesa: false };

function rcScheda(k) {
  const s = SP[k], att = act().includes(k);
  return `<div class="rc-sch"><div class="rc-sch-t"><b>${esc(k)}</b><span>${esc(s.cat)}</span></div>
<div class="rc-pos"><svg class="ic" aria-hidden="true"><use href="#i-tower"/></svg><span>Posizione consigliata: <b>livello ${esc(s.lv.toLowerCase())}</b> (${LV_RANGE[s.lv] || '—'})</span></div>
<div class="rc-dati">Germinazione ${s.ger[0]}–${s.ger[1]} gg · EC ${f(s.ec[0])}–${f(s.ec[1])} · pH ${f(s.ph[0])}–${f(s.ph[1])} · raccolta ${esc(s.d)}</div>
${att ? '<p class="rc-ok">Già in coltivazione</p>' : `<button type="button" class="bt f" data-rc-usa="${esc(k)}">Aggiungi alle colture</button>`}</div>`;
}

function rcEsito(x, i) {
  const pct = Math.round(x.score * 100), schede = schedePer(x.specie, x.genere);
  const nome = x.comuni[0] ? `${esc(x.comuni[0])} · <i>${esc(x.specie)}</i>` : `<i>${esc(x.specie)}</i>`;
  let corpo;
  if (schede.length === 1) corpo = rcScheda(schede[0]);
  else if (schede.length > 1) corpo = `<p class="rc-nota">Più varietà in archivio per questa specie: scegli quella che coltivi.</p>${schede.map(rcScheda).join('')}`;
  else corpo = `<p class="rc-nota">Non è in archivio: crea la scheda con i valori della bustina dei semi.</p><button type="button" class="bt" data-rc-crea="${i}">Crea scheda</button>`;
  return `<div class="rc-esito"><div class="rc-h"><span>${nome}</span><span class="rc-pct${pct < PN_MIN * 100 ? ' basso' : ''}">${pct}%</span></div>${corpo}</div>`;
}

function rcR() {
  const k = ld('pnkey', ''), el = $('rcOut');
  let h = '';
  if (RC.foto) h += `<img class="rc-foto" src="${RC.foto}" alt="Foto da riconoscere">`;
  if (RC.attesa) h += '<p class="rc-nota" role="status">Riconoscimento in corso…</p>';
  else if (RC.errore) h += `<div class="tip" role="status" style="border-color:var(--wa)">${esc(RC.errore)}</div>`;
  else if (RC.esiti) {
    if (!RC.esiti.length) h += '<div class="tip" role="status">Nessuna pianta riconosciuta. Prova con una foto nitida di una foglia intera, su sfondo semplice.</div>';
    else {
      if (RC.esiti[0].score < PN_MIN) h += '<div class="tip" style="border-color:var(--wa)">Riconoscimento incerto: le piantine molto giovani si riconoscono male. Riprova quando hanno le prime foglie vere.</div>';
      h += RC.esiti.map(rcEsito).join('');
    }
  }
  el.innerHTML = h;
  $('rcFoto').disabled = !k || RC.attesa;
  $('rcKeyBox').open = !k;
  $('rcKey').value = k;
}

async function rcAnalizza(file) {
  const chiave = ld('pnkey', '');
  if (!file || !chiave) return;
  RC.attesa = true; RC.errore = ''; RC.esiti = null;
  if (RC.foto) URL.revokeObjectURL(RC.foto);
  RC.foto = URL.createObjectURL(file);
  rcR();
  try { RC.esiti = await identifica(await riduci(file), chiave); }
  catch (e) { RC.errore = e.message || String(e); }
  RC.attesa = false;
  rcR();
}

$('rcFoto').onchange = e => { rcAnalizza(e.target.files[0]); e.target.value = ''; };
$('rcKey').onchange = e => { sv('pnkey', e.target.value.trim()); RC.errore = ''; rcR(); };
$('rcOut').onclick = e => {
  const usa = e.target.closest('[data-rc-usa]'), crea = e.target.closest('[data-rc-crea]');
  if (usa) { const k = usa.dataset.rcUsa; if (!act().includes(k)) setAct(act().concat(k)); plR(); lvR(); spOpt(); gerR(); rcR(); }
  if (crea) {
    // Precompila "Aggiungi una pianta": nome comune (o scientifico) e specie; i valori di coltivazione li inserisce la persona.
    const x = RC.esiti[+crea.dataset.rcCrea], nome = x.comuni[0] || x.specie;
    $('xN').value = nome.charAt(0).toUpperCase() + nome.slice(1);
    $('xS').value = x.specie;
    $('xM').textContent = `Specie: ${x.specie}. Completa i valori dalla bustina e premi “Aggiungi all’archivio”.`;
    $('xN').scrollIntoView({ block: 'center' });
    $('xN').focus();
  }
};
rcR();
