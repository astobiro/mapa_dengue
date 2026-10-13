# 🦟 Mapa Dengue São Luís (MA)

Painel interativo e PWA para vigilância epidemiológica e monitoramento espacial de casos prováveis de dengue nos bairros e distritos sanitários de São Luís (MA).

---

## 📌 Resumo do Sistema

O sistema foi desenvolvido para facilitar a análise epidemiológica territorial da dengue em São Luís:

- **🗺️ Mapa Coroplético Interativo**: Visualização dinâmica com Leaflet (OpenStreetMap e Satélite Híbrido), permitindo alternar entre **Visão por Bairros** e **Visão por Distritos Sanitários**.
- **📊 Indicadores Epidemiológicos**: Acompanhamento de casos prováveis acumulados, variação semanal, incidência por 100 mil habitantes e ranking de bairros mais afetados.
- **🔄 Integração com Google Planilhas**: Conexão direta com planilhas públicas publicadas como CSV para atualização rápida de dados sem necessidade de backend.
- **📁 Malha GeoJSON Customizada**: Carregamento automático da malha de bairros via repositório (`geojson/bairros_limpos.geojson`), suporte a parâmetro de URL (`?geojson=...`) e importação manual de arquivos pelo usuário.
- **🖼️ Modo Embed para Looker Studio**: Suporte à incorporação em iframes e dashboards com interface limpa, sem cabeçalho, com filtros minimizados e parâmetros pré-configurados na URL.
- **📱 PWA Offline**: Instalação como aplicativo no celular ou desktop, com cache de dados para consulta mesmo sem conexão à internet.

---

## 📁 Estrutura do Repositório

```text
├── geojson/                # Malhas geográficas versionadas (bairros_limpos.geojson)
├── public/                 # Arquivos públicos e estáticos para o GitHub Pages
│   └── geojson/            # Cópia estática servida em produção
├── src/                    # Código-fonte da aplicação React + TypeScript + Tailwind
│   ├── components/         # Mapa, painéis, modais e cabeçalhos
│   ├── services/           # Sincronização com Google Planilhas e processamento de dados
│   └── utils/              # Cálculos geográficos e dissolução de polígonos
└── .github/workflows/      # Automação de deploy para o GitHub Pages
```

---

## 🚀 Como Rodar Localmente

```bash
# 1. Instalar as dependências
npm install

# 2. Iniciar o servidor de desenvolvimento
npm run dev

# 3. Compilar para produção
npm run build
```

---

## 🌐 Publicação no GitHub Pages

O projeto já inclui o fluxo de deploy automatizado (`.github/workflows/deploy.yml`):

1. Envie o código para a branch `main` do seu repositório no GitHub:
   ```bash
   git add .
   git commit -m "Atualizações do projeto"
   git push origin main
   ```
2. No GitHub, acesse a aba **Settings** > **Pages**.
3. Em **Build and deployment** > **Source**, selecione **GitHub Actions**.
4. O site será compilado e publicado automaticamente na URL do seu GitHub Pages.
