# HydroPonicManager

App mobile (Android e iOS) per la **Torre Idroponica NFT**: germinazione in miniserra, torre a 10 livelli, ricambio colture, dosaggio nutrienti TriPart, correzione EC e pH.

Costruita con [Capacitor](https://capacitorjs.com): l'interfaccia è in `www/` (HTML/JS, nessun build step), i progetti nativi in `android/` e `ios/`.

## Notifiche delle scadenze

La scheda **🔔 Avvisi** programma notifiche locali sul telefono (plugin `@capacitor/local-notifications`), senza server:

| Evento | Quando |
| --- | --- |
| Semina, controllo umidità (giorno 3), inizio e fine finestra di germinazione | per ogni fila delle miniserre |
| Trasferimento in torre, inizio e scadenza dei 3 cambi soluzione | dalla data di trasferimento |
| Raccolta di ogni livello e semina suggerita per il ricambio | dalle date di trapianto della torre |
| Inizio e fine del fermo torre | dal piano di fermo |
| Routine: correzione pH (5 giorni) e rotazione ogni 2 giorni | disattivabile |

- Una notifica al giorno all'orario scelto (predefinito 09:00) con tutte le scadenze del giorno.
- Opzionale: avviso il giorno prima (solo per eventi non di routine).
- Le notifiche si riprogrammano da sole quando cambi date o piante e quando riapri l'app, per i successivi 60 giorni (massimo 60 avvisi in attesa, limite di iOS).
- Toccando una notifica si apre la sezione dell'evento.

## Sviluppo

```bash
npm install
npm test            # verifica la programmazione delle notifiche (Playwright)
npx cap sync        # copia www/ nei progetti nativi
npm run android     # apre Android Studio
npm run ios         # apre Xcode (solo macOS)
```

L'APK di debug viene compilato da GitHub Actions a ogni push: scaricalo da **Actions → APK Android → Artifacts**.
