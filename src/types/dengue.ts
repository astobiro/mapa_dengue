export type RiskLevel = 'baixo' | 'medio' | 'alto' | 'muito_alto';

export type MapViewLevel = 'bairro' | 'distrito';

export interface BairroEpidemiology {
  id: string;
  bairroNome: string;
  distritoSanitario: string;
  populacao: number; // obtido do campo POPULACAO do geojson
  casos: number; // obtido da coluna N_CASOS da planilha
  incidencia: number; // calculada: (casos / populacao) * 100.000 hab
  nivelRisco: RiskLevel;
  dataAtualizacao: string;
}

export interface DistrictEpidemiology {
  distritoNome: string;
  totalCasos: number;
  totalPopulacao: number;
  incidencia: number;
  nivelRisco: RiskLevel;
  bairrosCount: number;
  bairros: BairroEpidemiology[];
}

export interface WeeklyDataSummary {
  semana: string;
  dataReferencia: string;
  totalCasos: number;
  totalPopulacao: number;
  incidenciaMedia: number;
  bairrosEmRiscoAlto: number;
  bairrosTotal: number;
  bairros: Record<string, BairroEpidemiology>;
}

export interface SheetsConfig {
  url: string;
  sheetName?: string;
  autoRefreshIntervalSeconds: number; // 0 = desativado, 60 = 1min, 300 = 5min, etc.
  lastFetchedAt?: string;
  sourceType: 'google_sheets' | 'csv_url' | 'local_demo' | 'custom_upload';
}

export type ChoroplethMetric = 'casos' | 'incidencia';

export type BasemapTheme = 'osm' | 'satellite';

export interface GeoJsonNeighborhoodFeature {
  type: 'Feature';
  properties: {
    id: string;
    name: string;
    NM_BAIRRO?: string;
    POPULACAO: number;
    layer?: string;
    distrito?: string;
    zona?: string;
    [key: string]: any;
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

export interface GeoJsonNeighborhoodCollection {
  type: 'FeatureCollection';
  name?: string;
  features: GeoJsonNeighborhoodFeature[];
}
