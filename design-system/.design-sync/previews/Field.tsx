import { Field, Input, Select } from '@hydroponic/ui';

export const Numero = () => (
  <div style={{ width: 300 }}>
    <Field label="Serbatoio (litri)" htmlFor="l"><Input id="l" type="number" defaultValue={30} /></Field>
  </div>
);

export const ConNota = () => (
  <div style={{ width: 300 }}>
    <Field label="Data trasferimento in torre" htmlFor="d" hint="Le scadenze di crescita partono da questa data.">
      <Input id="d" type="date" defaultValue="2026-10-24" />
    </Field>
  </div>
);

export const Menu = () => (
  <div style={{ width: 300 }}>
    <Field label="Fase" htmlFor="f"><Select id="f" defaultValue="Crescita vegetativa" options={['Prime radici', 'Prime foglie', 'Crescita vegetativa', 'Fioritura']} /></Field>
  </div>
);
