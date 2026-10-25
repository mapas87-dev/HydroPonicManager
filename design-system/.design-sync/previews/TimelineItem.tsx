import { Timeline, TimelineItem, Dot } from '@hydroponic/ui';

export const Stati = () => (
  <div style={{ width: 380 }}>
    <Timeline>
      <TimelineItem when="ven 24 ott" past>Trasferimento in torre: spugna nel net pot.</TimelineItem>
      <TimelineItem when="dom 26 ott" today>
        <Dot color="var(--hp-cat-1)" /><b>Serra 1 · F1 · Spinaci</b>: inizio emergenza, luce 14–16 h.
      </TimelineItem>
      <TimelineItem when="3 nov → 7 nov">Cambio totale soluzione (1° cambio).</TimelineItem>
    </Timeline>
  </div>
);
