import { FeatureChip, AppShell } from '@hydroponic/ui';

export const Singola = () => <FeatureChip icon="drop">Acqua in movimento</FeatureChip>;
export const NellIntestazione = () => (
  <div style={{ width: 360 }}>
    <AppShell title="Torre Idroponica" style={{ padding: 0 }} badges={<FeatureChip icon="home">Ideale per spazi piccoli</FeatureChip>} />
  </div>
);
