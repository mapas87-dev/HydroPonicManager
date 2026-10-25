// Notifiche locali allo scadere degli eventi del calendario.
// Usa il plugin Capacitor LocalNotifications quando l'app gira su Android/iOS;
// nel browser mostra solo l'anteprima degli avvisi.
// Legge lo stato dell'app (ST, TW, ROT, SP, ...) definito in index.html.

const NT_HORIZON = 60; // giorni in avanti da programmare
const NT_MAX = 60;     // iOS tiene al massimo 64 notifiche in attesa
const NT_CHANNEL = 'scadenze';

const NT = (() => {
  const def = { on: true, h: '09:00', pre: true, rou: true };
  try { return Object.assign(def, JSON.parse(ld('nt', 'null'))); } catch (e) { return def; }
})();

// Il bridge nativo inietta window.Capacitor prima degli script: basta leggerlo una volta.
const NT_P = (() => {
  const C = window.Capacitor;
  return C && C.isNativePlatform && C.isNativePlatform() && C.Plugins ? C.Plugins.LocalNotifications || null : null;
})();

// Raccoglie gli eventi futuri (entro NT_HORIZON giorni), raggruppati per giorno.
// pre:false = evento di routine, senza avviso il giorno prima.
function ntEvents() {
  const t = today(), end = ad(t, NT_HORIZON), ev = [];
  const push = (d, w, txt, tab, pre = true) => { if (d && d >= t && d <= end) ev.push({ d, w, txt, tab, pre }); };

  gerEvents().forEach(e => push(e.d, e.w, e.txt, 'ger', e.pre));

  // Crescita: dalla data di trasferimento in torre
  const d = ld('cd', today()); // stesso valore iniziale del campo #cDt
  if (d) {
    push(d, 'Crescita', 'trasferimento in torre: spugna nel net pot, base a contatto col velo d’acqua', 'cre');
    for (let i = 1; i <= 3; i++) {
      push(ad(d, 10 * i), 'Soluzione', `da oggi ${i}° cambio totale della soluzione (entro ${fdi(ad(d, 14 * i))})`, 'cre');
      push(ad(d, 14 * i), 'Soluzione', `scade oggi il ${i}° cambio totale della soluzione`, 'cre');
    }
    if (NT.rou) {
      for (let i = 1; i <= 5; i++) push(ad(d, i), 'pH', 'correggi il pH del serbatoio nuovo', 'cre', false);
      for (let i = 1; ad(d, i) <= end; i += 2) push(ad(d, i), 'Torre', 'ruota la torre di 180° per una luce uniforme', 'cre', false);
    }
  }

  // Ricambio: raccolte, semine suggerite e fermo torre
  rotPlan().forEach(sl => {
    const x = sl.s[0];
    push(sl.F, `Torre · livello ${sl.l + 1}`, `raccolta di ${sl.n}× ${sl.k}` + (x ? `; poi trapianta ${x.k} il ${fdi(x.T)}` : ''), 'rot');
    // Semina già in ritardo: avviso oggi (come "semina subito" nel calendario), ripetuto ogni giorno finché il pot non viene ripiantato.
    if (x) push(x.sow < t ? t : x.sow, `Suggerito · L${sl.l + 1}`, `${x.sow < t ? 'semina subito' : 'semina'} ${x.k} per il livello che si libera il ${fdi(sl.F)}`, 'ger', x.sow >= t);
  });
  WN.forEach(w => {
    push(w.s, 'Fermo torre', 'inizia oggi: svuota, pulisci e sanifica torre, pompa e tubi', 'rot');
    push(w.e, 'Fermo torre', 'fine fermo: nuova soluzione TriPart, pH 5,8 e riparti con i trapianti', 'rot');
  });

  const g = {};
  ev.forEach(e => (g[e.d] = g[e.d] || []).push(e));
  return Object.keys(g).sort().map(day => ({ d: day, items: g[day] }));
}

// Trasforma gli eventi in notifiche: una per giorno all'orario scelto,
// più (opzionale) un avviso il giorno prima per gli eventi non di routine.
function ntList() {
  const [hh, mm] = (NT.h || '09:00').split(':').map(Number), now = Date.now(), out = [];
  const at = day => { const x = new Date(day + 'T00:00:00'); x.setHours(hh || 0, mm || 0, 0, 0); return x; };
  const note = (id, when, its, prefix) => {
    if (+when > now) out.push({
      id, at: when, tab: its[0].tab,
      title: its.length > 1 ? `${prefix}: ${its.length} scadenze` : `${prefix} · ${its[0].w}`,
      body: its.length > 1 ? its.map(e => `${e.w}: ${e.txt}`).join('\n') : its[0].txt,
    });
  };
  ntEvents().forEach(({ d, items }) => {
    const id = +d.replace(/-/g, '') * 10, imp = items.filter(e => e.pre);
    note(id, at(d), items, '🌱 Oggi');
    if (NT.pre && imp.length) note(id + 1, at(ad(d, -1)), imp, '⏰ Domani');
  });
  return out.sort((x, y) => x.at - y.at).slice(0, NT_MAX);
}

const ntNote = t => `<p style="color:var(--mu);margin:0">${t}</p>`;
function ntMsg(t) { $('aMsg').innerHTML = t ? `<div class="tip" style="border-color:var(--wa)">${esc(t)}</div>` : ''; }

// Disegna l'elenco solo quando la scheda Avvisi è visibile.
function ntShow(L) {
  if (!$('avv').classList.contains('on')) return;
  const info = NT_P ? '' : '<div class="tip">Anteprima: le notifiche arrivano sul telefono con l’app installata (Android o iOS).</div>';
  if (!NT.on) { $('aList').innerHTML = ntNote('Notifiche disattivate.'); return; }
  const hm = d => d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  $('aList').innerHTML = (L.length ? L.map(n => `<div class="ev"><b>${fd(n.at)}<br><small>${hm(n.at)}</small></b><span><b style="min-width:0;color:var(--tx)">${esc(n.title)}</b><br>${esc(n.body).replace(/\n/g, '<br>')}</span></div>`).join('')
    : ntNote('Nessuna scadenza nei prossimi ' + NT_HORIZON + ' giorni.')) + info;
}

let ntTimer = 0, ntSig = '', ntBusy = Promise.resolve();
function ntSched() { clearTimeout(ntTimer); ntTimer = setTimeout(() => { ntBusy = ntBusy.then(ntApply); }, 500); }
notify = ntSched;

async function ntApply() {
  const L = ntList();
  ntShow(L);
  if (!NT_P) return;
  const sig = NT.on ? JSON.stringify(L.map(n => [n.id, +n.at, n.title, n.body])) : 'off';
  if (sig === ntSig) return;
  try {
    if (NT.on && L.length) {
      let perm = await NT_P.checkPermissions();
      if (perm.display !== 'granted') perm = await NT_P.requestPermissions();
      if (perm.display !== 'granted') { ntMsg('Permesso negato: abilita le notifiche per “Torre Idroponica” nelle impostazioni del telefono.'); return; }
    }
    const pend = (await NT_P.getPending()).notifications || [];
    if (pend.length) await NT_P.cancel({ notifications: pend.map(n => ({ id: n.id })) });
    if (NT.on && L.length) await NT_P.schedule({
      notifications: L.map(n => ({
        id: n.id, title: n.title, body: n.body, largeBody: n.body,
        schedule: { at: n.at, allowWhileIdle: true },
        channelId: NT_CHANNEL, extra: { tab: n.tab },
      })),
    });
    ntSig = sig; ntMsg('');
  } catch (e) { ntMsg('Errore nella programmazione delle notifiche: ' + (e && e.message || e)); }
}

// Un cambio d'impostazione riprogramma comunque: ripara anche avvisi persi dal sistema (riavvio, app chiusa forzatamente).
function ntSave() { sv('nt', JSON.stringify(NT)); ntSig = ''; ntSched(); }

// Impostazioni nella scheda Avvisi
$('aOn').checked = NT.on; $('aH').value = NT.h; $('aPre').value = NT.pre ? '1' : '0'; $('aRou').checked = NT.rou;
$('aOn').onchange = e => { NT.on = e.target.checked; ntSave(); };
$('aH').onchange = e => { NT.h = e.target.value || '09:00'; ntSave(); };
$('aPre').onchange = e => { NT.pre = e.target.value === '1'; ntSave(); };
$('aRou').onchange = e => { NT.rou = e.target.checked; ntSave(); };
$('nav').addEventListener('click', e => { if (e.target.dataset.t === 'avv') ntShow(ntList()); });

if (NT_P) {
  NT_P.createChannel({ id: NT_CHANNEL, name: 'Scadenze coltivazione', description: 'Avvisi di germinazione, cambio soluzione, raccolta e fermo torre', importance: 4, vibration: true }).catch(() => { /* solo Android */ });
  // Tocco sulla notifica: apre la sezione dell'evento
  NT_P.addListener('localNotificationActionPerformed', a => {
    const tab = a && a.notification && a.notification.extra && a.notification.extra.tab;
    const b = tab && document.querySelector(`#nav button[data-t="${tab}"]`);
    if (b) b.click();
  });
}
ntSched();

// Al ritorno nell'app: riprova la programmazione (es. permesso appena concesso nelle impostazioni);
// se è cambiato il giorno aggiorna anche tutte le viste che dipendono da "oggi" (rotR ridisegna Ricambio, calendario e Crescita).
let ntDay = today();
document.addEventListener('visibilitychange', () => {
  if (document.hidden) return;
  if (today() !== ntDay) { ntDay = today(); rotR(); } else ntSched();
});
