import React, { useState } from 'react';
import { BasemapTheme, ChoroplethMetric } from '../types/dengue';
import { 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  Layers, 
  LayoutDashboard, 
  Monitor, 
  Sparkles, 
  X 
} from 'lucide-react';

interface LookerStudioEmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSheetUrl?: string;
  defaultMetric: ChoroplethMetric;
  defaultBasemap: BasemapTheme;
}

export const LookerStudioEmbedModal: React.FC<LookerStudioEmbedModalProps> = ({
  isOpen,
  onClose,
  currentSheetUrl,
  defaultMetric,
  defaultBasemap
}) => {
  const [copied, setCopied] = useState(false);
  const [embedMode, setEmbedMode] = useState(true);
  const [metric, setMetric] = useState<ChoroplethMetric>(defaultMetric);
  const [theme, setTheme] = useState<BasemapTheme>(defaultBasemap);
  const [refreshInterval, setRefreshInterval] = useState(300);

  if (!isOpen) return null;

  // Gerar a URL completa com parâmetros de consulta para incorporação
  const baseUrl = window.location.origin + window.location.pathname;
  const params = new URLSearchParams();
  if (embedMode) params.set('embed', 'true');
  params.set('metric', metric);
  params.set('theme', theme);
  if (refreshInterval > 0) params.set('refresh', String(refreshInterval));
  if (currentSheetUrl) params.set('sheet', currentSheetUrl);

  const generatedEmbedUrl = `${baseUrl}?${params.toString()}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedEmbedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl text-slate-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Incorporação no Google Looker Studio</h2>
              <p className="text-xs text-slate-400">Elemento de URL integrada com carregamento dinâmico</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Instruções Looker Studio */}
          <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/30 text-xs text-blue-200 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-blue-300">
              <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span>Como adicionar ao seu painel do Google Data Studio:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px] leading-relaxed">
              <li>No Looker Studio (Google Data Studio), clique em <strong>Inserir &gt; Incorporação por URL</strong>.</li>
              <li>Desenhe o quadro onde deseja que o mapa apareça no relatório.</li>
              <li>No painel direito <strong>Propriedades de incorporação de URL</strong>, cole a URL gerada abaixo.</li>
              <li>Pronto! O mapa carregará dinamicamente os dados da sua planilha sem precisar recarregar o Data Studio.</li>
            </ol>
          </div>

          {/* Opções da URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Métrica Inicial no Painel</label>
              <select
                value={metric}
                onChange={(e) => setMetric(e.target.value as ChoroplethMetric)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
              >
                <option value="casos">Número de Casos Prováveis</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Tema do Mapa Base</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as BasemapTheme)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
              >
                <option value="osm">OpenStreetMap</option>
                <option value="satellite">Satélite Híbrido</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Atualização Automática no Iframe</label>
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
              >
                <option value={60}>A cada 1 minuto</option>
                <option value={300}>A cada 5 minutos (Padrão)</option>
                <option value={900}>A cada 15 minutos</option>
                <option value={0}>Apenas quando abrir a página</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={embedMode}
                  onChange={(e) => setEmbedMode(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500 bg-slate-950 border-slate-700"
                />
                <span>Modo Embed (Interface compacta sem barras extras)</span>
              </label>
            </div>
          </div>

          {/* Caixa com a URL Gerada */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              URL Gerada para Colar no Looker Studio:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={generatedEmbedUrl}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-[11px] text-sky-300 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-xs transition shadow-md flex-shrink-0"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar URL</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Dica para Hospedagem */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300 block mb-0.5">Hospedagem da Aplicação:</span>
            Ao publicar a sua aplicação (ex: no GitHub Pages ou em seu servidor próprio), basta copiar o endereço web da sua página e colar no Looker Studio da mesma forma! O código é 100% estático e compatível.
          </div>
        </div>

        <div className="px-6 py-3.5 bg-slate-950/40 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
