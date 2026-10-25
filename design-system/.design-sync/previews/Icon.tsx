import { Icon, iconNames } from '@hydroponic/ui';

export const Tutte = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 84px)', gap: 12, fontFamily: 'var(--hp-font)', color: 'var(--hp-text)', fontSize: 12 }}>
    {iconNames.map(n => <span key={n} style={{ display: 'grid', justifyItems: 'center', gap: 4 }}><Icon name={n} size={24} />{n}</span>)}
  </div>
);

export const Colori = () => (
  <div style={{ display: 'flex', gap: 16 }}>
    <Icon name="drop" size={28} style={{ color: 'var(--hp-sky)' }} label="Acqua" />
    <Icon name="leaf" size={28} style={{ color: 'var(--hp-accent)' }} label="Crescita" />
    <Icon name="alert" size={28} style={{ color: 'var(--hp-warn)' }} label="Attenzione" />
  </div>
);
