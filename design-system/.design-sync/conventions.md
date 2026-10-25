# Torre Idroponica UI — convenzioni

Design system dell'app mobile "Torre Idroponica NFT" (coltivazione idroponica su balcone). Interfaccia in **italiano**, pensata per telefono (larghezza ~390px), numeri con la virgola decimale (`5,8`, `1,2–1,4 mS/cm`).

## Struttura e setup
- Avvolgi ogni schermata in `<AppShell title="…" subtitle="…">`: imposta sfondo `--hp-bg`, font Poppins, colore testo e margini laterali 14px. Fuori da AppShell i componenti restano stilizzati, ma il tuo testo libero cade nel font di sistema.
- Nessun provider o tema JS. Il tema scuro è automatico (`prefers-color-scheme`); per forzarlo metti `data-theme="dark"` o `"light"` su `<html>`.
- Ordine tipico: `AppShell` → `FeatureChips` → `NavTabs` (sezioni) → una colonna di `Card`.

## Idioma di stile: componenti + token CSS
- Niente classi utility: compone con i componenti e usa `style={{…}}` con **token `var(--hp-*)`** per il tuo layout.
- Colori: `--hp-bg`, `--hp-surface`, `--hp-text`, `--hp-muted`, `--hp-accent` (verde, azioni e date), `--hp-accent-soft`, `--hp-border`, `--hp-warn` (arancione, risultati e avvisi), `--hp-warn-soft`, `--hp-header`, `--hp-water`.
- Palette categoriale per file/colture: `--hp-cat-1` … `--hp-cat-8`. Livelli torre: `--hp-level-high`, `--hp-level-mid`, `--hp-level-low`.
- Testo: `--hp-font`, `--hp-text-xs|sm|md|lg|xl`. Spazi: `--hp-space-1`…`--hp-space-5`. Raggi: `--hp-radius-sm|md|lg|pill`.
- Le classi `hp-*` sono interne ai componenti: non scriverle a mano.

## Quale componente usare
- Contenitori: `Card` (`step` = cerchio numerato, `highlight` = bordo arancione per i calcolatori), `FieldGrid` (2 colonne), `ButtonRow`.
- Dati: `KeyValue` (righe etichetta/valore, sempre dentro una Card), `Stat` (risultato grande, di solito come `value` di KeyValue), `DataTable` (`highlightRow`), `Timeline` + `TimelineItem` (scadenze: `today`, `past`), `Dot` (pallino colorato).
- Moduli: `Field` + `Input`/`Select`, `Toggle`, `Checklist`. Navigazione: `NavTabs` (sezioni), `SegmentedTabs` (dentro una card).
- Messaggi: `Tip` (`tone="info"` verde, `"warning"` arancione). Azioni: `Button` (`primary` | `outline` | `danger`, `block`).

## Dove leggere
Prima di dare stile leggi `_ds/<cartella>/styles.css` e i file che importa (token in testa). Per ogni componente leggi il suo `.prompt.md` e `.d.ts`.

## Esempio
```jsx
<AppShell title="Torre Idroponica NFT" subtitle="Guida per balcone">
  <Card title="Dosaggio nutrienti" highlight>
    <FieldGrid>
      <Field label="Serbatoio (litri)"><Input type="number" defaultValue={30} /></Field>
      <Field label="Fase"><Select options={['Crescita', 'Fioritura']} /></Field>
    </FieldGrid>
    <KeyValue label="TriPart Grow (1,8 mL/L)" value={<Stat value="54,0" unit="mL" />} />
    <Tip>Miscela in ordine: Grow, Micro, Bloom.</Tip>
  </Card>
  <div style={{ display: 'flex', gap: 'var(--hp-space-3)', color: 'var(--hp-muted)' }}>…</div>
</AppShell>
```
