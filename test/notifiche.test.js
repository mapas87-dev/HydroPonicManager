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
    const log = window.__ln = { scheduled: [], cancelled: [], perm: 0 };
    window.Capacitor = {
      isNativePlatform: () => true,
      Plugins: { LocalNotifications: {
        checkPermissions: async () => ({ display: 'prompt' }),
        requestPermissions: async () => { log.perm++; return { display: 'granted' }; },
        getPending: async () => ({ notifications: log.scheduled.map(n => ({ id: n.id })) }),
        cancel: async ({ notifications }) => { log.cancelled.push(...notifications); log.scheduled = []; },
        schedule: async ({ notifications }) => { log.scheduled = notifications; return { notifications }; },
        createChannel: async () => {},
        addListener: () => {},
      } },
    };
  }, seed);
  await page.goto('file://' + path.resolve(__dirname, '../www/index.html'));
  await page.waitForTimeout(1200);

  let s = await page.evaluate(() => window.__ln.scheduled.map(n => ({ id: n.id, at: new Date(n.schedule.at).toISOString(), title: n.title, body: n.body, tab: n.extra.tab })));
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
  await page.uncheck('#aRou');
  await page.waitForTimeout(900);
  s = await page.evaluate(() => window.__ln.scheduled.map(n => n.body));
  assert.ok(!s.join('\n').includes('ruota la torre'), 'rotazione ancora presente');

  // Disattivando le notifiche si cancella tutto
  await page.uncheck('#aOn');
  await page.waitForTimeout(900);
  s = await page.evaluate(() => window.__ln.scheduled);
  assert.equal(s.length, 0, 'notifiche non cancellate');
  console.log('OK impostazioni (routine, disattivazione)');
  await page.screenshot({ path: process.env.SHOT || '/dev/null', fullPage: true }).catch(() => {});
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
