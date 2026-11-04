# Painel-jr
Painel financeiro da JR Barbearia — controle de cortes, faturamento, entradas e saídas com sincronização em tempo real via Firebase.

**Endereço:** https://danielrss139-commits.github.io/Painel-jr/painel-jr-1.index.html (GitHub Pages, branch `main`). A raiz do site redireciona para o painel.

- `painel-jr-1.index.html` — o painel (arquivo único: HTML, CSS e JS).
- `sw.js` — service worker: rede primeiro para o painel, cópia salva para abrir sem internet. Ao mudar o painel, suba a versão `V` no `sw.js`.
- `manifest.json` + `icon-*.png` — instalar na tela inicial do celular.

Dados no Firestore (coleções `jrPainelCortes` e `jrPainelTransacoes`), sem mudança de formato.
