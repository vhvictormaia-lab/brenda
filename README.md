# Site de declaração para a Brenda

Site estático (sem servidor), publicado no GitHub Pages: https://vhvictormaia-lab.github.io/brenda/

## Estrutura
```
├── index.html            página
├── manifest.webmanifest  ícone ao adicionar na tela inicial
├── css/style.css         visual e animações
├── js/
│   ├── config.js         EDITE AQUI: textos, datas, fotos, vales, surpresas
│   └── app.js            funcionamento (não precisa mexer)
└── assets/
    ├── photos/           foto01.jpg ... foto11.jpg (galeria e surpresas)
    ├── rings/            fotos e vídeo das alianças (parte secreta)
    ├── music/            nossa-musica.mp3
    ├── icons/            ícones do site
    └── og.jpg            imagem que aparece ao enviar o link no WhatsApp
```

## O que o site tem
1. **Abertura:** envelope, Deus, versículo, constelação, coração que explode e a pergunta com o botão "Sim".
2. **Site principal:** contador (meses, dias, horas), carta, números, motivos, cartinhas "Abra quando", galeria.
3. **Surpresas escondidas** pelo caminho (toque, espere, segure, toque 3 vezes). Ficam em `surprises` no `config.js`.
4. **Segredo:** tocar 5 vezes no coração gigante abre as alianças e promessas. "Selar nossa promessa" leva ao agradecimento a Deus e ao botão **Fim**, que abre a última página (FIM + vales). Os vales ficam em `fakeEnd` no `config.js`.
5. **Dia 10 (mêsversário):** no dia 10 de cada mês o presente abre uma surpresa própria (de 10/10/2026 até dezembro de 2027; depois disso usa uma carta padrão). Textos em `dia10.months`.
6. **Nossos meses:** botão no topo e seção com um cartão para cada dia 10 que já passou. Ela pode rever qualquer mês.

## Depois de qualquer mudança
Troque o número de versão nas 3 linhas do `index.html` (`?v=24` para `?v=25`, e assim por diante). Assim o celular dela não usa a versão antiga.

## Fotos novas
1. Reduza para no máximo 1600 px no lado maior e salve como .jpg, com nome simples, sem espaço nem acento.
2. Coloque em `assets/photos/` e adicione o caminho na lista `photos` do `config.js`.
3. Não suba fotos originais pesadas: deixam o repositório lento.

## Testar sem esperar o dia 10
Abra o site com `?hoje=2026-11-10` no fim do endereço (qualquer data). Quem souber disso também consegue ver as surpresas antes da hora.

## Ver no computador
`python -m http.server 5500` dentro da pasta e abrir http://localhost:5500
