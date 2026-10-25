import { Tip } from '@hydroponic/ui';

export const Consiglio = () => (
  <div style={{ width: 340 }}><Tip>Aggiungi circa l’80% della dose, mescola con la pompa attiva 5–10 minuti, ricontrolla il pH e solo allora aggiungi il resto.</Tip></div>
);
export const Attenzione = () => (
  <div style={{ width: 340 }}><Tip tone="warning">Le colture scelte non hanno EC o pH in comune: meglio due torri o serbatoi separati.</Tip></div>
);
