import { Button, ButtonRow } from '@hydroponic/ui';

export const Varianti = () => (
  <ButtonRow>
    <Button variant="primary">Riempi per livelli consigliati</Button>
    <Button>Svuota torre</Button>
    <Button variant="danger">Elimina</Button>
  </ButtonRow>
);

export const Blocco = () => (
  <div style={{ width: 320 }}>
    <Button variant="primary" block>Aggiungi all’archivio</Button>
  </div>
);

export const Disabilitato = () => (
  <ButtonRow>
    <Button variant="primary" disabled>Salva</Button>
    <Button disabled>Applica a tutto il livello</Button>
  </ButtonRow>
);
