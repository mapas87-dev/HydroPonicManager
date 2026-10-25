import { Dot } from '@hydroponic/ui';

const file = ['Spinaci', 'Bieta', 'Lattuga', 'Rucola', 'Basilico', 'Prezzemolo', 'Menta', 'Kale'];

export const PaletteFile = () => (
  <div style={{ display: 'grid', gap: 6, fontSize: 14, fontFamily: 'var(--hp-font)', color: 'var(--hp-text)' }}>
    {file.map((n, i) => <span key={n}><Dot color={`var(--hp-cat-${i + 1})`} />F{i + 1} · {n}</span>)}
  </div>
);

export const LivelliTorre = () => (
  <div style={{ display: 'grid', gap: 6, fontSize: 14, fontFamily: 'var(--hp-font)', color: 'var(--hp-text)' }}>
    <span><Dot color="var(--hp-level-high)" />Alto · livelli 1–3</span>
    <span><Dot color="var(--hp-level-mid)" />Medio · livelli 4–7</span>
    <span><Dot color="var(--hp-level-low)" />Basso · livelli 8–10</span>
  </div>
);
