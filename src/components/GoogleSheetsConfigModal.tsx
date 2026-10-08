import React, { useState } from 'react';
import { SheetsConfig } from '../types/dengue';
import { generateGoogleSheetsCsvTemplate } from '../services/sheetsService';
import { 
  CheckCircle2, 
  Copy, 
  Download, 
  ExternalLink, 
  FileSpreadsheet, 
  HelpCircle, 
  Loader2, 
  RefreshCw, 
  Sparkles, 
  X, 
  AlertCircle 
} from 'lucide-react';

interface GoogleSheetsConfigModalProps {
  config: SheetsConfig;
  isOpen: boolean;
  onClose: () => void;
  onSaveConfig: (newConfig: SheetsConfig) => Promise<void>;
  onResetToDemo: () => void;
  isLoading: boolean;
  error: string | null;
}

export const GoogleSheetsConfigModal: React.FC<GoogleSheetsConfigModalProps> = ({
  config,
  isOpen,
  onClose,
  onSaveConfig,
  onResetToDemo,
  isLoading,
  error
}) => {
  const [url, setUrl] = useState(config.url || '');
  const [sheetName, setSheetName] = useState(config.sheetName || '');
  const [refreshInterval, setRefreshInterval] = useState(config.autoRefreshIntervalSeconds);
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'guide'>('config');

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveConfig({
      url: url.trim(),
      sheetName: sheetName.trim() || undefined,
      autoRefreshIntervalSeconds: Number(refreshInterval),
      sourceType: url.trim() ? 'google_sheets' : 'local_demo',
      lastFetchedAt: new Date().toISOString()
    });
  };

  const handleDownloadTemplate = () => {
    const csvContent = generateGoogleSheetsCsvTemplate();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'modelo_dengue_sao_luis.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyCsvStructure = () => {
    const csvContent = generateGoogleSheetsCsvTemplate();
    navigator.clipboard.writeText(csvContent);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl text-slate-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Conexão com Google Planilhas</h2>
              <p className="text-xs text-slate-400">Atualização semanal dinâmica para GitHub Pages e Looker Studio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-950/20">
          <button
            onClick={() => setActiveTab('config')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'config'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Configuração da Planilha
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Como Publicar sua Planilha (Passo a Passo)
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Erro ao carregar planilha:</p>
                <p className="text-rose-200/90 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {activeTab === 'config' ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Link Compartilhado ou Link Publicado do Google Planilhas
                </label>
                <input
                  type="text"
                  placeholder="https://docs.google.com/spreadsheets/d/.../edit ou /pub?output=csv"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-xs text-white placeholder:text-slate-500 transition"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Certifique-se de que a planilha está marcada como pública ("Qualquer pessoa com o link pode ver" ou "Publicar na Web").
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Nome da Aba (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Dados, Resumo ou Folha1"
                    value={sheetName}
                    onChange={(e) => setSheetName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-xs text-white placeholder:text-slate-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Atualização Automática (Polling)
                  </label>
                  <select
                    value={refreshInterval}
                    onChange={(e) => setRefreshInterval(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-xs text-white transition"
                  >
                    <option value={0}>Apenas ao recarregar a página</option>
                    <option value={60}>A cada 1 minuto (Tempo real)</option>
                    <option value={300}>A cada 5 minutos (Recomendado)</option>
                    <option value={900}>A cada 15 minutos</option>
                    <option value={3600}>A cada 1 hora</option>
                  </select>
                </div>
              </div>

              {/* Status Atual */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Origem dos Dados Atual:</span>
                  <span className="font-semibold text-white">
                    {config.sourceType === 'google_sheets' ? 'Planilha Ativa' : 'Dados Modelo São Luís (Demonstração)'}
                  </span>
                </div>
                {config.lastFetchedAt && (
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Última Sincronização:</span>
                    <span className="text-slate-300 font-mono text-[11px]">
                      {new Date(config.lastFetchedAt).toLocaleTimeString('pt-BR')}
                    </span>
                  </div>
                )}
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-rose-950/50 transition"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Conectando e Processando...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      <span>Salvar e Sincronizar Dados</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onResetToDemo}
                  disabled={isLoading}
                  className="py-2.5 px-3.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                >
                  Restaurar Demonstração
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-xs text-slate-300">
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                    1
                  </span>
                  <div>
                    <h4 className="font-semibold text-white">Estrutura das Colunas na Planilha</h4>
                    <p className="text-slate-400 mt-0.5 text-[11px]">
                      Sua planilha do Google só precisa conter as 2 colunas abaixo:
                    </p>
                    <div className="mt-2 p-2 rounded-lg bg-slate-950 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                      NM_BAIRRO | N_CASOS
                    </div>
                    <p className="text-slate-400 mt-1.5 text-[10px]">
                      A coluna <strong>N_CASOS</strong> representa o <strong>Número de Casos Prováveis</strong> notificados para cada bairro.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                    2
                  </span>
                  <div>
                    <h4 className="font-semibold text-white">Como Compartilhar</h4>
                    <p className="text-slate-400 mt-0.5 text-[11px]">
                      No Google Planilhas, acerte o acesso:
                    </p>
                    <p className="mt-1 text-[11px] text-slate-300">
                      <strong>Opção A (Mais fácil):</strong> Clique no botão azul <strong>Compartilhar</strong> &gt; em "Acesso geral", mude para <strong>Qualquer pessoa com o link</strong> (Leitor).
                    </p>
                    <p className="mt-1 text-[11px] text-slate-300">
                      <strong>Opção B (Mais rápida):</strong> Clique no menu <strong>Arquivo &gt; Compartilhar &gt; Publicar na Web</strong> &gt; Escolha "Valores separados por vírgula (.csv)" e clique em <strong>Publicar</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                    3
                  </span>
                  <div>
                    <h4 className="font-semibold text-white">Cole o Link neste App</h4>
                    <p className="text-slate-400 mt-0.5 text-[11px]">
                      Cole o link copiado na aba "Configuração da Planilha". Toda vez que sua equipe epidemiológica adicionar novas semanas ou números na planilha, os gráficos e o mapa se atualizarão automaticamente!
                    </p>
                  </div>
                </div>
              </div>

              {/* Botões do modelo */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 transition"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Baixar Modelo CSV de São Luís</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyCsvStructure}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-700 text-slate-200 text-xs transition"
                >
                  {copiedTemplate ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-400" />
                      <span>Copiar Cabeçalhos</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
