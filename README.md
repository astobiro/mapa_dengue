# Painel de Vigilância Epidemiológica da Dengue - São Luís (MA)

Aplicação web progressiva (PWA) e mapa interativo para monitoramento de casos prováveis de dengue nos bairros de São Luís (MA), com suporte a dados do Google Planilhas, arquivos GeoJSON personalizados e funcionamento offline.

---

## 🚀 Como hospedar no GitHub Pages

Este repositório já está configurado com tudo o que você precisa para publicar seu site gratuitamente no **GitHub Pages**.

### Passo a passo para ativar:

1. **Suba o código para o seu repositório no GitHub** (caso ainda não tenha feito):
   ```bash
   git add .
   git commit -m "Configurações para GitHub Pages"
   git push origin main
   ```

2. **Ative o GitHub Pages no seu repositório**:
   - Acesse o seu repositório no GitHub no navegador.
   - Clique na aba **Settings** (Configurações) no topo.
   - No menu lateral esquerdo, clique em **Pages**.
   - Na seção **Build and deployment** > **Source**:
     - Selecione **GitHub Actions**.
   - Salve a alteração.

3. **Pronto!**
   - O GitHub executará automaticamente o fluxo de trabalho configurado em `.github/workflows/deploy.yml`.
   - Você pode acompanhar o progresso na aba **Actions** do seu repositório.
   - Assim que terminar, a URL do seu site estará disponível na seção **Pages** (geralmente `https://<seu-usuario>.github.io/<nome-do-repositorio>/`).

---

## 🛠️ Arquivos de suporte ao GitHub Pages incluídos:

- **`.github/workflows/deploy.yml`**: Ação do GitHub Actions que compila o projeto com Vite (`npm run build`) e publica a pasta `dist/` diretamente no GitHub Pages a cada push na branch principal.
- **`public/.nojekyll`**: Garante que o GitHub Pages não ignore pastas ou arquivos estáticos iniciados com underscore (`_`).
- **`public/404.html`**: Redirecionamento SPA para que rotas ou recarregamentos de página funcionem perfeitamente sem erros 404.
- **`vite.config.ts` (`base: './'`)**: Caminhos de scripts e estilos configurados como relativos, funcionando em qualquer subdiretório de repositório no GitHub Pages.

---

## 💻 Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Gerar build de produção para testes
npm run build
npm run preview
```
