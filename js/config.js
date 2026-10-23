/* ====== EDITE AQUI: nome, data, textos, fotos e música ====== */
const CONFIG = {
  // Pergunta antes de abrir. Respostas aceitas (sem acento, minúsculas):
  gate: { answers: ['tamara'], wrong: 'Hmm, não foi essa… tente de novo 💕' },
  herName: 'Brenda',
  title: 'Para o amor da minha vida',
  startDate: '2026-09-10T00:00:00',   // 10 de setembro de 2026 (ano-mês-dia)

  /* abertura especial (antes da pergunta); {nome} vira o nome dela */
  openLines: [
    'Antes de qualquer coisa…',
    'eu preciso agradecer a Deus,',
    'porque Ele, no tempo perfeito,',
    'colocou você no meu caminho.',
    'E em 10 de setembro, tudo mudou para sempre.'
  ],
  godLine: 'Eu sei que não foi coincidência. Foi Deus. 🕊️',
  verse: 'Achou o bem aquele que acha uma esposa, e alcançou a benevolência do Senhor.',
  verseRef: 'Provérbios 18:22',
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
  hisName: 'Victor',   // seu nome (aparece no convite: Victor & Brenda)
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

  /* ===== DIA 10: nosso mêsversário (a página muda sozinha no dia 10 de cada mês) =====
     {nome} vira o nome dela e {periodo} vira "mês" ou "ano".
     Cada mês tem a sua surpresa: de 2 (10/11/2026) até 15 (10/12/2027).
     moment: presente (1º mês), coracao, natal, bolo, estrela, planos, baloes, ampulheta, arvore, chuva, cadeado, lanternas, casa, ano, gratidao, cartas, anel
     theme: rosa, natal, verao, noite, outono, ceu, ouro  |  photo: número da foto na lista "photos" (0 = primeira) */
  dia10: {
    day: 10,
    openingTitle: 'Hoje é dia 10',
    heartLine: 'Cada batida do meu coração tem o seu nome.',
    cakeLine: 'Vamos agradecer a Deus por mais um {periodo}.',
    prayer: [
      'Senhor, obrigado por mais um {periodo}.',
      'Obrigado por ter colocado a {nome} na minha vida e por nos permitir caminhar juntos.',
      'Guarda o nosso namoro, abençoa os nossos sonhos e nos prepara para o dia do nosso casamento.',
      'Que o nosso amor seja sempre para a Tua glória.',
      'Em nome de Jesus, amém. 🙏'
    ],
    months: {
      1: { tag: 'o primeiro mês', theme: 'rosa', moment: 'presente', photo: 5, caption: 'O nosso primeiro mês',
        words: ['Tem um presente esperando por você… toque nele 🎁', 'Obrigado, Deus, por ela. 🙏', 'Obrigado por cada conversa e cada risada.', 'Obrigado por me escolher todos os dias.', 'Um mês de nós, e o melhor ainda está por vir. 💖'],
        verse: ['Este é o dia que fez o Senhor; regozijemo-nos e alegremo-nos nele.', 'Salmos 118:24'],
        letter: 'Um mês, meu amor. Parece pouco, mas foi o suficiente para eu ter certeza de que Deus escreveu a nossa história. Cada dia ao seu lado me ensina a amar com mais calma e mais fé. Obrigado por me escolher. Que este seja o primeiro de muitos dias 10 juntos. Eu te amo, {nome}.' },
      2: { tag: 'o nosso começo', theme: 'rosa', moment: 'coracao+bolo', photo: 0, caption: 'O começo de tudo',
        words: ['Dois meses de nós…', 'e o meu amor só cresce.', 'Hoje ele já não cabe em mim. 💖'],
        verse: ['Melhor é serem dois do que um, porque têm melhor paga do seu trabalho.', 'Eclesiastes 4:9'],
        letter: 'Dois meses, meu amor. No calendário parece pouco, mas no meu coração já é uma vida inteira. A cada dia ao seu lado eu descubro um novo motivo para agradecer a Deus. Que Ele continue guiando os nossos passos, e que cada dia 10 seja mais um degrau até o dia do nosso sim. Eu te amo, hoje e sempre.' },
      3: { tag: 'o mês do Natal', theme: 'natal', moment: 'natal', photo: 2, caption: 'A nossa luz', momentTitle: 'Vamos acender o nosso primeiro Natal 🎄',
        words: ['Que o Natal traga paz ao seu coração.', 'Que Deus te dê saúde e muita alegria.', 'E que a nossa casa, um dia, tenha esta mesma luz.'],
        verse: ['Hoje vos nasceu, na cidade de Davi, o Salvador, que é Cristo, o Senhor.', 'Lucas 2:11'],
        letter: 'Três meses, e o nosso primeiro Natal está chegando. Eu quero que a nossa casa, um dia, tenha a mesma luz que esta data tem: paz, cuidado e Jesus no centro de tudo. Obrigado por ser o presente que Deus me deu este ano. Nada que eu pudesse embrulhar se compara a ter você. Feliz Natal antecipado, meu amor. Eu te amo.' },
      4: { tag: 'o primeiro mês do ano', theme: 'ouro', moment: 'planos', photo: 1, caption: 'Um ano novo ao seu lado', momentTitle: 'Nossos planos para este ano',
        words: ['Orar juntos todos os dias', 'Viajar e criar boas memórias', 'Cuidar um do outro nos dias difíceis', 'Realizar um sonho de cada vez', 'Chegar mais perto do nosso sim'],
        verse: ['Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz e não de mal.', 'Jeremias 29:11'],
        letter: 'Quatro meses, e um ano novo inteiro nos esperando. Eu não sei tudo o que ele guarda, mas sei quem eu quero ao meu lado em cada capítulo. Entrego este ano nas mãos de Deus e peço que Ele cuide de cada plano nosso. Que a gente ore mais, ria mais e cresça junto. Obrigado por começar o ano comigo. Eu te amo, {nome}.' },
      5: { tag: 'o mês do carinho', theme: 'verao', moment: 'baloes', photo: 3, caption: 'O seu sorriso', momentTitle: 'Toque nos balões 🎈',
        words: ['Você é a minha alegria mais simples.', 'Com você, até um dia comum vira festa.', 'Eu escolho você, hoje e em todos os meses.'],
        verse: ['Agora, pois, permanecem a fé, a esperança e o amor, estes três; mas o maior destes é o amor.', '1 Coríntios 13:13'],
        letter: 'Cinco meses! Ao seu lado eu aprendi que amar é feito de pequenas coisas: uma mensagem de bom dia, uma oração antes de dormir, um abraço que resolve o dia inteiro. Obrigado por cuidar de mim do seu jeito. Quero continuar fazendo você sorrir nos dias fáceis e nos difíceis. Que Deus encha o seu coração de paz hoje. Eu te amo muito.' },
      6: { tag: 'meio ano de nós', theme: 'noite', moment: 'ampulheta', photo: 4, caption: 'Meio ano de nós',
        words: ['Seis meses…', 'metade de um ano de histórias,', 'e eu pediria a Deus mais mil assim.'],
        verse: ['Ensina-nos a contar os nossos dias, de tal maneira que alcancemos coração sábio.', 'Salmos 90:12'],
        letter: 'Meio ano, meu amor. Se eu pudesse voltar no tempo, viveria cada dia de novo, desde o primeiro. Mas o melhor é saber que o tempo ainda corre a nosso favor, e que o que Deus começou Ele vai completar. Obrigado por cada abraço, cada risada e cada oração dividida. O próximo meio ano será ainda mais bonito. Eu te amo.' },
      7: { tag: 'o mês da árvore que cresce', theme: 'outono', moment: 'arvore', photo: 6, caption: 'Plantando o nosso futuro', momentTitle: 'Uma flor por mês', treeColor: '#ffb347',
        verse: ['Será como a árvore plantada junto a ribeiros de águas, que dá o seu fruto na estação própria.', 'Salmos 1:3'],
        letter: 'Sete meses, e o nosso amor já tem raízes. Cada oração, cada conversa e cada perdão regou essa árvore, e hoje eu vejo flores onde antes havia só um sonho. Peço a Deus que ela cresça forte, dê bons frutos e dê sombra para quem vier depois de nós. Obrigado por plantar isso comigo. Eu te amo, {nome}.' },
      8: { tag: 'o mês das bênçãos', theme: 'ceu', moment: 'chuva', photo: 7, caption: 'A minha bênção', momentTitle: 'Uma chuva de bênçãos para você',
        words: ['paz', 'saúde', 'alegria', 'fé', 'sorrisos', 'proteção', 'amor', 'união'],
        verse: ['O Senhor te abençoe e te guarde; o Senhor faça resplandecer o seu rosto sobre ti.', 'Números 6:24-25'],
        letter: 'Oito meses, e eu só consigo pensar em quantas bênçãos Deus derramou sobre nós. Algumas eu pedi, outras vieram sem eu perceber, e a maior delas foi você. Que essa chuva de coisas boas nunca pare de cair sobre a sua vida. Que Ele te guarde, te proteja e te faça ainda mais feliz. Eu te amo, hoje e sempre.' },
      9: { tag: 'a semana dos namorados', theme: 'rosa', moment: 'cadeado', photo: 8, caption: 'Namorados de novo',
        words: ['Antes do Dia dos Namorados, eu preciso te perguntar de novo: quer continuar sendo a minha namorada?'],
        verse: ['Aonde quer que fores, irei eu; o teu povo é o meu povo, e o teu Deus é o meu Deus.', 'Rute 1:16'],
        letter: 'Nove meses, e o Dia dos Namorados está chegando! Eu poderia te dar mil presentes, mas o que eu mais queria era repetir o pedido, com mais amor e mais certeza do que no primeiro dia. Obrigado por dizer sim todos os dias. Feliz Dia dos Namorados antecipado, meu amor. Eu te escolho, hoje e sempre.' },
      10: { tag: 'o mês das lanternas', theme: 'noite', moment: 'lanternas', photo: 0, caption: 'Sonhos e fé', momentTitle: 'Cada lanterna leva uma oração',
        words: ['gratidão', 'fé', 'saúde', 'sonhos', 'família', 'paz', 'união', 'esperança'],
        verse: ['Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.', 'Provérbios 3:5'],
        letter: 'Dez meses! Hoje eu soltei, em oração, todas as coisas boas que eu desejo para a sua vida: saúde, paz, alegria e realização. Que cada uma suba até Deus e volte como resposta. Eu tenho fé de que o que a gente sonha, Ele pode realizar. Obrigado por sonhar ao meu lado. Eu te amo, {nome}.' },
      11: { tag: 'o lar que vamos construir', theme: 'verao', moment: 'casa', photo: 2, caption: 'O nosso lar',
        words: ['Um dia, uma casa só nossa…', 'com as luzes acesas e a mesa posta,', 'o seu sorriso me esperando,', 'e Deus no centro de tudo.'],
        verse: ['Se o Senhor não edificar a casa, em vão trabalham os que a edificam.', 'Salmos 127:1'],
        letter: 'Onze meses, e eu já consigo imaginar a nossa casa: o barulho da cozinha, a sua risada no corredor, a oração antes de dormir. Eu não sei quando, mas sei com quem. Peço a Deus que edifique cada tijolo desse sonho e nos prepare para ele. Obrigado por sonhar um lar comigo. Eu te amo, {nome}.' },
      12: { tag: 'um ano de nós', theme: 'ouro', moment: 'ano', photo: 3, caption: 'Um ano de nós',
        verse: ['Põe-me como selo sobre o teu coração, porque o amor é forte como a morte.', 'Cantares 8:6'],
        letter: 'Um ano inteiro ao seu lado, e eu só consigo agradecer: a Deus, por ter nos unido, e a você, por ter ficado. Foram doze meses de aprendizado, de riso, de oração e de muito amor. Eu não troco nenhum deles. Que os próximos sejam ainda mais lindos, até o dia em que a gente diga o sim diante do altar. Feliz aniversário de namoro, meu amor. Eu te amo, {nome}.' },
      13: { tag: 'um ano e um mês', theme: 'outono', moment: 'gratidao', photo: 1, caption: 'Gratidão', momentTitle: 'Hoje o meu coração só tem gratidão',
        words: ['Obrigado por cada oração feita por mim.', 'Obrigado por cada abraço quando eu precisei.', 'Obrigado por acreditar em nós.', 'Obrigado por ser exatamente quem você é.', 'Obrigado, Deus, por ela.'],
        verse: ['Grandes coisas fez o Senhor por nós, e por isso estamos alegres.', 'Salmos 126:3'],
        letter: 'Um ano e um mês. Depois do primeiro aniversário eu descobri que o amor não é só festa: é ficar, é cuidar, é recomeçar. E mesmo assim, a cada mês eu me apaixono mais. Hoje o meu coração só tem gratidão. Obrigado por tudo o que você é para mim. Eu te amo, {nome}.' },
      14: { tag: 'mais um capítulo', theme: 'noite', moment: 'cartas', photo: 6, caption: 'Mais um capítulo', momentTitle: 'Toque nas cartas 💌',
        words: [
          { t: 'Abra quando sentir saudade', x: 'Eu estou aí, mesmo de longe. Fecha os olhos e lembra do nosso abraço.' },
          { t: 'Abra quando duvidar de si', x: 'Você é maravilhosa. Deus te fez com carinho, e eu admiro você todos os dias.' },
          { t: 'Abra quando quiser sorrir', x: 'Lembra de nós dois rindo à toa? Eu guardo esse som como um tesouro.' }
        ],
        verse: ['Dou graças ao meu Deus todas as vezes que me lembro de vós.', 'Filipenses 1:3'],
        letter: 'Quatorze meses, e a nossa história já tem tantos capítulos bonitos. Eu guardo cada um deles com cuidado, como quem guarda cartas antigas. Obrigado por escrever essa história comigo. Eu confio que as melhores páginas ainda estão por vir. Que Deus continue abençoando o nosso caminho. Eu te amo, {nome}.' },
      15: { tag: 'o Natal do nosso segundo ano', theme: 'natal', moment: 'anel', photo: 4, caption: 'Até o nosso sim',
        verse: ['Tudo fez formoso em seu tempo.', 'Eclesiastes 3:11'],
        letter: 'Quinze meses, e mais um Natal juntos. Olhando para trás eu só vejo a mão de Deus em tudo: nos encontros, nas decisões, nas orações respondidas. O tempo corre depressa, mas a aliança que eu sonho colocar na sua mão vai chegar no dia certo. Até lá eu vou continuar te escolhendo e agradecendo por você. Feliz Natal, meu amor. Eu te amo.' }
    },
    defaultLetter: 'Mais um dia 10, mais um mês de carinho, de vitórias e de gratidão. Obrigado por caminhar comigo e por me escolher todos os dias. Que Deus continue guardando o nosso amor e nos conduza ao dia em que vamos dizer "sim" diante dEle. Eu te amo, {nome}.',
    yearLetter: 'Mais um ano inteiro ao seu lado, e eu só consigo agradecer: a Deus, por ter nos unido, e a você, por ter ficado. Que os próximos sejam ainda mais lindos, até chegarmos ao altar. Eu te amo, {nome}.',
    finalText: 'Obrigado, Deus, por mais um {periodo} ao lado dela.',
    finalSign: 'Eu te amo, {nome}'
  },

  /* ===== SURPRESAS ESCONDIDAS no site (ela vai achando enquanto desce a tela) =====
     after: depois de qual parte aparece (hero, nums, motivos, abra, momentos)
     type: toque (toque e aguarde) | espere (contagem, não pode tocar antes) | segure (segurar o coração) | toques (tocar N vezes)
     photo: número da foto da lista "photos" (0 = primeira) */
  surprises: [
    { after: 'hero', type: 'toque', kicker: 'Surpresa 1', hint: 'Toque aqui 👆', wait: 'Aguarde…', photo: 2,
      text: 'Olha só nós dois… esse momento ficou guardado no meu coração. 💖' },
    { after: 'nums', type: 'espere', kicker: 'Surpresa 2', hint: 'Não toque ainda…', go: 'Agora pode! 💖', seconds: 5,
      text: 'Eu avisei para esperar! Valeu a pena? 😏 Quem tem paciência comigo ganha o meu amor inteirinho. 💞' },
    { after: 'motivos', type: 'segure', kicker: 'Surpresa 3', hint: 'Segure o coração 💗', photo: 4,
      text: 'Um segredo: eu me apaixono por você de novo todos os dias.' },
    { after: 'abra', type: 'toques', n: 3, kicker: 'Surpresa 4', hint: 'Toque 3 vezes no coração', photo: 6,
      text: 'Três toques, três vezes eu te digo: eu te amo, eu te amo, eu te amo! 💕' },
    { after: 'momentos', type: 'toque', kicker: 'Surpresa 5', hint: 'Tem mais… toque aqui 👀', wait: 'Aguarde, vem coisa linda…', photo: 3,
      text: 'Você achou que era só isso? 😏 Ainda tem mais lá embaixo…' }
  ],
  /* o "FIM" falso: ela acha que acabou, e ainda tem mais */
  fakeEnd: {
    fim: 'FIM 💕', fimSub: 'Obrigado por ter visto tudo até aqui.', psiu: 'psiu… 👀',
    teaser: 'Achou que tinha acabado? 😏', hint: 'Toque aqui', wait: 'Aguarde',
    coupons: [
      { icon: '🍽️', t: 'Vale um jantar a dois', d: 'Você escolhe o lugar e eu pago. 😉' },
      { icon: '🤗', t: 'Vale um abraço apertado', d: 'Pode usar quando quiser, sem prazo de validade.' },
      { icon: '👑', t: 'Vale um dia de princesa', d: 'Hoje você manda em tudo. Eu obedeço. 😅' },
      { icon: '🙏', t: 'Vale uma oração juntos', d: 'Para agradecer a Deus por tudo o que Ele tem feito por nós.' }
    ],
    last: 'Agora sim, acabou… por enquanto. Eu te amo, {nome}. 💖'
  },

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
