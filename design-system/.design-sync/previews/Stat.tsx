import { Stat } from '@hydroponic/ui';

export const Toni = () => (
  <div style={{ display: 'flex', gap: 24 }}>
    <Stat value="54,0" unit="mL" />
    <Stat value="1,35" unit="mS/cm" tone="accent" />
  </div>
);
export const SenzaUnita = () => <Stat value="0,0857" />;
