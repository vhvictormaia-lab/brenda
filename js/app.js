const $ = id => document.getElementById(id);
const pad = n => String(n).padStart(2, '0');
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmtDate = d => new Date(d).toLocaleDateString('pt-BR', {day:'numeric', month:'long', year:'numeric'});

/* corações flutuando */
for (let i = 0; i < 14; i++) {
  const s = document.createElement('span');
  s.textContent = '♥';
  s.style.left = Math.random() * 100 + '%';
  s.style.fontSize = (12 + Math.random() * 16) + 'px';
  s.style.animationDuration = (12 + Math.random() * 14) + 's';
  s.style.animationDelay = (-Math.random() * 20) + 's';
  $('hearts').appendChild(s);
}

/* carregamento */
const hideLoader = () => { $('loader').classList.add('hide'); $('hero').classList.add('in'); };
setTimeout(hideLoader, 2200);
$('skip').onclick = hideLoader;

/* topo */
$('title').textContent = CONFIG.title;
$('since').textContent = 'Juntos desde ' + fmtDate(CONFIG.startDate);
$('message').textContent = CONFIG.message;
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

/* música (Spotify ou YouTube) */
function embedUrl(u){
  let m = u.match(/spotify\.com\/(?:intl-[a-z]+\/)?track\/([A-Za-z0-9]+)/);
  if (m) return { src: 'https://open.spotify.com/embed/track/' + m[1], h: 152 };
  m = u.match(/(?:youtu\.be\/|v=)([\w-]{11})/);
  if (m) return { src: 'https://www.youtube.com/embed/' + m[1] + '?autoplay=1', h: 220 };
  return null;
}
const emb = CONFIG.musicUrl ? embedUrl(CONFIG.musicUrl) : null;
if (CONFIG.musicFile || emb) {
  $('musicBox').hidden = false;
  $('musicBtn').onclick = () => {
    $('player').innerHTML = CONFIG.musicFile
      ? '<audio controls autoplay loop src="' + esc(CONFIG.musicFile) + '" style="width:100%;margin-top:16px"></audio>'
      : '<iframe src="' + esc(emb.src) + '" height="' + emb.h + '" allow="autoplay; encrypted-media" loading="lazy" title="Nossa música"></iframe>';
    $('musicBtn').style.display = 'none';
  };
}

/* carrossel */
const N = CONFIG.photos.length, DUR = 4000;
let cur = 0, playing = true, timer = null;
$('slides').innerHTML = CONFIG.photos.map((u, i) =>
  '<div class="slide">' + (u ? '<img src="' + esc(u) + '" alt="Foto ' + (i + 1) + ' do casal" onerror="this.remove()">' : '💕') + '</div>').join('');
CONFIG.photos.forEach((u, i) => {
  const b = document.createElement('button');
  b.type = 'button'; b.setAttribute('aria-label', 'Ver foto ' + (i + 1));
  b.innerHTML = u ? '<img src="' + esc(u) + '" alt="" onerror="this.remove()">' : '💗';
  b.onclick = () => go(i);
  $('thumbs').appendChild(b);
});
function runBar(){
  const bar = $('bar');
  bar.style.transition = 'none'; bar.style.width = '0';
  clearTimeout(timer);
  if (!playing) return;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    bar.style.transition = 'width ' + DUR + 'ms linear'; bar.style.width = '100%';
  }));
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
$('car').addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, {passive:true});
$('car').addEventListener('touchend', e => {
  if (sx === null) return;
  const dx = e.changedTouches[0].clientX - sx;
  if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1));
  sx = null;
});
if (N) go(0);
