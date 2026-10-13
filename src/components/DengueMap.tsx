import React, { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  BairroEpidemiology, 
  BasemapTheme, 
  ChoroplethMetric, 
  DistrictEpidemiology, 
  GeoJsonNeighborhoodCollection, 
  GeoJsonNeighborhoodFeature, 
  MapViewLevel 
} from '../types/dengue';
import { findBairroData, normalizeKey } from '../services/sheetsService';
import { createDissolvedDistrictsGeoJson } from '../utils/districtGeoJson';
import { ChevronDown, ChevronUp, Layers, Maximize2, ShieldAlert } from 'lucide-react';

interface DengueMapProps {
  geoJsonData: GeoJsonNeighborhoodCollection;
  bairrosData: Record<string, BairroEpidemiology>;
  districtsData?: Record<string, DistrictEpidemiology>;
  viewLevel: MapViewLevel;
  selectedBairroId: string | null;
  onSelectBairro: (bairroId: string | null) => void;
  selectedDistrictName?: string | null;
  onSelectDistrict?: (distName: string | null) => void;
  metric: ChoroplethMetric;
  basemap: BasemapTheme;
  onChangeBasemap: (theme: BasemapTheme) => void;
  highlightSearchBairroId?: string | null;
  filterDistrito?: string;
  isEmbedMode?: boolean;
}

// Estilo de cores epidemiológicas oficiais baseadas no volume de casos prováveis
export function getMetricColor(value: number, _metric?: ChoroplethMetric): string {
  // Métrica: Número de Casos Prováveis
  if (value >= 300) return '#991b1b';
  if (value >= 150) return '#dc2626';
  if (value >= 60) return '#ea580c';
  if (value >= 25) return '#f59e0b';
  return '#10b981';
}

export function getMetricLabel(_metric?: ChoroplethMetric): string {
  return 'Número de Casos Prováveis';
}

export const DengueMap: React.FC<DengueMapProps> = ({
  geoJsonData,
  bairrosData,
  districtsData,
  viewLevel,
  selectedBairroId,
  onSelectBairro,
  selectedDistrictName,
  onSelectDistrict,
  metric,
  basemap,
  onChangeBasemap,
  highlightSearchBairroId,
  filterDistrito,
  isEmbedMode
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const initialFitDoneRef = useRef(false);
  // Guardar posição e zoom anteriores ao clique no bairro para restaurar ao fechar a janela
  const previousViewStateRef = useRef<{ center: L.LatLng; zoom: number } | null>(null);
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [isLegendCollapsed, setIsLegendCollapsed] = useState<boolean>(Boolean(isEmbedMode));

  useEffect(() => {
    if (isEmbedMode) {
      setIsLegendCollapsed(true);
    }
  }, [isEmbedMode]);

  // Dissolver polígonos dos bairros em contornos externos unificados por distrito
  const dissolvedDistrictsGeoJson = useMemo(() => {
    return createDissolvedDistrictsGeoJson(geoJsonData);
  }, [geoJsonData]);

  // Inicializar o mapa do Leaflet
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Coordenadas centrais da Ilha de São Luís: -2.53, -44.28
    const map = L.map(mapContainerRef.current, {
      center: [-2.540, -44.250],
      zoom: 12,
      minZoom: 10,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Atualizar Basemap (Somente OpenStreetMap e Satélite Híbrido)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let subdomains = 'abc';
    let maxZoom = 19;

    if (basemap === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      subdomains = '';
    }

    const newTileLayer = L.tileLayer(url, {
      subdomains,
      maxZoom,
      attribution: basemap === 'satellite' ? '&copy; Esri &copy; Maxar' : '&copy; OpenStreetMap contributors'
    });

    newTileLayer.addTo(map);
    tileLayerRef.current = newTileLayer;
  }, [basemap]);

  // Atualizar Camada GeoJSON quando mudar dados, métrica, nível de visualização ou filtro
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (geoJsonLayerRef.current) {
      map.removeLayer(geoJsonLayerRef.current);
    }

    // Na visualização de distritos, utilizar a camada unificada (dissolvida sem linhas internas)
    const activeGeoData = viewLevel === 'distrito' ? dissolvedDistrictsGeoJson : geoJsonData;

    const getBairroInfo = (feature: GeoJsonNeighborhoodFeature): BairroEpidemiology | undefined => {
      const p = feature.properties;
      return (
        findBairroData(bairrosData, p.id || '') ||
        findBairroData(bairrosData, p.NM_BAIRRO || '') ||
        findBairroData(bairrosData, p.name || '')
      );
    };

    const getFeatureStyle = (feature: any) => {
      const info = getBairroInfo(feature);
      const featureId = feature.properties.id || normalizeKey(feature.properties.NM_BAIRRO || feature.properties.name || '');
      const distName = feature.properties.layer || feature.properties.Layer || feature.properties.LAYER || feature.properties.distrito || info?.distritoSanitario || 'Distrito Central';
      
      const isDistrictSelected = viewLevel === 'distrito' && normalizeKey(selectedDistrictName || '') === normalizeKey(distName);
      const isBairroSelected = viewLevel === 'bairro' && (selectedBairroId === featureId || (info && info.id === selectedBairroId));
      const isSearchTarget = highlightSearchBairroId === featureId;

      // Filtro por distrito
      if (filterDistrito && filterDistrito !== 'all') {
        if (normalizeKey(distName) !== normalizeKey(filterDistrito)) {
          return {
            fillColor: '#64748b',
            fillOpacity: 0.08,
            color: '#475569',
            weight: 0.5,
            dashArray: '2, 4'
          };
        }
      }

      let metricVal = 0;
      if (viewLevel === 'distrito' && districtsData && districtsData[distName]) {
        // Agrupado por distrito
        const dist = districtsData[distName];
        metricVal = dist.totalCasos;
      } else if (info) {
        // Por bairro
        metricVal = info.casos;
      }

      const color = (info || (viewLevel === 'distrito' && districtsData?.[distName]))
        ? getMetricColor(metricVal, metric)
        : '#64748b';

      const isSelected = isDistrictSelected || isBairroSelected;

      if (viewLevel === 'distrito') {
        // Estilo unificado para distritos: sem linhas internas de bairros, apenas contorno externo nítido
        const anyDistrictActive = Boolean(selectedDistrictName || (filterDistrito && filterDistrito !== 'all'));
        const isThisDistrictFocused = 
          (selectedDistrictName && normalizeKey(distName) === normalizeKey(selectedDistrictName)) ||
          (filterDistrito && filterDistrito !== 'all' && normalizeKey(distName) === normalizeKey(filterDistrito));

        if (anyDistrictActive) {
          if (isThisDistrictFocused) {
            return {
              fillColor: color,
              fillOpacity: 0.94,
              color: '#38bdf8', // Contorno ciano iluminado em destaque
              weight: 4.5,
              opacity: 1,
              className: 'transition-all duration-300 cursor-pointer drop-shadow-2xl'
            };
          } else {
            // Outros distritos ficam sutilmente atenuados para destacar o distrito selecionado
            return {
              fillColor: color,
              fillOpacity: 0.28,
              color: 'rgba(255, 255, 255, 0.3)',
              weight: 1.2,
              opacity: 0.45,
              className: 'transition-all duration-300 cursor-pointer opacity-60'
            };
          }
        }

        return {
          fillColor: color,
          fillOpacity: 0.72,
          color: '#ffffff',
          weight: 2.2,
          opacity: 0.95,
          className: 'transition-all duration-200 cursor-pointer drop-shadow-md'
        };
      }

      // Estilo por bairros
      return {
        fillColor: color,
        fillOpacity: isSelected ? 0.85 : isSearchTarget ? 0.9 : 0.65,
        color: isSelected ? '#ffffff' : isSearchTarget ? '#38bdf8' : '#0f172a',
        weight: isSelected ? 3.5 : isSearchTarget ? 3 : 1.2,
        opacity: 0.95,
        className: 'transition-all duration-200 cursor-pointer'
      };
    };

    const geoJsonLayer = L.geoJSON(activeGeoData as any, {
      style: getFeatureStyle,
      onEachFeature: (feature, layer) => {
        const info = getBairroInfo(feature as GeoJsonNeighborhoodFeature);
        const name = feature.properties.NM_BAIRRO || feature.properties.name || 'Bairro';
        const distName = feature.properties.layer || feature.properties.Layer || feature.properties.LAYER || feature.properties.distrito || info?.distritoSanitario || 'Distrito Central';
        const popGeoJson = feature.properties.POPULACAO || info?.populacao || 0;
        const distInfo = districtsData ? districtsData[distName] : undefined;

        let tooltipContent = '';

        if (viewLevel === 'distrito') {
          // Tooltip de Visualização por Distrito (Apenas Casos Prováveis)
          const distCases = distInfo ? distInfo.totalCasos : 0;
          const distCount = distInfo ? distInfo.bairrosCount : 0;

          tooltipContent = `
            <div class="px-2.5 py-1.5 text-xs font-sans leading-tight">
              <span class="text-rose-400 text-[10px] font-bold uppercase tracking-wider block">Distrito Sanitário</span>
              <strong class="text-white block text-sm font-semibold">${distName}</strong>
              <div class="mt-1 pt-1 border-t border-slate-700/60 text-[11px] space-y-0.5">
                <div class="flex justify-between gap-3">
                  <span class="text-slate-400">Número de Casos Prováveis:</span>
                  <span class="font-bold text-white text-right">${distCases.toLocaleString('pt-BR')}</span>
                </div>
                <div class="flex justify-between gap-3">
                  <span class="text-slate-400">Bairros Monitorados:</span>
                  <span class="font-semibold text-slate-300 text-right">${distCount}</span>
                </div>
              </div>
            </div>
          `;
        } else {
          // Tooltip de Visualização por Bairro (Apenas Casos Prováveis)
          tooltipContent = `
            <div class="px-2.5 py-1.5 text-xs font-sans leading-tight">
              <strong class="text-white block text-sm font-semibold">${name}</strong>
              <span class="text-slate-300 text-[11px] block mb-1">${distName}</span>
              <div class="mt-1 pt-1 border-t border-slate-700/60 text-[11px]">
                <div class="flex justify-between gap-3">
                  <span class="text-slate-400">Número de Casos Prováveis:</span>
                  <span class="font-bold text-white text-right">${info ? info.casos.toLocaleString('pt-BR') : '0'}</span>
                </div>
              </div>
            </div>
          `;
        }

        layer.bindTooltip(tooltipContent, {
          sticky: true,
          direction: 'top',
          className: 'leaflet-custom-tooltip bg-slate-900/95 backdrop-blur-md border border-slate-700 text-white rounded-xl shadow-2xl p-0'
        });

        layer.on({
          mouseover: (e) => {
            const l = e.target;
            l.setStyle({
              weight: viewLevel === 'distrito' ? 4.5 : 3,
              color: '#f8fafc',
              fillOpacity: 0.88
            });
            l.bringToFront();
          },
          mouseout: (e) => {
            geoJsonLayer.resetStyle(e.target);
          },
          click: (e) => {
            if (viewLevel === 'distrito') {
              // No modo distrito: selecionar distrito e dar zoom no contorno do distrito inteiro
              if (onSelectDistrict) {
                onSelectDistrict(distName);
              }
              onSelectBairro(null); // Limpar seleção de bairro para destacar o distrito
              try {
                const bounds = e.target.getBounds();
                if (bounds.isValid()) {
                  mapInstanceRef.current?.flyToBounds(bounds, {
                    padding: [50, 50],
                    maxZoom: 13,
                    duration: 1.2
                  });
                }
              } catch {}
            } else {
              // No modo bairro: selecionar bairro e dar zoom no bairro
              const bId = info?.id || feature.properties.id || feature.properties.NM_BAIRRO || feature.properties.name || '';
              onSelectBairro(bId);
            }
          }
        });
      }
    });

    geoJsonLayer.addTo(map);
    geoJsonLayerRef.current = geoJsonLayer;

    try {
      const bounds = geoJsonLayer.getBounds();
      if (bounds.isValid() && !initialFitDoneRef.current) {
        map.fitBounds(bounds, { padding: [20, 20], maxZoom: 14 });
        initialFitDoneRef.current = true;
      }
    } catch {}
  }, [
    geoJsonData, 
    dissolvedDistrictsGeoJson, 
    bairrosData, 
    districtsData, 
    viewLevel, 
    metric, 
    selectedBairroId, 
    selectedDistrictName, 
    highlightSearchBairroId, 
    filterDistrito
  ]);

  // Foco com zoom quando um distrito é selecionado pelo painel, filtro ou cabeçalho
  useEffect(() => {
    const targetDistrict = (filterDistrito && filterDistrito !== 'all') ? filterDistrito : selectedDistrictName;
    if (!targetDistrict) {
      if (geoJsonLayerRef.current && mapInstanceRef.current && initialFitDoneRef.current) {
        const bounds = geoJsonLayerRef.current.getBounds();
        if (bounds.isValid()) {
          mapInstanceRef.current.flyToBounds(bounds, { padding: [20, 20], duration: 1 });
        }
      }
      return;
    }

    if (!geoJsonLayerRef.current || !mapInstanceRef.current) return;

    if (viewLevel === 'distrito') {
      geoJsonLayerRef.current.eachLayer((layer: any) => {
        const feat = layer.feature;
        if (!feat) return;
        const p = feat.properties;
        const dName = p.layer || p.distrito || '';
        if (normalizeKey(dName) === normalizeKey(targetDistrict)) {
          try {
            const bounds = layer.getBounds();
            if (bounds.isValid()) {
              mapInstanceRef.current?.flyToBounds(bounds, {
                padding: [50, 50],
                maxZoom: 13,
                duration: 1.2
              });
            }
          } catch {}
        }
      });
    } else {
      // No modo bairro, calcular envelope unificado de todos os bairros daquele distrito
      const groupBounds = L.latLngBounds([]);
      geoJsonLayerRef.current.eachLayer((layer: any) => {
        const feat = layer.feature;
        if (!feat) return;
        const p = feat.properties;
        const dName = p.layer || p.distrito || '';
        if (normalizeKey(dName) === normalizeKey(targetDistrict)) {
          try {
            const bounds = layer.getBounds();
            if (bounds.isValid()) {
              groupBounds.extend(bounds);
            }
          } catch {}
        }
      });
      if (groupBounds.isValid()) {
        mapInstanceRef.current?.flyToBounds(groupBounds, {
          padding: [50, 50],
          maxZoom: 13,
          duration: 1.2
        });
      }
    }
  }, [selectedDistrictName, filterDistrito, viewLevel]);

  // Foco com zoom quando um bairro é pesquisado ou selecionado, e restauração ao fechar janela
  useEffect(() => {
    if (viewLevel === 'distrito') return;
    const targetId = highlightSearchBairroId || selectedBairroId;
    const map = mapInstanceRef.current;
    if (!map) return;

    if (targetId) {
      // Se estamos prestes a dar zoom no bairro e ainda não salvamos o estado prévio, salvar agora
      if (!previousViewStateRef.current) {
        previousViewStateRef.current = {
          center: map.getCenter(),
          zoom: map.getZoom()
        };
      }

      if (!geoJsonLayerRef.current) return;
      geoJsonLayerRef.current.eachLayer((layer: any) => {
        const feat = layer.feature;
        if (!feat) return;
        const p = feat.properties;
        const matches = 
          p.id === targetId ||
          normalizeKey(p.id || '') === normalizeKey(targetId) ||
          normalizeKey(p.NM_BAIRRO || p.name || '') === normalizeKey(targetId);

        if (matches) {
          try {
            const bounds = layer.getBounds();
            if (bounds.isValid()) {
              mapInstanceRef.current?.flyToBounds(bounds, {
                padding: [40, 40],
                maxZoom: 14,
                duration: 1.2
              });
            }
          } catch {}
        }
      });
    } else {
      // Quando fechar a janela (targetId é null), retornar exatamente ao zoom e centro de antes de clicar no bairro
      if (previousViewStateRef.current) {
        const { center, zoom } = previousViewStateRef.current;
        previousViewStateRef.current = null;
        map.flyTo(center, zoom, {
          duration: 1.0
        });
      }
    }
  }, [highlightSearchBairroId, selectedBairroId, viewLevel]);

  const handleResetBounds = () => {
    if (geoJsonLayerRef.current && mapInstanceRef.current) {
      const bounds = geoJsonLayerRef.current.getBounds();
      if (bounds.isValid()) {
        mapInstanceRef.current.flyToBounds(bounds, { padding: [20, 20], duration: 1 });
      }
    }
  };

  return (
    <div className="relative w-full h-full min-h-[380px] bg-slate-950 overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Botões Flutuantes Superiores: Basemap switcher & Reset zoom */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        <button
          onClick={handleResetBounds}
          title="Ver toda a Ilha de São Luís"
          className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 shadow-lg backdrop-blur-md transition-all active:scale-95"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            title="Alterar Camada do Mapa Base"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700/80 shadow-lg backdrop-blur-md transition-all"
          >
            <Layers className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">
              {basemap === 'satellite' ? 'Satélite' : 'OpenStreetMap'}
            </span>
          </button>

          {showLayerMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-lg p-1.5 text-xs text-slate-200 z-50">
              <div className="px-2 py-1 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                Camadas Disponíveis
              </div>
              <button
                onClick={() => { onChangeBasemap('osm'); setShowLayerMenu(false); }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition ${
                  basemap === 'osm' ? 'bg-rose-500/20 text-rose-300 font-semibold' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <span>OpenStreetMap</span>
                {basemap === 'osm' && <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />}
              </button>
              <button
                onClick={() => { onChangeBasemap('satellite'); setShowLayerMenu(false); }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition ${
                  basemap === 'satellite' ? 'bg-rose-500/20 text-rose-300 font-semibold' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <span>Satélite Híbrido</span>
                {basemap === 'satellite' && <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Legenda Epidemiológica Flutuante (Inferior Esquerda) com tamanho compacto e minimização */}
      <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 transition-all">
        {isLegendCollapsed ? (
          <button
            onClick={() => setIsLegendCollapsed(false)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/95 hover:bg-slate-800 text-slate-200 border border-slate-700/80 shadow-2xl backdrop-blur-md text-[11px] font-semibold transition active:scale-95 group"
            title="Expandir legenda de cores epidemiológicas"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
            <span>Legenda</span>
            <div className="flex items-center gap-0.5 ml-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#991b1b]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            </div>
            <ChevronUp className="w-3 h-3 text-slate-400 group-hover:text-white transition-colors" />
          </button>
        ) : (
          <div className="max-w-[200px] sm:max-w-[210px] bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-2 sm:p-2.5 shadow-2xl text-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between gap-1 text-[11px] font-semibold text-white mb-1.5 pb-1 border-b border-slate-800">
              <div className="flex items-center gap-1.5 min-w-0">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                <span className="truncate">Casos Prováveis</span>
              </div>
              <button
                type="button"
                onClick={() => setIsLegendCollapsed(true)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Minimizar legenda"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-1 text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#991b1b] flex-shrink-0" />
                <span className="text-slate-300 font-medium">≥ 300 casos</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#dc2626] flex-shrink-0" />
                <span className="text-slate-300 font-medium">150 a 299 casos</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#ea580c] flex-shrink-0" />
                <span className="text-slate-300">60 a 149 casos</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#f59e0b] flex-shrink-0" />
                <span className="text-slate-300">25 a 59 casos</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#10b981] flex-shrink-0" />
                <span className="text-slate-300">&lt; 25 casos</span>
              </div>
            </div>

            <div className="mt-1.5 pt-1 border-t border-slate-800/80 text-[9px] text-slate-400 flex items-center justify-between">
              <span>{viewLevel === 'distrito' ? 'Distritos' : 'Bairros'}</span>
              <span>Clique p/ focar</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
