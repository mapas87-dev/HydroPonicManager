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

## Navigazione e font

- **Barra in basso a 5 gruppi** (`www/gruppi.js`): Semina, Torre (Crescita + Ricambio), Soluzione (Nutrienti + EC + pH), Piante, Avvisi. In alto compaiono solo le schede del gruppo; ogni gruppo ricorda l'ultima scheda aperta.
- **Tasto Indietro (Android):** torna alla scheda visitata prima (`www/indietro.js`, plugin `@capacitor/app`); a cronologia vuota manda l'app in background.
- **Font:** Lora e Raleway sono inclusi in `www/fonts/` (subset latino, licenza SIL OFL), quindi l'app ha il suo aspetto anche senza connessione.

## Icona

L'icona nasce da un design Canva (torre NFT bianca con piantine e goccia arancione su verde `#2f8f5b`), ridisegnata come vettoriale in `assets/icon-foreground.svg`. Per rigenerare le icone dopo una modifica: renderizza i PNG da 1024 px in `assets/` e lancia
`npx capacitor-assets generate --android --ios --iconBackgroundColor '#2f8f5b'`.

## Sviluppo

```bash
npm install
npm test            # verifica la programmazione delle notifiche (Playwright)
npx cap sync        # copia www/ nei progetti nativi
npm run android     # apre Android Studio
npm run ios         # apre Xcode (solo macOS)
npm run setup:android  # installa l'Android SDK (serve Java 21 e accesso a dl.google.com)
npm run apk         # compila android/app/build/outputs/apk/debug/app-debug.apk
```

In locale l'APK ha `versionCode` 1: per installarlo sopra una build di GitHub usa `VERSION_CODE=<numero più alto> npm run apk`.
`--max-workers=2` evita gli errori 429 (Too Many Requests) di Maven Central dietro il proxy della sandbox.

### Ambiente cloud di Claude Code

Per avere l'SDK già pronto in ogni sessione, incolla questo nello **Setup script** dell'ambiente (menu dell'ambiente → Edit) e aggiungi `dl.google.com` agli Allowed domains:

```bash
# Android SDK per compilare l'APK di HydroPonicManager (serve dl.google.com negli Allowed domains)
SDK="$HOME/android-sdk"
if [ ! -d "$SDK/platforms/android-36" ]; then
  ZIP=$(curl -fsSL https://dl.google.com/android/repository/repository2-3.xml | grep -o 'commandlinetools-linux-[0-9]*_latest.zip' | sort -t- -k3 -n | tail -1)
  curl -fsSL "https://dl.google.com/android/repository/$ZIP" -o /tmp/cmdline-tools.zip
  rm -rf /tmp/cmdline-tools && unzip -q /tmp/cmdline-tools.zip -d /tmp/cmdline-tools
  mkdir -p "$SDK/cmdline-tools" && rm -rf "$SDK/cmdline-tools/latest" && mv /tmp/cmdline-tools/cmdline-tools "$SDK/cmdline-tools/latest"
  "$SDK/cmdline-tools/latest/bin/android" --sdk="$SDK" sdk install platform-tools platforms/android-36 build-tools/36.0.0
fi
```

`npm run apk` trova l'SDK in `~/android-sdk` e scrive da solo `android/local.properties`.

L'APK di debug viene compilato da GitHub Actions quando cambiano app o progetto Android: scaricalo da **Actions → APK Android → Artifacts**.
Ogni APK è firmato con la stessa chiave di debug (`android/app/debug.keystore`) e ha un `versionCode` crescente, quindi si installa come aggiornamento del precedente. Gli APK compilati prima di questa modifica avevano chiavi diverse: per passare alla nuova chiave disinstalla l'app una volta.

## Design system

`design-system/` contiene `@hydroponic/ui`: token, CSS e 23 componenti React (incluse BottomNav e Icon) allineati allo stile "Organic Biophilic" dell'app, pronti per Claude Design (`/design-sync`). Vedi `design-system/.design-sync/NOTES.md`.
