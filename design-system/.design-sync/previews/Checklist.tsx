import { Checklist } from '@hydroponic/ui';

export const Semina = () => (
  <div style={{ width: 360 }}>
    <Checklist items={[
      { id: 'a', label: 'Cubi di spugna ben idratati (pH 5,5–6,0)', done: true },
      { id: 'b', label: 'Semi posizionati secondo la specie', done: true },
      { id: 'c', label: 'Coperchio e bocchette chiusi per 2–3 giorni' },
      { id: 'd', label: 'Luce 14–16 h appena spuntano i germogli' },
    ]} />
  </div>
);
