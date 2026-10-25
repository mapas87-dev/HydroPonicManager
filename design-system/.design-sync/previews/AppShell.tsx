import { AppShell, FeatureChips, FeatureChip, NavTabs, Card, KeyValue } from '@hydroponic/ui';

export const SchermataCompleta = () => (
  <div style={{ width: 390 }}>
    <AppShell title="Torre Idroponica NFT" subtitle="Guida per balcone">
      <FeatureChips>
        <FeatureChip icon="💧">Acqua in movimento</FeatureChip>
        <FeatureChip icon="🌱">Crescita continua</FeatureChip>
      </FeatureChips>
      <NavTabs value="nut" items={[{ id: 'ger', label: 'Germinazione' }, { id: 'nut', label: 'Nutrienti' }, { id: 'ec', label: 'EC' }]} />
      <Card title="Regole di coltivazione">
        <KeyValue label="EC target" value="1,2–1,4 mS/cm" />
        <KeyValue label="pH ottimale" value="5,8" />
      </Card>
    </AppShell>
  </div>
);
