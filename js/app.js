const $ = id => document.getElementById(id);
const pad = n => String(n).padStart(2, '0');
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const fmtDate = d => new Date(d).toLocaleDateString('pt-BR', {day:'numeric', month:'long', year:'numeric'});

/* textos */
document.title = CONFIG.title;
$('title').textContent = CONFIG.title;
$('since').textContent = 'Juntos desde ' + fmtDate(CONFIG.startDate);
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
for (let i = 0; i < 14; i++) {
  const s = document.createElement('span');
  s.textContent = '♥';
  s.style.left = Math.random() * 100 + '%';
  s.style.fontSize = (12 + Math.random() * 16) + 'px';
  s.style.animationDuration = (12 + Math.random() * 14) + 's';
  s.style.animationDelay = (-Math.random() * 20) + 's';
  $('hearts').appendChild(s);
}

/* explosão de corações (canvas) */
const cv = $('fx'), cx = cv.getContext('2d');
let P = [], raf = 0;
function fit(){ const d = devicePixelRatio || 1; cv.width = innerWidth * d; cv.height = innerHeight * d; cx.setTransform(d, 0, 0, d, 0, 0); }
addEventListener('resize', fit); fit();
function burst(x, y, n, sm){
  const cols = ['#ff4d79', '#ff8fab', '#ffd1dc', '#ffffff', '#ffb3c6', '#e0245e'];
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, s = (sm ? 2 : 3) + Math.random() * (sm ? 6 : 12);
    P.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 4, r: sm ? 9 + Math.random() * 10 : 12 + Math.random() * 28,
             rot: Math.random() * 6, vr: (Math.random() - .5) * .2, c: cols[i % cols.length], l: 1 });
  }
  if (!raf) loop();
}
function loop(){
  cx.clearRect(0, 0, innerWidth, innerHeight);
  P = P.filter(p => p.l > 0 && p.y < innerHeight + 60);
  for (const p of P) {
    p.vy += .2; p.vx *= .992; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.l -= .005;
    cx.save(); cx.globalAlpha = Math.max(0, Math.min(1, p.l * 1.6));
    cx.translate(p.x, p.y); cx.rotate(p.rot); cx.fillStyle = p.c;
    cx.font = p.r + 'px serif'; cx.textAlign = 'center'; cx.textBaseline = 'middle';
    cx.fillText('♥', 0, 0); cx.restore();
  }
  raf = P.length ? requestAnimationFrame(loop) : 0;
}

/* música: começa assim que o navegador permitir */
const bgm = $('bgm');
if (CONFIG.musicFile) bgm.src = CONFIG.musicFile;
function fadeIn(){ bgm.volume = 0; let v = 0; const t = setInterval(() => { v = Math.min(.9, v + .03); bgm.volume = v; if (v >= .9) clearInterval(t); }, 120); }
async function startMusic(){
  if (!CONFIG.musicFile) return false;
  try { await bgm.play(); fadeIn(); $('sound').style.display = 'block'; return true; }
  catch (e) { return false; }
}
$('sound').onclick = () => {
  if (bgm.paused) { bgm.play(); $('sound').textContent = '🔊'; }
  else { bgm.pause(); $('sound').textContent = '🔇'; }
};

/* sequência da abertura */
const show = id => document.querySelectorAll('.stage').forEach(s => s.classList.toggle('on', s.id === id));
let started = false;
async function sequence(){
  if (started) return; started = true;
  show('s1'); await sleep(2800);
  show('s2'); $('bomb').classList.add('arm'); await sleep(3700);
  $('flash').classList.add('go');
  show('');
  burst(innerWidth / 2, innerHeight / 2, 170);
  await sleep(350); burst(innerWidth / 2, innerHeight / 2, 90);
  await sleep(1900); show('s3');
}
$('openBtn').onclick = async () => { await startMusic(); sequence(); };
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
  setTimeout(() => $('intro').remove(), 1400);
};

/* revelar ao rolar + carta sendo escrita */
async function typeIt(){
  const el = $('message'), t = CONFIG.message;
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
  flash(); burst(innerWidth / 2, innerHeight / 2, 160);
  setTimeout(() => burst(innerWidth / 2, innerHeight / 3, 90), 400);
  setTimeout(() => $('secret').scrollIntoView({ behavior: 'smooth' }), 1300);
}

$('sTitle').textContent = CONFIG.secretTitle;
$('sSub').textContent = CONFIG.secretSub;
$('invNames').textContent = (CONFIG.hisName || 'Eu') + ' & ' + CONFIG.herName;
$('invLine').textContent = CONFIG.inviteLine;
$('invDate').textContent = CONFIG.inviteDate;
$('promises').innerHTML = CONFIG.promises.map((t, i) => '<p class="pm rv" style="transition-delay:' + (i * 80) + 'ms">' + esc(t) + '</p>').join('');
if (!CONFIG.rings.length) { $('rTitle').remove(); $('ringGallery').remove(); }
else {
  $('ringGallery').innerHTML = CONFIG.rings.map((r, i) => {
    const media = /\.(mp4|webm|mov)$/i.test(r.src)
      ? '<video src="' + esc(r.src) + '" controls playsinline preload="metadata"></video>'
      : '<img src="' + esc(r.src) + '" alt="' + esc(r.caption || 'Nossas alianças') + '" loading="lazy" onerror="this.parentNode.remove()">';
    return '<figure class="rf rv" style="transition-delay:' + (i * 120) + 'ms">' + media + (r.caption ? '<figcaption>' + esc(r.caption) + '</figcaption>' : '') + '</figure>';
  }).join('');
  let resume = false;
  document.querySelectorAll('.rf video').forEach(v => {
    v.onplay = () => { if (!bgm.paused) { bgm.pause(); resume = true; } };
    v.onpause = () => { if (resume) { bgm.play(); resume = false; } };
  });
}

/* céu estrelado e pétalas */
for (let i = 0; i < 70; i++) {
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

/* selar a promessa */
$('seal').onclick = () => {
  $('seal').disabled = true; flash();
  for (let i = 0; i < 6; i++) setTimeout(() => burst(innerWidth * (.15 + Math.random() * .7), innerHeight * (.25 + Math.random() * .4), 70), i * 380);
  $('sealed').textContent = CONFIG.sealedText; $('sealed').classList.add('show');
};

/* contador: total de horas, minutos, segundos e próximo mêsversário */
const start = new Date(CONFIG.startDate);
const nf = n => Math.floor(n).toLocaleString('pt-BR');
let ease = 0;
function tick(){
  const now = new Date();
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
tick(); setInterval(tick, 1000);

/* galeria: foto inteira com fundo desfocado */
const N = CONFIG.photos.length, DUR = 5000;
let cur = 0, playing = true, timer = null;
$('slides').innerHTML = CONFIG.photos.map((u, i) =>
  '<div class="slide"><img class="bg" src="' + esc(u) + '" alt="" onerror="this.remove()">' +
  '<img class="fg" src="' + esc(u) + '" alt="Foto ' + (i + 1) + ' do casal" onerror="this.remove()"></div>').join('');
CONFIG.photos.forEach((u, i) => {
  const b = document.createElement('button');
  b.type = 'button'; b.setAttribute('aria-label', 'Ver foto ' + (i + 1));
  b.innerHTML = '<img src="' + esc(u) + '" alt="" onerror="this.remove()">';
  b.onclick = () => go(i);
  $('thumbs').appendChild(b);
});
function runBar(){
  const bar = $('bar');
  bar.style.transition = 'none'; bar.style.width = '0';
  clearTimeout(timer);
  if (!playing) return;
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
