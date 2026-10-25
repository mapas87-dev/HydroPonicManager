import { ButtonRow, Button } from '@hydroponic/ui';

export const AzioniTorre = () => (
  <ButtonRow>
    <Button variant="primary">Riempi per livelli consigliati</Button>
    <Button>Svuota torre</Button>
  </ButtonRow>
);

export const AzioniPot = () => (
  <ButtonRow>
    <Button>Applica a tutto il livello</Button>
    <Button>Applica a tutta la torre</Button>
  </ButtonRow>
);
