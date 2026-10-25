// Verifica la programmazione delle notifiche con un finto plugin Capacitor.
// Uso: npm test  (richiede Playwright con Chromium)
const { chromium } = require('playwright');
const path = require('path');
const assert = require('assert');

// Data locale, come today() nell'app (toISOString da solo darebbe la data UTC)
const iso = d => new Date(d - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
const addDays = n => { const d = new Date(); d.setDate(d.getDate() + n); return iso(d); };
const APP = 'file://' + path.resolve(__dirname, '../www/index.html');
// Torre con il livello 1 pieno della pianta data, trapiantata il giorno d
const torre = (pianta, d) => JSON.stringify({ p: Array.from({ length: 10 }, (_, l) => Array(5).fill(l === 0 ? pianta : '')), d: Array.from({ length: 10 }, (_, l) => Array(5).fill(l === 0 ? d : '')), s: [0, 0] });

(async () => {
  const browser = await chromium.launch();
  // Apre l'app con un localStorage di partenza ({chiave: valore} senza il prefisso ti_)
  const apri = async seed => {
    const pg = await browser.newPage();
    await pg.addInitScript(seed => { for (const k in seed) localStorage.setItem('ti_' + k, seed[k]); }, seed);
    await pg.goto(APP);
    return pg;
  };
  const page = await browser.newPage();
  page.on('pageerror', e => { console.error('Errore pagina:', e); process.exitCode = 1; });
  const seed = {
    serra: JSON.stringify({ n: 1, i: 0, s: [{ rows: 1, cols: 6, r: [{ p: 'Spinaci', d: addDays(1) }] }] }),
    cd: addDays(2),
    torre: torre('Rucola', addDays(0)),
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
  await page.goto(APP);
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
  await page.click('#bar button[data-g="avvisi"]');
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

  // Ricambio in ritardo: Rucola trapiantata 40 giorni fa (raccolta ~35) -> avvisi "semina subito" e "raccolta in ritardo" oggi, senza avviso del giorno prima
  const late = await apri({ torre: torre('Rucola', addDays(-40)) });
  const oggi = await late.evaluate(() => (ntEvents().find(g => g.d === today()) || { items: [] }).items);
  const sem = oggi.filter(e => e.w.startsWith('Suggerito')), racc = oggi.filter(e => e.w.startsWith('Torre · livello'));
  assert.ok(sem.length && sem.every(e => e.txt.startsWith('semina subito') && !e.pre), 'manca l’avviso di semina in ritardo: ' + JSON.stringify(sem));
  assert.ok(racc.length && racc.every(e => e.txt.startsWith('raccolta in ritardo') && !e.pre), 'manca l’avviso di raccolta in ritardo: ' + JSON.stringify(racc));
  console.log('OK ricambio in ritardo:', sem[0].txt, '|', racc[0].txt);

  // Tasto Indietro: torna alle schede visitate in ordine inverso, poi segnala cronologia vuota
  const tab = () => late.evaluate(() => document.querySelector('#nav button.on').dataset.t);
  // Visibilità reale (layout), non solo l'attributo hidden
  const visibili = () => late.evaluate(() => [...document.querySelectorAll('#nav button')].filter(b => b.getClientRects().length).map(b => b.dataset.t));
  const gruppo = () => late.evaluate(() => document.querySelector('#bar button.on').dataset.g);

  // Barra in basso: 5 gruppi; le schede in alto mostrano solo quelle del gruppo; ogni gruppo ricorda l'ultima scheda
  assert.equal(await late.locator('#bar button').count(), 5);
  assert.deepEqual(await visibili(), [], 'Semina ha una sola scheda: barra in alto nascosta');
  await late.click('#bar button[data-g="soluzione"]');
  assert.equal(await tab(), 'nut'); assert.deepEqual(await visibili(), ['nut', 'ec', 'ph']);
  await late.click('#nav button[data-t="ec"]');
  await late.click('#bar button[data-g="torre"]');
  assert.equal(await tab(), 'cre'); assert.deepEqual(await visibili(), ['cre', 'rot']);
  await late.click('#bar button[data-g="soluzione"]');
  assert.equal(await tab(), 'ec', 'il gruppo non ricorda l’ultima scheda');
  await late.click('#bar button[data-g="avvisi"]');
  assert.equal(await gruppo(), 'avvisi');
  console.log('OK barra in basso a 5 gruppi');

  const giro = [];
  while (await late.evaluate(() => tornaIndietro())) giro.push([await tab(), await gruppo()].join('/'));
  assert.deepEqual(giro, ['ec/soluzione', 'cre/torre', 'ec/soluzione', 'nut/soluzione', 'ger/semina'], 'cronologia Indietro: ' + giro);
  const caricati = await late.evaluate(async () => [(await document.fonts.load('16px Raleway')).length, (await document.fonts.load('600 16px Lora')).length]);
  assert.ok(caricati[0] > 0 && caricati[1] > 0, 'font locali non caricati: ' + caricati);
  const remoti = await late.evaluate(() => performance.getEntriesByType('resource').filter(r => /googleapis|gstatic/.test(r.name)).length);
  assert.equal(remoti, 0, 'richieste a Google Fonts');
  console.log('OK tasto Indietro e font inclusi nell’app');

  // Calendari: 3 giornate visibili, passate nascoste, stessa scadenza di più file unita in una voce
  const cal = await apri({ cd: addDays(-1), serra: JSON.stringify({ n: 1, i: 0, s: [{ rows: 3, cols: 6, r: [{ p: 'Spinaci', d: addDays(-2) }, { p: 'Bieta', d: addDays(-2) }, { p: 'Insalata (lattuga)', d: addDays(0) }] }] }) });
  const giorni = () => cal.evaluate(() => [...document.querySelectorAll('#gOut .ag-day')].map(d => d.querySelector('.ag-dh b').textContent));
  const gg = await giorni();
  assert.deepEqual(gg.slice(0, 2), ['Oggi', 'Domani'], 'date relative');
  assert.equal(gg.length, 3, 'più di 3 giornate visibili');
  const umid = await cal.evaluate(() => [...document.querySelectorAll('#gOut .ag-it')].filter(i => i.textContent.includes('Controllo umidità')).map(i => i.querySelectorAll('.ag-chips span').length));
  assert.deepEqual(umid, [2], 'controllo umidità di F1 e F2 non unito in una voce');
  await cal.click('#gOut [data-ag="past"]');
  assert.equal((await giorni()).length, 4, 'le passate non si aprono');
  assert.ok(await cal.evaluate(() => document.querySelector('#gOut .ag-day.past') !== null));
  await cal.click('#gOut [data-ag="more"]');
  assert.ok((await giorni()).length > 4, 'Mostra altre non espande');
  // Crescita: giorno in torre, routine separata, scadenze con al massimo 3 giornate
  await cal.click('#bar button[data-g="torre"]');
  const cre = await cal.evaluate(() => ({ giorno: document.querySelector('.ag-state b').textContent, rout: document.querySelectorAll('.ag-rout .ag-it').length,
    giorni: document.querySelectorAll('#cAg .ag-day').length, prox: document.querySelector('.ag-state').textContent }));
  assert.equal(cre.giorno, '2'); assert.equal(cre.rout, 3); assert.equal(cre.giorni, 3);
  assert.ok(cre.prox.includes('1° cambio soluzione'), cre.prox);
  // I pulsanti cambiano solo la vista: nessuna riprogrammazione delle notifiche
  await cal.evaluate(() => { window.__nt = 0; const n0 = notify; notify = () => { window.__nt++; n0(); }; });
  await cal.click('#cAg [data-ag="past"]');
  assert.equal(await cal.evaluate(() => window.__nt), 0, 'un pulsante dell’agenda ha riprogrammato le notifiche');
  await cal.close();
  console.log('OK calendari: 3 giornate, passate nascoste, voci unite, routine separata');

  // Casi limite della Crescita
  const caso = async (seed, fn) => {
    const pg = await apri(seed);
    await pg.click('#bar button[data-g="torre"]');
    const r = await pg.evaluate(fn); await pg.close(); return r;
  };
  // I quattro casi sono indipendenti: girano in parallelo
  const [raccolta, inCorso, domani, passate] = await Promise.all([
    // raccolta scaduta da 13 giorni: in vista oggi, evidenziata, non tra le passate
    caso({ cd: addDays(-50), torre: torre('Rucola', addDays(-48)) }, () => {
      const it = [...document.querySelectorAll('#cAg .ag-day:not(.past) .ag-it')].find(i => i.textContent.includes('Raccolta'));
      return it && { oggi: it.closest('.ag-day').classList.contains('today'), warn: it.classList.contains('warn'), testo: it.textContent };
    }),
    // giorno 12: il 1° cambio soluzione è in corso e il riquadro lo dice
    caso({ cd: addDays(-11) }, () => document.querySelector('.ag-state').textContent),
    // trasferimento domani: singolare
    caso({ cd: addDays(1) }, () => document.querySelector('.ag-state').textContent),
    // germinazione con scadenze tutte passate: messaggio giusto, non "imposta la semina"
    caso({ serra: JSON.stringify({ n: 1, i: 0, s: [{ rows: 1, cols: 6, r: [{ p: 'Spinaci', d: addDays(-30) }] }] }) }, () => document.querySelector('#gOut').textContent),
  ]);
  assert.ok(raccolta && raccolta.oggi && raccolta.warn && raccolta.testo.includes('in ritardo') && raccolta.testo.includes('Era prevista'), 'raccolta in ritardo nascosta: ' + JSON.stringify(raccolta));
  assert.ok(inCorso.includes('In corso') && inCorso.includes('1° cambio soluzione'), inCorso);
  assert.ok(domani.includes('giorno il trasferimento') && !domani.includes('1giorni'), domani);
  assert.ok(passate.includes('tutte passate') && !passate.includes('Imposta pianta'), passate);
  console.log('OK casi limite: raccolta in ritardo, scadenza in corso, singolare, scadenze tutte passate');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
