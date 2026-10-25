import { AppShell, FeatureChips, FeatureChip, NavTabs, Card, KeyValue, BottomNav } from '@hydroponic/ui';

export const SchermataCompleta = () => (
  <div style={{ width: 390 }}>
    <AppShell title="Torre Idroponica NFT" subtitle="Guida per balcone" badges={
      <FeatureChips>
        <FeatureChip icon="drop">Acqua in movimento</FeatureChip>
        <FeatureChip icon="sprout">Crescita continua</FeatureChip>
      </FeatureChips>
    }>
      <NavTabs value="nut" items={[{ id: 'nut', label: 'Nutrienti', icon: 'flask' }, { id: 'ec', label: 'EC', icon: 'zap' }, { id: 'ph', label: 'pH-', icon: 'gauge' }]} />
      <Card title="Regole di coltivazione">
        <KeyValue label="EC target" value="1,2–1,4 mS/cm" />
        <KeyValue label="pH ottimale" value="5,8" />
      </Card>
      <BottomNav inline value="soluzione" items={[
        { id: 'semina', label: 'Semina', icon: 'sprout' }, { id: 'torre', label: 'Torre', icon: 'tower' },
        { id: 'soluzione', label: 'Soluzione', icon: 'flask' }, { id: 'piante', label: 'Piante', icon: 'book' }, { id: 'avvisi', label: 'Avvisi', icon: 'bell' },
      ]} />
    </AppShell>
  </div>
);
