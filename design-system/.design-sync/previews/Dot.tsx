import { AppShell, Dot } from '@hydroponic/ui';

const file = ['Spinaci', 'Bieta', 'Lattuga', 'Rucola', 'Basilico', 'Prezzemolo', 'Menta', 'Kale'];
const legenda = { display: 'grid', gap: 6, fontSize: 14 } as const;

export const PaletteFile = () => (
  <AppShell style={{ padding: 0 }}>
    <div style={legenda}>{file.map((n, i) => <span key={n}><Dot color={`var(--hp-cat-${i + 1})`} />F{i + 1} · {n}</span>)}</div>
  </AppShell>
);

export const LivelliTorre = () => (
  <AppShell style={{ padding: 0 }}>
    <div style={legenda}>
      <span><Dot color="var(--hp-level-high)" />Alto · livelli 1–3</span>
      <span><Dot color="var(--hp-level-mid)" />Medio · livelli 4–7</span>
      <span><Dot color="var(--hp-level-low)" />Basso · livelli 8–10</span>
    </div>
  </AppShell>
);
