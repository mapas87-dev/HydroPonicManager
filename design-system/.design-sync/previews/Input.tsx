import { Input } from '@hydroponic/ui';

export const Tipi = () => (
  <div style={{ width: 280, display: 'grid', gap: 8 }}>
    <Input placeholder="Nome della pianta" />
    <Input type="number" defaultValue={5.8} step={0.1} />
    <Input type="time" defaultValue="09:00" />
  </div>
);

export const Disabilitato = () => <div style={{ width: 280 }}><Input defaultValue="Rucola" disabled /></div>;
