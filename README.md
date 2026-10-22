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
