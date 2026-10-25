// Tasto Indietro di Android: torna alla scheda visitata prima invece di chiudere l'app.
// Con la cronologia vuota manda l'app in background (le notifiche restano programmate).
(() => {
  const C = window.Capacitor;
  const App = C && C.isNativePlatform && C.isNativePlatform() && C.Plugins ? C.Plugins.App : null;
  const storia = [];
  let indietro = false;
  const attiva = () => { const b = document.querySelector('#nav button.on'); return b && b.dataset.t; };

  // Fase di cattura: legge la scheda corrente prima che il gestore della nav la cambi.
  $('nav').addEventListener('click', e => {
    const b = e.target.closest('button[data-t]'), da = attiva();
    if (!b || indietro || !da || b.dataset.t === da) return;
    storia.push(da);
    if (storia.length > 30) storia.shift();
  }, true);

  // Esposta per i test e per un eventuale pulsante "indietro" nell'interfaccia.
  window.tornaIndietro = () => {
    const t = storia.pop();
    if (!t) return false;
    indietro = true;
    document.querySelector(`#nav button[data-t="${t}"]`).click();
    indietro = false;
    return true;
  };

  if (App) App.addListener('backButton', () => { if (!tornaIndietro()) App.minimizeApp(); });
})();
