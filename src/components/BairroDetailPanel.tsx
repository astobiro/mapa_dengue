import React from 'react';
import { BairroEpidemiology, DistrictEpidemiology, MapViewLevel } from '../types/dengue';
import { 
  AlertTriangle, 
  Building2, 
  FileSpreadsheet, 
  ShieldCheck, 
  X 
} from 'lucide-react';

interface BairroDetailPanelProps {
  bairro: BairroEpidemiology | null;
  districtInfo?: DistrictEpidemiology | null;
  viewLevel?: MapViewLevel;
  onClose: () => void;
}

export const BairroDetailPanel: React.FC<BairroDetailPanelProps> = ({ 
  bairro, 
  districtInfo,
  viewLevel = 'bairro',
  onClose 
}) => {
  if (!bairro && !districtInfo) return null;

  // Se estiver no modo distrito ou se tivermos informações do distrito
  const isDistrictMode = viewLevel === 'distrito' && !!districtInfo;

  const totalCasos = isDistrictMode ? districtInfo.totalCasos : (bairro?.casos ?? 0);

  const getCasesStatus = (casos: number) => {
    if (casos >= 150) {
      return { 
        label: 'ALTO NÚMERO DE CASOS', 
        style: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        isHigh: true,
        isMed: false
      };
    }
    if (casos >= 60) {
      return { 
        label: 'NÚMERO MODERADO DE CASOS', 
        style: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
        isHigh: false,
        isMed: true
      };
    }
    if (casos >= 25) {
      return { 
        label: 'ALERTA EPIDEMIOLÓGICO', 
        style: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        isHigh: false,
        isMed: true
      };
    }
    return { 
      label: 'BAIXO NÚMERO DE CASOS', 
      style: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      isHigh: false,
      isMed: false
    };
  };

  const status = getCasesStatus(totalCasos);

  return (
    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 w-80 sm:w-96 max-h-[calc(100%-2rem)] flex flex-col bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
      {/* Cabeçalho */}
      <div className="p-4 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 relative">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-1.5">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${status.style}`}>
            {status.label}
          </span>
          {isDistrictMode && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20">
              Distrito Sanitário
            </span>
          )}
        </div>

        <h2 className="text-lg font-bold text-white tracking-tight">
          {isDistrictMode ? districtInfo.distritoNome : bairro?.bairroNome}
        </h2>
        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
          <Building2 className="w-3.5 h-3.5 text-rose-400" />
          <span>
            {isDistrictMode ? `${districtInfo.bairrosCount} bairros monitorados` : bairro?.distritoSanitario}
          </span>
        </div>
      </div>

      {/* Métrica: Número de Casos Prováveis */}
      <div className="p-4 overflow-y-auto space-y-3.5 text-xs">
        <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/70">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 text-slate-300">
              <FileSpreadsheet className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-semibold text-white">Número de Casos Prováveis</span>
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-900 text-rose-400 border border-rose-500/20">
              Notificações
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {totalCasos.toLocaleString('pt-BR')}
            </span>
            <span className="text-xs text-slate-400 font-medium">casos prováveis</span>
          </div>

          <span className="text-[11px] text-slate-400 block mt-1.5">
            {isDistrictMode 
              ? 'Total acumulado no distrito sanitário' 
              : 'Casos prováveis notificados no bairro'}
          </span>
        </div>

        {/* Se for modo distrito, listar bairros do distrito com número de casos */}
        {isDistrictMode && districtInfo.bairros.length > 0 && (
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-200">
                Bairros do Distrito ({districtInfo.bairros.length}):
              </span>
              <span className="text-[10px] text-slate-400">Casos Prováveis</span>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {districtInfo.bairros.map((b) => (
                <div key={b.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
                  <span className="text-slate-300 font-medium truncate max-w-[170px]">{b.bairroNome}</span>
                  <span className="font-bold text-white text-xs bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    {b.casos.toLocaleString('pt-BR')} {b.casos === 1 ? 'caso' : 'casos'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ações Recomendadas no Território */}
        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-2">
          <div className="flex items-center gap-1.5 font-semibold text-slate-200 text-xs">
            {status.isHigh ? (
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            )}
            <span>Classificação & Recomendações:</span>
          </div>
          <ul className="space-y-1.5 text-[11px] text-slate-300 list-disc list-inside">
            {status.isHigh ? (
              <>
                <li className="font-semibold text-rose-300">Região prioritária para bloqueio imediato de transmissão.</li>
                <li>Mobilização de equipes e visitas domiciliares de agentes de endemias.</li>
                <li>Ciclos programados de borrifação / fumacê nas vias públicas.</li>
              </>
            ) : status.isMed ? (
              <>
                <li>Monitoramento semanal de notificações.</li>
                <li>Campanhas para eliminação de criadouros domésticos.</li>
              </>
            ) : (
              <>
                <li>Nível sob controle. Manter ações rotineiras de vigilância.</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
