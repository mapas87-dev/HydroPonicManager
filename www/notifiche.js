// Notifiche locali allo scadere degli eventi del calendario.
// Usa il plugin Capacitor LocalNotifications quando l'app gira su Android/iOS;
// nel browser mostra solo l'anteprima degli avvisi.
// Legge lo stato dell'app (ST, TW, ROT, SP, ...) definito in index.html.

const NT_HORIZON = 60; // giorni in avanti da programmare
const NT_MAX = 60;     // iOS tiene al massimo 64 notifiche in attesa
const NT_CHANNEL = 'scadenze';

const NT = (() => {
  const def = { on: true, h: '09:00', pre: true, rou: true };
  try { return Object.assign(def, JSON.parse(ld('nt', 'null')) || {}); } catch (e) { return def; }
})();

function ntPlugin() {
  const C = window.Capacitor;
  return C && C.isNativePlatform && C.isNativePlatform() && C.Plugins ? C.Plugins.LocalNotifications || null : null;
}

// Raccoglie gli eventi futuri (entro NT_HORIZON giorni), raggruppati per giorno.
// pre:false = evento di routine, senza avviso il giorno prima.
function ntEvents() {
  const t = today(), end = ad(t, NT_HORIZON), ev = [];
  const push = (d, w, txt, tab, pre = true) => { if (d && d >= t && d <= end) ev.push({ d, w, txt, tab, pre }); };

  // Germinazione: per ogni fila delle miniserre
  ST.s.slice(0, ST.n).forEach((z, si) => z.r.slice(0, z.rows).forEach((x, ri) => {
    const s = SP[x.p]; if (!s || !x.d) return;
    const w = `Serra ${si + 1} · F${ri + 1} · ${x.p}`;
    push(x.d, w, 'giorno di semina: spugne idratate (pH 5,5–6,0), coperchio chiuso', 'ger');
    push(ad(x.d, 3), w, 'controlla l’umidità, spruzza se la superficie è asciutta', 'ger', false);
    push(ad(x.d, s.ger[0]), w, 'inizio emergenza: luce 14–16 h e bocchette aperte', 'ger');
    push(ad(x.d, s.ger[1]), w, 'fine finestra di germinazione: se non è spuntato nulla verifica temperatura e umidità', 'ger');
  }));

  // Crescita: dalla data di trasferimento in torre
  const d = $('cDt').value;
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
    if (x) push(x.sow, `Suggerito · L${sl.l + 1}`, `semina ${x.k} per il livello che si libera il ${fdi(sl.F)}`, 'ger');
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
// più (opzionale) un avviso la sera prima per gli eventi non di routine.
function ntList() {
  const [hh, mm] = (NT.h || '09:00').split(':').map(Number), now = Date.now(), out = [];
  const at = day => { const x = new Date(day + 'T00:00:00'); x.setHours(hh || 0, mm || 0, 0, 0); return x; };
  const lines = items => items.map(e => `${e.w}: ${e.txt}`).join('\n');
  ntEvents().forEach(({ d, items }) => {
    const id = +d.replace(/-/g, '') * 10, a = at(d), tab = items[0].tab;
    if (+a > now) out.push({
      id, at: a, tab,
      title: items.length > 1 ? `🌱 ${items.length} scadenze oggi` : `🌱 Oggi · ${items[0].w}`,
      body: items.length > 1 ? lines(items) : items[0].txt,
    });
    const imp = items.filter(e => e.pre);
    const b = at(ad(d, -1));
    if (NT.pre && imp.length && +b > now) out.push({
      id: id + 1, at: b, tab: imp[0].tab,
      title: imp.length > 1 ? `⏰ Domani ${imp.length} scadenze` : `⏰ Domani · ${imp[0].w}`,
      body: imp.length > 1 ? lines(imp) : imp[0].txt,
    });
  });
  return out.sort((x, y) => x.at - y.at).slice(0, NT_MAX);
}

function ntMsg(t) { $('aMsg').innerHTML = t ? `<div class="tip" style="border-color:var(--wa)">${esc(t)}</div>` : ''; }

function ntShow(L) {
  const P = ntPlugin();
  const info = P ? '' : '<div class="tip">Anteprima: le notifiche arrivano sul telefono con l’app installata (Android o iOS).</div>';
  if (!NT.on) { $('aList').innerHTML = '<p style="color:var(--mu);margin:0">Notifiche disattivate.</p>'; return; }
  const hm = d => d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  $('aList').innerHTML = (L.length ? L.map(n => `<div class="ev"><b>${fd(n.at)}<br><small>${hm(n.at)}</small></b><span><b style="min-width:0;color:var(--tx)">${esc(n.title)}</b><br>${esc(n.body).replace(/\n/g, '<br>')}</span></div>`).join('')
    : '<p style="color:var(--mu);margin:0">Nessuna scadenza nei prossimi ' + NT_HORIZON + ' giorni.</p>') + info;
}

let ntTimer = 0, ntSig = '', ntBusy = Promise.resolve();
function ntSched() { clearTimeout(ntTimer); ntTimer = setTimeout(() => { ntBusy = ntBusy.then(ntApply); }, 500); }

async function ntApply() {
  const L = ntList();
  ntShow(L);
  const P = ntPlugin();
  if (!P) return;
  const sig = NT.on ? JSON.stringify(L.map(n => [n.id, +n.at, n.title, n.body])) : 'off';
  if (sig === ntSig) return;
  try {
    if (NT.on && L.length) {
      let perm = await P.checkPermissions();
      if (perm.display !== 'granted') perm = await P.requestPermissions();
      if (perm.display !== 'granted') { ntMsg('Permesso negato: abilita le notifiche per “Torre Idroponica” nelle impostazioni del telefono.'); return; }
    }
    const pend = (await P.getPending()).notifications || [];
    if (pend.length) await P.cancel({ notifications: pend.map(n => ({ id: n.id })) });
    if (NT.on && L.length) await P.schedule({
      notifications: L.map(n => ({
        id: n.id, title: n.title, body: n.body, largeBody: n.body,
        schedule: { at: n.at, allowWhileIdle: true },
        channelId: NT_CHANNEL, extra: { tab: n.tab },
      })),
    });
    ntSig = sig; ntMsg('');
  } catch (e) { ntMsg('Errore nella programmazione delle notifiche: ' + (e && e.message || e)); }
}

function ntSave() { sv('nt', JSON.stringify(NT)); ntSig = ''; ntSched(); }

// Impostazioni nella scheda Avvisi
$('aOn').checked = NT.on; $('aH').value = NT.h; $('aPre').value = NT.pre ? '1' : '0'; $('aRou').checked = NT.rou;
$('aOn').onchange = e => { NT.on = e.target.checked; ntSave(); };
$('aH').onchange = e => { NT.h = e.target.value || '09:00'; ntSave(); };
$('aPre').onchange = e => { NT.pre = e.target.value === '1'; ntSave(); };
$('aRou').onchange = e => { NT.rou = e.target.checked; ntSave(); };

(async () => {
  const P = ntPlugin();
  if (P) {
    try { await P.createChannel({ id: NT_CHANNEL, name: 'Scadenze coltivazione', description: 'Avvisi di germinazione, cambio soluzione, raccolta e fermo torre', importance: 4, vibration: true }); } catch (e) { /* solo Android */ }
    // Tocco sulla notifica: apre la sezione dell'evento
    P.addListener('localNotificationActionPerformed', a => {
      const tab = a && a.notification && a.notification.extra && a.notification.extra.tab;
      const b = tab && document.querySelector(`#nav button[data-t="${tab}"]`);
      if (b) b.click();
    });
  }
  ntSched();
})();

// Al ritorno nell'app ricalcola: "oggi" può essere cambiato
document.addEventListener('visibilitychange', () => { if (!document.hidden) calR(); });
