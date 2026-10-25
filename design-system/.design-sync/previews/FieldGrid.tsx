import { FieldGrid, Field, Input, Select } from '@hydroponic/ui';

export const CorrezioneEC = () => (
  <div style={{ width: 340 }}>
    <FieldGrid>
      <Field label="EC misurata (mS/cm)"><Input type="number" defaultValue={1.2} step={0.01} /></Field>
      <Field label="Temp. acqua (°C)"><Input type="number" defaultValue={18} /></Field>
      <Field label="Calibrazione (°C)"><Input type="number" defaultValue={25} /></Field>
      <Field label="Coefficiente (%/°C)"><Input type="number" defaultValue={1.91} /></Field>
    </FieldGrid>
  </div>
);

export const Nutrienti = () => (
  <div style={{ width: 340 }}>
    <FieldGrid>
      <Field label="Serbatoio (litri)"><Input type="number" defaultValue={30} /></Field>
      <Field label="Fase"><Select options={['Crescita', 'Fioritura']} /></Field>
    </FieldGrid>
  </div>
);
