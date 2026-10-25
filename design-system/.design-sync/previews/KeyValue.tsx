import { KeyValue, Stat, Dot } from '@hydroponic/ui';

export const Righe = () => (
  <div style={{ width: 340 }}>
    <KeyValue label="Semi per foro" value="1-2 semi, 0,5 cm" />
    <KeyValue label="Temperatura" value="15–20 °C" />
    <KeyValue label="Tempi" value="5–10 giorni" />
  </div>
);

export const ConNotaEColore = () => (
  <div style={{ width: 340 }}>
    <KeyValue label={<><Dot color="var(--hp-level-high)" />Alto · Insalata</>} value="EC 1,2–1,4 · pH 5,5–6,2" note="Massima esposizione solare." />
    <KeyValue label={<><Dot color="var(--hp-level-low)" />Basso · Bieta</>} value="EC 1,2–1,4 · pH 5,5–6,2" note="Foglie ampie, non fa ombra." />
  </div>
);

export const ConRisultato = () => (
  <div style={{ width: 340 }}>
    <KeyValue label="Dose totale pH-" value={<Stat value="25,8" unit="mL" />} />
  </div>
);
