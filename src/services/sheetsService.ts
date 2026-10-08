import Papa from 'papaparse';
import { calculateRiskLevel } from '../data/mockEpidemiologyData';
import { SAO_LUIS_BAIRROS_GEOJSON } from '../data/saoLuisGeoJson';
import { BairroEpidemiology, DistrictEpidemiology, GeoJsonNeighborhoodCollection, WeeklyDataSummary } from '../types/dengue';

/**
 * Normaliza strings para busca e correspondência robusta entre planilha e GeoJSON
 */
export function normalizeKey(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9]/g, '') // remove pontuações, espaços e hífens
    .trim();
}

/**
 * Busca de alta precisão de dados do bairro por ID, ID de feature ou nome normalizado
 */
export function findBairroData(
  bairros: Record<string, BairroEpidemiology>,
  query: string
): BairroEpidemiology | undefined {
  if (!query || !bairros) return undefined;
  if (bairros[query]) return bairros[query];
  const norm = normalizeKey(query);
  if (!norm) return undefined;
  if (bairros[norm]) return bairros[norm];

  const values = Object.values(bairros);
  
  // 1. Correspondência exata por id ou nome normalizado
  const exact = values.find(b => 
    b.id === query || 
    normalizeKey(b.id) === norm || 
    normalizeKey(b.bairroNome) === norm
  );
  if (exact) return exact;

  // 2. Correspondência por inclusão controlada (mínimo de 3 caracteres)
  if (norm.length >= 3) {
    const contained = values.find(b => {
      const bNorm = normalizeKey(b.bairroNome);
      const idNorm = normalizeKey(b.id);
      return bNorm.includes(norm) || idNorm.includes(norm) || (bNorm.length >= 4 && norm.includes(bNorm));
    });
    if (contained) return contained;
  }

  return undefined;
}

/**
 * Agrega os dados epidemiológicos agrupando por Distrito Sanitário
 */
export function aggregateDistrictsData(
  bairrosData: Record<string, BairroEpidemiology>
): Record<string, DistrictEpidemiology> {
  const districts: Record<string, DistrictEpidemiology> = {};
  const seenBairros = new Set<string>();

  Object.values(bairrosData).forEach((b) => {
    // Evita duplicar bairros registrados sob chaves redundantes
    if (seenBairros.has(b.id)) return;
    seenBairros.add(b.id);

    const distRaw = b.distritoSanitario || 'Distrito Centro';
    const distName = normalizeKey(distRaw) === 'sao luis' ? 'Distrito Centro' : distRaw;
    if (!districts[distName]) {
      districts[distName] = {
        distritoNome: distName,
        totalCasos: 0,
        totalPopulacao: 0,
        incidencia: 0,
        nivelRisco: 'baixo',
        bairrosCount: 0,
        bairros: []
      };
    }

    districts[distName].totalCasos += b.casos;
    districts[distName].totalPopulacao += b.populacao;
    districts[distName].bairrosCount += 1;
    districts[distName].bairros.push(b);
  });

  Object.values(districts).forEach((d) => {
    d.incidencia = d.totalPopulacao > 0
      ? Math.round(((d.totalCasos / d.totalPopulacao) * 100000) * 10) / 10
      : 0;
    d.nivelRisco = calculateRiskLevel(d.incidencia);
    d.bairros.sort((a, b) => b.casos - a.casos);
  });

  return districts;
}

/**
 * Converte qualquer formato comum de link do Google Planilhas em um endpoint CSV direto
 */
export function convertGoogleSheetsUrlToCsvUrl(url: string, sheetName?: string): string {
  const trimmed = url.trim();

  if (trimmed.endsWith('.csv') || trimmed.includes('output=csv') || trimmed.includes('format=csv')) {
    const separator = trimmed.includes('?') ? '&' : '?';
    return `${trimmed}${separator}_cacheBuster=${Date.now()}`;
  }

  if (trimmed.includes('/pubhtml')) {
    const csvUrl = trimmed.replace('/pubhtml', '/pub?output=csv');
    return `${csvUrl}&_cacheBuster=${Date.now()}`;
  }

  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    const sheetId = match[1];
    const gidMatch = trimmed.match(/[#&?]gid=([0-9]+)/);
    const gid = gidMatch ? gidMatch[1] : '0';

    if (sheetName) {
      return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}&_cacheBuster=${Date.now()}`;
    }

    return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}&_cacheBuster=${Date.now()}`;
  }

  return `${trimmed}${trimmed.includes('?') ? '&' : '?'}t=${Date.now()}`;
}

function parseBrazilianNumber(val: any): number {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const str = String(val).trim();
  const clean = str.replace(/\./g, '').replace(',', '.');
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}

function extractPopulationMap(geoJson?: GeoJsonNeighborhoodCollection): Map<string, { populacao: number; distrito: string; officialName: string; featId: string }> {
  const map = new Map<string, { populacao: number; distrito: string; officialName: string; featId: string }>();
  const dataset = geoJson || SAO_LUIS_BAIRROS_GEOJSON;

  dataset.features.forEach((feat) => {
    const p = feat.properties;
    const officialName = p.NM_BAIRRO || p.name || 'Bairro';
    const populacao = Number(p.POPULACAO || p.populacao || p.POP) || 25000;
    const rawDist = p.layer || p.Layer || p.LAYER || p.distrito || p.NM_DISTRIT || 'Distrito Centro';
    const distrito = normalizeKey(rawDist) === 'sao luis' ? 'Distrito Centro' : rawDist;
    const featId = p.id || normalizeKey(officialName);

    const keyName = normalizeKey(officialName);
    const keyId = normalizeKey(featId);

    const data = { populacao, distrito, officialName, featId };
    if (keyName) map.set(keyName, data);
    if (keyId) map.set(keyId, data);
  });

  return map;
}

export async function fetchEpidemiologyFromGoogleSheets(
  rawUrl: string,
  sheetName?: string,
  geoJson?: GeoJsonNeighborhoodCollection
): Promise<{
  weeks: Record<string, WeeklyDataSummary>;
  activeWeek: string;
  rowCount: number;
}> {
  const csvUrl = convertGoogleSheetsUrlToCsvUrl(rawUrl, sheetName);

  const response = await fetch(csvUrl, {
    headers: {
      'Accept': 'text/csv,text/plain,*/*'
    }
  });

  if (!response.ok) {
    throw new Error(`Falha ao acessar planilha (HTTP ${response.status}: ${response.statusText}). Verifique se a planilha está com acesso público ("Qualquer pessoa com o link pode ver" ou "Publicada na Web").`);
  }

  const csvText = await response.text();

  return parseEpidemiologyCsv(csvText, geoJson);
}

export function parseEpidemiologyCsv(
  csvText: string,
  geoJson?: GeoJsonNeighborhoodCollection
): {
  weeks: Record<string, WeeklyDataSummary>;
  activeWeek: string;
  rowCount: number;
} {
  const parsed = Papa.parse<Record<string, any>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header: string) => header.trim().toLowerCase()
  });

  if (!parsed.data || parsed.data.length === 0) {
    throw new Error('A planilha está vazia ou os cabeçalhos não foram identificados.');
  }

  const popMap = extractPopulationMap(geoJson);
  const weeks: Record<string, WeeklyDataSummary> = {};
  let latestWeek = 'SE Atual';

  const sample = parsed.data[0];
  const keys = Object.keys(sample);

  const findKey = (candidates: string[]) => {
    return keys.find(k => {
      const norm = normalizeKey(k);
      return candidates.some(c => norm === normalizeKey(c) || norm.includes(normalizeKey(c)));
    });
  };

  const colBairro = findKey(['nm_bairro', 'nmbairro', 'bairro', 'nome_do_bairro', 'nome']) || keys[0] || 'nm_bairro';
  const colCasos = findKey(['n_casos', 'ncasos', 'numero_de_casos', 'casos', 'casos_provaveis', 'total_casos']) || keys[1] || 'n_casos';
  const colSemana = findKey(['semana', 'semana_epidemiologica', 'se', 'periodo']);

  let validRowCount = 0;

  parsed.data.forEach((row) => {
    const rawBairro = row[colBairro];
    if (!rawBairro || String(rawBairro).trim() === '') return;

    validRowCount++;
    const bairroNomeInput = String(rawBairro).trim();
    const id = normalizeKey(bairroNomeInput);

    const semana = colSemana && row[colSemana] ? String(row[colSemana]).trim() : 'SE Atual';
    latestWeek = semana;

    const casos = parseBrazilianNumber(row[colCasos]);

    const geoInfo = popMap.get(id);
    const finalId = geoInfo?.featId || id;
    const populacao = geoInfo?.populacao ?? 25000;
    const rawDistSanitario = geoInfo?.distrito ?? 'Distrito Centro';
    const distritoSanitario = normalizeKey(rawDistSanitario) === 'sao luis' ? 'Distrito Centro' : rawDistSanitario;
    const bairroNome = geoInfo?.officialName ?? bairroNomeInput;

    const incidencia = populacao > 0 ? Math.round(((casos / populacao) * 100000) * 10) / 10 : 0;
    const nivelRisco = calculateRiskLevel(incidencia);

    if (!weeks[semana]) {
      weeks[semana] = {
        semana,
        dataReferencia: new Date().toLocaleDateString('pt-BR'),
        totalCasos: 0,
        totalPopulacao: 0,
        incidenciaMedia: 0,
        bairrosEmRiscoAlto: 0,
        bairrosTotal: 0,
        bairros: {}
      };
    }

    const item: BairroEpidemiology = {
      id: finalId,
      bairroNome,
      distritoSanitario,
      populacao,
      casos,
      incidencia,
      nivelRisco,
      dataAtualizacao: new Date().toLocaleDateString('pt-BR')
    };

    weeks[semana].bairros[finalId] = item;
    weeks[semana].bairros[id] = item;
    weeks[semana].totalCasos += casos;
    weeks[semana].totalPopulacao += populacao;
    weeks[semana].bairrosTotal += 1;
    if (nivelRisco === 'alto' || nivelRisco === 'muito_alto') {
      weeks[semana].bairrosEmRiscoAlto += 1;
    }
  });

  Object.keys(weeks).forEach(sem => {
    const w = weeks[sem];
    if (w.totalPopulacao > 0) {
      w.incidenciaMedia = Math.round(((w.totalCasos / w.totalPopulacao) * 100000) * 10) / 10;
    }
  });

  return {
    weeks,
    activeWeek: latestWeek,
    rowCount: validRowCount
  };
}

export function generateGoogleSheetsCsvTemplate(): string {
  const headers = ['NM_BAIRRO', 'N_CASOS'];

  const sampleRows = [
    ['Cidade Operária', '478'],
    ['Turu', '395'],
    ['Cohatrac', '320'],
    ['Cidade Olímpica', '228'],
    ['Coroadinho', '215'],
    ['Anjo da Guarda', '198'],
    ['Cohab Anil', '142'],
    ['Parque Vitória', '122'],
    ['Vila Embratel', '118'],
    ['São Cristóvão', '110'],
    ['Centro Histórico', '68'],
    ['Calhau', '22'],
    ['Renascença', '19']
  ];

  return [
    headers.join(','),
    ...sampleRows.map(r => r.join(','))
  ].join('\n');
}
