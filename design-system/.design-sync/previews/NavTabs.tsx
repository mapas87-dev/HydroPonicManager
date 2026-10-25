import { NavTabs } from '@hydroponic/ui';

const sezioni = [
  { id: 'ger', label: 'Germinazione' }, { id: 'cre', label: 'Crescita' }, { id: 'pia', label: 'Piante' },
  { id: 'rot', label: 'Ricambio' }, { id: 'nut', label: 'Nutrienti' }, { id: 'ec', label: 'EC' }, { id: 'avv', label: '🔔 Avvisi' },
];

export const Principale = () => <div style={{ width: 390 }}><NavTabs items={sezioni} value="ger" /></div>;
export const AvvisiAttivo = () => <div style={{ width: 390 }}><NavTabs items={sezioni.slice(3)} value="avv" /></div>;
