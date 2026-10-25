import { Timeline, TimelineItem, Dot } from '@hydroponic/ui';

export const CalendarioCrescita = () => (
  <div style={{ width: 380 }}>
    <Timeline>
      <TimelineItem when="sab 25 ott" today>Trasferimento: spugna nel cestello, base a contatto col velo d’acqua.</TimelineItem>
      <TimelineItem when="25 ott → 30 ott">Correggi il pH ogni giorno (serbatoio nuovo).</TimelineItem>
      <TimelineItem when="4 nov → 8 nov">Cambio totale soluzione (1° cambio).</TimelineItem>
      <TimelineItem when="9 dic"><Dot color="var(--hp-warn)" /><b>Suggerito · L1</b>: semina Rucola per il livello che si libera.</TimelineItem>
    </Timeline>
  </div>
);
