# Torre Idroponica UI — convenzioni

Design system dell'app mobile "Torre Idroponica NFT" (coltivazione idroponica su balcone), stile **Organic Biophilic**: sfondo crema, verde bosco, marrone terra, terracotta; forme morbide e ombre leggere. Interfaccia in **italiano**, per telefono (~390px), numeri con la virgola decimale (`5,8`, `1,2–1,4 mS/cm`). Controlli alti almeno 44px.

## Struttura e setup
- Avvolgi ogni schermata in `<AppShell title="…" subtitle="…" badges={<FeatureChips>…</FeatureChips>} withBottomNav>`: sfondo crema, font Raleway, margini 16px, intestazione verde con le foglie. Fuori da AppShell (o da una Card) il tuo testo libero cade nel font di sistema.
- Navigazione: `BottomNav` fissa in basso con 3–5 sezioni (icona + etichetta); `NavTabs` in alto solo per le sotto-schede della sezione attiva. Con BottomNav metti `withBottomNav` su AppShell, che lascia lo spazio in fondo.
- Nessun provider o tema JS. Tema scuro automatico (`prefers-color-scheme`); per forzarlo `data-theme="dark"` o `"light"` su `<html>`.

## Idioma di stile: componenti + token CSS
- Niente classi utility: componi con i componenti e usa `style={{…}}` con **token `var(--hp-*)`** per il tuo layout. Le classi `hp-*` sono interne: non scriverle a mano.
- Colori: `--hp-bg` (crema), `--hp-surface`, `--hp-text`, `--hp-muted`, `--hp-accent` (verde: azioni, date, scheda attiva), `--hp-accent-soft`, `--hp-on-accent`, `--hp-border`, `--hp-warn` (terracotta: risultati e avvisi), `--hp-warn-soft`, `--hp-on-warn`, `--hp-header`, `--hp-earth` (marrone), `--hp-sky` (acqua), `--hp-leaf`.
- Palette file/colture: `--hp-cat-1` … `--hp-cat-8` (testo bianco leggibile). Livelli torre: `--hp-level-high`, `--hp-level-mid`, `--hp-level-low`.
- Testo: `--hp-font` (Raleway), `--hp-font-head` (Lora, per titoli), `--hp-text-xs|sm|md|lg|xl`. Spazi: `--hp-space-1`…`--hp-space-5`. Raggi: `--hp-radius-sm|md|lg|pill`. Ombra: `--hp-shadow`. Tocco minimo: `--hp-tap`.
- Icone: solo `<Icon name="…">` (drop, sprout, home, leaf, book, cycle, flask, zap, gauge, tower, bell, alert), colorate con `color`. Niente emoji.

## Quale componente usare
- Contenitori: `Card` (`step` = badge marrone numerato, `highlight` = bordo e titolo terracotta per i calcolatori), `FieldGrid` (2 colonne), `ButtonRow`.
- Dati: `KeyValue` (righe etichetta/valore dentro una Card), `Stat` (risultato grande, di solito `value` di KeyValue), `DataTable` (`highlightRow`), `Timeline` + `TimelineItem` (`today`, `past`), `Dot`.
- Moduli: `Field` + `Input`/`Select`, `Toggle`, `Checklist`. Navigazione: `BottomNav`, `NavTabs` (con `icon`), `SegmentedTabs` (dentro una card).
- Messaggi: `Tip` (`tone="info"` foglia verde, `"warning"` triangolo terracotta). Azioni: `Button` (`primary` | `outline` | `danger`, `block`), a pillola.

## Dove leggere
Prima di dare stile leggi `_ds/<cartella>/styles.css` e i file che importa (token in testa). Per ogni componente leggi `.prompt.md` e `.d.ts`.

## Esempio
```jsx
<AppShell title="Torre Idroponica NFT" subtitle="Guida per balcone" withBottomNav
  badges={<FeatureChips><FeatureChip icon="drop">Acqua in movimento</FeatureChip></FeatureChips>}>
  <NavTabs value="nut" items={[{ id: 'nut', label: 'Nutrienti', icon: 'flask' }, { id: 'ec', label: 'EC', icon: 'zap' }]} />
  <Card title="Dosaggio nutrienti" highlight>
    <FieldGrid>
      <Field label="Serbatoio (litri)"><Input type="number" defaultValue={30} /></Field>
      <Field label="Fase"><Select options={['Crescita', 'Fioritura']} /></Field>
    </FieldGrid>
    <KeyValue label="TriPart Grow (1,8 mL/L)" value={<Stat value="54,0" unit="mL" />} />
    <Tip>Miscela in ordine: Grow, Micro, Bloom.</Tip>
  </Card>
  <BottomNav value="soluzione" items={[{ id: 'semina', label: 'Semina', icon: 'sprout' }, { id: 'soluzione', label: 'Soluzione', icon: 'flask' }, { id: 'avvisi', label: 'Avvisi', icon: 'bell' }]} />
</AppShell>
```
