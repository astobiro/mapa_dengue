import React, { useState } from 'react';
import { MapViewLevel, WeeklyDataSummary } from '../types/dengue';
import { 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  Layers, 
  Maximize2, 
  RefreshCw, 
  Search, 
  ShieldAlert, 
  SlidersHorizontal, 
  X 
} from 'lucide-react';

interface MinimizedEmbedFiltersProps {
  summary: WeeklyDataSummary;
  availableWeeks: string[];
  selectedWeek: string;
  onSelectWeek: (week: string) => void;
  viewLevel: MapViewLevel;
  onChangeViewLevel: (level: MapViewLevel) => void;
  filterDistrito: string;
  onChangeDistrito: (distrito: string) => void;
  distritosList: string[];
  bairrosList: Array<{ id: string; name: string }>;
  onSearchBairro: (bairroId: string | null) => void;
  onRefreshData: () => void;
  isRefreshing: boolean;
  onExitEmbedMode?: () => void;
  lastUpdatedText?: string;
  onOpenLookerModal?: () => void;
}

export const MinimizedEmbedFilters: React.FC<MinimizedEmbedFiltersProps> = ({
  summary,
  availableWeeks,
  selectedWeek,
  onSelectWeek,
  viewLevel,
  onChangeViewLevel,
  filterDistrito,
  onChangeDistrito,
  distritosList,
  bairrosList,
  onSearchBairro,
  onRefreshData,
  isRefreshing,
  onExitEmbedMode,
  lastUpdatedText
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
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

  // Se estiver recolhido, mostrar apenas um botão discreto e informativo
  if (isCollapsed) {
    return (
      <div className="absolute top-3 left-3 z-30 flex items-center gap-2">
        <button
          onClick={() => setIsCollapsed(false)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/95 hover:bg-slate-850 text-slate-200 border border-slate-700/80 shadow-2xl backdrop-blur-md text-xs font-semibold transition active:scale-95 group"
          title="Expandir filtros do mapa"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-rose-400 group-hover:rotate-45 transition-transform" />
          <span>Filtros</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
            {selectedWeek} • {viewLevel === 'bairro' ? 'Bairros' : 'Distritos'}
          </span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {onExitEmbedMode && (
          <button
            onClick={onExitEmbedMode}
            className="p-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/80 shadow-md backdrop-blur-md transition"
            title="Expandir para modo completo"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="absolute top-3 left-3 z-30 max-w-[calc(100vw-5.5rem)] sm:max-w-none flex flex-col gap-1.5 animate-in fade-in duration-200">
      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 p-1.5 sm:p-2 rounded-2xl shadow-2xl text-xs text-slate-200">
        {/* Alternância: Bairros vs Distritos */}
        <div className="flex items-center rounded-xl bg-slate-950/80 border border-slate-800 p-0.5">
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
          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-xl px-2.5 py-1 text-xs">
            <Calendar className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
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

        {/* Filtro por Distrito Sanitário */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-xl px-2.5 py-1 text-xs max-w-[180px] sm:max-w-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <select
            value={filterDistrito}
            onChange={(e) => onChangeDistrito(e.target.value)}
            className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer truncate"
          >
            <option value="all" className="bg-slate-900 text-white">Todos os Distritos</option>
            {distritosList.map(d => (
              <option key={d} value={d} className="bg-slate-900 text-white">
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Busca Rápida de Bairro */}
        <div className="relative hidden md:block w-48">
          <div className="relative flex items-center">
            <Search className="w-3 h-3 text-slate-400 absolute left-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar bairro..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              className="w-full pl-7 pr-6 py-1 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-rose-500 text-xs text-white placeholder:text-slate-500 focus:outline-none transition"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-1.5 p-0.5 rounded text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {showSearchDropdown && filteredBairros.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 max-h-44 overflow-y-auto rounded-xl bg-slate-900 border border-slate-700 shadow-2xl z-50 text-xs">
              {filteredBairros.slice(0, 6).map(b => (
                <button
                  key={b.id}
                  onClick={() => handleSelectBairroSearch(b.id, b.name)}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-800 text-slate-200 hover:text-white flex items-center justify-between border-b border-slate-800/50 last:border-0"
                >
                  <span className="font-medium truncate">{b.name}</span>
                  <span className="text-[10px] text-rose-400">Ver →</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Resumo de Casos Prováveis */}
        <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span>{summary.totalCasos.toLocaleString('pt-BR')} casos prováveis</span>
        </div>

        {/* Botão de Atualização / Sincronizar */}
        <button
          onClick={onRefreshData}
          disabled={isRefreshing}
          className="p-1 sm:px-2 sm:py-1 rounded-xl bg-slate-950/80 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition flex items-center gap-1"
          title="Sincronizar dados"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-rose-400' : ''}`} />
          <span className="hidden xl:inline text-[11px]">Sincronizar</span>
        </button>

        {/* Botão Recolher Filtros */}
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1 sm:px-1.5 sm:py-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title="Minimizar barra de filtros"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>

        {/* Expandir / Sair do Modo Embed */}
        {onExitEmbedMode && (
          <button
            onClick={onExitEmbedMode}
            className="p-1 sm:px-1.5 sm:py-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Sair do modo integrado (Ver cabeçalho completo)"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
