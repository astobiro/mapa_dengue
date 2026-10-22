import React, { useState } from 'react';
import { ChoroplethMetric, MapViewLevel, WeeklyDataSummary } from '../types/dengue';
import { PWAInstallButton } from './PWAInstallButton';
import { 
  BarChart3, 
  Calendar, 
  ChevronDown, 
  FileSpreadsheet, 
  Filter, 
  Layers, 
  LayoutDashboard, 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  Search, 
  ShieldAlert, 
  X 
} from 'lucide-react';

interface EpidemiologyHeaderProps {
  summary: WeeklyDataSummary;
  availableWeeks: string[];
  selectedWeek: string;
  onSelectWeek: (week: string) => void;
  metric: ChoroplethMetric;
  onChangeMetric: (metric: ChoroplethMetric) => void;
  viewLevel: MapViewLevel;
  onChangeViewLevel: (level: MapViewLevel) => void;
  filterDistrito: string;
  onChangeDistrito: (distrito: string) => void;
  distritosList: string[];
  bairrosList: Array<{ id: string; name: string }>;
  onSearchBairro: (bairroId: string | null) => void;
  onOpenSheetsModal: () => void;
  onOpenGeoJsonModal: () => void;
  onOpenLookerModal: () => void;
  onRefreshData: () => void;
  isRefreshing: boolean;
  isEmbedMode: boolean;
  onToggleEmbedMode: () => void;
  lastUpdatedText?: string;
  sourceType: string;
}

export const EpidemiologyHeader: React.FC<EpidemiologyHeaderProps> = ({
  summary,
  availableWeeks,
  selectedWeek,
  onSelectWeek,
  metric,
  onChangeMetric,
  viewLevel,
  onChangeViewLevel,
  filterDistrito,
  onChangeDistrito,
  distritosList,
  bairrosList,
  onSearchBairro,
  onOpenSheetsModal,
  onOpenGeoJsonModal,
  onOpenLookerModal,
  onRefreshData,
  isRefreshing,
  isEmbedMode,
  onToggleEmbedMode,
  lastUpdatedText,
  sourceType
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const filteredBairros = searchTerm.trim()
    ? bairrosList.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase().trim()))
    : [];

  const handleSelectBairroSearch = (bId: string, bName: string) => {
    onSearchBairro(bId);
    setSearchTerm(bName);
    setShowSearchDropdown(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearchBairro(null);
    setShowSearchDropdown(false);
  };

  return (
    <header className="w-full bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 text-slate-100 z-30 transition-all shadow-lg">
      {/* Barra Principal Superior */}
      <div className="px-3 sm:px-5 py-2.5 flex items-center justify-between gap-2 sm:gap-4 flex-wrap">
        {/* Identificação e Branding */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-rose-600 to-red-800 text-white shadow-md shadow-rose-950/50">
            <ShieldAlert className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight leading-none">
                Vigilância Dengue São Luís
              </h1>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                PWA • MA
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
              <span>{summary.dataReferencia || 'Semana Epidemiológica'}</span>
              {lastUpdatedText && (
                <>
                  <span>•</span>
                  <span className="text-slate-400">Atualizado: {lastUpdatedText}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Indicadores de Casos Prováveis */}
        <div className="hidden lg:flex items-center gap-3 bg-slate-950/60 border border-slate-800/80 px-3.5 py-1.5 rounded-xl text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px]">Número de Casos Prováveis:</span>
            <span className="font-bold text-white text-xs">{summary.totalCasos.toLocaleString('pt-BR')}</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px]">Bairros Monitorados:</span>
            <span className="font-semibold text-slate-300 text-xs">{summary.bairrosTotal || Object.keys(summary.bairros || {}).length}</span>
          </div>
        </div>

        {/* Botões de Ação Direta */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Botão de Atualização Manual */}
          <button
            onClick={onRefreshData}
            disabled={isRefreshing}
            title="Atualizar dados da planilha agora"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition active:scale-95 flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-rose-400' : ''}`} />
            <span className="hidden md:inline">Sincronizar</span>
          </button>

          {/* Configurar Planilha */}
          <button
            onClick={onOpenSheetsModal}
            title="Conectar com sua Planilha do Google"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition active:scale-95"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Google Planilha</span>
          </button>

          {/* GeoJSON Shapefile */}
          <button
            onClick={onOpenGeoJsonModal}
            title="Configurar GeoJSON / Shapefile dos Bairros"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition active:scale-95 flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden lg:inline">GeoJSON</span>
          </button>

          {/* Integração Looker Studio */}
          <button
            onClick={onOpenLookerModal}
            title="Copiar link para o Google Data Studio / Looker Studio"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-medium transition active:scale-95"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Looker Studio</span>
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton compact />

          {/* Alternar Modo Embed / Completo */}
          <button
            onClick={onToggleEmbedMode}
            title={isEmbedMode ? "Sair do modo integrado (Embed)" : "Ativar modo integrado para Looker Studio"}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            {isEmbedMode ? <Minimize2 className="w-4 h-4 text-sky-400" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Barra de Controles Epidemiológicos & Filtros */}
      <div className={`px-3 sm:px-5 py-2 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between gap-2.5 flex-wrap ${
        isEmbedMode ? 'py-1.5' : ''
      }`}>
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-[280px]">
          {/* Alternância: Visualização por Bairros vs por Distrito */}
          <div className="flex items-center rounded-xl bg-slate-900 border border-slate-700/80 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => onChangeViewLevel('bairro')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                viewLevel === 'bairro' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Bairros
            </button>
            <button
              type="button"
              onClick={() => onChangeViewLevel('distrito')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                viewLevel === 'distrito' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Distritos
            </button>
          </div>

          {/* Seletor de Semana Epidemiológica */}
          {availableWeeks.length > 1 && (
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-700/80 rounded-xl px-2 py-1 text-xs">
              <Calendar className="w-3.5 h-3.5 text-rose-400" />
              <select
                value={selectedWeek}
                onChange={(e) => onSelectWeek(e.target.value)}
                className="bg-transparent text-white font-semibold text-xs focus:outline-none cursor-pointer"
              >
                {availableWeeks.map(w => (
                  <option key={w} value={w} className="bg-slate-900 text-white">
                    {w}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Controle de Métrica: Casos Prováveis vs Incidência */}
          <div className="flex items-center rounded-xl bg-slate-900 border border-slate-700/80 p-0.5 text-xs">
            <span className="text-[10px] text-slate-400 font-semibold px-2 hidden lg:inline">Métrica:</span>
            <button
              type="button"
              onClick={() => onChangeMetric('casos')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                metric === 'casos' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Exibir Número de Casos Prováveis"
            >
              Casos
            </button>
            <button
              type="button"
              onClick={() => onChangeMetric('incidencia')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                metric === 'incidencia' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Exibir Taxa de Incidência por 100 mil habitantes"
            >
              Incidência
            </button>
          </div>

          {/* Filtro por Distrito Sanitário */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterDistrito}
              onChange={(e) => onChangeDistrito(e.target.value)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-white">Todos os Distritos</option>
              {distritosList.map(d => (
                <option key={d} value={d} className="bg-slate-900 text-white">
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Busca Rápida de Bairro com Autocomplete */}
        <div className="relative w-full sm:w-64">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar bairro (ex: Cohatrac, Turu)..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 focus:border-rose-500 text-xs text-white placeholder:text-slate-500 focus:outline-none transition"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-2 p-0.5 rounded text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {showSearchDropdown && filteredBairros.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-xl bg-slate-900 border border-slate-700 shadow-2xl z-50 text-xs">
              {filteredBairros.slice(0, 8).map(b => (
                <button
                  key={b.id}
                  onClick={() => handleSelectBairroSearch(b.id, b.name)}
                  className="w-full text-left px-3 py-2 hover:bg-slate-800 text-slate-200 hover:text-white flex items-center justify-between border-b border-slate-800/50 last:border-0"
                >
                  <span className="font-medium truncate">{b.name}</span>
                  <span className="text-[10px] text-rose-400">Ver no mapa →</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
