# Note design-sync — @hydroponic/ui

- Il pacchetto vive in `design-system/` (config home = questa cartella). Esegui tutti i comandi da qui, con `--node-modules ./node_modules --entry ./dist/index.js`.
- Build: `npm run build` (esbuild + tsc + concatenazione CSS in `dist/styles.css`). Ricompila sempre prima del convertitore.
- Il design system è stato **estratto** da `../www/index.html` (app Capacitor, HTML/JS vanilla). L'app NON usa ancora questi componenti: se cambi colori o stili nell'app, aggiornali a mano in `src/styles/`.
- Font: Poppins da `@fontsource/poppins` (latin 400/600/700) via `extraFonts`. Altri pesi/subset non vengono spediti.
- Componenti con più export nello stesso file (`ButtonRow`, `FieldGrid`, `Select`, `TimelineItem`, `FeatureChips`) sono mappati con `componentSrcMap`.
- Gruppi: stub `.design-sync/groups/<Gruppo>.md` collegati via `docsMap` (solo `category`; il `.prompt.md` viene sintetizzato da `.d.ts` + anteprime).
- `cardMode: "column"` per i componenti larghi (DataTable, KeyValue, Tip, Card, FieldGrid, NavTabs, SegmentedTabs) — segnalati da `[GRID_OVERFLOW]`.
- Playwright: nella sandbox cloud è globale; collegalo con `ln -sfn $(npm root -g)/playwright .ds-sync/node_modules/playwright` dopo aver ricopiato `.ds-sync/`.
- Le anteprime che contengono testo libero (es. Dot) devono impostare `fontFamily: 'var(--hp-font)'` nel contenitore, altrimenti il testo cade nel serif del browser.

## Known render warns
- Nessuno.

## Stato upload
- **Mai caricato.** La sessione claude.ai/code non aveva l'autorizzazione DesignSync. Nessun `projectId` in config: il primo sync creerà un nuovo progetto e caricherà tutto (percorso incrementale).

## Re-sync risks
- I token sono copiati dall'app: possono divergere da `www/index.html` senza che nulla lo segnali.
- Input data/ora/numero mostrano il formato del browser (inglese nel Chromium headless); nel prodotto dipende dalla lingua del dispositivo.
- Il build dipende dalle versioni fissate di esbuild/typescript/@fontsource in `package.json`.
