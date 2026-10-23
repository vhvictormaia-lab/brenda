# Site de declaração

```
├── index.html
├── css/style.css
├── js/
│   ├── config.js        → EDITE AQUI: nome, data, textos, fotos e vídeos
│   └── app.js
└── assets/
    ├── photos/          → fotos da galeria principal (foto01.jpg, foto02.jpg...)
    ├── rings/           → fotos e vídeo da página das alianças (a parte secreta)
    └── music/           → a música (nossa-musica.mp3)
```

## Fotos novas
1. Reduza para no máximo 1600 px no lado maior (squoosh.app) e salve como .jpg, com nome simples, sem espaço nem acento.
2. Coloque em `assets/photos/` (galeria) ou `assets/rings/` (alianças).
3. Adicione o caminho na lista `photos` ou `rings` do `js/config.js`.

## Depois de qualquer mudança
Troque o número em `?v=6` (3 linhas no final do `index.html`) para `?v=7`, `?v=8`... assim o celular não usa a versão antiga.

## Ver no computador
`python -m http.server 5500` dentro da pasta, e abrir http://localhost:5500

## Dia 10 (mêsversário)
No dia 10 de cada mês a página abre um presente com animação e sons. Os textos ficam em `dia10` no `js/config.js`.
Cada mês tem uma surpresa própria (de 10/11/2026 até 10/12/2027): carta, foto-lembrança, versículo e um momento diferente (bolo, estrela, balões, ampulheta, árvore, chuva de bênçãos, cadeado, lanternas, casa, anel de 12 meses, cartas, relógio e aliança). Para mudar, edite `dia10.months` no `config.js`. Confira os versículos na sua Bíblia.
- Antes do dia 10: aparece o cartão "Um presente te espera no dia 10 · faltam X dias".
- Para testar sem esperar: abra o site com `?hoje=2026-11-10` no fim do endereço.

## Aba "Nossos meses"
Logo abaixo do contador aparece a seção "Nossos meses": um cartão para cada dia 10 que já passou (o mais novo primeiro). Ao tocar, a surpresa daquele mês toca de novo. Os cartões aparecem sozinhos, mês a mês.

## Prévia do link e ícone
- `assets/og.jpg`: imagem que aparece quando o link é enviado no WhatsApp. O endereço completo já está no `index.html` (`og:image` e `og:url`).
- `manifest.webmanifest` e `assets/icons/`: ícone de coração quando ela adicionar o site à tela inicial do celular.
