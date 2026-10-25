import { FeatureChips, FeatureChip } from '@hydroponic/ui';

export const Intestazione = () => (
  <div style={{ width: 380 }}>
    <FeatureChips>
      <FeatureChip icon="💧">Acqua in movimento</FeatureChip>
      <FeatureChip icon="🌱">Crescita continua</FeatureChip>
      <FeatureChip icon="🏡">Ideale per spazi piccoli</FeatureChip>
    </FeatureChips>
  </div>
);
