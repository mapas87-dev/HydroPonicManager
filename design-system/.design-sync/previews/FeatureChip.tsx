import { FeatureChip } from '@hydroponic/ui';

export const Singola = () => <FeatureChip icon="💧">Acqua in movimento</FeatureChip>;
export const Varie = () => (
  <div style={{ display: 'grid', gap: 8 }}>
    <FeatureChip icon="🌱">Crescita continua</FeatureChip>
    <FeatureChip icon="🏡">Ideale per spazi piccoli</FeatureChip>
  </div>
);
