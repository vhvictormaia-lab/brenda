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
  /* ===== o livro do dia 10 de novembro (mês 2) — ver js/livro.js ===== */
  livro: {
    coverPhoto: 0,
    coverKicker: 'Capítulo II',
    coverTitle: 'Nossa História',
    coverSub: 'O caminho até o altar',
    coverPhrase: 'Deus já escreveu o nosso final feliz. Falta pouco para o altar. 💍',
    tocTitle: 'Sumário',
    toc: ['O Castelo do Tempo', 'A Carta da Pomba', 'Extra! Extra!', 'O Mural das Lembranças', 'A Cabine de Fotos', 'O Significado do Amor', 'O Pote de Mensagens', 'A Caixinha de Música', 'O Quebra-Cabeça', 'O Cadeado do Amor'],
    castleTitle: 'O Castelo do Tempo',
    castleVerse: ['Tudo sofre, tudo crê, tudo espera, tudo suporta. O amor nunca falha.', '1 Coríntios 13:7-8'],
    letterTitle: 'A Carta da Pomba',
    riddle: ['Não tenho voz, mas faço o coração falar.', 'Não tenho asas, mas faço você voar.', 'Quanto mais eu dou, mais eu tenho.', 'Nasci em Deus e moro em dois corações.'],
    riddleAsk: 'Quem sou eu?',
    riddleAnswer: 'O amor. E o meu, {nome}, tem o seu nome. 💖',
    news: {
      name: 'O DIÁRIO DO AMOR',
      line: 'EDIÇÃO ESPECIAL · 10 DE NOVEMBRO DE 2026 · PREÇO: UM BEIJO',
      head: 'BRENDA E VICTOR SÃO O MELHOR CASAL DO MUNDO, CONFIRMA ESTUDO',
      sub: 'Pesquisa ouviu um coração e teve 100% de aprovação do outro',
      photo: 2,
      cap: 'Flagrante: o casal, mais uma vez, sendo lindo.',
      stamp: 'EXTRA!',
      cols: [
        'Segundo o único jurado, o Victor, a Brenda é a mulher mais linda do Brasil. Os outros candidatos nem apareceram.',
        'O sorriso dela foi classificado como perigoso: provoca esquecimento do que se ia falar e batimentos acima do normal.',
        'Fontes próximas garantem que o casamento é só questão de tempo, e que o tempo está nas mãos de Deus.'
      ],
      box: ['PREVISÃO DO TEMPO', '100% de chance de amor, com abraços fortes à tarde e beijos à noite.'],
      class: ['CLASSIFICADOS', 'Procura-se: mais um domingo juntos. Oferece-se: um coração inteiro.'],
      foot: 'Todas as informações foram verificadas pelo coração do Victor.'
    },
    muralTitle: 'Mural das Lembranças',
    mural: [
      { p: 1, t: 'Esse sorriso é o meu vício' }, { p: 2, t: 'Sempre juntinhos' }, { p: 4, t: 'Deus acertou em cheio' },
      { p: 9, t: 'O abraço mais certo' }, { p: 6, t: 'Minha parte favorita do dia' }, { p: 3, t: 'O meu para sempre' }
    ],
    boothTitle: 'A Cabine de Fotos',
    booth: [5, 7, 0, 8],
    boothSign: 'Cabine do Amor · Brenda & Victor',
    meaningTitle: 'O Significado do Amor',
    meaningWord: 'AMOR',
    meaningPron: 'a·mor · substantivo masculino',
    meaningText: '1. Sentimento que Deus coloca no coração de duas pessoas para que caminhem juntas. 2. É paciente, é bondoso, não guarda rancor. 3. É escolher a mesma pessoa todos os dias, até nos dias difíceis. 4. É orar um pelo outro e sentir saudade com cinco minutos de distância. 5. Veja também: Brenda.',
    meaningEnd: 'A definição mais completa é uma só: {nome}. 💖',
    jarTitle: 'O Pote de Mensagens',
    jarHint: 'Você tem 2 toques ✨',
    jarJoke: 'Era brincadeira! Abra quantas quiser: o pote é infinito. ∞💌',
    jar: [
      "Você é a resposta de uma oração que eu nem sabia que tinha feito. 🙏",
      "Hoje o dia é seu: você consegue tudo o que Deus colocou no seu coração.",
      "O seu sorriso é o meu melhor bom dia. ☀️",
      "Não tenha medo: Deus vai à sua frente e eu vou ao seu lado.",
      "Você é mais forte do que imagina e mais amada do que sabe.",
      "Eu escolho você hoje, amanhã e em todos os dias que Deus me der.",
      "Que o seu dia seja leve. E se não for, eu estou aqui para carregar junto.",
      "Nada que você sonha é grande demais para Deus.",
      "Obrigado por existir na minha vida.",
      "Os seus sonhos também são meus. Vamos conquistar juntos.",
      "Quando o dia pesar, lembre-se: tem alguém orando por você agora.",
      "Você é linda por fora e muito mais por dentro.",
      "Respire fundo. Você já superou dias piores do que esse.",
      "Eu amo o seu jeito de rir de tudo, até das minhas piadas ruins. 😂",
      "Cada passo seu importa, mesmo os pequenos.",
      "Você é o meu motivo de agradecer a Deus todos os dias.",
      "Descanse. Você não precisa dar conta de tudo sozinha.",
      "O seu abraço é a minha casa. 🏡",
      "Sou o homem mais sortudo do mundo por ter você.",
      "Confie no tempo de Deus. Ele nunca se atrasa.",
      "Você merece tudo de bom, e eu vou lutar para te dar.",
      "Hoje eu te amo mais do que ontem e menos do que amanhã.",
      "A sua fé me inspira todos os dias.",
      "Você é capaz. Não deixe ninguém dizer o contrário.",
      "A saudade de você começa assim que a gente se despede.",
      "Você faz o meu coração ficar em paz.",
      "Seja gentil com você hoje, como você é com todo mundo.",
      "Deus caprichou quando te fez.",
      "Uma mulher que ora é uma mulher que vence. E você ora. 🙏",
      "Eu me apaixono por você de novo toda vez que você fala o meu nome.",
      "Não desista. O que você plantou com fé vai florescer.",
      "Você é a minha parte favorita do dia.",
      "Que orgulho de você! Continue.",
      "Eu te amo nos dias de sol e nos de chuva.",
      "Cada dia ao seu lado é uma bênção que eu agradeço de joelhos.",
      "Tudo vai dar certo. Deus já está cuidando.",
      "O seu olhar tem um brilho que nenhuma foto consegue guardar.",
      "Quando eu penso no futuro, você está em todas as cenas.",
      "Você não precisa ser perfeita. Eu amo você inteira.",
      "Eu vou sempre torcer por você, na vitória e na luta.",
      "Você é o presente de Deus que eu mais cuido.",
      "Hoje, respire, sorria e lembre-se: você é muito amada.",
      "Os seus abraços curam o meu dia inteiro.",
      "O que é seu, Deus guarda. Espere com paz.",
      "Você me faz querer ser um homem melhor.",
      "A cada dia que passa eu tenho mais certeza de que é você.",
      "Seja luz hoje, como você sempre é.",
      "Você é a minha oração respondida.",
      "Mesmo de longe, o meu coração está com você.",
      "Não se compare. O seu brilho é único.",
      "Eu aprendi a amar vendo como você ama.",
      "Você é corajosa. Eu vi.",
      "Que Deus abençoe cada passo seu hoje.",
      "O meu lado favorito do sofá é o que fica perto de você.",
      "Todo dia é uma nova chance de recomeçar com Deus.",
      "Eu amo as suas manias, todas elas.",
      "Você tem um coração lindo. Nunca deixe isso mudar.",
      "Quando você sorri, o meu dia se ajeita.",
      "A sua paz é um tesouro. Proteja.",
      "Eu te prometo: nunca vou soltar a sua mão.",
      "Você não está sozinha. Nunca esteve.",
      "Pense em tudo o que você já venceu e orgulhe-se.",
      "O amor que Deus colocou em mim por você só cresce.",
      "Você é o meu sim mais fácil.",
      "Que a sua semana seja cheia de alegria e de pequenas vitórias.",
      "Eu admiro a sua força, a sua fé e o seu jeitinho.",
      "Quero envelhecer ao seu lado, discutindo quem esqueceu a chave. 😂",
      "Faça o que o seu coração pede. Eu apoio você.",
      "Você ilumina qualquer ambiente em que entra.",
      "O melhor de mim eu aprendi com Deus e com você.",
      "Não existe distância que o amor e a oração não vençam.",
      "Você é a minha paz no meio da correria.",
      "Lembre-se: Deus tem planos lindos para nós dois.",
      "Se cansar, descanse. Mas não desista.",
      "Sou grato por cada risada que a gente já deu junto.",
      "Eu amo ver você feliz. Isso é tudo para mim.",
      "Você é a história que eu quero contar para os nossos netos.",
      "Que você nunca duvide do quanto é especial.",
      "Confio em Deus para nos guiar e em você para caminhar comigo.",
      "Os seus erros não definem você. A graça de Deus, sim.",
      "Amar você é a coisa mais fácil que eu já fiz.",
      "Hoje eu só queria dizer: obrigado por me aguentar. 😅💖",
      "Você é a razão do meu sorriso bobo no meio do dia.",
      "Fique firme. A manhã sempre chega.",
      "Eu vejo Deus no seu jeito de cuidar das pessoas.",
      "Cada oração minha tem o seu nome.",
      "O seu futuro é brilhante, e eu quero estar nele.",
      "Você é mais do que suficiente.",
      "Se hoje foi difícil, amanhã eu te trago um abraço extra.",
      "Ter você é a prova de que Deus me ama.",
      "Você é o meu amor, a minha amiga e o meu lar.",
      "Nunca esqueça: você nasceu para brilhar. ✨",
      "Eu te amo mais do que as palavras conseguem dizer, e olha que eu estou tentando.",
      "Cada pequeno detalhe seu é importante para mim.",
      "Com Deus no centro, o nosso amor não cai.",
      "Que bom que os nossos caminhos se cruzaram. Foi Deus. 🕊️",
      "Vá com calma e vá com fé. Eu estou aqui.",
      "Você é o meu sonho, só que acordado.",
      "Prometo ser o seu companheiro nos dias bons e nos difíceis.",
      "E se você chegou até aqui: eu te amo, {nome}. Sempre. 💖"
    ],
    boxTitle: 'A Caixinha de Música',
    boxHint: 'Gire a manivela 🎶',
    boxMsgs: [
      'Já imagino você entrando de branco, e eu tentando não chorar. 😭💍',
      'Cada passo seu até o altar vai ser o melhor momento da minha vida.',
      'Diante de Deus e de todos, eu vou dizer: sim, para sempre.',
      'Quero acordar ao seu lado todos os dias da minha vida.',
      'O casamento é só o começo da melhor parte da nossa história. 💞'
    ],
    puzzleTitle: 'O Quebra-Cabeça',
    puzzleHint: 'Toque em uma peça 🧩',
    puzzlePhoto: 3,
    puzzleEnd: 'Peça por peça, Deus nos encaixou. 🧩💖',
    lockTitle: 'O Cadeado do Amor',
    lockIntro: 'Em Paris, os casais trancam um cadeado na ponte e jogam a chave no rio. Vamos fazer o nosso? Toque na chave 🗝️',
    lockClosed: 'Trancado! 🔒 Agora toque na chave de novo.',
    lockEnd: 'A chave foi para o fundo do rio. O que Deus ajuntou, não o separe o homem.',
    lockRef: 'Mateus 19:6',
    lockInitials: 'B ♥ V'
  },
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
      2: { tag: 'o nosso livro', theme: 'rosa', book: true, moment: 'coracao+bolo', photo: 0, caption: 'O começo de tudo',
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
