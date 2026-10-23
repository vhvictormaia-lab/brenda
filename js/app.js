const $ = id => document.getElementById(id);
const pad = n => String(n).padStart(2, '0');
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const fmtDate = d => new Date(d).toLocaleDateString('pt-BR', {day:'numeric', month:'long', year:'numeric'});

const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const LOW = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 2;
const SC = LOW ? .55 : 1;   // aparelhos mais fracos recebem menos partículas

/* relógio do site; ?hoje=2026-11-10 na URL simula outra data (para testar o dia 10) */
const _hoje = new URLSearchParams(location.search).get('hoje');
const T_OFF = _hoje && !isNaN(new Date(_hoje + 'T12:00:00')) ? new Date(_hoje + 'T12:00:00') - Date.now() : 0;
const nowD = () => new Date(Date.now() + T_OFF);

/* textos */
document.title = CONFIG.title;
let ci = 0;
$('title').setAttribute('aria-label', CONFIG.title);
$('title').innerHTML = CONFIG.title.split(' ').map(w => '<span class="w" aria-hidden="true">' +
  [...w].map(c => '<span class="ch" style="--i:' + (ci++) + '">' + esc(c) + '</span>').join('') + '</span>').join(' ');
$('since').textContent = 'Juntos desde ' + fmtDate(CONFIG.startDate);
$('sKicker').textContent = CONFIG.secretKicker;
$('askName').textContent = CONFIG.herName + ',';
$('askText').textContent = CONFIG.askText;
$('askQ').textContent = CONFIG.askQuestion;
$('yes').textContent = CONFIG.yesLabel;
$('finalText').textContent = CONFIG.finalMessage;
$('reasons').innerHTML = CONFIG.reasons.map((r, i) =>
  '<div class="reason rv" style="transition-delay:' + (i * 120) + 'ms"><span>♥</span><p>' + esc(r) + '</p></div>').join('');

$('letters').innerHTML = CONFIG.letters.map((l, i) =>
  '<div class="lt rv" style="transition-delay:' + (i * 120) + 'ms"><button type="button" aria-expanded="false"><span class="em">✉️</span>' + esc(l.title) +
  '</button><div class="body"><p>' + esc(l.text) + '</p></div></div>').join('');
document.querySelectorAll('.lt button').forEach(b => b.onclick = () => {
  const open = b.parentNode.classList.toggle('open');
  b.setAttribute('aria-expanded', open);
  b.firstChild.textContent = open ? '💌' : '✉️';
  if (open) { const r = b.getBoundingClientRect(); burst(r.left + 34, r.top + 24, 28, true); }
});

/* corações de fundo */
for (let i = 0; i < (LOW ? 7 : 14); i++) {
  const s = document.createElement('span');
  s.textContent = '♥';
  s.style.left = Math.random() * 100 + '%';
  s.style.fontSize = (12 + Math.random() * 16) + 'px';
  s.style.animationDuration = (12 + Math.random() * 14) + 's';
  s.style.animationDelay = (-Math.random() * 20) + 's';
  $('hearts').appendChild(s);
}

/* explosão de corações (canvas com sprites prontos e limite de partículas) */
const cv = $('fx'), cx = cv.getContext('2d');
const COLS = ['#ff4d79', '#ff8fab', '#ffd1dc', '#ffffff', '#ffb3c6', '#e0245e'];
const SPR = COLS.map(c => {
  const s = document.createElement('canvas'); s.width = s.height = 64;
  const g = s.getContext('2d'); g.font = '56px serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillStyle = c; g.fillText('♥', 32, 34); return s;
});
let P = [], raf = 0, W = innerWidth, H = innerHeight, rt;
function fit(){ const d = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; cv.width = W * d; cv.height = H * d; cx.setTransform(d, 0, 0, d, 0, 0); }
addEventListener('resize', () => { cancelAnimationFrame(rt); rt = requestAnimationFrame(fit); }); fit();
function burst(x, y, n, sm){
  n = Math.max(1, Math.round(n * SC));
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, s = (sm ? 2 : 3) + Math.random() * (sm ? 6 : 12);
    P.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 4, r: sm ? 9 + Math.random() * 10 : 12 + Math.random() * 28,
             rot: Math.random() * 6, vr: (Math.random() - .5) * .2, k: i % SPR.length, l: 1 });
  }
  if (P.length > 650) P.splice(0, P.length - 650);
  if (!raf) loop();
}
function loop(){
  cx.clearRect(0, 0, W, H);
  P = P.filter(p => p.l > 0 && p.y < H + 60);
  for (const p of P) {
    p.vy += (p.g == null ? .2 : p.g); p.vx *= .992; if (p.sw) p.vx += Math.sin(p.y / 45 + p.rot) * .05; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.l -= (p.d || .005);
    cx.globalAlpha = Math.max(0, Math.min(1, p.l * 1.6));
    cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot);
    cx.drawImage((p.a || SPR)[p.k], -p.r / 2, -p.r / 2, p.r, p.r); cx.restore();
  }
  cx.globalAlpha = 1;
  raf = P.length ? requestAnimationFrame(loop) : 0;
}

/* flores (emoji) para a cena final */
const FLW = ['🌹', '🌷', '🌸', '💐', '🌺', '🌻', '🌼', '✨', '💖', '🤍'].map(e => {
  const s = document.createElement('canvas'); s.width = s.height = 64;
  const g = s.getContext('2d'); g.font = '48px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(e, 32, 36); return s;
});
function shoot(o){
  const n = Math.max(1, Math.round(o.n * SC));
  for (let i = 0; i < n; i++) P.push({
    x: o.x + (Math.random() - .5) * (o.w || 0), y: o.y, vx: (o.vx || 0) + (Math.random() - .5) * (o.sx || 6), vy: (o.vy || 0) + (Math.random() - .5) * (o.sy || 4),
    r: (o.r || 30) * (.6 + Math.random() * .8), rot: Math.random() * 6, vr: (Math.random() - .5) * .14,
    k: Math.floor(Math.random() * (o.sp || FLW).length), a: o.sp || FLW, l: o.l || 1.4, g: o.g, d: o.d, sw: o.sw });
  if (P.length > 650) P.splice(0, P.length - 650);
  if (!raf) loop();
}

/* música: começa assim que o navegador permitir */
const bgm = $('bgm');
if (CONFIG.musicFile) bgm.src = CONFIG.musicFile;
function fadeIn(){ bgm.volume = 0; let v = 0; const t = setInterval(() => { v = Math.min(.9, v + .03); bgm.volume = v; if (v >= .9) clearInterval(t); }, 120); }
function startMusic(){
  if (!CONFIG.musicFile) return Promise.resolve(false);
  const p = bgm.play().then(() => { fadeIn(); $('sound').style.display = 'block'; return true; }, () => false);
  return Promise.race([p, sleep(1200).then(() => 'wait')]);   // não deixa a abertura esperando a música carregar
}
bgm.addEventListener('error', () => { $('sound').style.display = 'none'; });
$('sound').onclick = () => {
  if (bgm.paused) { bgm.play().catch(() => {}); $('sound').textContent = '🔊'; }
  else { bgm.pause(); $('sound').textContent = '🔇'; }
};

/* sequência da abertura */
const show = id => document.querySelectorAll('.stage').forEach(s => s.classList.toggle('on', s.id === id));
let started = false;
/* abertura especial: céu, frases, luz do alto e coração de constelação */
async function openingScene(){
  const S0 = { skip: false };
  const w = async ms => { const t0 = performance.now(); while (!S0.skip && performance.now() - t0 < ms) await sleep(100); };
  const line = t => { $('ol').innerHTML = '<span>' + esc(t.replace('{nome}', CONFIG.herName)) + '</span>'; };
  $('oskip').onclick = () => { S0.skip = true; };
  for (let i = 0; i < (LOW ? 30 : 60); i++) {
    const s = document.createElement('i'), z = 1 + Math.random() * 2.4;
    s.style.cssText = 'left:' + Math.random() * 100 + '%;top:' + Math.random() * 100 + '%;width:' + z + 'px;height:' + z + 'px;animation-delay:' + (-Math.random() * 4) + 's';
    $('osky').appendChild(s);
  }
  const N = 26, pts = [];
  for (let k = 0; k <= N; k++) {
    const t = k / N * Math.PI * 2;
    pts.push([100 + 16 * Math.pow(Math.sin(t), 3) * 5.4, 80 - (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 5.2]);
  }
  $('consvg').innerHTML = '<path class="ln" pathLength="1" d="M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L') + '"/>' +
    pts.slice(0, N).map((p, k) => '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + (k % 5 ? 1.8 : 2.8) + '" style="animation-delay:' + (.3 + k / N * 4.4).toFixed(2) + 's"/>').join('');
  $('oname').textContent = CONFIG.openName.replace('{nome}', CONFIG.herName);
  $('odate').textContent = CONFIG.openDate;
  show('s05');
  for (const t of CONFIG.openLines) { if (S0.skip) break; line(t); vib(25); await w(3200); }
  if (!S0.skip) {                                           // luz do céu, pomba e versículo
    $('obeam').classList.add('on');
    const d = document.createElement('span'); d.className = 'dove'; d.textContent = '🕊️'; d.style.top = '16%';
    $('s05').appendChild(d); setTimeout(() => d.remove(), 9500);
    line(CONFIG.godLine); await w(4000);
  }
  if (!S0.skip) { $('ol').innerHTML = '<span class="vs">' + esc(CONFIG.verse) + '<small>' + esc(CONFIG.verseRef) + '</small></span>'; await w(5600); }
  if (!S0.skip) {                                           // coração de constelação com o nome
    $('ol').innerHTML = ''; $('obeam').classList.remove('on'); $('ocon').classList.add('on'); vib([40, 60, 40]);
    await w(7200);
  }
  $('ocon').classList.remove('on'); $('oskip').style.display = 'none';
  await sleep(S0.skip ? 100 : 900);
}

async function sequence(){
  if (started) return; started = true;
  try {
    if (!RM) await openingScene();
    show('s1'); await sleep(RM ? 700 : 2800);
    if (!RM) {
      show('s2'); $('bomb').classList.add('arm'); await sleep(3700);
      flash(); show('');
      burst(W / 2, H / 2, 170);
      await sleep(350); burst(W / 2, H / 2, 90);
      await sleep(1900);
    }
  } catch (e) {}
  show('s3');
}
$('openBtn').onclick = () => { startMusic(); sequence(); };
startMusic().then(ok => { if (ok || !CONFIG.musicFile) sequence(); });

$('yes').onclick = async e => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.disabled = true;
  burst(r.left + r.width / 2, r.top + r.height / 2, 130);
  await sleep(1200);
  $('intro').classList.add('out');
  $('site').classList.add('show');
  document.body.classList.remove('lock');
  scrollTo(0, 0);
  $('hero').classList.add('in');
  burst(innerWidth / 2, innerHeight * .4, 90);
  watch();
  autoDia10();
  setTimeout(() => $('intro').remove(), 1400);
};

/* revelar ao rolar + carta sendo escrita */
async function typeIt(){
  const el = $('message'), t = CONFIG.message, env = $('env2');
  env.classList.add('open'); await sleep(1300); env.classList.add('gone'); await sleep(900); el.classList.add('on');
  el.setAttribute('aria-label', t); el.textContent = ''; el.classList.add('typing');
  for (const ch of t) { el.textContent += ch; await sleep('.,'.includes(ch) ? 240 : 32); }
  el.classList.remove('typing');
}
function watch(){
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); io.unobserve(e.target);
    if (e.target.contains($('message'))) typeIt();
    if (e.target.id === 'nums') countUp();
    if (e.target.id === 'clockBox') runClock();
  }), { threshold: .2 });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));
}
addEventListener('pointerdown', e => {
  if ($('site').classList.contains('show') && !e.target.closest('button')) burst(e.clientX, e.clientY, 8, true);
});
/* ===== segredo: 5 toques no coração ===== */
function flash(){ const f = $('flash'); f.classList.remove('go'); void f.offsetWidth; f.classList.add('go'); }
let taps = 0, unlocked = false;
$('bigHeart').onclick = e => {
  burst(e.clientX, e.clientY, unlocked ? 40 : 60);
  if (unlocked) return;
  taps++;
  $('taps').classList.add('on');
  [...$('taps').children].forEach((d, k) => d.classList.toggle('f', k < taps));
  $('hint').textContent = taps < 5 ? 'Continue tocando… tem uma surpresa 💞' : '💍 Role para baixo…';
  if (taps >= 5) unlock();
};
function unlock(){
  unlocked = true;
  $('secret').hidden = false;
  document.querySelectorAll('#ringGallery [data-src]').forEach(el => { el.src = el.dataset.src; if (el.dataset.poster) el.poster = el.dataset.poster; });
  flash(); burst(innerWidth / 2, innerHeight / 2, 160);
  setTimeout(() => burst(innerWidth / 2, innerHeight / 3, 90), 400);
  vib([60, 40, 60]);
  setTimeout(() => $('secret').scrollIntoView({ behavior: 'smooth' }), 1300);
}

$('sTitle').textContent = CONFIG.secretTitle;
$('sSub').textContent = CONFIG.secretSub;
$('invNames').textContent = CONFIG.hisName ? CONFIG.hisName + ' & ' + CONFIG.herName : 'Nós dois ♥';
$('invLine').textContent = CONFIG.inviteLine;
$('invDate').textContent = CONFIG.inviteDate;
$('promises').innerHTML = CONFIG.promises.map((t, i) => '<p class="pm rv" style="transition-delay:' + (i * 80) + 'ms">' + esc(t) + '</p>').join('');
if (!CONFIG.rings.length) { $('rTitle').remove(); $('ringGallery').remove(); }
else {
  $('ringGallery').innerHTML = CONFIG.rings.map((r, i) => {
    const media = /\.(mp4|webm|mov)$/i.test(r.src)
      ? '<video data-src="' + esc(r.src) + '"' + (r.poster ? ' data-poster="' + esc(r.poster) + '"' : '') + ' controls playsinline muted loop preload="metadata"></video>'
      : '<img data-src="' + esc(r.src) + '" alt="' + esc(r.caption || 'Nossas alianças') + '" decoding="async" onerror="this.parentNode.remove()">';
    return '<figure class="rf rv" style="transition-delay:' + (i * 120) + 'ms">' + media + (r.caption ? '<figcaption>' + esc(r.caption) + '</figcaption>' : '') + '</figure>';
  }).join('');
  let resume = false;
  const sync = v => {
    const loud = !v.paused && !v.muted && v.volume > 0;   // só pausa a música se o vídeo estiver com som
    if (loud && !bgm.paused) { bgm.pause(); resume = true; }
    else if (!loud && resume) { bgm.play().catch(() => {}); resume = false; }
  };
  const vio = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target;
    if (e.isIntersecting && v.src) v.play().catch(() => {}); else v.pause();   // toca mudo quando aparece, pausa quando sai
  }), { threshold: .6 });
  document.querySelectorAll('.rf video').forEach(v => {
    v.muted = true;
    ['play', 'pause', 'ended', 'volumechange'].forEach(ev => v.addEventListener(ev, () => sync(v)));
    vio.observe(v);
  });
}

/* céu estrelado e pétalas */
for (let i = 0; i < (LOW ? 30 : 60); i++) {
  const s = document.createElement('i'), z = 1 + Math.random() * 2.5;
  s.style.cssText = 'left:' + Math.random() * 100 + '%;top:' + Math.random() * 100 + '%;width:' + z + 'px;height:' + z + 'px;animation-delay:' + (-Math.random() * 4) + 's;animation-duration:' + (2 + Math.random() * 3) + 's';
  $('sky').appendChild(s);
}
for (let i = 0; i < 12; i++) {
  const p = document.createElement('b');
  p.textContent = i % 3 ? '🌸' : '♥';
  p.style.cssText = 'left:' + Math.random() * 100 + '%;font-size:' + (14 + Math.random() * 14) + 'px;animation-duration:' + (10 + Math.random() * 10) + 's;animation-delay:' + (-Math.random() * 14) + 's';
  $('sky').appendChild(p);
}

/* relógio: o tempo correndo atrás da aliança do futuro */
for (let i = 0; i < 12; i++) {
  const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  l.setAttribute('x1', 120); l.setAttribute('x2', 120); l.setAttribute('y1', 30); l.setAttribute('y2', i % 3 ? 38 : 42);
  l.setAttribute('transform', 'rotate(' + i * 30 + ' 120 120)');
  $('ticks').appendChild(l);
}
let running = false;
function runClock(){
  if (running) return; running = true;
  $('clockBox').classList.remove('done');
  const D = 9500, L = 1080, t0 = performance.now(); let stage = -1;
  (function f(t){
    const p = Math.min(1, (t - t0) / D), e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    const a = L * e, lead = 140 * (1 - p * p);
    $('hand').setAttribute('transform', 'rotate(' + a + ' 120 120)');
    $('ringDot').setAttribute('transform', 'rotate(' + (a + lead) + ' 120 120)');
    const st = p < .3 ? 0 : p < .68 ? 1 : p < 1 ? 2 : 3;
    if (st !== stage) { stage = st; $('clockText').textContent = CONFIG.clockLines[st]; }
    if (p < 1) return requestAnimationFrame(f);
    running = false; $('clockBox').classList.add('done');
    const r = $('ringIn').getBoundingClientRect();
    flash(); burst(r.left + r.width / 2, r.top + r.height / 2, 90);
  })(t0);
}
$('clockBox').onclick = runClock;

/* selar a promessa: dispara o grande final */
$('seal').onclick = () => { $('sealed').textContent = CONFIG.sealedText; $('sealed').classList.add('show'); finale(); };

/* contador: total de horas, minutos, segundos e próximo mêsversário */
const start = new Date(CONFIG.startDate);
const nf = n => Math.floor(n).toLocaleString('pt-BR');
let ease = 0;
function tick(){
  const now = nowD();
  let months = (now.getFullYear() - start.getFullYear()) * 12 + now.getMonth() - start.getMonth();
  let anchor = new Date(start); anchor.setMonth(start.getMonth() + months);
  if (anchor > now) { months--; anchor = new Date(start); anchor.setMonth(start.getMonth() + months); }
  const ms = Math.max(0, now - anchor), tot = Math.max(0, now - start), k = ease;
  $('cm').textContent = Math.max(0, months);
  $('cd').textContent = Math.floor(ms / 864e5);
  $('ct').textContent = nf(tot / 36e5);
  $('total').textContent = 'São ' + nf(tot / 864e5) + ' dias de amor';
  $('nd').textContent = nf(tot / 864e5 * k);
  $('nh').textContent = nf(tot / 36e5 * k);
  $('nm').textContent = nf(tot / 6e4 * k);
  $('ns').textContent = nf(tot / 1e3 * k);
  $('nb').textContent = nf(tot / 6e4 * 72 * k);
  let n = 0, next = new Date(start);
  while (next <= now) { n++; next = new Date(start); next.setMonth(start.getMonth() + n); }
  const faltam = Math.ceil((next - now) / 864e5);
  $('moni').textContent = (now.getDate() === start.getDate() && months >= 1)
    ? 'Hoje completamos ' + months + (months > 1 ? ' meses' : ' mês') + ' juntos! 🎉'
    : 'Faltam ' + faltam + (faltam === 1 ? ' dia' : ' dias') + ' para completarmos ' + Math.max(1, n) + (n > 1 ? ' meses' : ' mês') + ' 💞';
}
function countUp(){
  const t0 = performance.now();
  (function f(t){ const p = Math.min(1, (t - t0) / 2200); ease = 1 - Math.pow(1 - p, 3); tick(); if (p < 1) requestAnimationFrame(f); })(t0);
}
tick(); setInterval(() => { if (!document.hidden) tick(); }, 1000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });

/* galeria: foto inteira com fundo desfocado */
const N = CONFIG.photos.length, DUR = 5000;
let cur = 0, playing = true, timer = null, carVis = false;
$('slides').innerHTML = CONFIG.photos.map((u, i) =>
  '<div class="slide"><img class="bg" data-i="' + i + '" decoding="async" alt="" onerror="this.remove()">' +
  '<img class="fg" data-i="' + i + '" decoding="async" alt="Foto ' + (i + 1) + ' do casal" onerror="this.remove()"></div>').join('');
CONFIG.photos.forEach((u, i) => {
  const b = document.createElement('button');
  b.type = 'button'; b.setAttribute('aria-label', 'Ver foto ' + (i + 1));
  b.innerHTML = '<img data-i="' + i + '" decoding="async" alt="" onerror="this.remove()">';
  b.onclick = () => go(i);
  $('thumbs').appendChild(b);
});
function runBar(){
  const bar = $('bar');
  bar.style.transition = 'none'; bar.style.width = '0';
  clearTimeout(timer);
  if (!playing || !carVis || document.hidden) return;
  requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.transition = 'width ' + DUR + 'ms linear'; bar.style.width = '100%'; }));
  timer = setTimeout(() => go(cur + 1), DUR);
}
function go(i){
  cur = (i + N) % N;
  [...$('slides').children].forEach((s, k) => s.classList.toggle('on', k === cur));
  [...$('thumbs').children].forEach((b, k) => b.setAttribute('aria-current', k === cur));
  $('num').textContent = (cur + 1) + ' / ' + N;
  runBar();
}
$('prev').onclick = () => go(cur - 1);
$('next').onclick = () => go(cur + 1);
$('pp').onclick = () => { playing = !playing; $('pp').textContent = playing ? '❚❚' : '▶'; runBar(); };
let sx = null;
$('car').addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
$('car').addEventListener('touchend', e => {
  if (sx === null) return;
  const dx = e.changedTouches[0].clientX - sx;
  if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1));
  sx = null;
});
if (N) go(0);

new IntersectionObserver(es => { carVis = es[0].isIntersecting; runBar(); }, { threshold: .3 }).observe($('car'));
document.addEventListener('visibilitychange', runBar);

/* fotos entram uma de cada vez, sem competir com a música */
let photosStarted = false;
function startPhotos(){
  if (photosStarted) return; photosStarted = true;
  let i = 0;
  (function next(){
    if (i >= N) return;
    const k = i++, u = CONFIG.photos[k], im = new Image();
    im.onload = im.onerror = () => { document.querySelectorAll('[data-i="' + k + '"]').forEach(el => { el.src = u; }); setTimeout(next, 60); };
    im.src = u;
  })();
}
bgm.addEventListener('canplay', startPhotos, { once: true });
setTimeout(startPhotos, 3000);

/* rastro de corações com o mouse (só no computador) */
let lastT = 0;
addEventListener('pointermove', e => {
  if (e.pointerType !== 'mouse' || !$('site').classList.contains('show')) return;
  const t = performance.now(); if (t - lastT < 90) return; lastT = t;
  burst(e.clientX, e.clientY, 1, true);
}, { passive: true });

/* ===== grande final: aliança, buquês, chuva de flores e agradecimento ===== */
const vib = p => { try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} };
for (let i = 0; i < 50; i++) {
  const s = document.createElement('i'), z = 1 + Math.random() * 2.4;
  s.style.cssText = 'left:' + Math.random() * 100 + '%;top:' + Math.random() * 100 + '%;width:' + z + 'px;height:' + z + 'px;animation-delay:' + (-Math.random() * 4) + 's';
  $('fstars').appendChild(s);
}
let finaleOn = false, fToken = 0, FS = null;
function bouquets(){
  const em = ['💐', '🌹', '🌷', '🌸', '💐', '🌺', '🌻', '🌼'];
  $('bq').innerHTML = em.map((e, i) => '<span style="--x:' + (3 + i * 12.5) + '%;--d:' + (i * .35).toFixed(2) + 's;--s:' + Math.round(58 + Math.random() * 62) + 'px">' + e + '</span>').join('');
}
function dove(top){
  const d = document.createElement('span'); d.className = 'dove'; d.textContent = '🕊️'; d.style.top = top + '%';
  $('finale').appendChild(d); setTimeout(() => d.remove(), 9500);
}
const fountains = (xs, n) => xs.forEach(f => shoot({ x: W * f, y: H + 10, w: 50, n, vy: -17, sy: 5, sx: 9, r: 42, g: .24, l: 1.6, d: .0045 }));
const petalRain = () => shoot({ x: Math.random() * W, y: -30, n: 2, vy: 2.6, sy: 1.4, sx: 2.5, r: 26, g: .012, l: 3, d: .0016, sw: 1 });

async function finale(){
  if (finaleOn) return; finaleOn = true;
  const t = ++fToken, alive = () => finaleOn && t === fToken, S = FS = { skip: false };
  const wait = async ms => { const t0 = performance.now(); while (alive() && !S.skip && performance.now() - t0 < ms) await sleep(120); };
  const F = $('finale'), fr = $('fring');
  F.hidden = false; F.classList.remove('pray', 'fin'); $('fend').classList.remove('on'); $('ftxt').innerHTML = ''; $('bq').innerHTML = '';
  document.body.classList.add('lock'); void F.offsetWidth; F.classList.add('on');
  fr.classList.remove('go'); void fr.offsetWidth; fr.classList.add('go');
  flash(); vib([90, 50, 90]); burst(W / 2, H / 2, 140);
  await wait(1900);

  if (alive() && !S.skip) {
    bouquets();
    S.fountain = setInterval(() => { if (alive()) fountains([.2, .5, .8], 12); }, 520);
    S.rain = setInterval(() => { if (alive()) petalRain(); }, 160);
    await wait(4200);
    if (alive() && !S.skip) { bouquets(); burst(W / 2, H * .45, 90); vib(60); }
    await wait(5200);
  }
  if (alive() && !S.skip) {
    clearInterval(S.fountain); clearInterval(S.rain);
    S.rain = setInterval(() => { if (alive()) shoot({ x: Math.random() * W, y: -30, n: 1, vy: 2.4, sy: 1, sx: 2, r: 22, g: .01, l: 3, d: .0016, sw: 1 }); }, 420);
    F.classList.add('pray'); dove(62); setTimeout(() => { if (alive()) dove(22); }, 9000);
    for (const ln of CONFIG.thanks) {
      if (!alive() || S.skip) break;
      $('ftxt').innerHTML = '<p class="fl">' + esc(ln.replace('{nome}', CONFIG.herName)) + '</p>';
      vib(40); await wait(5000);
    }
  }
  if (!alive()) return;
  clearInterval(S.fountain); clearInterval(S.rain);
  S.rain = setInterval(() => { if (alive()) petalRain(); }, 160);
  $('ftxt').innerHTML = ''; F.classList.add('fin'); F.classList.add('pray');
  $('fTitle').textContent = CONFIG.thanksFinal.replace('{nome}', CONFIG.herName);
  $('fSign').textContent = CONFIG.thanksSign;
  $('fend').classList.add('on'); vib([120, 60, 120]);
  let g = 0;
  const gi = setInterval(() => {
    if (!alive() || ++g > 22) return clearInterval(gi);
    fountains([.15, .5, .85], 10);
    if (g % 4 === 0) burst(W * (.2 + Math.random() * .6), H * (.2 + Math.random() * .3), 60);
  }, 230);
}
function closeFinale(){
  finaleOn = false;
  if (FS) { clearInterval(FS.fountain); clearInterval(FS.rain); }
  const F = $('finale'); F.classList.remove('on'); document.body.classList.remove('lock');
  setTimeout(() => { if (!finaleOn) { F.hidden = true; $('bq').innerHTML = ''; } }, 1300);
}
$('fClose').onclick = () => {            // "Fim": fecha o agradecimento e leva ela para a última surpresa
  closeFinale(); burst(W / 2, H / 2, 60);
  const fe0 = document.querySelector('.fakeend');
  if (fe0) { fe0.hidden = false; fe0.dataset.fast = '1'; fe0.querySelectorAll('.psiu,.teaser,.sbox').forEach(el => el.classList.add('on')); setTimeout(() => { sfx.chime(); vib([40, 30, 40]); }, 600); }   // a página do FIM aparece já completa
  const go = () => { const fe = document.querySelector('.fakeend'); if (fe) fe.scrollIntoView({ behavior: 'smooth', block: 'center' }); };
  setTimeout(go, 500); setTimeout(go, 1300);
};
$('fSkip').onclick = () => { if (FS) FS.skip = true; };

/* ===== efeitos sonoros (Web Audio, criados no código, sem arquivos) ===== */
let AC = null, MASTER = null, NB = null;
function audioCtx(){
  if (!AC) {
    try {
      AC = new (window.AudioContext || window.webkitAudioContext)();
      const comp = AC.createDynamicsCompressor(); MASTER = AC.createGain(); MASTER.gain.value = .85;
      MASTER.connect(comp); comp.connect(AC.destination);
    } catch (e) { AC = null; return null; }
  }
  if (AC.state === 'suspended') { try { AC.resume().catch(() => {}); } catch (e) {} }
  return AC;
}
document.addEventListener('pointerdown', () => audioCtx(), { passive: true });   // libera o som no primeiro toque (iPhone exige)
const sfxOk = () => $('sound').textContent !== '🔇' && !!audioCtx();
function tone(f, o){
  o = o || {};
  const c = AC, t = c.currentTime + (o.t || 0), d = o.d || 1, v = o.v || .2;
  const os = c.createOscillator(), g = c.createGain();
  os.type = o.type || 'sine'; os.frequency.setValueAtTime(f, t);
  if (o.to) os.frequency.exponentialRampToValueAtTime(o.to, t + d);
  g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + (o.a || .006)); g.gain.exponentialRampToValueAtTime(.0001, t + d);
  os.connect(g); g.connect(MASTER); os.start(t); os.stop(t + d + .05);
}
function noise(o){
  o = o || {};
  const c = AC, t = c.currentTime + (o.t || 0), d = o.d || .5;
  if (!NB || NB.sampleRate !== c.sampleRate) {
    NB = c.createBuffer(1, c.sampleRate * 3, c.sampleRate);
    const a = NB.getChannelData(0); for (let i = 0; i < a.length; i++) a[i] = Math.random() * 2 - 1;
  }
  const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
  s.buffer = NB; f.type = o.type || 'lowpass'; f.Q.value = o.q || 1;
  f.frequency.setValueAtTime(o.f0 || 800, t); if (o.f1) f.frequency.exponentialRampToValueAtTime(o.f1, t + d);
  g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(o.v || .2, t + (o.a || .01)); g.gain.exponentialRampToValueAtTime(.0001, t + d);
  s.connect(f); f.connect(g); g.connect(MASTER); s.start(t, Math.random()); s.stop(t + d + .05);
}
const sfx = {
  tick(){ if (sfxOk()) tone(1800, { d: .07, type: 'triangle', v: .6, a: .002 }); },
  bell(f, t, v){ if (!sfxOk()) return; f = f || 220; t = t || 0; v = v || .22;
    [[1, 1, 4.5], [2.76, .5, 3], [5.4, .25, 2], [8.93, .12, 1.2]].forEach(p => tone(f * p[0], { t, d: p[2], v: v * p[1], a: .004 })); },
  chime(t){ if (!sfxOk()) return; [784, 988, 1175, 1568].forEach((f, i) => sfx.bell(f, (t || 0) + i * .16, .09)); },
  harp(notes, gap){ if (!sfxOk()) return; gap = gap || .13;
    notes.forEach((f, i) => { tone(f, { t: i * gap, d: 1.8, type: 'triangle', v: .15, a: .004 }); tone(f * 2, { t: i * gap, d: .8, v: .03 }); }); },
  heart(){ if (!sfxOk()) return; tone(95, { d: .16, to: 48, v: .55, a: .004 }); tone(190, { d: .1, to: 90, v: .12, type: 'triangle' }); tone(85, { t: .22, d: .2, to: 42, v: .38, a: .004 }); },
  sparkle(){ if (!sfxOk()) return; for (let i = 0; i < 4; i++) tone([1568, 1976, 2349, 2637, 3136][Math.floor(Math.random() * 5)], { t: i * .07, d: .5, v: .1 }); },
  blow(){ if (sfxOk()) noise({ d: .9, type: 'bandpass', f0: 700, f1: 1500, q: .7, v: .6, a: .08 }); },
  firework(){ if (!sfxOk()) return;
    noise({ d: .55, type: 'bandpass', f0: 500, f1: 3200, q: 2, v: .25, a: .3 });
    noise({ t: .55, d: 1.1, type: 'lowpass', f0: 700, f1: 80, v: 1, a: .004 });
    for (let i = 0; i < 9; i++) noise({ t: .6 + Math.random() * .7, d: .05, type: 'highpass', f0: 3500, v: .15, a: .002 }); }
};

/* ===== dia 10: o presente do mêsversário ===== */
const SD = CONFIG.dia10 || {}, DAYN = SD.day || 10;
const monthsAt = d => (d.getFullYear() - start.getFullYear()) * 12 + d.getMonth() - start.getMonth();
function specialInfo(){
  const n = nowD(), m = monthsAt(n), today = new Date(n.getFullYear(), n.getMonth(), n.getDate());
  if (n.getDate() === DAYN && m >= 1) return { today: true, m };
  let nx = new Date(n.getFullYear(), n.getMonth(), DAYN);
  if (nx <= today) nx = new Date(n.getFullYear(), n.getMonth() + 1, DAYN);
  while (monthsAt(nx) < 1) nx = new Date(nx.getFullYear(), nx.getMonth() + 1, DAYN);
  return { today: false, m: monthsAt(nx), days: Math.round((nx - today) / 864e5) };
}
function giftInit(){
  const g = $('gift'), txt = $('giftTxt'), s = specialInfo();
  g.classList.toggle('today', s.today);
  txt.textContent = s.today ? 'Hoje é dia ' + DAYN + '! Toque para abrir o seu presente'
    : 'Um presente te espera no dia ' + DAYN + ' · faltam ' + s.days + (s.days === 1 ? ' dia' : ' dias');
  g.onclick = () => {
    if (specialInfo().today) return dia10();
    g.classList.remove('shake'); void g.offsetWidth; g.classList.add('shake');
    sfx.sparkle(); vib(40);
    const old = txt.textContent; txt.textContent = 'Ainda não… mas falta pouco 💞';
    setTimeout(() => { txt.textContent = old; }, 2600);
  };
  if (typeof MESES !== 'undefined') renderMeses();
}
const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const dateOfM = m => new Date(start.getFullYear(), start.getMonth() + m, DAYN, 12);
const labelM = m => { const y = Math.floor(m / 12), r = m % 12, p = [];
  if (y) p.push(y + (y === 1 ? ' ano' : ' anos')); if (r) p.push(r + (r === 1 ? ' mês' : ' meses')); return p.join(' e '); };
function renderMeses(){            // aba "Nossos meses": os dias 10 que já passaram
  const sec = $('meses'), grid = $('mgrid'), n = nowD(), si = specialInfo();
  const cur = si.today ? si.m : si.m - 1;
  $('mlink').hidden = cur < 1; $('mlink').onclick = () => { sfx.sparkle(); sec.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  if (cur < 1) { sec.hidden = true; return; }
  sec.hidden = false; grid.innerHTML = '';
  const ph = CONFIG.photos || [];
  for (let m = cur; m >= 1; m--) {
    const cf = (SD.months || {})[m] || {}, src = ph.length ? ph[(cf.photo != null ? cf.photo : m * 3) % ph.length] : '';
    const d = dateOfM(m), b = document.createElement('button'); b.type = 'button'; b.className = 'mc' + (si.today && m === cur ? ' today' : '');
    b.innerHTML = (si.today && m === cur ? '<i class="mb">Hoje!</i>' : '') + (src ? '<img loading="lazy" alt="" src="' + esc(src) + '">' : '') + '<i class="mp">▶</i>' +
      '<div class="mi"><b>' + esc(labelM(m)) + '</b><span>10 ' + MESES[d.getMonth()].slice(0, 3) + ' ' + d.getFullYear() + (cf.tag ? ' · ' + esc(cf.tag) : '') + '</span></div>';
    b.onclick = () => { sfx.sparkle(); dia10(m); };
    grid.appendChild(b);
  }
  const nx = $('mnext');
  nx.textContent = si.today ? '' : 'Próxima surpresa: dia ' + DAYN + ' de ' + MESES[dateOfM(si.m).getMonth()] + ' · faltam ' + si.days + (si.days === 1 ? ' dia' : ' dias') + ' 💞';
}
giftInit();
renderMeses();
document.addEventListener('visibilitychange', () => { if (!document.hidden) { giftInit(); renderMeses(); } });

function autoDia10(){      // abre sozinho na primeira visita do dia 10
  if (RM || !specialInfo().today) return;
  const n = nowD(), key = 'd10:' + n.getFullYear() + '-' + n.getMonth() + '-' + n.getDate();
  if (!_hoje) { try { if (localStorage.getItem(key)) return; localStorage.setItem(key, '1'); } catch (e) {} }
  setTimeout(dia10, 3800);
}

for (let i = 0; i < 45; i++) {
  const s = document.createElement('i'), z = 1 + Math.random() * 2.4;
  s.style.cssText = 'left:' + Math.random() * 100 + '%;top:' + Math.random() * 100 + '%;width:' + z + 'px;height:' + z + 'px;animation-delay:' + (-Math.random() * 4) + 's';
  $('d10stars').appendChild(s);
}
let d10On = false, D10 = null;
const duck = v => { try { bgm.volume = v; } catch (e) {} };

/* ---- sons extras dos momentos ---- */
Object.assign(sfx, {
  pop(){ if (!sfxOk()) return; noise({ d: .12, type: 'highpass', f0: 1500, v: .7, a: .002 }); tone(300, { d: .1, to: 90, v: .3, a: .002 }); },
  click(){ if (!sfxOk()) return; tone(880, { d: .09, type: 'triangle', v: .35, a: .002 }); tone(1320, { t: .06, d: .12, type: 'triangle', v: .25, a: .002 }); },
  shutter(){ if (!sfxOk()) return; noise({ d: .06, type: 'highpass', f0: 2500, v: .5, a: .002 }); noise({ t: .09, d: .08, type: 'highpass', f0: 1800, v: .4, a: .002 }); },
  whoosh(){ if (sfxOk()) noise({ d: 1.2, type: 'bandpass', f0: 300, f1: 2500, q: 1, v: .4, a: .5 }); },
  sand(d){ if (sfxOk()) noise({ d: d || 5, type: 'highpass', f0: 4500, v: .09, a: .6 }); },
  rain(d){ if (sfxOk()) noise({ d: d || 2.8, type: 'highpass', f0: 3000, v: .12, a: .5 }); },
  note(i){ if (!sfxOk()) return; const sc = [523, 587, 659, 784, 880, 1047, 1175, 1319]; tone(sc[(i || 0) % sc.length], { d: 1.2, type: 'triangle', v: .22, a: .004 }); tone(sc[(i || 0) % sc.length] * 2, { d: .6, v: .04 }); },
  pad(f){ if (!sfxOk()) return; f = f || 261; [1, 1.25, 1.5].forEach(r => tone(f * r, { d: 4, type: 'sine', v: .08, a: 1.2 })); },
  jingle(){ if (!sfxOk()) return; [784, 659, 784, 1047, 988, 880, 784].forEach((f, i) => tone(f, { t: i * .18, d: .7, type: 'triangle', v: .18, a: .004 })); }
});
const D10T = {                // notas de cada tema (usadas no final)
  rosa: [523, 659, 784, 1047], natal: [392, 523, 659, 784, 1047], verao: [587, 740, 880, 1175],
  noite: [440, 523, 659, 880], outono: [349, 440, 523, 698], ceu: [523, 659, 784, 988, 1319], ouro: [523, 659, 784, 1047, 1319]
};
const emojiSpr = list => list.map(e => {
  const s = document.createElement('canvas'); s.width = s.height = 64;
  const g = s.getContext('2d'); g.font = '48px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(e, 32, 36); return s;
});
const SPR_STAR = emojiSpr(['⭐', '✨', '🌟', '💛']);
const SPR_BLOOM = emojiSpr(['🌸', '💮', '🌺', '💖']);
const SPR_GOLD = emojiSpr(['✨', '💛', '🌟', '💍']);
const SPR_SNOW = emojiSpr(['❄️', '✨', '❄️', '⭐']);

/* ---- utilitários dos momentos ---- */
const dmA = () => $('dmA');
function dmReset(c, title, wide){
  c.st('d7'); const a = dmA(); a.innerHTML = ''; a.className = 'dmA' + (wide ? ' wide' : '');
  $('dmT').textContent = c.fill(title || ''); $('dmBtn').hidden = true;
}
async function dmLine(c, txt, ms, cls){
  if (!c.alive() || c.S.skip) return;
  const a = dmA(); a.innerHTML = '<p class="' + (cls || 'fm') + '">' + esc(c.fill(txt)) + '</p>';
  await c.w(ms || 4200);
}
const svgEl = (tag, attrs) => { const e = document.createElementNS('http://www.w3.org/2000/svg', tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
function waitFor(c, setup, maxMs){          // espera uma interação (ou pular / tempo máximo)
  return new Promise(r => { c.S.cake = r; const t = setTimeout(r, maxMs || 30000); c.S.iv.push(t); setup(r); });
}
const words = c => (c.cfg.words || []);

const D10M = {
  /* bolo, velas e oração */
  async bolo(c){
    c.st('d4'); const cake = $('cake'), btn = $('dBlow'), O = c.O;
    cake.classList.remove('off', 'away'); btn.hidden = false; $('dPray').innerHTML = '';
    $('candles').innerHTML = '<i><b></b></i>'.repeat(Math.max(1, Math.min(c.yrs || c.m, 12)));
    $('d4t').textContent = c.fill(SD.cakeLine || 'Vamos agradecer a Deus por mais um {periodo}.');
    await waitFor(c, r => { btn.onclick = r; });
    btn.hidden = true;
    if (c.alive() && !c.S.skip) {
      sfx.blow(); cake.classList.add('off'); vib(60); await c.w(1700);
      sfx.sparkle(); sfx.harp([523, 659, 784, 1047], .14); $('d4t').textContent = ''; cake.classList.add('away'); O.classList.add('pray'); await c.w(1000);
      for (const ln of (SD.prayer || [])) {
        if (!c.alive() || c.S.skip) break;
        $('dPray').innerHTML = '<p class="fl">' + esc(c.fill(ln)) + '</p>'; vib(30); await c.w(5000);
      }
      $('dPray').innerHTML = '';
    }
  },

  /* coração que se enche de amor (novembro) */
  async coracao(c){
    dmReset(c, ''); const a = dmA(), hp = 'M50 85 C10 55 0 30 15 15 C30 0 47 8 50 22 C53 8 70 0 85 15 C100 30 90 55 50 85 Z';
    a.innerHTML = '<svg class="hrt" viewBox="0 0 100 90"><defs><clipPath id="hcl"><path d="' + hp + '"/></clipPath><linearGradient id="hgd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8fab"/><stop offset="1" stop-color="#e0245e"/></linearGradient></defs>' +
      '<path d="' + hp + '" fill="#ffffff12"/><rect id="hLq" x="0" y="90" width="100" height="90" fill="url(#hgd)" clip-path="url(#hcl)"/>' +
      '<path d="' + hp + '" fill="none" stroke="#ffb3c6" stroke-width="2"/><text id="hTx" x="50" y="50" text-anchor="middle" font-size="15" fill="#fff">0%</text></svg>';
    const L = $('hLq'), X = $('hTx'), ls = words(c); sfx.pad(262); sfx.heart();
    const t0 = performance.now(), D = 5200; let li = -1, lb = 0;
    while (c.alive() && !c.S.skip) {
      const p = Math.min(1, (performance.now() - t0) / D), e = 1 - Math.pow(1 - p, 2);
      L.setAttribute('y', 88 - 86 * e + Math.sin(performance.now() / 160) * 1.5); X.textContent = Math.round(e * 100) + '%';
      const k = Math.min(1, Math.floor(p * 2)); if (k !== li) { li = k; $('dmT').textContent = c.fill(ls[k] || ''); }
      if (performance.now() - lb > 620) { lb = performance.now(); sfx.heart(); vib(20); }
      if (p >= 1) break; await sleep(40);
    }
    if (c.alive() && !c.S.skip) {
      X.textContent = '∞'; X.setAttribute('font-size', 30); $('dmT').textContent = c.fill(ls[2] || ''); sfx.bell(523, 0, .28); sfx.chime(.3); flash(); vib([80, 50, 80]);
      shoot({ x: W / 2, y: H * .4, n: 50, sx: 14, sy: 12, r: 26, l: 2.2, sp: SPR_BLOOM }); burst(W / 2, H * .4, 90); await c.w(4600);
    }
  },
  /* árvore de Natal que acende (dezembro) */
  async natal(c){
    dmReset(c, c.cfg.momentTitle); const a = dmA(), svg = svgEl('svg', { class: 'xm', viewBox: '0 0 300 350' }); a.appendChild(svg);
    const add = (tag, at, cls) => { const e = svgEl(tag, at); if (cls) e.setAttribute('class', cls); svg.appendChild(e); return e; };
    add('rect', { x: 135, y: 296, width: 30, height: 36, fill: '#7a4a2a' });
    ['150,60 62,150 238,150', '150,106 42,222 258,222', '150,168 22,302 278,302'].forEach((p, i) => { const e = add('polygon', { points: p, fill: ['#2a8f5a', '#23804f', '#1c7044'][i] }, 'tf'); e.style.animationDelay = (i * .35) + 's'; });
    sfx.pad(392); await c.w(1500);
    const cols = ['#ff5c6c', '#ffd75e', '#6cc8ff', '#ffffff', '#ff9ad5'], pts = [[150, 95], [120, 135], [180, 130], [100, 175], [150, 165], [200, 178], [75, 220], [120, 215], [180, 212], [228, 224], [60, 268], [110, 255], [160, 262], [208, 258], [250, 272]];
    for (let i = 0; i < pts.length; i++) {
      if (!c.alive() || c.S.skip) break;
      add('circle', { cx: pts[i][0], cy: pts[i][1], r: 7, fill: cols[i % cols.length], style: 'filter:drop-shadow(0 0 7px ' + cols[i % cols.length] + ')' }, 'tf'); sfx.note(i); await c.w(170);
    }
    if (c.alive() && !c.S.skip) {
      const st = add('text', { x: 150, y: 62, 'text-anchor': 'middle', 'font-size': 56, fill: '#ffd75e', style: 'filter:drop-shadow(0 0 14px #ffd75e)' }, 'tf'); st.textContent = '★';
      sfx.chime(); sfx.jingle(); flash(); vib([60, 40, 60]);
      shoot({ x: W / 2, y: -20, n: 46, w: W, sx: 2, sy: 2, vy: 2, r: 20, l: 4, g: .03, sw: 1, sp: SPR_SNOW }); await c.w(1500);
    }
    const gifts = [[70, 332], [230, 332], [150, 340]];
    for (let i = 0; i < words(c).length; i++) {
      if (!c.alive() || c.S.skip) break;
      const g = add('text', { x: gifts[i][0], y: gifts[i][1], 'text-anchor': 'middle', 'font-size': 30 }, 'tf'); g.textContent = '🎁';
      $('dmT').textContent = c.fill(words(c)[i]); sfx.click(); sfx.harp([659, 784, 988], .12); burst(W / 2, H * .55, 24); await c.w(4300);
    }
  },

  /* caixa de surpresas: toque, toque de novo, abre, corações, explosão (1º mês) */
  async presente(c){
    const ws = words(c), ok = () => c.alive() && !c.S.skip;
    dmReset(c, ws[0]); const a = dmA();
    a.innerHTML = '<button class="gbox" type="button" id="gbx" aria-label="Abrir o presente">🎁</button>'; const g = $('gbx'); sfx.pad(262);
    await waitFor(c, r => { g.onclick = r; }, 14000);
    if (!ok()) return;
    g.onclick = null; g.classList.remove('shake2'); void g.offsetWidth; g.classList.add('shake2'); sfx.click(); sfx.sparkle(); vib(40);
    burst(W / 2, H * .45, 24, true); $('dmT').textContent = c.fill('Mais uma vez… 💞');
    await waitFor(c, r => { g.onclick = r; }, 14000);
    if (!ok()) return;
    sfx.pop(); sfx.chime(); flash(); vib([60, 40, 60]); shoot({ x: W / 2, y: H * .5, n: 36, sx: 14, sy: 12, r: 24, l: 2, sp: SPR_GOLD });
    $('dmT').textContent = c.fill('Dentro dele estão três coisas… toque nos corações 💖');
    a.innerHTML = ''; const row = document.createElement('div'); row.className = 'brow'; a.appendChild(row);
    let left = 3;
    await waitFor(c, done => {
      const pop = (b, i) => {
        if (b.classList.contains('gone')) return; b.classList.add('gone');
        const r = b.getBoundingClientRect(); sfx.pop(); sfx.heart(); vib(30); burst(r.left + r.width / 2, r.top + r.height / 2, 30);
        $('dmT').textContent = c.fill(ws[i + 1] || ''); sfx.harp([523 + i * 130, 659 + i * 130, 784 + i * 130], .12);
        if (--left <= 0) setTimeout(done, 3600);
      };
      for (let i = 0; i < 3; i++) {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'bal'; b.textContent = '💖';
        b.style.setProperty('--h', ((i - 1) * 28) + 'deg'); b.style.setProperty('--d', (-i * .8) + 's'); b.onclick = () => pop(b, i); row.appendChild(b);
      }
      c.S.iv.push(setInterval(() => { const b = row.querySelector('.bal:not(.gone)'); if (b) pop(b, [...row.children].indexOf(b)); }, 7000));
    }, 70000);
    if (!ok()) return;
    a.innerHTML = '<button class="gbox" type="button" id="gbx2" aria-label="Último toque">💖</button>'; const g2 = $('gbx2');
    $('dmT').textContent = c.fill('Agora o último toque… 💥'); sfx.pad(330);
    await waitFor(c, r => { g2.onclick = r; }, 14000);
    if (!ok()) return;
    a.innerHTML = ''; sfx.firework(); sfx.chime(.2); flash(); vib([120, 60, 120, 60, 200]);
    burst(W / 2, H * .42, 120); shoot({ x: W / 2, y: H * .42, n: 70, sx: 18, sy: 16, r: 30, l: 2.6, sp: SPR_BLOOM }); fountains([.15, .85], 10);
    for (let i = 1; i <= 3; i++) setTimeout(() => { if (c.alive()) { burst(W * (.2 + Math.random() * .6), H * (.2 + Math.random() * .3), 70); sfx.firework(); } }, i * 700);
    $('dmT').textContent = c.fill(ws[4] || ''); await c.w(6500);
  },
  /* estrela de Natal */
  async estrela(c){
    dmReset(c, ''); dmA().innerHTML = '<div class="bstar">★</div>';
    sfx.pad(392); sfx.harp([523, 659, 784, 1047, 1319], .2); flash();
    shoot({ x: W / 2, y: H * .35, n: 22, sx: 10, sy: 8, r: 26, l: 2, sp: SPR_STAR }); await c.w(3000);
    for (const t of words(c)) { if (!c.alive() || c.S.skip) break; $('dmT').textContent = c.fill(t); sfx.chime(); burst(W / 2, H * .3, 26); await c.w(5600); }
  },
  /* nossos planos */
  async planos(c){
    dmReset(c, c.cfg.momentTitle); const ul = document.createElement('ul'); ul.className = 'plist'; dmA().appendChild(ul);
    for (const t of words(c)) {
      if (!c.alive() || c.S.skip) break;
      const li = document.createElement('li'); li.innerHTML = '<span class="ck">✓</span><span>' + esc(c.fill(t)) + '</span>'; ul.appendChild(li);
      void li.offsetWidth; li.classList.add('on'); sfx.click(); vib(25); burst(W / 2, H * .45, 8, true); await c.w(1900);
    }
    if (c.alive() && !c.S.skip) { sfx.chime(); burst(W / 2, H * .4, 60); await c.w(3000); }
  },
  /* balões que estouram em mensagens */
  async baloes(c){
    dmReset(c, c.cfg.momentTitle); const row = document.createElement('div'); row.className = 'brow'; dmA().appendChild(row);
    const msgs = words(c); let left = msgs.length;
    await waitFor(c, done => {
      const pop = (b, i) => {
        if (b.classList.contains('gone')) return; b.classList.add('gone');
        const r = b.getBoundingClientRect(); sfx.pop(); vib(30); burst(r.left + r.width / 2, r.top + r.height / 2, 24);
        $('dmT').textContent = c.fill(msgs[i]); sfx.note(i + 2); if (--left <= 0) { setTimeout(done, 3600); }
      };
      msgs.forEach((t, i) => {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'bal'; b.textContent = '🎈';
        b.style.setProperty('--h', (i * 120 - 20) + 'deg'); b.style.setProperty('--d', (-i * .7) + 's');
        b.onclick = () => pop(b, i); row.appendChild(b);
      });
      c.S.iv.push(setInterval(() => { const b = row.querySelector('.bal:not(.gone)'); if (b) pop(b, [...row.children].indexOf(b)); }, 6500));   // se ela não tocar, estouram sozinhos
    }, 60000);
    await c.w(600);
  },
  /* meio ano: ampulheta */
  async ampulheta(c){
    dmReset(c, ''); const a = dmA();
    a.innerHTML = '<svg class="hg" id="hg" viewBox="0 0 100 160"><defs><clipPath id="hgT"><polygon points="15,12 85,12 50,80"/></clipPath><clipPath id="hgB"><polygon points="50,80 15,148 85,148"/></clipPath></defs>' +
      '<rect id="hgTs" x="0" y="12" width="100" height="68" fill="#f9d976" clip-path="url(#hgT)"/><rect id="hgBs" x="0" y="148" width="100" height="0" fill="#f9d976" clip-path="url(#hgB)"/>' +
      '<line id="hgF" x1="50" y1="80" x2="50" y2="148" stroke="#f9d976" stroke-width="1.6"/>' +
      '<path d="M12 10 H88 M12 150 H88 M15 12 L50 80 L15 148 M85 12 L50 80 L85 148" fill="none" stroke="#fff3d6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const T = $('hgTs'), B = $('hgBs'), F = $('hgF'), lines = words(c); sfx.sand(6.5);
    const t0 = performance.now(), D = 6500; let li = -1;
    while (c.alive() && !c.S.skip) {
      const p = Math.min(1, (performance.now() - t0) / D);
      T.setAttribute('y', 12 + 68 * p); T.setAttribute('height', 68 * (1 - p));
      B.setAttribute('y', 148 - 62 * p); B.setAttribute('height', 62 * p); F.style.opacity = p < 1 ? 1 : 0;
      const k = Math.min(lines.length - 1, Math.floor(p * lines.length)); if (k !== li) { li = k; $('dmT').textContent = c.fill(lines[k]); sfx.note(k + 1); }
      if (p >= 1) break; await sleep(50);
    }
    if (c.alive() && !c.S.skip) { sfx.bell(440, 0, .25); sfx.chime(.5); $('hg').classList.add('flip'); burst(W / 2, H * .4, 50); await c.w(3200); }
  },
  /* árvore do nosso amor: uma flor por mês */
  async arvore(c){
    dmReset(c, c.cfg.momentTitle); const col = c.cfg.treeColor || '#ffb347';
    const svg = svgEl('svg', { class: 'tr', viewBox: '0 0 400 320' }); dmA().appendChild(svg);
    svg.appendChild(svgEl('ellipse', { cx: 200, cy: 110, rx: 150, ry: 95, fill: col, opacity: .18 }));
    ['M200 312 C200 250 195 210 200 160', 'M200 225 C170 205 150 195 118 172', 'M200 205 C230 185 255 175 288 152', 'M200 180 C185 152 170 130 158 100', 'M200 172 C216 146 233 126 248 98'].forEach((d, i) => {
      const p = svgEl('path', { d, class: 'tb' + (i ? '' : ' t0'), pathLength: 1 }); p.style.animationDelay = (i * .35) + 's'; svg.appendChild(p);
    });
    sfx.pad(220); await c.w(2400);
    const em = ['🌸', '💖', '🌷', '🌼', '💗', '🌺'], n = Math.min(c.m, 15), ga = 2.399963;
    for (let i = 0; i < n; i++) {
      if (!c.alive() || c.S.skip) break;
      const r = Math.sqrt((i + .5) / n), x = 200 + Math.cos(i * ga) * r * 135, y = 108 + Math.sin(i * ga) * r * 82;
      const t = svgEl('text', { x, y, 'text-anchor': 'middle', 'dominant-baseline': 'middle', class: 'tf' }); t.textContent = em[i % em.length];
      svg.appendChild(t); sfx.note(i); vib(15);
      const bb = svg.getBoundingClientRect(); burst(bb.left + x / 400 * bb.width, bb.top + y / 320 * bb.height, 6, true);
      await c.w(Math.max(260, 3600 / n));
    }
    if (c.alive() && !c.S.skip) { sfx.chime(); shoot({ x: W / 2, y: -20, n: 40, w: W, sx: 3, sy: 3, vy: 3, r: 24, l: 3, g: .05, sw: 1, sp: SPR_BLOOM }); await c.w(3200); }
  },
  /* chuva de bênçãos */
  async chuva(c){
    dmReset(c, c.cfg.momentTitle); const a = dmA(); a.style.overflow = 'hidden'; a.style.minHeight = '340px'; sfx.rain(3.5); sfx.pad(330);
    for (let i = 0; i < 42; i++) { const d = document.createElement('i'); d.className = 'drop'; d.style.left = Math.random() * 100 + '%'; d.style.animationDuration = (.7 + Math.random() * .7) + 's'; d.style.animationDelay = (-Math.random() * 1.4) + 's'; a.appendChild(d); }
    const ws = words(c);
    for (let i = 0; i < ws.length; i++) {
      if (!c.alive() || c.S.skip) break;
      const s = document.createElement('span'); s.className = 'rw'; s.textContent = ws[i]; s.style.left = (8 + (i % 4) * 22 + Math.random() * 6) + '%'; s.style.fontSize = (1.3 + Math.random() * .8) + 'rem'; a.appendChild(s);
      sfx.note(i); if (i % 2 === 0) sfx.rain(1.2); await c.w(900);
    }
    await c.w(3200);
    if (c.alive() && !c.S.skip) { a.innerHTML = '<div class="rbow">🌈</div>'; $('dmT').textContent = c.fill('Depois da chuva, Deus pinta o céu.'); sfx.harp([523, 659, 784, 1047, 1319], .14); flash(); burst(W / 2, H * .4, 70); await c.w(4800); }
  },
  /* cadeado: namora comigo de novo? */
  async cadeado(c){
    dmReset(c, ''); const a = dmA(); a.innerHTML = '<div class="dlock" id="dlk">🔓</div>';
    const q = words(c)[0] || 'Quer continuar sendo a minha namorada?'; sfx.pad(294); await c.w(1200);
    $('dmT').textContent = c.fill(q); const btn = $('dmBtn'); btn.textContent = 'Sim, para sempre 💍'; btn.hidden = false;
    await waitFor(c, r => { btn.onclick = r; }, 40000);
    btn.hidden = true;
    if (c.alive() && !c.S.skip) {
      const lk = $('dlk'); lk.textContent = '🔒'; lk.classList.add('shut'); sfx.click(); sfx.bell(523, 0, .25); sfx.chime(.3); vib([60, 40, 60]); flash();
      shoot({ x: W / 2, y: H * .45, n: 40, sx: 12, sy: 10, r: 26, l: 2, sp: SPR_GOLD }); burst(W / 2, H * .4, 80);
      $('dmT').textContent = c.fill('Selado. Eu te escolho, {nome}. 💞'); await c.w(4800);
    }
  },
  /* lanternas de oração */
  async lanternas(c){
    dmReset(c, c.cfg.momentTitle, true); const a = dmA(); a.style.pointerEvents = 'none'; $('dmT').style.position = 'relative'; $('dmT').style.zIndex = 3;
    sfx.pad(220); const ws = words(c);
    for (let i = 0; i < ws.length; i++) {
      if (!c.alive() || c.S.skip) break;
      const l = document.createElement('div'); l.className = 'ln'; l.style.left = (6 + (i % 4) * 22 + Math.random() * 8) + '%'; l.style.animationDuration = (11 + Math.random() * 3) + 's';
      l.innerHTML = '<div class="lb"><i></i><b>' + esc(c.fill(ws[i])) + '</b></div>'; a.appendChild(l);
      sfx.whoosh(); sfx.note(i); vib(20); await c.w(1500);
    }
    await c.w(6500);
  },
  /* casa dos sonhos */
  async casa(c){
    dmReset(c, ''); const a = dmA();
    a.innerHTML = '<svg class="hs" viewBox="0 0 300 240"><path class="hl" pathLength="1" d="M30 120 L150 30 L270 120"/><path class="hl" pathLength="1" d="M50 108 V212 H250 V108"/><path class="hl" pathLength="1" d="M200 62 V40 H225 V82"/>' +
      '<rect class="hw" x="70" y="130" width="44" height="44" rx="3"/><rect class="hw" x="186" y="130" width="44" height="44" rx="3"/><rect class="hd" x="128" y="150" width="44" height="62" rx="3"/><rect class="hw" x="130" y="76" width="40" height="30" rx="3"/></svg>';
    sfx.pad(262); await c.w(2400);
    const parts = [...a.querySelectorAll('.hw,.hd')], ls = words(c);
    for (let i = 0; i < ls.length; i++) {
      if (!c.alive() || c.S.skip) break;
      const p = parts[i % parts.length]; p.classList.add('on'); sfx.click(); sfx.note(i + 1); $('dmT').textContent = c.fill(ls[i]);
      const r = p.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, 10, true); await c.w(3300);
    }
    parts.forEach(p => p.classList.add('on')); if (c.alive() && !c.S.skip) { sfx.harp([392, 494, 587, 784, 988], .14); burst(W / 2, H * .4, 60); await c.w(3000); }
  },
  /* um ano: anel de 12 meses */
  async ano(c){
    dmReset(c, ''); const a = dmA(); const box = document.createElement('div'); box.className = 'yr'; a.appendChild(box);
    const ms = ['set', 'out', 'nov', 'dez', 'jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago'], els = [];
    ms.forEach((n, i) => { const e = document.createElement('div'); e.className = 'ym'; const ang = i / 12 * Math.PI * 2 - Math.PI / 2; e.style.left = (50 + Math.cos(ang) * 40) + '%'; e.style.top = (50 + Math.sin(ang) * 40) + '%'; e.textContent = n; box.appendChild(e); els.push(e); });
    const ctr = document.createElement('div'); ctr.className = 'yc'; box.appendChild(ctr); sfx.pad(262);
    for (let i = 0; i < 12; i++) { if (!c.alive() || c.S.skip) break; els[i].classList.add('on'); sfx.note(i % 8); vib(12); await c.w(420); }
    if (c.alive() && !c.S.skip) {
      ctr.innerHTML = '<span class="ring">💍</span>1 ano'; sfx.bell(523, 0, .28); sfx.chime(.4); flash(); vib([80, 50, 80]);
      shoot({ x: W / 2, y: H * .4, n: 40, sx: 14, sy: 12, r: 28, l: 2.2, sp: SPR_GOLD }); burst(W / 2, H * .4, 90); await c.w(5200);
    }
  },
  /* gratidão: lista de obrigados */
  async gratidao(c){
    dmReset(c, c.cfg.momentTitle); const ul = document.createElement('ul'); ul.className = 'plist gr'; dmA().appendChild(ul); sfx.pad(349);
    for (const t of words(c)) {
      if (!c.alive() || c.S.skip) break;
      const li = document.createElement('li'); li.innerHTML = '<span class="ck">♥</span><span>' + esc(c.fill(t)) + '</span>'; ul.appendChild(li);
      void li.offsetWidth; li.classList.add('on'); sfx.heart(); vib([30, 60, 20]); burst(W / 2, H * .45, 8, true); await c.w(2800);
    }
    await c.w(1500);
  },
  /* cartas "abra quando" */
  async cartas(c){
    dmReset(c, c.cfg.momentTitle); const row = document.createElement('div'); row.className = 'crow'; dmA().appendChild(row);
    const ls = words(c); let opened = 0;
    await waitFor(c, done => {
      ls.forEach(l => {
        const d = document.createElement('div'); d.className = 'cd'; d.innerHTML = '<button class="cb" type="button">💌 <span>' + esc(l.t) + '</span></button><p>' + esc(c.fill(l.x)) + '</p>'; row.appendChild(d);
        d.querySelector('button').onclick = () => { if (d.classList.contains('open')) return; d.classList.add('open'); sfx.click(); sfx.harp([523, 659, 784], .12); vib(25); burst(W / 2, H * .5, 14, true); if (++opened >= ls.length) setTimeout(done, 5000); };
      });
      c.S.iv.push(setInterval(() => { const d = row.querySelector('.cd:not(.open) button'); if (d) d.click(); }, 9000));   // abre sozinha se ela não tocar
    }, 70000);
  },
  /* relógio correndo atrás da aliança */
  async anel(c){
    dmReset(c, ''); const a = dmA();
    a.innerHTML = '<div style="display:flex;gap:18px;font-size:clamp(3.5rem,16vw,5.5rem);align-items:center;justify-content:center"><span id="acR" style="transition:transform 1.3s">⏰</span><span id="acG" style="transition:transform 1.3s;filter:drop-shadow(0 0 20px #f9d976)">💍</span></div>';
    const lines = CONFIG.clockLines || [], R = $('acR'), G = $('acG'); sfx.pad(294);
    for (let i = 0; i < lines.length; i++) {
      if (!c.alive() || c.S.skip) break;
      $('dmT').textContent = c.fill(lines[i]); sfx.tick();
      const last = i === lines.length - 1; R.style.transform = 'translateX(' + (last ? 70 : i * 18) + 'px) rotate(' + (i * 40) + 'deg)'; G.style.transform = 'translateX(' + (last ? 70 : 45 + i * 24) + 'px)';
      if (last) { sfx.bell(523, 0, .28); sfx.chime(.4); flash(); shoot({ x: W / 2, y: H * .4, n: 36, sx: 12, sy: 10, r: 26, l: 2.2, sp: SPR_GOLD }); }
      await c.w(i === lines.length - 1 ? 5200 : 4200);
    }
  }
};

let D10LAST = 0, D10Y = 0;
async function dia10(fm){
  if (d10On || finaleOn) return; d10On = true;
  fm = typeof fm === 'number' && fm > 0 ? fm : 0; D10LAST = fm;
  const S = D10 = { skip: false, iv: [] }, m = fm || specialInfo().m, when = fm ? dateOfM(fm) : nowD(), yrs = m % 12 === 0 ? m / 12 : 0, per = yrs ? 'ano' : 'mês';
  const cfg = (SD.months || {})[m] || {}, theme = cfg.theme || 'rosa';
  const alive = () => d10On && D10 === S;
  const w = async ms => { const t0 = performance.now(); while (alive() && !S.skip && performance.now() - t0 < ms) await sleep(100); };
  const fill = t => String(t || '').replace(/\{nome\}/g, CONFIG.herName).replace(/\{periodo\}/g, per);
  const O = $('d10'), st = id => document.querySelectorAll('.d10st').forEach(s => s.classList.toggle('on', s.id === id));
  const c = { S, m, yrs, per, cfg, O, alive, w, fill, st };
  $('d10skip').onclick = () => { S.skip = true; if (S.cake) S.cake(); };
  O.hidden = false; O.classList.remove('pray', 'fin'); O.dataset.theme = theme; D10Y = window.scrollY || document.documentElement.scrollTop || 0; document.body.classList.add('lock'); void O.offsetWidth; O.classList.add('on');
  audioCtx(); duck(.25);
  const notes = D10T[theme] || D10T.rosa;

  /* 1. relógio chegando à meia-noite */
  st('d1'); const dc = $('dclock'); dc.classList.remove('mid'); $('dt1').textContent = '';
  for (const t of ['23:59:56', '23:59:57', '23:59:58', '23:59:59']) { if (S.skip) break; dc.textContent = t; sfx.tick(); await w(1000); }
  if (alive() && !S.skip) {
    dc.textContent = '00:00:00'; dc.classList.add('mid'); flash(); vib([80, 60, 80]);
    sfx.bell(196, 0, .3); sfx.bell(196, 1.5, .26); sfx.chime(2.2);
    $('dt1').textContent = (fm ? 'Dia ' + DAYN + ' de ' + MESES[when.getMonth()] + ' de ' + when.getFullYear() : fill(SD.openingTitle || 'Hoje é dia ' + DAYN)) + (cfg.tag ? ' · ' + cfg.tag : '');
    burst(W / 2, H / 2, 90); await w(4400);
  }
  /* 2. quanto tempo juntos */
  if (alive() && !S.skip) {
    st('d2'); const target = yrs || m, total = Math.max(0, when - start), big = $('dBig');
    big.classList.remove('pop'); $('dSub').textContent = ''; $('dLbl').textContent = (yrs ? (yrs === 1 ? 'ano' : 'anos') : (m === 1 ? 'mês' : 'meses')) + ' de nós';
    for (let i = 0; i <= target && alive() && !S.skip; i++) { big.textContent = i; sfx.tick(); await w(i === target ? 100 : Math.max(160, 900 / target)); }
    if (alive() && !S.skip) {
      sfx.chime(); vib(50); big.classList.add('pop'); burst(W / 2, H * .4, 70);
      const t0 = performance.now(); let k = 0;
      while (alive() && !S.skip) {
        const p = Math.min(1, (performance.now() - t0) / 2600), e = 1 - Math.pow(1 - p, 3);
        $('dSub').textContent = nf(total / 864e5 * e) + ' dias · ' + nf(total / 36e5 * e) + ' horas de amor';
        if (k++ % 2 === 0 && p < 1) sfx.tick();
        if (p >= 1) break; await sleep(60);
      }
      await w(2400);
    }
  }
  /* 3. batimentos */
  if (alive() && !S.skip) {
    st('d3'); $('d3t').textContent = fill(SD.heartLine || 'Cada batida do meu coração tem o seu nome.');
    const hb = $('dHeart');
    for (let i = 0; i < 4 && alive() && !S.skip; i++) {
      hb.classList.remove('b'); void hb.offsetWidth; hb.classList.add('b'); sfx.heart(); vib([40, 90, 30]);
      if (i % 2 === 0) burst(W / 2, H * .4, 10, true); await w(1100);
    }
  }
  /* 4. polaroid: a lembrança do mês */
  if (alive() && !S.skip) {
    const photos = CONFIG.photos || [], src = photos[(cfg.photo != null ? cfg.photo : m * 3) % Math.max(1, photos.length)];
    if (src) {
      st('d3b'); const pol = $('pol'), img = $('polImg'); pol.classList.remove('fall'); img.src = src; $('polCap').textContent = fill(cfg.caption || 'Mais um mês de nós');
      await sleep(250); void pol.offsetWidth; pol.classList.add('fall'); sfx.whoosh(); await w(900); sfx.shutter(); flash(); vib(40);
      shoot({ x: W / 2, y: H * .3, n: 18, sx: 10, sy: 6, r: 22, l: 1.8, sp: SPR_GOLD }); sfx.harp(notes.slice(0, 3), .15); await w(5200);
    }
  }
  /* 5. o momento criativo do mês */
  if (alive() && !S.skip) {
    for (const mk of String(cfg.moment || 'bolo').split('+')) {
      if (!alive() || S.skip) break;
      try { await (D10M[mk] || D10M.bolo)(c); } catch (e) { console.warn('dia10 moment', e); }
      S.iv.forEach(t => { clearInterval(t); clearTimeout(t); }); S.iv = []; S.cake = null;
      const a = dmA(); if (a) { a.style.cssText = ''; } $('dmT').style.cssText = '';
    }
  }
  /* 6. versículo */
  if (alive() && !S.skip && cfg.verse) {
    st('d8'); O.classList.add('pray'); $('dVerse').textContent = '“' + cfg.verse[0] + '”'; $('dRef').textContent = cfg.verse[1];
    sfx.pad(262); sfx.harp(notes, .2); burst(W / 2, H * .3, 24); await w(7000);
  }
  /* 7. carta do mês */
  if (alive() && !S.skip) {
    st('d5'); const el = $('dLetter'); el.textContent = '';
    const txt = fill(cfg.letter || (yrs ? SD.yearLetter : SD.defaultLetter));
    for (const ch of txt) { if (!alive() || S.skip) break; el.textContent += ch; await sleep('.,'.includes(ch) ? 220 : 30); }
    if (alive() && !S.skip) { sfx.harp([392, 494, 587, 784], .16); await w(4200); }
  }
  /* 8. final com fogos */
  if (!alive()) return;
  st('d6'); O.classList.add('pray', 'fin'); $('d6t').textContent = fill(SD.finalText); $('d6s').textContent = fill(SD.finalSign);
  flash(); vib([120, 60, 120]); sfx.harp(notes.concat([notes[notes.length - 1] * 1.26]), .12); sfx.chime(.8);
  let k = 0;
  S.fw = setInterval(() => {
    if (!alive() || ++k > 24) return clearInterval(S.fw);
    burst(W * (.15 + Math.random() * .7), H * (.12 + Math.random() * .38), 70); sfx.firework();
    if (k % 3 === 0) fountains([.15, .85], 8);
  }, 900);
}
function closeDia10(){
  d10On = false; if (D10) { clearInterval(D10.fw); (D10.iv || []).forEach(t => { clearInterval(t); clearTimeout(t); }); }
  const O = $('d10'); O.classList.remove('on'); document.body.classList.remove('lock'); duck(.9);
  const y = D10Y, back = () => window.scrollTo(0, y); back(); requestAnimationFrame(back); setTimeout(back, 120); setTimeout(back, 400);   // volta para o ponto exato do site
  setTimeout(() => { if (!d10On) O.hidden = true; }, 1300);
}
$('d10Close').onclick = () => { closeDia10(); burst(W / 2, H / 2, 60); };


/* ===== surpresas escondidas pelo site principal ===== */
(function(){
  const SU = CONFIG.surprises || [], FE = CONFIG.fakeEnd || null, total = SU.length + (FE ? 1 : 0);
  if (!total) return;
  let found = 0;
  const fl = t => String(t || '').replace(/\{nome\}/g, CONFIG.herName), ph = CONFIG.photos || [], trk = $('sTrack');
  const mark = () => { found++; trk.hidden = false; trk.textContent = '💝 ' + found + '/' + total + ' surpresas'; trk.classList.remove('pop'); void trk.offsetWidth; trk.classList.add('pop'); };
  const polHTML = i => (i != null && ph.length) ? '<div class="spol"><i class="tape"></i><img alt="" loading="lazy" src="' + esc(ph[i % ph.length]) + '"></div>' : '';
  const mid = sec => { const r = sec.getBoundingClientRect(); return Math.min(innerHeight * .6, Math.max(120, r.top + r.height / 2)); };
  const mk = (cls, html) => { const s = document.createElement('section'); s.className = cls; s.innerHTML = html; return s; };
  const winEffects = (sec, big) => { sfx.harp([523, 659, 784, 1047], .12); sfx.chime(.3); flash(); vib([60, 40, 60]); burst(innerWidth / 2, mid(sec), big ? 90 : 55);
    shoot({ x: innerWidth / 2, y: mid(sec), n: big ? 40 : 22, sx: 12, sy: 10, r: 24, l: 2, sp: SPR_BLOOM }); };
  function reveal(sec, o){
    const r = sec.querySelector('.sres');
    r.innerHTML = polHTML(o.photo) + '<p class="stx">' + esc(fl(o.text)) + '</p>';
    sec.querySelector('.sbox').style.display = 'none'; sec.querySelector('.sk').textContent = '✨ ' + (o.kicker || 'Surpresa') + ' ✨';
    void r.offsetWidth; r.classList.add('on'); mark(); winEffects(sec);
    setTimeout(() => r.scrollIntoView({ behavior: 'smooth', block: 'center' }), 250);
  }
  const once = (sec, fn) => async e => { if (sec.dataset.busy) return; sec.dataset.busy = '1'; try { await fn(e); } catch (x) { console.warn(x); } };
  const TYPES = {
    toque(sec, o){ const b = sec.querySelector('.sbtn');
      b.onclick = once(sec, async () => { b.classList.add('wait'); b.innerHTML = esc(o.wait || 'Aguarde…') + ' <span class="dts"><i></i><i></i><i></i></span>';
        for (let i = 0; i < 4; i++) { sfx.heart(); vib(20); await sleep(700); } reveal(sec, o); }); },
    espere(sec, o){ const b = sec.querySelector('.sbtn'), hint = sec.querySelector('.shint'); let n = o.seconds || 5, ready = false, started = false;
      b.classList.add('nope'); b.textContent = (o.hint || 'Não toque ainda…') + ' ' + n;
      const start = () => { if (started) return; started = true; const iv = setInterval(() => { n--; if (n > 0) { b.textContent = (o.hint || 'Não toque ainda…') + ' ' + n; sfx.tick(); return; }
        clearInterval(iv); ready = true; b.classList.remove('nope'); b.textContent = o.go || 'Agora pode! 💖'; sfx.chime(); vib(40); hint.textContent = ''; }, 1000); };
      new IntersectionObserver((es, io) => { if (es[0].isIntersecting) { io.disconnect(); start(); } }, { threshold: .6 }).observe(sec);
      const early = ['Ei! Ainda não! 😏', 'Tenha paciência, meu amor… 💞', 'Quase lá! Respira… 😅'];
      b.onclick = once2(sec, () => { if (!ready) { b.classList.remove('shk'); void b.offsetWidth; b.classList.add('shk'); hint.textContent = early[Math.floor(Math.random() * early.length)]; vib(30); sfx.click(); return false; } return true; }, () => reveal(sec, o)); },
    segure(sec, o){ const b = sec.querySelector('.sbtn'), hint = sec.querySelector('.shint'); let t0 = 0, raf = 0, done = false;
      b.addEventListener('contextmenu', e => e.preventDefault());
      const step = () => { const p = Math.min(1, (performance.now() - t0) / 2000); b.style.setProperty('--p', p * 100);
        if (p >= 1) { done = true; cancelAnimationFrame(raf); reveal(sec, o); return; } raf = requestAnimationFrame(step); };
      let lastB = 0; const beat = () => { if (!t0 || done) return; if (performance.now() - lastB > 450) { lastB = performance.now(); sfx.heart(); vib(15); } requestAnimationFrame(beat); };
      b.addEventListener('pointerdown', e => { if (done) return; e.preventDefault(); t0 = performance.now(); hint.textContent = ''; step(); beat(); });
      const stop = () => { if (done || !t0) return; t0 = 0; cancelAnimationFrame(raf); b.style.setProperty('--p', 0); hint.textContent = 'Segure mais um pouquinho… 💗'; };
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => b.addEventListener(ev, stop)); },
    toques(sec, o){ const b = sec.querySelector('.sbtn'), hint = sec.querySelector('.shint'); let left = o.n || 3;
      b.onclick = () => { if (left <= 0) return; left--; sfx.pop(); sfx.note(3 - left); vib(30);
        const r = b.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, 18, true);
        b.classList.remove('shk'); void b.offsetWidth; b.classList.add('shk');
        if (left > 0) hint.textContent = 'Mais ' + left + (left === 1 ? ' toque…' : ' toques…'); else { sec.dataset.busy = '1'; reveal(sec, o); } }; }
  };
  function once2(sec, gate, go){ return () => { if (sec.dataset.busy) return; if (gate() === false) return; sec.dataset.busy = '1'; go(); }; }
  SU.forEach(o => {
    const a = document.getElementById(o.after); if (!a) return;
    const isBig = o.type === 'toques', isHold = o.type === 'segure';
    const btn = isHold ? '<button class="sbtn hold" type="button" aria-label="Segure"><span>💗</span></button>' : isBig ? '<button class="sbtn big" type="button" aria-label="Toque">💗</button>' : '<button class="sbtn" type="button">' + esc(o.hint || 'Toque aqui') + '</button>';
    const sec = mk('sur', '<p class="sk">' + esc(o.kicker || 'Uma surpresa escondida') + '</p><div class="sbox">' + btn + '<p class="shint">' + ((isHold || isBig) ? esc(o.hint || '') : '') + '</p></div><div class="sres"></div>');
    a.after(sec); (TYPES[o.type] || TYPES.toque)(sec, o);
  });
  /* o FIM falso: parece que acabou, mas ainda tem mais */
  if (FE) {
    const a = document.getElementById('secret') || document.getElementById('fim'); if (!a) return;
    const sec = mk('sur fakeend', '<p class="fimtxt">' + esc(fl(FE.fim)) + '</p><p class="fimsub">' + esc(fl(FE.fimSub)) + '</p><p class="psiu">' + esc(fl(FE.psiu)) + '</p><p class="teaser">' + esc(fl(FE.teaser)) + '</p><div class="sbox"><button class="sbtn" type="button">' + esc(FE.hint || 'Toque aqui') + '</button></div><div class="sres"></div>');
    sec.hidden = true;            // só aparece depois de selar a promessa e tocar em "Fim"
    a.after(sec);
    const psiu = sec.querySelector('.psiu'), tz = sec.querySelector('.teaser'), box = sec.querySelector('.sbox'), b = sec.querySelector('.sbtn');
    new IntersectionObserver((es, io) => { if (!es[0].isIntersecting) return; io.disconnect(); if (sec.dataset.fast) return;
      setTimeout(() => { psiu.classList.add('on'); sfx.sparkle(); vib(25); }, 1100);
      setTimeout(() => { tz.classList.add('on'); box.classList.add('on'); sfx.chime(); vib([40, 30, 40]); }, 2300); }, { threshold: .7 }).observe(sec);
    b.onclick = once(sec, async () => {
      b.classList.add('wait'); b.innerHTML = esc(FE.wait || 'Aguarde') + ' <span class="dts"><i></i><i></i><i></i></span>';
      for (let i = 3; i > 0; i--) { sfx.tick(); sfx.heart(); await sleep(900); }
      const r = sec.querySelector('.sres'); r.innerHTML = '<div class="cups" id="cups"></div><p class="stx" id="cupLast" style="opacity:0;transition:opacity 1.2s"></p>'; r.classList.add('on');
      box.style.display = 'none'; tz.textContent = '🎟️ Seus vales especiais'; sfx.pad(330); flash();
      const cups = $('cups'); let i = 0;
      for (const cp of (FE.coupons || [])) { const d = document.createElement('div'); d.className = 'cup'; d.innerHTML = '<span class="ci">' + esc(cp.icon || '🎟️') + '</span><div><b>' + esc(fl(cp.t)) + '</b><span>' + esc(fl(cp.d)) + '</span></div>'; cups.appendChild(d);
        sfx.note(i++); vib(25); burst(innerWidth / 2, Math.min(innerHeight * .6, d.getBoundingClientRect().top + 30), 12, true); d.scrollIntoView({ behavior: 'smooth', block: 'center' }); await sleep(1700); }
      const last = $('cupLast'); last.textContent = fl(FE.last); last.style.opacity = 1; mark(); winEffects(sec, true); fountains([.15, .85], 10);
      setTimeout(() => last.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
    });
  }
})();
