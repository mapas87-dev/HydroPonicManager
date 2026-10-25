import { Select } from '@hydroponic/ui';

export const Semplice = () => <div style={{ width: 280 }}><Select defaultValue="Medio" options={['Alto', 'Medio', 'Basso']} /></div>;

export const ConGruppi = () => (
  <div style={{ width: 280 }}>
    <Select defaultValue="Spinaci">
      <optgroup label="In coltivazione"><option>Spinaci</option><option>Bieta</option></optgroup>
      <optgroup label="Archivio"><option>Rucola</option><option>Basilico</option></optgroup>
    </Select>
  </div>
);
