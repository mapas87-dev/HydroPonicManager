import { DataTable } from '@hydroponic/ui';

export const SchemaNutrienti = () => (
  <div style={{ width: 380 }}>
    <DataTable
      columns={['Fase', 'Grow', 'Micro', 'Bloom', 'EC']}
      rows={[['Prime radici', '0,5', '0,5', '0,5', '0,3–0,6'], ['Prime foglie', '1,0', '1,0', '1,0', '0,8–1,2'], ['Crescita', '1,8', '1,2', '0,6', '1,3–1,8'], ['Fioritura', '0,8', '1,6', '2,4', '1,4–2,2']]}
      highlightRow={2}
    />
  </div>
);

export const TabellaEC = () => (
  <div style={{ width: 380 }}>
    <DataTable columns={['Temp °C', 'EC misurata', 'EC reale', 'Var. %']}
      rows={[['16', '1,20', '1,45', '+21,0%'], ['17', '1,20', '1,42', '+18,1%'], ['18', '1,20', '1,38', '+15,4%']]} highlightRow={2} />
  </div>
);
