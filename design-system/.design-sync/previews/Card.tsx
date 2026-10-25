import { Card, KeyValue, Stat, Tip } from '@hydroponic/ui';

export const Passo = () => (
  <div style={{ width: 360 }}>
    <Card title="Calendario germinazione" step={1} description="Le scadenze seguono le date di semina impostate per ogni fila delle serre.">
      <KeyValue label="Serra 1 · pot occupati" value="18 su 18" />
      <KeyValue label="F1 · Spinaci" value="6 pot" note="emergenza 31 ott → 5 nov" />
    </Card>
  </div>
);

export const Evidenziata = () => (
  <div style={{ width: 360 }}>
    <Card title="Dosaggio nutrienti" highlight>
      <KeyValue label="1. TriPart Grow (1,8 mL/L)" value={<Stat value="54,0" unit="mL" />} />
      <KeyValue label="2. TriPart Micro (1,2 mL/L)" value={<Stat value="36,0" unit="mL" />} />
      <KeyValue label="3. TriPart Bloom (0,6 mL/L)" value={<Stat value="18,0" unit="mL" />} />
      <Tip>Miscela in ordine: prima Grow, poi Micro, infine Bloom, mescolando ogni volta.</Tip>
    </Card>
  </div>
);

export const Semplice = () => (
  <div style={{ width: 360 }}>
    <Card title="Regole di coltivazione">
      <KeyValue label="EC target" value="1,2–1,4 mS/cm" />
      <KeyValue label="pH ottimale" value="5,8 (5,5–6,2)" />
      <KeyValue label="Esposizione" value="Ruota di 180° ogni 1–2 giorni" />
    </Card>
  </div>
);
