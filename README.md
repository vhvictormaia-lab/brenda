# Site de declaração

Contador de tempo juntos, mensagem, música e galeria de fotos.

## Estrutura

```
site-namorada/
├── index.html
├── css/style.css
├── js/
│   ├── config.js     → EDITE AQUI: título, data, mensagem, fotos e música
│   └── app.js
└── assets/
    ├── photos/       → suas fotos
    └── music/        → sua música (.mp3), opcional
```

## Personalizar

1. Reduza as fotos (cerca de 1600 px de largura, 300 a 500 KB cada) e copie para `assets/photos/`
   com nomes simples, em minúsculas e sem acento: `foto1.jpg`, `foto2.jpg`...
2. Edite `js/config.js`: título, data de início, mensagem e a lista de fotos.
3. Música: coloque um `.mp3` em `assets/music/` (nome em `musicFile`) ou
   deixe `musicFile` vazio ('') e cole um link do Spotify/YouTube em `musicUrl`.

## Ver no computador

Dentro da pasta do projeto:

```
python -m http.server 5500
```
Abra http://localhost:5500

## Publicar no GitHub Pages

1. Crie um repositório no GitHub (escolha um nome que ela não adivinhe) e envie os arquivos.
2. Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)` → Save.
3. Em poucos minutos o site fica em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

Em repositório público, qualquer pessoa que achar o endereço vê as fotos.
Use só música que você tenha direito de usar.
