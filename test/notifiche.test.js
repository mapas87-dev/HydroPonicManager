// Verifica la programmazione delle notifiche con un finto plugin Capacitor.
// Uso: npm test  (richiede Playwright con Chromium)
const { chromium } = require('playwright');
const path = require('path');
const assert = require('assert');

const iso = d => d.toISOString().slice(0, 10);
const addDays = n => { const d = new Date(); d.setDate(d.getDate() + n); return iso(d); };

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('pageerror', e => { console.error('Errore pagina:', e); process.exitCode = 1; });
  const seed = {
    serra: JSON.stringify({ n: 1, i: 0, s: [{ rows: 1, cols: 6, r: [{ p: 'Spinaci', d: addDays(1) }] }] }),
    cd: addDays(2),
    torre: JSON.stringify({ p: Array.from({ length: 10 }, (_, l) => Array(5).fill(l === 0 ? 'Rucola' : '')),
      d: Array.from({ length: 10 }, (_, l) => Array(5).fill(l === 0 ? addDays(0) : '')), s: [0, 0] }),
  };
  await page.addInitScript(seed => {
    for (const k in seed) localStorage.setItem('ti_' + k, seed[k]);
    const log = window.__ln = { scheduled: [], perm: 0, deny: true };
    window.Capacitor = {
      isNativePlatform: () => true,
      Plugins: { LocalNotifications: {
        checkPermissions: async () => ({ display: 'prompt' }),
        requestPermissions: async () => { log.perm++; return { display: log.deny ? 'denied' : 'granted' }; },
        getPending: async () => ({ notifications: log.scheduled.map(n => ({ id: n.id })) }),
        cancel: async () => { log.scheduled = []; },
        schedule: async ({ notifications }) => { log.scheduled = notifications; return { notifications }; },
        createChannel: async () => {},
        addListener: () => {},
      } },
    };
  }, seed);
  await page.goto('file://' + path.resolve(__dirname, '../www/index.html'));
  const scheduled = () => page.evaluate(() => window.__ln.scheduled.map(n => ({ id: n.id, at: new Date(n.schedule.at).toISOString(), title: n.title, body: n.body })));
  // Primo avvio: permesso negato -> messaggio, nessuna notifica
  await page.waitForFunction(() => window.__ln.perm === 1);
  assert.ok((await page.textContent('#aMsg')).includes('Permesso negato'), 'manca il messaggio di permesso negato');
  assert.equal((await scheduled()).length, 0);
  // L'utente abilita le notifiche nelle impostazioni e torna nell'app lo stesso giorno
  await page.evaluate(() => { window.__ln.deny = false; document.dispatchEvent(new Event('visibilitychange')); });
  await page.waitForFunction(() => window.__ln.scheduled.length > 0);
  assert.equal(await page.textContent('#aMsg'), '', 'messaggio di errore non rimosso');

  let s = await scheduled();
  assert.ok(s.length > 0 && s.length <= 60, 'notifiche programmate: ' + s.length);
  assert.ok(s.every(n => new Date(n.at) > new Date()), 'nessuna notifica nel passato');
  const all = s.map(n => n.title + ' ' + n.body).join('\n');
  for (const t of ['inizio emergenza', 'fine finestra', 'cambio totale', 'raccolta di 5× Rucola', 'Fermo torre'])
    assert.ok(all.includes(t), 'manca: ' + t);
  assert.ok(s.some(n => n.title.startsWith('⏰ Domani')), 'manca avviso del giorno prima');
  assert.equal(new Set(s.map(n => n.id)).size, s.length, 'id duplicati');
  console.log('OK', s.length, 'notifiche. Prime:\n' + s.slice(0, 4).map(n => `  ${n.at} ${n.title} | ${n.body.split('\n')[0]}`).join('\n'));

  // Disattivando le routine spariscono rotazione e pH
  await page.click('#nav button[data-t="avv"]');
  assert.ok(await page.locator('#aList .ev').count() > 0, 'elenco Avvisi vuoto');
  await page.uncheck('#aRou');
  await page.waitForFunction(() => window.__ln.scheduled.length > 0 && !window.__ln.scheduled.some(n => n.body.includes('ruota la torre')));

  // Disattivando le notifiche si cancella tutto
  await page.uncheck('#aOn');
  await page.waitForFunction(() => window.__ln.scheduled.length === 0);

  // Avvisi persi dal sistema: riattivare l'impostazione li riprogramma anche se la lista non è cambiata
  await page.check('#aOn');
  await page.waitForFunction(() => window.__ln.scheduled.length > 0);
  await page.evaluate(() => { window.__ln.scheduled = []; });
  await page.uncheck('#aOn'); await page.check('#aOn');
  await page.waitForFunction(() => window.__ln.scheduled.length > 0);
  console.log('OK permesso, ritorno nell’app, impostazioni (routine, disattivazione, ripristino)');

  // Semina suggerita in ritardo: Rucola trapiantata 40 giorni fa (raccolta ~35) -> avviso "semina subito" oggi, senza avviso del giorno prima
  const late = await browser.newPage();
  await late.addInitScript(d => {
    localStorage.setItem('ti_torre', JSON.stringify({ p: Array.from({ length: 10 }, (_, l) => Array(5).fill(l === 0 ? 'Rucola' : '')),
      d: Array.from({ length: 10 }, (_, l) => Array(5).fill(l === 0 ? d : '')), s: [0, 0] }));
  }, addDays(-40));
  await late.goto('file://' + path.resolve(__dirname, '../www/index.html'));
  const oggi = await late.evaluate(() => (ntEvents().find(g => g.d === today()) || { items: [] }).items.filter(e => e.w.startsWith('Suggerito')));
  assert.ok(oggi.length && oggi.every(e => e.txt.startsWith('semina subito') && !e.pre), 'manca l’avviso di semina in ritardo: ' + JSON.stringify(oggi));
  console.log('OK semina in ritardo:', oggi[0].txt);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
