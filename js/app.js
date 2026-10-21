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
function burst(x, y, n){
  const cols = ['#ff4d79', '#ff8fab', '#ffd1dc', '#ffffff', '#ffb3c6', '#e0245e'];
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, s = 3 + Math.random() * 12;
    P.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 4, r: 12 + Math.random() * 28,
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
  }), { threshold: .2 });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));
}
$('bigHeart').onclick = e => burst(e.clientX, e.clientY, 60);

/* contador */
const start = new Date(CONFIG.startDate);
function tick(){
  const now = new Date();
  let months = (now.getFullYear() - start.getFullYear()) * 12 + now.getMonth() - start.getMonth();
  let anchor = new Date(start); anchor.setMonth(start.getMonth() + months);
  if (anchor > now) { months--; anchor = new Date(start); anchor.setMonth(start.getMonth() + months); }
  const ms = Math.max(0, now - anchor), rest = ms % 864e5;
  $('cm').textContent = Math.max(0, months);
  $('cd').textContent = Math.floor(ms / 864e5);
  $('ct').textContent = pad(Math.floor(rest / 36e5)) + ':' + pad(Math.floor(rest % 36e5 / 6e4)) + ':' + pad(Math.floor(rest % 6e4 / 1e3));
  $('total').textContent = 'São ' + Math.max(0, Math.floor((now - start) / 864e5)) + ' dias de amor';
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
