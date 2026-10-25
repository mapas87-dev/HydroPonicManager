import { NavTabs } from '@hydroponic/ui';

export const Soluzione = () => (
  <div style={{ width: 390 }}>
    <NavTabs value="nut" items={[{ id: 'nut', label: 'Nutrienti', icon: 'flask' }, { id: 'ec', label: 'EC', icon: 'zap' }, { id: 'ph', label: 'pH-', icon: 'gauge' }]} />
  </div>
);
export const Torre = () => (
  <div style={{ width: 390 }}>
    <NavTabs value="rot" items={[{ id: 'cre', label: 'Crescita', icon: 'leaf' }, { id: 'rot', label: 'Ricambio', icon: 'cycle' }]} />
  </div>
);
