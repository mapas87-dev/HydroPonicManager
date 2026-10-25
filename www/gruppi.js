// Barra in basso con 5 gruppi. Le 8 schede restano quelle di #nav: la barra sceglie il gruppo,
// #nav in alto mostra solo le schede del gruppo (ed è nascosta se il gruppo ne ha una sola).
// Ogni cambio passa dal clic sui pulsanti di #nav, così calcoli, notifiche e tasto Indietro non cambiano.
(() => {
  const G = [
    { id: 'semina', label: 'Semina', ic: 'i-sprout', t: ['ger'] },
    { id: 'torre', label: 'Torre', ic: 'i-tower', t: ['cre', 'rot'] },
    { id: 'soluzione', label: 'Soluzione', ic: 'i-flask', t: ['nut', 'ec', 'ph'] },
    { id: 'piante', label: 'Piante', ic: 'i-book', t: ['pia'] },
    { id: 'avvisi', label: 'Avvisi', ic: 'i-bell', t: ['avv'] },
  ];
  const ultima = {}; // ultima scheda aperta per gruppo
  const bar = document.createElement('div');
  bar.id = 'bar'; bar.setAttribute('role', 'navigation'); bar.setAttribute('aria-label', 'Sezioni');
  bar.innerHTML = G.map(g => `<button type="button" data-g="${g.id}"><svg class="ic" aria-hidden="true"><use href="#${g.ic}"/></svg><span>${g.label}</span></button>`).join('');
  document.body.appendChild(bar);

  const sync = () => {
    const on = document.querySelector('#nav button.on'), t = on && on.dataset.t;
    const g = G.find(x => x.t.includes(t)) || G[0];
    ultima[g.id] = t;
    bar.querySelectorAll('button').forEach(b => {
      const att = b.dataset.g === g.id;
      b.classList.toggle('on', att);
      att ? b.setAttribute('aria-current', 'page') : b.removeAttribute('aria-current');
    });
    document.querySelectorAll('#nav button').forEach(b => { b.hidden = !g.t.includes(b.dataset.t); });
    $('nav').hidden = g.t.length < 2;
  };

  bar.addEventListener('click', e => {
    const b = e.target.closest('button[data-g]');
    if (!b) return;
    const g = G.find(x => x.id === b.dataset.g);
    document.querySelector(`#nav button[data-t="${ultima[g.id] || g.t[0]}"]`).click();
  });
  new MutationObserver(sync).observe($('nav'), { subtree: true, attributes: true, attributeFilter: ['class'] });
  sync();
})();
