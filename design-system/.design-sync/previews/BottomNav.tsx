import { BottomNav } from '@hydroponic/ui';

const sezioni = [
  { id: 'semina', label: 'Semina', icon: 'sprout' }, { id: 'torre', label: 'Torre', icon: 'tower' },
  { id: 'soluzione', label: 'Soluzione', icon: 'flask' }, { id: 'piante', label: 'Piante', icon: 'book' }, { id: 'avvisi', label: 'Avvisi', icon: 'bell' },
] as const;

export const CinqueSezioni = () => <div style={{ width: 390 }}><BottomNav inline value="soluzione" items={[...sezioni]} /></div>;
export const TreSezioni = () => <div style={{ width: 390 }}><BottomNav inline value="torre" items={[sezioni[0], sezioni[1], sezioni[4]]} /></div>;
