import { AppShell, FeatureChips, FeatureChip } from '@hydroponic/ui';

export const Intestazione = () => (
  <div style={{ width: 390 }}>
    <AppShell title="Torre Idroponica NFT" subtitle="Guida per balcone" style={{ padding: 0 }} badges={
      <FeatureChips>
        <FeatureChip icon="drop">Acqua in movimento</FeatureChip>
        <FeatureChip icon="sprout">Crescita continua</FeatureChip>
        <FeatureChip icon="home">Ideale per spazi piccoli</FeatureChip>
      </FeatureChips>
    } />
  </div>
);
