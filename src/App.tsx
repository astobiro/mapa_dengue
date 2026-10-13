import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SAO_LUIS_BAIRROS_GEOJSON } from './data/saoLuisGeoJson';
import { INITIAL_EPIDEMIOLOGY_DATA } from './data/mockEpidemiologyData';
import { 
  BairroEpidemiology, 
  BasemapTheme, 
  ChoroplethMetric, 
  DistrictEpidemiology, 
  GeoJsonNeighborhoodCollection, 
  MapViewLevel, 
  SheetsConfig, 
  WeeklyDataSummary 
} from './types/dengue';
import { 
  aggregateDistrictsData, 
  fetchEpidemiologyFromGoogleSheets, 
  findBairroData, 
  normalizeKey 
} from './services/sheetsService';
import { normalizeGeoJsonCollection } from './utils/districtGeoJson';
import { DengueMap } from './components/DengueMap';
import { EpidemiologyHeader } from './components/EpidemiologyHeader';
import { MinimizedEmbedFilters } from './components/MinimizedEmbedFilters';
import { BairroDetailPanel } from './components/BairroDetailPanel';
import { GoogleSheetsConfigModal } from './components/GoogleSheetsConfigModal';
import { LookerStudioEmbedModal } from './components/LookerStudioEmbedModal';
import { GeoJsonUploadModal } from './components/GeoJsonUploadModal';
import { OfflineIndicator } from './components/OfflineIndicator';

const LOCAL_STORAGE_KEY_CONFIG = 'dengue_slz_sheets_config_v1';
const LOCAL_STORAGE_KEY_GEOJSON = 'dengue_slz_custom_geojson_v1';
const LOCAL_STORAGE_KEY_GEOJSON_URL = 'dengue_slz_custom_geojson_url_v1';

export default function App() {
  const queryParams = useMemo(() => new URLSearchParams(window.location.search), []);

  const initialEmbedMode = 
    queryParams.get('embed') === 'true' || 
    queryParams.get('mode') === 'embed' || 
    (typeof window !== 'undefined' && window.self !== window.top);

  const initialSheetUrl = queryParams.get('sheet') || queryParams.get('url') || '';
  
  // Métrica padrão: Número de Casos Prováveis ('casos')
  const initialMetric = (queryParams.get('metric') as ChoroplethMetric) || 'casos';
  // Camada padrão: OpenStreetMap ('osm')
  const initialTheme = (queryParams.get('theme') as BasemapTheme) || 'osm';
  const initialRefresh = queryParams.get('refresh') ? Number(queryParams.get('refresh')) : 300;
  const initialWeek = queryParams.get('week') || '';
  const initialDistrito = queryParams.get('distrito') || 'all';
  const initialViewLevel: MapViewLevel = queryParams.get('view') === 'distrito' ? 'distrito' : 'bairro';
  const initialGeoJsonParam = queryParams.get('geojson') || '';

  // Estado da Configuração da Planilha
  const [sheetsConfig, setSheetsConfig] = useState<SheetsConfig>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (initialSheetUrl) parsed.url = initialSheetUrl;
        return parsed;
      }
    } catch {}

    return {
      url: initialSheetUrl,
      autoRefreshIntervalSeconds: initialRefresh,
      sourceType: initialSheetUrl ? 'google_sheets' : 'local_demo',
      lastFetchedAt: new Date().toISOString()
    };
  });

  // URL do GeoJSON personalizado (caso importado via URL)
  const [customGeoJsonUrl, setCustomGeoJsonUrl] = useState<string>(() => {
    return initialGeoJsonParam || localStorage.getItem(LOCAL_STORAGE_KEY_GEOJSON_URL) || '';
  });

  // Camada GeoJSON
  const [geoJsonData, setGeoJsonData] = useState<GeoJsonNeighborhoodCollection>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_GEOJSON);
      if (saved) return JSON.parse(saved);
    } catch {}
    return SAO_LUIS_BAIRROS_GEOJSON;
  });

  // Dados Epidemiológicos agrupados por semana
  const [epidemiologyWeeks, setEpidemiologyWeeks] = useState<Record<string, WeeklyDataSummary>>(INITIAL_EPIDEMIOLOGY_DATA);
  const [selectedWeek, setSelectedWeek] = useState<string>(initialWeek || 'SE 14');

  // Estados de Interface do Usuário
  const [metric, setMetric] = useState<ChoroplethMetric>(initialMetric);
  const [basemap, setBasemap] = useState<BasemapTheme>(initialTheme);
  const [viewLevel, setViewLevel] = useState<MapViewLevel>(initialViewLevel); // 'bairro' ou 'distrito'
  const [filterDistrito, setFilterDistrito] = useState<string>(initialDistrito);
  const [selectedBairroId, setSelectedBairroId] = useState<string | null>(null);
  const [selectedDistrictName, setSelectedDistrictName] = useState<string | null>(null);
  const [searchedBairroId, setSearchedBairroId] = useState<string | null>(null);
  const [isEmbedMode, setIsEmbedMode] = useState<boolean>(initialEmbedMode);

  // Estados de Carregamento e Notificações
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Modais
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const [isLookerModalOpen, setIsLookerModalOpen] = useState(false);
  const [isGeoJsonModalOpen, setIsGeoJsonModalOpen] = useState(false);

  // Carregar GeoJSON da pasta local/GitHub (ou parâmetro URL caso fornecido)
  useEffect(() => {
    // 1. Se especificado explicitamente na URL, dar prioridade
    if (initialGeoJsonParam) {
      fetch(initialGeoJsonParam)
        .then((res) => {
          if (!res.ok) throw new Error('Falha ao carregar GeoJSON da URL');
          return res.json();
        })
        .then((data) => {
          const normalized = normalizeGeoJsonCollection(data);
          setGeoJsonData(normalized);
          setCustomGeoJsonUrl(initialGeoJsonParam);
        })
        .catch((err) => {
          console.warn('Erro ao carregar GeoJSON especificado na URL:', err);
        });
      return;
    }

    // 2. Se o usuário já tiver um GeoJSON salvo no localStorage, respeitar a escolha do usuário
    const hasSavedLocal = localStorage.getItem(LOCAL_STORAGE_KEY_GEOJSON);
    if (hasSavedLocal) return;

    // 3. Tentar carregar automaticamente do repositório /geojson/bairros_limpos.geojson
    const defaultPaths = [
      './geojson/bairros_limpos.geojson',
      '/geojson/bairros_limpos.geojson',
      './bairros_limpos.geojson',
      '/bairros_limpos.geojson'
    ];

    const tryFetchDefault = async () => {
      for (const p of defaultPaths) {
        try {
          const res = await fetch(p);
          if (res.ok) {
            const data = await res.json();
            if (data && data.features && data.features.length > 0) {
              const normalized = normalizeGeoJsonCollection(data);
              setGeoJsonData(normalized);
              setCustomGeoJsonUrl(p);
              break;
            }
          }
        } catch {}
      }
    };

    tryFetchDefault();
  }, [initialGeoJsonParam]);

  // Resumo da semana selecionada
  const currentWeekSummary = useMemo<WeeklyDataSummary>(() => {
    if (epidemiologyWeeks[selectedWeek]) {
      return epidemiologyWeeks[selectedWeek];
    }
    const firstKey = Object.keys(epidemiologyWeeks)[0];
    if (firstKey && epidemiologyWeeks[firstKey]) {
      return epidemiologyWeeks[firstKey];
    }
    return INITIAL_EPIDEMIOLOGY_DATA['SE 14'];
  }, [epidemiologyWeeks, selectedWeek]);

  // Dados agregados por Distrito Sanitário
  const districtsData = useMemo<Record<string, DistrictEpidemiology>>(() => {
    return aggregateDistrictsData(currentWeekSummary.bairros || {});
  }, [currentWeekSummary]);

  // Lista de Semanas Disponíveis
  const availableWeeks = useMemo(() => {
    return Object.keys(epidemiologyWeeks);
  }, [epidemiologyWeeks]);

  // Lista de Distritos Sanitários únicos (removendo "São Luís" conforme solicitação)
  const distritosList = useMemo(() => {
    const set = new Set<string>();
    Object.values(currentWeekSummary.bairros || {}).forEach(b => {
      if (b.distritoSanitario) set.add(b.distritoSanitario);
    });
    geoJsonData.features.forEach(f => {
      const d = f.properties?.layer || f.properties?.Layer || f.properties?.LAYER || f.properties?.distrito || f.properties?.distritoSanitario;
      if (d) set.add(d);
    });
    return Array.from(set)
      .filter(d => {
        if (!d || !d.trim()) return false;
        const norm = normalizeKey(d);
        return norm !== 'sao luis' && norm !== 'municipio de sao luis' && norm !== 'ilha de sao luis' && norm !== 'cidade de sao luis' && !norm.startsWith('saoluis');
      })
      .sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [currentWeekSummary, geoJsonData]);

  // Lista de Bairros para Busca
  const bairrosList = useMemo(() => {
    const list: Array<{ id: string; name: string }> = [];
    const seen = new Set<string>();

    geoJsonData.features.forEach(f => {
      const p = f.properties;
      const bId = p.id || normalizeKey(p.NM_BAIRRO || p.name || '');
      const bName = p.NM_BAIRRO || p.name || 'Bairro';
      if (!seen.has(bId)) {
        seen.add(bId);
        list.push({ id: bId, name: bName });
      }
    });

    Object.values(currentWeekSummary.bairros || {}).forEach(b => {
      if (!seen.has(b.id)) {
        seen.add(b.id);
        list.push({ id: b.id, name: b.bairroNome });
      }
    });

    return list.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }, [geoJsonData, currentWeekSummary]);

  // Bairro Selecionado (Dossiê) com busca robusta
  const selectedBairro = useMemo<BairroEpidemiology | null>(() => {
    if (!selectedBairroId) return null;
    
    // 1. Busca direta ou normalizada no mapa da semana
    const directFound = findBairroData(currentWeekSummary.bairros || {}, selectedBairroId);
    if (directFound) return directFound;

    // 2. Se não achou diretamente, verificar nas feições do GeoJSON e tentar novamente
    const feat = geoJsonData.features.find(f => {
      const p = f.properties;
      return (
        p.id === selectedBairroId ||
        p.NM_BAIRRO === selectedBairroId ||
        p.name === selectedBairroId ||
        normalizeKey(p.id || '') === normalizeKey(selectedBairroId) ||
        normalizeKey(p.NM_BAIRRO || p.name || '') === normalizeKey(selectedBairroId)
      );
    });

    if (feat) {
      const p = feat.properties;
      const byName = findBairroData(currentWeekSummary.bairros || {}, p.NM_BAIRRO || p.name || '');
      if (byName) return byName;

      const name = p.NM_BAIRRO || p.name || 'Bairro';
      const populacao = Number(p.POPULACAO) || 25000;
      const rawD = p.layer || p.distrito || 'Distrito Centro';
      const safeDist = normalizeKey(rawD) === 'sao luis' ? 'Distrito Centro' : rawD;
      return {
        id: selectedBairroId,
        bairroNome: name,
        distritoSanitario: safeDist,
        populacao,
        casos: 0,
        incidencia: 0,
        nivelRisco: 'baixo',
        dataAtualizacao: new Date().toLocaleDateString('pt-BR')
      };
    }

    return null;
  }, [selectedBairroId, currentWeekSummary, geoJsonData]);

  // Informações do Distrito Selecionado
  const selectedDistrict = useMemo<DistrictEpidemiology | null>(() => {
    if (!selectedDistrictName || !districtsData) return null;
    return districtsData[selectedDistrictName] || null;
  }, [selectedDistrictName, districtsData]);

  // Função para carregar e sincronizar a planilha do Google
  const syncGoogleSheets = useCallback(async (targetConfig?: SheetsConfig, currentGeo?: GeoJsonNeighborhoodCollection) => {
    const cfg = targetConfig || sheetsConfig;
    if (!cfg.url || cfg.url.trim() === '') return;

    setIsRefreshing(true);
    setError(null);

    try {
      const activeGeo = currentGeo || geoJsonData;
      const result = await fetchEpidemiologyFromGoogleSheets(cfg.url, cfg.sheetName, activeGeo);
      
      setEpidemiologyWeeks(result.weeks);
      if (initialWeek && result.weeks[initialWeek]) {
        setSelectedWeek(initialWeek);
      } else if (result.activeWeek && result.weeks[result.activeWeek]) {
        setSelectedWeek(result.activeWeek);
      } else {
        const first = Object.keys(result.weeks)[0];
        if (first) setSelectedWeek(first);
      }

      const updatedConfig: SheetsConfig = {
        ...cfg,
        lastFetchedAt: new Date().toISOString(),
        sourceType: 'google_sheets'
      };

      setSheetsConfig(updatedConfig);
      localStorage.setItem(LOCAL_STORAGE_KEY_CONFIG, JSON.stringify(updatedConfig));
    } catch (err: any) {
      setError(err.message || 'Erro ao sincronizar com Google Planilhas.');
    } finally {
      setIsRefreshing(false);
    }
  }, [sheetsConfig, geoJsonData, initialWeek]);

  useEffect(() => {
    if (sheetsConfig.url) {
      syncGoogleSheets();
    }
  }, []);

  useEffect(() => {
    if (!sheetsConfig.url || sheetsConfig.autoRefreshIntervalSeconds <= 0) return;

    const intervalMs = sheetsConfig.autoRefreshIntervalSeconds * 1000;
    const timer = setInterval(() => {
      syncGoogleSheets();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [sheetsConfig.url, sheetsConfig.autoRefreshIntervalSeconds, syncGoogleSheets]);

  const handleSaveSheetsConfig = async (newConfig: SheetsConfig) => {
    setSheetsConfig(newConfig);
    localStorage.setItem(LOCAL_STORAGE_KEY_CONFIG, JSON.stringify(newConfig));
    if (newConfig.url) {
      await syncGoogleSheets(newConfig);
      setIsSheetsModalOpen(false);
    } else {
      handleResetToDemo();
      setIsSheetsModalOpen(false);
    }
  };

  const handleResetToDemo = () => {
    const demoConfig: SheetsConfig = {
      url: '',
      autoRefreshIntervalSeconds: 300,
      sourceType: 'local_demo',
      lastFetchedAt: new Date().toISOString()
    };
    setSheetsConfig(demoConfig);
    localStorage.removeItem(LOCAL_STORAGE_KEY_CONFIG);
    setEpidemiologyWeeks(INITIAL_EPIDEMIOLOGY_DATA);
    setSelectedWeek('SE 14');
    setError(null);
  };

  const handleUpdateGeoJson = (newGeoJson: GeoJsonNeighborhoodCollection, sourceUrl?: string) => {
    setGeoJsonData(newGeoJson);
    const urlToSave = sourceUrl !== undefined ? sourceUrl : customGeoJsonUrl;
    setCustomGeoJsonUrl(urlToSave);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_GEOJSON, JSON.stringify(newGeoJson));
      if (urlToSave) {
        localStorage.setItem(LOCAL_STORAGE_KEY_GEOJSON_URL, urlToSave);
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY_GEOJSON_URL);
      }
    } catch {}
    if (sheetsConfig.url) {
      syncGoogleSheets(sheetsConfig, newGeoJson);
    }
  };

  const handleResetGeoJson = () => {
    setGeoJsonData(SAO_LUIS_BAIRROS_GEOJSON);
    setCustomGeoJsonUrl('');
    localStorage.removeItem(LOCAL_STORAGE_KEY_GEOJSON);
    localStorage.removeItem(LOCAL_STORAGE_KEY_GEOJSON_URL);
  };

  const handleSelectDistrito = useCallback((dist: string) => {
    setFilterDistrito(dist);
    if (dist === 'all') {
      setSelectedDistrictName(null);
    } else {
      setSelectedDistrictName(dist);
      // Se houver um bairro selecionado que não pertença a este distrito, desmarca o bairro
      setSelectedBairroId((prevBairroId) => {
        if (!prevBairroId) return null;
        const b = findBairroData(currentWeekSummary.bairros, prevBairroId);
        if (b && normalizeKey(b.distritoSanitario) === normalizeKey(dist)) {
          return prevBairroId;
        }
        return null;
      });
      // Permanece na visualização atual (se estiver na visualização de bairros, continua nela)
    }
  }, [currentWeekSummary.bairros]);

  const handleChangeViewLevel = useCallback((level: MapViewLevel) => {
    setViewLevel(level);
    if (level === 'distrito') {
      setSelectedBairroId(null);
      if (filterDistrito && filterDistrito !== 'all') {
        setSelectedDistrictName(filterDistrito);
      }
    }
  }, [filterDistrito]);

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-slate-950 font-sans text-slate-100 select-none">
      {/* Cabeçalho da Aplicação: Apenas no modo normal (oculto no modo embed para mostrar somente o mapa) */}
      {!isEmbedMode && (
        <EpidemiologyHeader
          summary={currentWeekSummary}
          availableWeeks={availableWeeks}
          selectedWeek={selectedWeek}
          onSelectWeek={setSelectedWeek}
          metric={metric}
          onChangeMetric={setMetric}
          viewLevel={viewLevel}
          onChangeViewLevel={handleChangeViewLevel}
          filterDistrito={filterDistrito}
          onChangeDistrito={handleSelectDistrito}
          distritosList={distritosList}
          bairrosList={bairrosList}
          onSearchBairro={(bId) => {
            setSearchedBairroId(bId);
            if (bId) setSelectedBairroId(bId);
          }}
          onOpenSheetsModal={() => setIsSheetsModalOpen(true)}
          onOpenGeoJsonModal={() => setIsGeoJsonModalOpen(true)}
          onOpenLookerModal={() => setIsLookerModalOpen(true)}
          onRefreshData={() => syncGoogleSheets()}
          isRefreshing={isRefreshing}
          isEmbedMode={isEmbedMode}
          onToggleEmbedMode={() => setIsEmbedMode(!isEmbedMode)}
          lastUpdatedText={
            sheetsConfig.lastFetchedAt 
              ? new Date(sheetsConfig.lastFetchedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) 
              : undefined
          }
          sourceType={sheetsConfig.sourceType}
        />
      )}

      {/* Área Central: Mapa Interativo & Painéis Flutuantes */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        {/* Filtros Minimizados Flutuantes no Modo Embed (Looker Studio) */}
        {isEmbedMode && (
          <MinimizedEmbedFilters
            summary={currentWeekSummary}
            availableWeeks={availableWeeks}
            selectedWeek={selectedWeek}
            onSelectWeek={setSelectedWeek}
            viewLevel={viewLevel}
            onChangeViewLevel={handleChangeViewLevel}
            filterDistrito={filterDistrito}
            onChangeDistrito={handleSelectDistrito}
            distritosList={distritosList}
            bairrosList={bairrosList}
            onSearchBairro={(bId) => {
              setSearchedBairroId(bId);
              if (bId) setSelectedBairroId(bId);
            }}
            onRefreshData={() => syncGoogleSheets()}
            isRefreshing={isRefreshing}
            onExitEmbedMode={() => setIsEmbedMode(false)}
            lastUpdatedText={
              sheetsConfig.lastFetchedAt 
                ? new Date(sheetsConfig.lastFetchedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) 
                : undefined
            }
            onOpenLookerModal={() => setIsLookerModalOpen(true)}
          />
        )}

        <DengueMap
          geoJsonData={geoJsonData}
          bairrosData={currentWeekSummary.bairros || {}}
          districtsData={districtsData}
          viewLevel={viewLevel}
          selectedBairroId={selectedBairroId}
          onSelectBairro={setSelectedBairroId}
          selectedDistrictName={selectedDistrictName}
          onSelectDistrict={setSelectedDistrictName}
          metric={metric}
          basemap={basemap}
          onChangeBasemap={setBasemap}
          highlightSearchBairroId={searchedBairroId}
          filterDistrito={filterDistrito}
          isEmbedMode={isEmbedMode}
        />

        {/* Dossiê do Bairro ou Distrito Selecionado */}
        {((viewLevel === 'distrito' && selectedDistrict) || (viewLevel === 'bairro' && selectedBairro)) && (
          <BairroDetailPanel
            bairro={viewLevel === 'distrito' ? null : selectedBairro}
            districtInfo={selectedDistrict || (selectedBairro ? districtsData[selectedBairro.distritoSanitario] : null)}
            viewLevel={viewLevel}
            onClose={() => {
              setSelectedBairroId(null);
              setSelectedDistrictName(null);
            }}
            isEmbedMode={isEmbedMode}
          />
        )}

        {/* Indicador de Status Offline do PWA */}
        <OfflineIndicator />
      </main>

      {/* Modais de Configuração e Ajuda */}
      <GoogleSheetsConfigModal
        config={sheetsConfig}
        isOpen={isSheetsModalOpen}
        onClose={() => setIsSheetsModalOpen(false)}
        onSaveConfig={handleSaveSheetsConfig}
        onResetToDemo={handleResetToDemo}
        isLoading={isRefreshing}
        error={error}
      />

      <LookerStudioEmbedModal
        isOpen={isLookerModalOpen}
        onClose={() => setIsLookerModalOpen(false)}
        currentSheetUrl={sheetsConfig.url}
        selectedWeek={selectedWeek}
        availableWeeks={availableWeeks}
        filterDistrito={filterDistrito}
        distritosList={distritosList}
        viewLevel={viewLevel}
        defaultMetric={metric}
        defaultBasemap={basemap}
        isCustomGeoJsonLoaded={geoJsonData !== SAO_LUIS_BAIRROS_GEOJSON || !!customGeoJsonUrl}
        initialGeoJsonUrl={customGeoJsonUrl}
      />

      <GeoJsonUploadModal
        isOpen={isGeoJsonModalOpen}
        onClose={() => setIsGeoJsonModalOpen(false)}
        currentGeoJson={geoJsonData}
        onUpdateGeoJson={handleUpdateGeoJson}
        onResetGeoJson={handleResetGeoJson}
        currentGeoJsonUrl={customGeoJsonUrl}
      />
    </div>
  );
}
