/* ====== EDITE AQUI: nome, data, textos, fotos e música ====== */
const CONFIG = {
  herName: 'Brenda',
  title: 'Para o amor da minha vida',
  startDate: '2026-09-10T00:00:00',   // 10 de setembro de 2026 (ano-mês-dia)

  /* abertura especial (antes da pergunta); {nome} vira o nome dela */
  openLines: [
    'Antes de qualquer coisa…',
    'o universo precisou alinhar milhões de coincidências',
    'só para a minha vida cruzar com a sua.',
    'E em 10 de setembro, tudo mudou para sempre.'
  ],
  wishLine: 'Uma estrela cadente… faça um pedido. 💫',
  openAfter: 'Mas o meu pedido já foi atendido: foi você.',
  openName: '{nome}',
  openDate: '10 · 09 · 2026',

  /* pergunta da abertura */
  askText: 'Desde 10 de setembro o meu mundo ficou mais bonito, mais leve e muito mais feliz. Você é a minha paz, a minha alegria e o meu melhor pedaço de futuro.',
  askQuestion: 'Você aceita continuar sendo a razão do meu sorriso, hoje e todos os dias?',
  yesLabel: 'Sim 💖',

  /* carta (aparece sendo escrita) */
  message: 'Eu nunca imaginei que alguém pudesse mudar tanto os meus dias só por existir. Você chegou de mansinho e, sem perceber, ficou com tudo o que eu tenho de melhor. Com você eu aprendi que amor é calma, é riso fácil, é segurar a mão em silêncio. Obrigado por me escolher, por cuidar de mim e por me amar do jeito que você ama. Eu quero te escolher de novo amanhã, e depois, e depois.',

  reasons: [
    'O seu sorriso muda o meu dia inteiro.',
    'Com você, até o silêncio é gostoso.',
    'Você me faz querer ser uma pessoa melhor.',
    'O seu abraço me acalma como nada mais no mundo.',
    'Ao seu lado, tudo faz sentido.'
  ],

  /* cartinhas "Abra quando..." */
  letters: [
    { title: 'Abra quando estiver com saudade', text: 'Fecha os olhos e respira fundo. Eu estou pensando em você agora, mesmo que você não saiba. A saudade é só o amor esperando o próximo abraço, e ele já está a caminho.' },
    { title: 'Abra quando o dia estiver difícil', text: 'Você é mais forte do que imagina e, quando não se sentir assim, eu acredito em você por nós dois. Nada pesa tanto quando a gente divide. Eu estou aqui, sempre.' },
    { title: 'Abra quando estiver feliz', text: 'Que bom ver você assim! Guarda esse sorriso, porque ele é a coisa mais linda que eu conheço. Eu passaria a vida inteira só para ver esse brilho nos seus olhos.' },
    { title: 'Abra antes de dormir', text: 'Boa noite, meu amor. Descansa, porque amanhã tem mais um dia para eu te amar um pouquinho mais do que hoje.' }
  ],

  finalMessage: 'Eu não sei tudo o que o futuro guarda, mas sei com quem eu quero viver cada parte dele. Obrigado por existir na minha vida.',

  /* ===== SEGREDO: aparece depois de tocar 5 vezes no coração do final ===== */
  hisName: '',   // seu nome; vazio = o convite mostra "Eu & Brenda"
  secretKicker: 'para sempre começa aqui',
  secretTitle: 'O nosso futuro',
  secretSub: 'As alianças, as promessas e o futuro que a gente sonha viver juntos.',
  rings: [   // fotos e vídeos da página das alianças (pasta assets/rings)
    { src: 'assets/rings/alianca1.jpg', caption: 'Duas alianças, uma promessa' },
    { src: 'assets/rings/alianca-video.mp4', poster: 'assets/rings/alianca-video-capa.jpg', caption: 'O nosso momento, em movimento' },
    { src: 'assets/rings/alianca2.jpg', caption: 'Mãos dadas, alianças no dedo' },
    { src: 'assets/rings/alianca3.jpg', caption: 'Eu te amo, escrito em cada detalhe' }
  ],
  promises: [
    'Prometo te escolher todos os dias, até nos dias em que for difícil.',
    'Prometo ser a sua calma quando o mundo estiver barulhento.',
    'Prometo cuidar dos seus sonhos como se fossem meus, porque agora são.',
    'Prometo rir com você, crescer com você e envelhecer com você.',
    'E prometo que, quando o tempo for o certo, vou te fazer a pergunta mais importante da minha vida.'
  ],
  clockLines: [
    'O tempo corre depressa…',
    '…e a aliança do nosso futuro vai sempre um passo à frente…',
    'mas eu vou te alcançar, no nosso tempo, no nosso dia.',
    'Um dia o tempo para, e o sim acontece. 💍'
  ],
  inviteLine: 'Um dia, no tempo certo',
  inviteDate: 'Data: a gente escolhe junto 💍',
  sealedText: 'Promessa selada. Até o nosso dia, meu amor. 💍',

  /* agradecimento (aparece depois de "Selar nossa promessa"); {nome} vira o nome dela */
  thanks: [
    'Deus, obrigado.',
    'Obrigado por ter colocado essa mulher tão especial no meu caminho.',
    'Pelo sorriso dela, pelo coração dela e pelo jeito como ela cuida de quem ama.',
    'Por cada dia ao lado dela e por tudo o que ainda vamos viver juntos.',
    'Abençoa o nosso amor, guarda os nossos planos e permite que a gente chegue ao dia do nosso sim.',
    '{nome}, obrigado por existir, por me escolher e por me ensinar o que é amar de verdade.'
  ],
  thanksFinal: 'Eu te amo, {nome}',
  thanksSign: 'Hoje, amanhã e para sempre. 💍',

  musicFile: 'assets/music/nossa-musica.mp3',
  photos: [   // galeria principal (pasta assets/photos)
    'assets/photos/foto01.jpg',
    'assets/photos/foto02.jpg',
    'assets/photos/foto03.jpg',
    'assets/photos/foto04.jpg',
    'assets/photos/foto05.jpg',
    'assets/photos/foto06.jpg',
    'assets/photos/foto07.jpg',
    'assets/photos/foto08.jpg',
    'assets/photos/foto09.jpg',
    'assets/photos/foto10.jpg',
    'assets/photos/foto11.jpg'
  ]
};
/* ================================================================ */
