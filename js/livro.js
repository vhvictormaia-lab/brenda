/* ===================================================================
   O LIVRO DO DIA 10 (mês 2): capa, sumário, castelo, pomba e carta, jornal,
   murais, cabine, lupa, pote, caixinha de música, quebra-cabeça e cadeado.
   Usa as funções do app.js (sfx, burst, flash, vib, tone, noise...).
   Os textos ficam em CONFIG.livro (config.js).
   =================================================================== */
Object.assign(sfx, {
  page(){ if (sfxOk()) noise({ d: .55, type: 'bandpass', f0: 900, f1: 3800, q: .7, v: .2, a: .14 }); },
  thud(){ if (!sfxOk()) return; tone(110, { d: .22, to: 48, v: .5, a: .003 }); noise({ d: .12, type: 'lowpass', f0: 700, v: .35, a: .003 }); },
  clack(){ if (!sfxOk()) return; tone(1500, { d: .12, type: 'square', v: .12, a: .002 }); tone(700, { t: .05, d: .25, type: 'triangle', v: .3, a: .002 }); noise({ d: .06, type: 'highpass', f0: 3000, v: .3, a: .002 }); },
  splash(){ if (!sfxOk()) return; noise({ d: .9, type: 'bandpass', f0: 1800, f1: 400, q: .6, v: .5, a: .01 }); noise({ t: .1, d: 1.1, type: 'lowpass', f0: 900, f1: 200, v: .4, a: .02 }); },
  typek(){ if (sfxOk()) tone(1100 + Math.random() * 500, { d: .035, type: 'square', v: .05, a: .001 }); },
  swoosh(){ if (sfxOk()) noise({ d: .7, type: 'bandpass', f0: 400, f1: 2200, q: .8, v: .22, a: .25 }); },
  march(i){                                   // "entrada da noiva" (Wagner), uma frase por giro da manivela
    if (!sfxOk()) return 0;
    const P = [[[392, .6], [523, 1], [523, .55], [523, 1.3]], [[392, .6], [587, 1], [494, .55], [523, 1.3]],
               [[392, .6], [523, 1], [698, .55], [698, 1.3]], [[659, .6], [587, 1], [523, .55], [587, 1.3], [523, 2]]][i % 4];
    let t = 0;
    P.forEach(([f, d], k) => {
      tone(f, { t, d: d + 1.2, type: 'triangle', v: .26, a: .01 }); tone(f * 2, { t, d: .9, v: .06 }); tone(f * 3, { t, d: .35, v: .03 });
      if (k === 1 || k === P.length - 1) { tone(f / 2, { t, d: d + .8, v: .12 }); tone(f * .75, { t, d: d + .8, v: .07 }); }
      t += d;
    });
    return t;
  }
});

async function livro(c){
  const L = CONFIG.livro || {}, ph = CONFIG.photos || [], P = i => ph[i % Math.max(1, ph.length)] || '';
  const fl = t => String(t || '').replace(/\{nome\}/g, CONFIG.herName);
  const E = esc, ROM = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  const old = $('bk'); if (old) old.remove();
  const root = document.createElement('div'); root.id = 'bk';
  root.innerHTML = '<div class="bkdesk"><div class="bkdust"></div></div><i class="bkcandle" aria-hidden="true">🕯️</i>' +
    '<button class="bkx" id="bkx" type="button">✕ Voltar ao site</button><h2 class="bktitle off" id="bktitle"></h2>' +
    '<div class="bkstage"><div class="bkbook" id="bkbook"><div class="bkbase"></div><div class="bkspread" id="bkspread"><div class="bkL" id="bkL"></div><div class="bkR" id="bkR"></div><i class="bkgut"></i></div></div></div>' +
    '<div class="bkbot"><p class="bkhint" id="bkhint"></p><button class="bknext" id="bknext" type="button"></button></div>';
  document.body.appendChild(root);
  const dust = root.querySelector('.bkdust');
  for (let i = 0; i < 22; i++) { const d = document.createElement('i'); d.style.cssText = 'left:' + Math.random() * 100 + '%;animation-duration:' + (9 + Math.random() * 10) + 's;animation-delay:' + (-Math.random() * 14) + 's;width:' + (2 + Math.random() * 3) + 'px;height:' + (2 + Math.random() * 3) + 'px'; dust.appendChild(d); }
  const sizeIt = () => {
    const iw = innerWidth, ih = innerHeight, top = ih < 520 ? 64 : 104, bot = ih < 520 ? 70 : 100, Hh = Math.max(200, ih - top - bot);
    const pwW = Math.min((iw - 14) / 2, 330), ph2 = Math.min(Hh, pwW * 2.3), pw = Math.min(pwW, ph2 / 2);
    root.style.setProperty('--pw', pw + 'px'); root.style.setProperty('--ph', ph2 + 'px'); root.style.setProperty('--top', top + 'px'); root.style.setProperty('--bot', bot + 'px');
  };
  sizeIt(); addEventListener('resize', sizeIt);
  void root.offsetWidth; root.classList.add('on');
  const bookEl = $('bkbook'), lslot = $('bkL'), rslot = $('bkR'), spread = $('bkspread'), titleEl = $('bktitle'), hintEl = $('bkhint'), nextEl = $('bknext');
  const pend = new Set(), timers = new Set(); let gone = false, curL = null, curR = null, curSpan = null, bgmWas = null;
  const alive = () => c.alive() && !gone;
  const w = async ms => { const t0 = performance.now(); while (alive() && performance.now() - t0 < ms) await sleep(60); };
  const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); if (alive()) fn(); }, ms); timers.add(t); return t; };
  const tap = (el, max) => new Promise(r => {
    let done = false; const f = () => { if (done) return; done = true; el.removeEventListener('click', f); clearTimeout(t); pend.delete(f); r(); };
    el.addEventListener('click', f); const t = max ? setTimeout(f, max) : 0; pend.add(f);
  });
  const mute = () => { if (bgmWas === null) { bgmWas = !bgm.paused; try { bgm.pause(); } catch (e) {} } };
  const unmute = () => { if (bgmWas) { try { bgm.volume = 0; bgm.play().catch(() => {}); let v = 0; const t = setInterval(() => { v = Math.min(.25, v + .02); bgm.volume = v; if (v >= .25) clearInterval(t); }, 120); } catch (e) {} } bgmWas = null; };
  const cleanup = () => { gone = true; removeEventListener('resize', sizeIt); pend.forEach(f => f()); timers.forEach(clearTimeout); unmute(); };
  $('bkx').onclick = () => { cleanup(); root.classList.remove('on'); setTimeout(() => root.remove(), 700); closeDia10(); };
  const div = (cls, html) => { const d = document.createElement('div'); d.className = cls; if (html != null) d.innerHTML = html; return d; };
  const pg = (cls, html) => div('bkpg ' + cls, html);
  const q = (el, sel) => el.querySelector(sel), qa = (el, sel) => el.querySelectorAll(sel);
  const rand = (a, b) => a + Math.random() * (b - a);
  const mesNome = () => MESES[dateOfM(c.m).getMonth()];
  const PW = () => parseFloat(root.style.getPropertyValue('--pw')) || 180, PH = () => parseFloat(root.style.getPropertyValue('--ph')) || 400;
  const setTitle = (rom, t) => { titleEl.classList.add('off'); setTimeout(() => { titleEl.innerHTML = rom ? '<small>' + rom + '</small><b>' + E(t) + '</b>' : ''; if (rom) titleEl.classList.remove('off'); }, 250); };
  const hint = t => { hintEl.classList.remove('on'); if (t) setTimeout(() => { hintEl.textContent = t; hintEl.classList.add('on'); }, 200); };
  const nextBtn = async label => { nextEl.textContent = label || 'Virar a página ➜'; void nextEl.offsetWidth; nextEl.classList.add('on'); await tap(nextEl); nextEl.classList.remove('on'); };
  const glow = () => { bookEl.classList.add('glow'); later(() => bookEl.classList.remove('glow'), 1300); };
  const typeInto = async (el, text, ms, snd) => { el.textContent = ''; for (const ch of text) { if (!alive()) return; el.textContent += ch; if (snd && ch !== ' ') sfx.typek(); await sleep(ms || 30); } };
  const rectC = el => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, r }; };
  const spark = (el, n, sp) => { const p = rectC(el); shoot({ x: p.x, y: p.y, n: n || 14, sx: 8, sy: 7, r: 20, l: 1.8, sp: sp || SPR_GOLD }); };

  /* ---------- motor do livro: duas páginas e folha que vira ---------- */
  const newLeaf = (front, back) => { const lf = div('bkleaf', '<div class="face f"></div><div class="face b"></div>'); if (front) q(lf, '.f').appendChild(front); if (back) q(lf, '.b').appendChild(back); return lf; };
  async function turn(spec, leaf0){
    if (curSpan) { const s = curSpan; curSpan = null; s.classList.remove('in'); s.classList.add('out'); hint(''); await w(420); s.remove(); }
    const lf = leaf0 || newLeaf(curR, spec.L);
    if (leaf0 && spec.L) q(lf, '.b').appendChild(spec.L);
    if (spec.R) rslot.appendChild(spec.R);
    if (!leaf0) spread.appendChild(lf);
    later(() => spec.L && spec.L.classList.add('ent'), 520); later(() => spec.R && spec.R.classList.add('ent'), 760);
    sfx.page(); vib(15); void lf.offsetWidth; lf.classList.add('go');
    later(() => { const r = spread.getBoundingClientRect(); shoot({ x: r.left + r.width / 2, y: r.top + r.height * .55, n: 12, sx: 9, sy: 8, r: 18, l: 1.6, sp: SPR_GOLD }); }, 380);
    await w(1280);
    lslot.innerHTML = ''; if (spec.L) lslot.appendChild(spec.L); lf.remove(); curL = spec.L; curR = spec.R;
    if (spec.span) { curSpan = spec.span; spread.appendChild(spec.span); void spec.span.offsetWidth; spec.span.classList.add('in'); }
  }
  const place = spec => {         // mostra a dupla direto (usado ao começar por uma página de teste)
    lslot.innerHTML = ''; rslot.innerHTML = ''; if (spec.L) lslot.appendChild(spec.L); if (spec.R) rslot.appendChild(spec.R); curL = spec.L; curR = spec.R;
    [spec.L, spec.R].forEach(p => p && p.classList.add('ent'));
    if (spec.span) { curSpan = spec.span; spread.appendChild(spec.span); void spec.span.offsetWidth; spec.span.classList.add('in'); }
  };
  const stars = () => Array.from({ length: 40 }, () => '<i style="left:' + rand(0, 100) + '%;top:' + rand(0, 70) + '%;animation-delay:' + rand(0, 3) + 's"></i>').join('');

  /* ===================== construção de cada dupla de páginas ===================== */
  const dateTxt = '10 de ' + mesNome() + ' de ' + dateOfM(c.m).getFullYear();
    const castleSvg = () => {
    let ticks = ''; for (let i = 0; i < 12; i++) { const a = i * 30 * Math.PI / 180, r1 = i % 3 ? 25 : 22, r2 = 28; ticks += '<line x1="' + (150 + Math.sin(a) * r1).toFixed(1) + '" y1="' + (150 - Math.cos(a) * r1).toFixed(1) + '" x2="' + (150 + Math.sin(a) * r2).toFixed(1) + '" y2="' + (150 - Math.cos(a) * r2).toFixed(1) + '" stroke="#6b4a1e" stroke-width="' + (i % 3 ? 1.2 : 2.2) + '"/>'; }
    let cren = ''; for (let i = 0; i < 9; i++) cren += '<rect x="' + (40 + i * 24.4) + '" y="198" width="14" height="14" fill="#5d4d73"/>';
    return '<svg viewBox="0 0 300 380" aria-hidden="true"><defs><radialGradient id="cgl" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffd98a" stop-opacity=".9"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></radialGradient></defs>' +
      '<path d="M0 300 Q60 260 130 290 T300 280 V380 H0Z" fill="#2c1f3d"/><circle class="cs-aura" cx="150" cy="150" r="90" fill="url(#cgl)"/>' +
      '<rect x="40" y="212" width="220" height="92" fill="#5d4d73"/>' + cren +
      '<rect x="36" y="150" width="56" height="154" fill="#6b5b7a"/><polygon points="30,150 64,98 98,150" fill="#b0364f"/><line x1="64" y1="98" x2="64" y2="80" stroke="#d9b25f" stroke-width="2"/><path d="M64 80 l16 5 -16 5z" fill="#ffd98a"/>' +
      '<rect x="208" y="150" width="56" height="154" fill="#6b5b7a"/><polygon points="202,150 236,98 270,150" fill="#b0364f"/><line x1="236" y1="98" x2="236" y2="80" stroke="#d9b25f" stroke-width="2"/><path d="M236 80 l16 5 -16 5z" fill="#ffd98a"/>' +
      '<rect x="108" y="70" width="84" height="236" fill="#7a6a8c"/><polygon points="98,72 150,10 202,72" fill="#c13c58"/><line x1="150" y1="10" x2="150" y2="-4" stroke="#d9b25f" stroke-width="2"/><path d="M150 -4 l18 6 -18 6z" fill="#ffd98a"/>' +
      '<rect x="128" y="78" width="44" height="40" rx="22" fill="#1c1230"/><g class="cs-bell"><path d="M-12 22 C-12 8 -8 0 0 0 C8 0 12 8 12 22 L16 27 H-16 Z" transform="translate(150,84)" fill="#e8b84a" stroke="#a97d1c" stroke-width="1.2"/><circle cx="150" cy="112" r="3.6" fill="#a97d1c"/></g>' +
      '<circle cx="150" cy="150" r="33" fill="#f8f0dc" stroke="#d9b25f" stroke-width="4"/>' + ticks +
      '<line id="csM" x1="150" y1="150" x2="150" y2="127" stroke="#3b2a1a" stroke-width="2.4" stroke-linecap="round"/><line id="csH" x1="150" y1="150" x2="150" y2="136" stroke="#3b2a1a" stroke-width="3.6" stroke-linecap="round"/><circle cx="150" cy="150" r="3.2" fill="#b0364f"/>' +
      '<path d="M132 304 V268 Q150 244 168 268 V304Z" fill="#241636"/>' +
      '<rect x="52" y="176" width="9" height="16" rx="4" fill="#ffd98a"/><rect x="224" y="176" width="9" height="16" rx="4" fill="#ffd98a"/><rect x="52" y="236" width="9" height="14" rx="4" fill="#ffd98a" opacity=".8"/><rect x="224" y="236" width="9" height="14" rx="4" fill="#ffd98a" opacity=".8"/><rect x="144" y="196" width="12" height="18" rx="6" fill="#ffd98a" opacity=".85"/>' +
      '<path d="M0 304 H300 V380 H0Z" fill="#1d1430"/></svg>';
  };
  const jarSvg = '<svg viewBox="0 0 200 250">' +
        '<defs><linearGradient id="jg" x1="0" x2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".55"/><stop offset=".5" stop-color="#ffffff" stop-opacity=".08"/><stop offset="1" stop-color="#ffffff" stop-opacity=".3"/></linearGradient><clipPath id="jc"><path d="M50 70 Q28 78 28 108 V206 Q28 236 58 236 H142 Q172 236 172 206 V108 Q172 78 150 70Z"/></clipPath></defs>' +
        '<g clip-path="url(#jc)">' + Array.from({ length: 46 }, (_, i) => { const cl = ['#ff8fa8', '#ffd166', '#8fd3ff', '#b8e986', '#d9a6ff', '#ffb38a', '#ff6b8e'][i % 7], x = 34 + (i * 37) % 130, y = 92 + (i * 53) % 138, r = (i * 47) % 160 - 80; return '<rect x="' + x + '" y="' + y + '" width="26" height="16" rx="2" fill="' + cl + '" transform="rotate(' + r + ' ' + (x + 13) + ' ' + (y + 8) + ')"/>'; }).join('') + '</g>' +
        '<path d="M50 70 Q28 78 28 108 V206 Q28 236 58 236 H142 Q172 236 172 206 V108 Q172 78 150 70Z" fill="url(#jg)" stroke="#fff" stroke-opacity=".7" stroke-width="3"/><rect x="52" y="44" width="96" height="26" rx="6" fill="#c8924f"/><rect x="52" y="44" width="96" height="9" rx="4" fill="#dcae6f"/><path d="M42 100 Q40 150 46 200" stroke="#fff" stroke-opacity=".7" stroke-width="5" fill="none" stroke-linecap="round"/></svg>';
  const LOCKHTML = '<svg class="lk-svg" viewBox="0 0 360 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d1b52"/><stop offset=".45" stop-color="#c2527a"/><stop offset=".72" stop-color="#ffb36b"/><stop offset="1" stop-color="#ffd8a0"/></linearGradient><linearGradient id="rv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9a6b"/><stop offset="1" stop-color="#3b2a63"/></linearGradient></defs><rect width="360" height="640" fill="url(#sk)"/><circle cx="250" cy="330" r="44" fill="#fff2c4" opacity=".85"/>' +
        '<g fill="#3a2350"><path d="M250 186 L252.2 232 L247.8 232Z"/><path d="M246 232 H254 L259 292 H241Z"/><rect x="238" y="290" width="24" height="5"/><path d="M241 295 H259 L264 326 H236Z"/><rect x="229" y="324" width="42" height="6"/><path d="M231 330 H243 L248 350 Q250 345 252 350 L257 330 H269 L279 372 H265 L259 352 Q250 342 241 352 L235 372 H221Z"/></g>' +
        '<path d="M0 372 H360 V392 H0Z" fill="#2b1a42"/><rect x="0" y="392" width="360" height="248" fill="url(#rv)"/></svg>' +
        '<div class="lk-river"><i></i><i></i><i></i><i></i></div><div class="lk-rip"><b></b><b></b><b></b></div>' +
        '<div class="lk-rail"><div class="lk-bars">' + Array.from({ length: 14 }, () => '<i></i>').join('') + '</div><div class="lk-small">' + Array.from({ length: 22 }, (_, i) => '<s style="left:' + (2 + (i * 4.4) % 94) + '%;top:' + (i % 3) * 14 + 'px;background:' + ['#d9b25f', '#c0392b', '#8fd3ff', '#b8e986', '#d9a6ff', '#ff8fa8'][i % 6] + '"></s>').join('') + '</div></div>' +
        '<div class="lk-lock"><svg viewBox="0 0 120 150"><path class="lk-sh" d="M32 66 V44 a28 28 0 0 1 56 0 V66" fill="none" stroke="#c9d1d9" stroke-width="12" stroke-linecap="round"/><rect x="14" y="62" width="92" height="76" rx="14" fill="#f0c04e" stroke="#a97d1c" stroke-width="4"/><rect x="14" y="62" width="92" height="22" rx="12" fill="#ffe08a" opacity=".6"/><text x="60" y="112" text-anchor="middle" font-size="19" font-family="Fraunces,serif" font-style="italic" fill="#7a4a10">' + E(L.lockInitials) + '</text></svg></div>' +
        '<button class="lk-key" type="button" aria-label="chave">🗝️</button><div class="lk-tb"><p class="lk-t"></p><cite class="lk-ref"></cite></div>';
  const envHTML = '<div class="lt-env hold"><i class="e-back"></i><i class="e-paper"></i><i class="e-front"></i><i class="e-flap"></i><i class="e-seal">♥</i></div>';
  const N = L.news || {}, MU = L.mural || [], BT = L.booth || [];
  const rot = ['-4deg', '3deg', '-2.5deg', '4deg', '-3.5deg', '2deg'];

  const sCover = () => {
    const cov = pg('cov pr', '<div class="cvf"><small>' + E(L.coverKicker) + '</small><div class="cvph"><img alt="" src="' + E(P(L.coverPhoto || 0)) + '"></div><h1>' + E(L.coverTitle) + '</h1><h4>' + E(L.coverSub) + '</h4><p>' + E(fl(L.coverPhrase)) + '</p><button class="cvbtn" type="button">Toque para abrir</button></div>');
    return cov;
  };
  const sToc = () => ({
    L: pg('pl', '<div class="ded"><i class="orn stg">✦</i><small class="stg">' + E(L.coverKicker) + '</small><h3 class="stg">Para a ' + E(CONFIG.herName) + '</h3><p class="stg">Que o nosso amor seja escrito por Deus, página por página.</p><span class="ring stg">💍</span><em class="stg">' + E(CONFIG.hisName || 'Victor') + '<br>' + E(dateTxt) + '</em></div>'),
    R: pg('pr', '<h3 class="stg">' + E(L.tocTitle) + '</h3><ol class="toc">' + (L.toc || []).map((t, i) => '<li><b>' + ROM[i] + '</b><span>' + E(t) + '</span><i></i><em>' + (i + 2) + '</em></li>').join('') + '</ol>'),
    title: ['', ''], run: rToc
  });
  const sCastle = () => {
    const s = div('bkspan castle', '<div class="cs-stars">' + stars() + '</div><div class="cs-cam">' + castleSvg() + '</div><div class="cs-date"><span class="cs-mo"></span><b class="cs-d">1</b></div><div class="cs-verse"><q></q><cite></cite></div>');
    return { L: pg('pl', ''), R: pg('pr', ''), span: s, title: [ROM[0], L.castleTitle], run: rCastle };
  };
  const sLetter = () => {
    const s = div('bkspan letter', '<i class="lt-cloud" style="top:6%;left:0;animation-delay:-6s">☁️</i><i class="lt-cloud" style="top:20%;left:0;font-size:1.9em;animation-delay:-16s">☁️</i><span class="lt-dove">' + DOVE_SVG + envHTML + '</span><div class="lt-table"></div>' +
      '<div class="lt-card"><div class="rd-in">' + (L.riddle || []).map(l => '<p class="rd-l">' + E(l) + '</p>').join('') + '<p class="rd-q">' + E(L.riddleAsk) + '</p><button class="rd-b" type="button">Revelar a resposta</button><p class="rd-a">' + E(fl(L.riddleAnswer)) + '</p></div></div>');
    return { L: pg('pl', ''), R: pg('pr', ''), span: s, title: [ROM[1], L.letterTitle], run: rLetter };
  };
  const sNews = () => ({
    L: pg('pl news', '<div class="npi"><div class="np-top">' + E(N.line) + '</div><h2 class="np-name">' + E(N.name) + '</h2><div class="np-rule"></div><div class="np-h"></div><p class="np-sub">' + E(N.sub) + '</p><figure class="np-ph"><i class="np-stamp">' + E(N.stamp) + '</i><img alt="" src="' + E(P(N.photo)) + '"><figcaption>' + E(N.cap) + '</figcaption></figure></div>'),
    R: pg('pr news', '<div class="npi">' + (N.cols || []).map(t => '<p class="np-c">' + E(t) + '</p>').join('') + '<div class="np-box"><b>' + E((N.box || [])[0]) + '</b><span>' + E((N.box || [])[1]) + '</span></div><div class="np-cl"><b>' + E((N.class || [])[0]) + '</b><span>' + E((N.class || [])[1]) + '</span></div><p class="np-ft">' + E(N.foot) + '</p></div>'),
    title: [ROM[2], (L.toc || [])[2] || 'Extra! Extra!'], run: rNews
  });
  const polHTML = (m, i) => '<figure class="pn" style="--r:' + rot[i % 6] + '" data-t="' + E(m.t) + '"><i class="pin"></i><img alt="" loading="eager" src="' + E(P(m.p)) + '"><figcaption>' + E(m.t) + '</figcaption></figure>';
  const sMural = () => ({
    L: pg('pl cork', MU.slice(0, 3).map((m, i) => polHTML(m, i)).join('')), R: pg('pr cork', MU.slice(3, 6).map((m, i) => polHTML(m, i + 3)).join('')),
    title: [ROM[3], L.muralTitle], run: rMural
  });
  const sBooth = () => ({
    L: pg('pl curtain', '<div class="bt-m"><div class="bt-sign">FOTOS</div><div class="bt-lens"><div class="bt-cd">…</div></div><div class="bt-lamp"></div></div><p class="bt-msg">Sorria!<br>A cabine vai tirar 4 fotos 📸</p>'),
    R: pg('pr curtain', '<div class="bt-slot"></div><div class="bt-out"><div class="bt-strip">' + BT.map(i => '<div class="bt-f"><img alt="" src="' + E(P(i)) + '"></div>').join('') + '<small>' + E(L.boothSign) + '</small></div></div>'),
    title: [ROM[4], L.boothTitle], run: rBooth
  });
  const sMeaning = () => ({
    L: pg('pl', '<i class="mn-orn stg">❦</i><h1 class="mn-w stg">' + E(L.meaningWord) + '</h1><p class="mn-pr stg">' + E(L.meaningPron) + '</p><p class="mn-cap stg">Passe a lupa na página ao lado 🔍</p>'),
    R: pg('pr', '<div class="mn-box"><div class="mn-t">' + E(fl(L.meaningText)) + '</div><div class="mn-t mn-z">' + E(fl(L.meaningText)) + '</div><div class="mn-lens"></div></div><p class="mn-end">' + E(fl(L.meaningEnd)) + '</p>'),
    title: [ROM[5], L.meaningTitle], run: rMeaning
  });
  const sJar = () => ({
    L: pg('pl jarpg', '<button class="jr-jar" type="button" aria-label="pote">' + jarSvg + '</button><p class="jr-cnt"></p>'),
    R: pg('pr jarpg', '<div class="jr-card"><p></p></div><p class="jr-ph">As mensagens do pote aparecem aqui 💌</p>'),
    title: [ROM[6], L.jarTitle], run: rJar
  });
  const sBox = () => ({
    L: pg('pl night', '<div class="bx-body"><div class="bx-lid"></div><div class="bx-disc"></div><span class="bx-couple">👰🤵</span><div class="bx-front"><i></i><i></i><i></i><i></i><i></i></div><button class="bx-crank" type="button" aria-label="manivela"><i></i></button></div>'),
    R: pg('pr night', '<div class="bx-msg"><p></p></div><span class="bx-idle">🎼</span>'),
    title: [ROM[7], L.boxTitle], run: rBox
  });
  const sPuzzle = () => ({
    L: pg('pl', '<span class="pz-pile">🧩</span>'), R: pg('pr ov', '<div class="pz-b"></div><p class="pz-end">' + E(fl(L.puzzleEnd)) + '</p>'),
    title: [ROM[8], L.puzzleTitle], run: rPuzzle, ov: true
  });
  const sLock = () => {
    const s = div('bkspan lock', LOCKHTML);
    return { L: pg('pl', ''), R: pg('pr', ''), span: s, title: [ROM[9], L.lockTitle], run: rLock, last: true };
  };

  /* ===================== o que acontece em cada dupla ===================== */
  async function rToc(sp){
    const items = qa(sp.R, '.toc li'); await w(1100);
    for (let i = 0; i < items.length; i++) { if (!alive()) return; items[i].classList.add('on'); sfx.click(); await w(320); }
    sfx.harp([523, 659, 784, 1047], .14); glow(); await w(900);
  }
  async function rCastle(sp){
    const S = sp.span, svg = q(S, 'svg'), cam = q(S, '.cs-cam'), hh = q(svg, '#csH'), mm = q(svg, '#csM'), dEl = q(S, '.cs-d'), dBox = q(S, '.cs-date'), bell = q(svg, '.cs-bell'), vs = q(S, '.cs-verse');
    cam.style.transformOrigin = '50% 39.5%'; q(S, '.cs-mo').textContent = mesNome();
    await w(1300); cam.style.transform = 'scale(2.15)'; sfx.swoosh(); await w(2700); if (!alive()) return;
    dBox.classList.add('on');
    const N = 10, perDay = 760, t0 = performance.now(); let lastDay = 0;
    while (alive()) {
      const t = performance.now() - t0, p = Math.min(1, t / (N * perDay)), day = Math.min(N, 1 + Math.floor(t / perDay)), hr = p * N * 2 * 360;
      hh.setAttribute('transform', 'rotate(' + hr + ' 150 150)'); mm.setAttribute('transform', 'rotate(' + hr * 12 + ' 150 150)');
      if (day !== lastDay) { lastDay = day; dEl.textContent = day; dEl.classList.remove('pop'); void dEl.offsetWidth; dEl.classList.add('pop'); sfx.tick(); if (day === N) dBox.classList.add('gold'); }
      if (p >= 1) break; await sleep(30);
    }
    if (!alive()) return;
    hh.setAttribute('transform', 'rotate(0 150 150)'); mm.setAttribute('transform', 'rotate(0 150 150)');
    flash(); vib([100, 60, 100]); S.classList.add('glow'); glow();
    for (let i = 0; i < 4; i++) {
      if (!alive()) return;
      bell.classList.remove('sw'); void bell.getBoundingClientRect(); bell.classList.add('sw');
      sfx.bell(i % 2 ? 196 : 247, 0, .34); sfx.bell((i % 2 ? 196 : 247) * 2, .02, .1); const r = rectC(S); burst(r.x, r.r.top + r.r.height * .22, 18, true); vib(40);
      await w(1350);
    }
    cam.style.transform = 'scale(1.25)'; await w(900);
    q(vs, 'q').textContent = L.castleVerse[0]; q(vs, 'cite').textContent = L.castleVerse[1];
    vs.classList.add('on'); sfx.pad(262); sfx.harp([523, 659, 784, 1047], .18); await w(6800);
  }
  async function rLetter(sp){
    const sc = sp.span, dv = q(sc, '.lt-dove'), env = q(sc, '.lt-env'), card = q(sc, '.lt-card');
    await w(500);
    const sw = sc.clientWidth, sh = sc.clientHeight, tableY = sh * .6;
    dv.style.display = 'block'; dv.style.left = '0px'; dv.style.top = sh * .1 + 'px';
    const flap = setInterval(() => sfx.flap(), 460); timers.add(flap);
    const dw = dv.offsetWidth || 110;
    await dv.animate([{ transform: 'translateX(' + (-dw * 1.4) + 'px)' }, { transform: 'translateX(' + (sw * .5 - dw * .5) + 'px)' }], { duration: 3800, easing: 'ease-out', fill: 'forwards' }).finished;
    if (!alive()) return;
    { const er = env.getBoundingClientRect(), sr = sc.getBoundingClientRect(), k = sc.clientWidth / (sr.width || 1); sc.appendChild(env); env.classList.remove('hold'); env.style.left = (er.left - sr.left) * k + 'px'; env.style.top = (er.top - sr.top) * k + 'px'; } sfx.swoosh();
    dv.animate([{ transform: 'translate(' + (sw * .5 - dw * .5) + 'px,0)' }, { transform: 'translate(' + (sw + dw) + 'px,-' + sh * .25 + 'px)' }], { duration: 3000, easing: 'ease-in', fill: 'forwards' }).finished.then(() => { clearInterval(flap); dv.remove(); });
    const top0 = parseFloat(env.style.top), drop = tableY - top0;
    await env.animate([{ transform: 'translateY(0) rotate(0)' }, { transform: 'translateY(' + drop * .9 + 'px) rotate(210deg)', offset: .7 }, { transform: 'translateY(' + drop + 'px) rotate(190deg)' }], { duration: 1300, easing: 'cubic-bezier(.4,0,.8,.6)', fill: 'forwards' }).finished;
    if (!alive()) return;
    env.getAnimations().forEach(a => a.cancel()); env.style.top = tableY + 'px'; env.style.transform = 'rotate(-6deg)';
    sfx.thud(); vib(40); { const p = rectC(env); burst(p.x, p.y, 14, true); }
    env.animate([{ transform: 'translateY(-1.2em) rotate(-6deg)' }, { transform: 'translateY(0) rotate(-6deg)' }], { duration: 280, easing: 'ease-out' });
    await w(1200);
    hint('Toque na carta ✉️'); env.classList.add('pulse');
    await tap(env, 9000);
    env.classList.remove('pulse'); hint('');
    env.classList.add('open'); sfx.pop(); sfx.chime(.2); await w(900);
    card.style.display = 'flex';
    const r0 = env.getBoundingClientRect(), r1 = card.getBoundingClientRect();
    card.animate([{ transform: 'translate(' + (r0.left + r0.width / 2 - r1.left - r1.width / 2) + 'px,' + (r0.top - r1.top - r1.height / 2 + 10) + 'px) scale(.2) rotate(-8deg)', opacity: 0 }, { opacity: 1, offset: .3 }, { transform: 'none', opacity: 1 }], { duration: 1100, easing: 'cubic-bezier(.2,.9,.3,1)', fill: 'both' });
    env.style.opacity = 0; sfx.whoosh(); shoot({ x: r0.left + r0.width / 2, y: r0.top, n: 14, sx: 7, sy: 6, r: 18, l: 1.6, sp: SPR_GOLD });
    await w(1300);
    const lines = qa(card, '.rd-l');
    for (let i = 0; i < lines.length; i++) { if (!alive()) return; lines[i].classList.add('on'); sfx.note(i); await w(1500); }
    const ask = q(card, '.rd-q'), ans = q(card, '.rd-a'), btn = q(card, '.rd-b');
    ask.classList.add('on'); vib(30); await w(900); btn.classList.add('on');
    await tap(btn, 25000); btn.remove();
    ans.classList.add('on'); sfx.harp([523, 659, 784, 1047, 1319], .14); flash(); burst(W / 2, H * .5, 50); await w(3500);
  }
  async function rNews(sp){
    const a = q(sp.L, '.npi'), b = q(sp.R, '.npi');
    await w(500); sfx.whoosh(); a.classList.add('in'); await w(500); sfx.whoosh(); b.classList.add('in'); await w(800); sfx.thud(); vib(40);
    await typeInto(q(sp.L, '.np-h'), N.head, 26, true); await w(250);
    q(sp.L, '.np-sub').classList.add('on'); await w(800);
    q(sp.L, '.np-ph').classList.add('on'); sfx.shutter(); await w(500); q(sp.L, '.np-stamp').classList.add('on'); sfx.clack(); vib(30); await w(600);
    qa(sp.R, '.np-c, .np-box, .np-cl, .np-ft').forEach((e, i) => later(() => { e.classList.add('on'); sfx.tick(); }, i * 600));
    await w(5200);
  }
  async function rMural(sp){
    const all = [...qa(sp.L, '.pn'), ...qa(sp.R, '.pn')], big = div('mu-big'); root.appendChild(big);
    const order = [0, 3, 1, 4, 2, 5];
    await w(500); hint('');
    for (const i of order) {
      if (!alive()) return; const p = all[i], rv = p.style.getPropertyValue('--r').trim() || '0deg', side = i < 3 ? -1 : 1;
      p.animate([{ transform: 'translate(' + side * 30 + '%,-150%) rotate(' + side * 50 + 'deg) scale(.6)', opacity: 0 }, { opacity: 1, offset: .2 }, { transform: 'translateY(8%) rotate(' + rv + ') scale(1.07)', offset: .72 }, { transform: 'rotate(' + rv + ') scale(1)', opacity: 1 }], { duration: 950, easing: 'cubic-bezier(.3,.7,.3,1)', fill: 'both' });
      later(() => { sfx.pop(); vib(15); spark(p, 6, SPR_BLOOM); }, 720); await w(560);
    }
    await w(700); sfx.harp([659, 784, 988, 1319], .13); glow(); hint('Toque nas fotos 💞');
    all.forEach(p => { p.onclick = () => { big.innerHTML = '<img alt="" src="' + E(q(p, 'img').src) + '"><b>' + E(p.dataset.t) + '</b>'; big.classList.add('on'); sfx.click(); vib(20); burst(W / 2, H * .5, 14, true); }; });
    big.onclick = () => { big.classList.remove('on'); sfx.pop(); };
    await w(4500); sp.cleanupBig = () => big.remove();
  }
  async function rBooth(sp){
    const cd = q(sp.L, '.bt-cd'), lamp = q(sp.L, '.bt-lamp'), msg = q(sp.L, '.bt-msg'), strip = q(sp.R, '.bt-strip'), out = q(sp.R, '.bt-out');
    const run = async first => {
      strip.classList.remove('col'); strip.style.transition = 'none'; strip.style.transform = 'translateY(-101%)'; void strip.offsetWidth;
      for (let i = 0; i < 4; i++) {
        msg.innerHTML = 'Foto ' + (i + 1) + ' de 4<br>Faça uma pose! 😍';
        for (const n of ['3', '2', '1']) { if (!alive()) return; cd.textContent = n; cd.classList.remove('pop'); void cd.offsetWidth; cd.classList.add('pop'); sfx.tick(); await w(first && i === 0 ? 700 : 380); }
        cd.textContent = '📸'; lamp.classList.add('on'); flash(); sfx.shutter(); vib(30); await w(200); lamp.classList.remove('on');
      }
      cd.textContent = '💖'; msg.innerHTML = 'Revelando…'; sfx.whoosh(); await w(500);
      strip.style.transition = 'transform 3.6s cubic-bezier(.3,.6,.3,1)'; strip.style.transform = 'translateY(0)';
      const iv = setInterval(() => { if (alive()) sfx.tick(); }, 260); timers.add(iv); await w(3700); clearInterval(iv);
      strip.classList.add('col'); msg.innerHTML = 'Ficou lindo! 💕'; sfx.harp([784, 988, 1175, 1568], .12); spark(out, 16, SPR_BLOOM); glow(); await w(1300);
    };
    await w(600); await run(true); if (!alive()) return;
    hint('Toque na tira para tirar de novo 📸'); let again = 0;
    strip.onclick = async () => { if (again) return; again = 1; hint(''); await run(false); again = 0; hint('Toque na tira para tirar de novo 📸'); };
    await w(3500);
  }
  async function rMeaning(sp){
    const box = q(sp.R, '.mn-box'), zoom = q(sp.R, '.mn-z'), lens = q(sp.R, '.mn-lens'), end = q(sp.R, '.mn-end'), base = q(sp.R, '.mn-t');
    await w(1400);
    const R = PW() * .3, K = 2.3, th = base.offsetHeight; box.style.height = th + 8 + 'px';
    let bw = box.clientWidth, bh = box.clientHeight, x = R, y = th / 2, drag = false;
    const put = (nx, ny) => { x = Math.max(R * .3, Math.min(bw - R * .3, nx)); y = Math.max(0, Math.min(bh, ny));
      lens.style.left = x - R + 'px'; lens.style.top = y - R + 'px'; zoom.style.transformOrigin = x + 'px ' + y + 'px'; zoom.style.clipPath = 'circle(' + R / K + 'px at ' + x + 'px ' + y + 'px)'; };
    zoom.style.transform = 'scale(' + K + ')'; lens.style.width = lens.style.height = R * 2 + 'px'; put(R * .4, th * .3); lens.classList.add('on'); zoom.classList.add('on'); sfx.sparkle();
    const bands = Math.max(1, Math.ceil(th / (R / K * 2 * .8))); let stop = false;
    const loc = e => { const r = box.getBoundingClientRect(); return [(e.clientX - r.left) * (bw / (r.width || 1)), (e.clientY - r.top) * (bh / (r.height || 1))]; };
    box.addEventListener('pointerdown', e => { drag = true; stop = true; put(...loc(e)); hint(''); });
    addEventListener('pointermove', e => { if (drag) put(...loc(e)); });
    addEventListener('pointerup', () => { drag = false; });
    for (let b = 0; b < bands && alive() && !stop; b++) {
      const yy = th * (b + .5) / bands, a = b % 2 ? bw - R * .3 : R * .3, z = b % 2 ? R * .3 : bw - R * .3, dur = 4600, t0 = performance.now();
      while (alive() && !stop) { const p = Math.min(1, (performance.now() - t0) / dur); put(a + (z - a) * p, yy); if (p >= 1) break; await sleep(30); }
    }
    hint('Arraste a lupa 🔍'); await w(stop ? 9000 : 2200);
    end.classList.add('on'); sfx.harp([523, 659, 784, 1047], .16); burst(W * .7, H * .75, 30); glow(); await w(3200);
  }
  async function rJar(sp){
    const jar = q(sp.L, '.jr-jar'), cnt = q(sp.L, '.jr-cnt'), card = q(sp.R, '.jr-card');
    const MS = L.jar || []; let bag = [], taps = 0, busy = false, last = -1, done = false;
    const draw = () => { if (!bag.length) { bag = MS.map((_, i) => i).sort(() => Math.random() - .5); if (bag[bag.length - 1] === last) bag.reverse(); } last = bag.pop(); return MS[last]; };
    await w(700); jar.classList.add('in'); sfx.pop(); await w(900); hint(L.jarHint);
    jar.onclick = async () => {
      if (busy) return; busy = true; taps++; sfx.pop(); vib(25); jar.classList.remove('shk'); void jar.offsetWidth; jar.classList.add('shk');
      const slip = document.createElement('i'); slip.className = 'slip'; slip.style.background = ['#ff8fa8', '#ffd166', '#8fd3ff', '#b8e986', '#d9a6ff', '#ffb38a'][Math.floor(Math.random() * 6)];
      const host = sp.R; host.appendChild(slip);
      const jx = jar.offsetLeft + jar.offsetWidth / 2 - PW(), jy = jar.offsetTop + jar.offsetHeight * .35;       // pote (página esquerda) em coordenadas da direita
      slip.style.left = jx + 'px'; slip.style.top = jy + 'px';
      sfx.whoosh(); spark(jar, 10, SPR_BLOOM);
      const tx = card.offsetLeft + card.offsetWidth / 2 - jx - 14, ty = card.offsetTop + card.offsetHeight / 2 - jy;
      await slip.animate([{ transform: 'translate(0,0) rotate(0) scale(.6)', opacity: 0 }, { opacity: 1, offset: .15 }, { transform: 'translate(' + tx * .5 + 'px,' + (ty - 60) + 'px) rotate(200deg) scale(1.5)', offset: .55 }, { transform: 'translate(' + tx + 'px,' + ty + 'px) rotate(360deg) scale(1.1)', opacity: 1 }], { duration: 850, easing: 'ease-in-out', fill: 'forwards' }).finished;
      slip.remove(); if (!alive()) return;
      card.classList.remove('on'); void card.offsetWidth; q(card, 'p').textContent = fl(draw()); card.classList.add('on'); q(sp.R, '.jr-ph').style.opacity = 0; sfx.chime(); sfx.harp([659, 784, 988], .1); burst(W * .7, H * .4, 22);
      if (taps <= 2) { cnt.textContent = taps === 1 ? 'Mais 1 toque ✨' : ''; hint(''); }
      if (taps === 2) { later(() => { hint(L.jarJoke); cnt.textContent = '∞ mensagens'; sfx.sparkle(); flash(); done = true; }, 1400); }
      else if (taps > 2) { cnt.textContent = taps + ' abertas · ∞'; }
      busy = false;
    };
    while (alive() && !done) await sleep(120);
    await w(2500);
  }
  async function rBox(sp){
    const crank = q(sp.L, '.bx-crank'), cloud = q(sp.R, '.bx-msg'), couple = q(sp.L, '.bx-couple');
    mute(); const M = L.boxMsgs || []; let n = 0, busy = false, done = false;
    await w(900); hint(L.boxHint); crank.classList.add('on');
    const noteFloat = () => { for (let i = 0; i < 6; i++) later(() => { const s = document.createElement('i'); s.className = 'nt'; s.textContent = ['♪', '♫', '♬', '💍'][i % 4]; s.style.left = rand(15, 80) + '%'; sp.R.appendChild(s); setTimeout(() => s.remove(), 3500); }, i * 350); };
    crank.onclick = async () => {
      if (busy) return; busy = true; hint(''); crank.classList.remove('spin'); void crank.offsetWidth; crank.classList.add('spin'); couple.classList.add('turn'); vib(25);
      const dur = sfx.march(n) * 1000 || 4200; cloud.classList.remove('on'); sfx.pop(); noteFloat(); await w(900);
      q(cloud, 'p').textContent = fl(M[n % M.length]); cloud.classList.add('on'); sfx.sparkle(); glow();
      await w(Math.max(1500, dur - 900)); couple.classList.remove('turn'); crank.classList.remove('spin'); n++;
      if (n >= 4) done = true; hint(n >= 4 ? 'Gire de novo se quiser 🎶' : 'Gire de novo 🎶'); busy = false;
    };
    while (alive() && !done) await sleep(150);
    await w(3600);
  }
  async function rPuzzle(sp){
    const brd = q(sp.R, '.pz-b'), end = q(sp.R, '.pz-end');
    const src = P(L.puzzlePhoto != null ? L.puzzlePhoto : 3), img = new Image(); img.src = src; await new Promise(r => { img.onload = img.onerror = r; setTimeout(r, 3000); });
    const Cw = brd.clientWidth, Ch = brd.clientHeight, iw = img.naturalWidth || 3, ih = img.naturalHeight || 4;
    const bgW = Math.max(Cw, Ch * iw / ih), bgH = bgW * ih / iw, offX = (bgW - Cw) / 2, offY = (bgH - Ch) * .18, pw = Cw / 3, ph2 = Ch / 3, pcs = [], pwp = PW();
    const SLOTS = [[.72, .14], [.3, .2], [.5, .36], [.74, .42], [.26, .5], [.52, .62], [.76, .7], [.3, .78], [.58, .86]].sort(() => Math.random() - .5);
    for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) {
      const d = document.createElement('i'); d.className = 'pz';
      d.style.cssText = 'left:' + k * pw + 'px;top:' + r * ph2 + 'px;width:' + pw + 'px;height:' + ph2 + 'px;background-image:url("' + src + '");background-size:' + bgW + 'px ' + bgH + 'px;background-position:-' + (k * pw + offX) + 'px -' + (r * ph2 + offY) + 'px';
      const cx = brd.offsetLeft + (k + .5) * pw, cy = brd.offsetTop + (r + .5) * ph2;       // centro da peça no lugar certo (coordenadas da página direita)
      const sl = SLOTS[pcs.length], px = -pwp * (sl[0] + rand(-.06, .06)), py = PH() * (sl[1] + rand(-.03, .03));                              // pilha de peças na página esquerda
      d.style.transform = 'translate(' + (px - cx) + 'px,' + (py - cy) + 'px) rotate(' + rand(-35, 35) + 'deg)'; d.style.zIndex = 5 + Math.floor(Math.random() * 20);
      brd.appendChild(d); pcs.push(d);
    }
    await w(400); pcs.forEach((d, i) => later(() => { d.classList.add('in'); sfx.tick(); }, i * 100)); await w(1300); hint(L.puzzleHint);
    let got = 0;
    await new Promise(res => { pend.add(res); pcs.forEach(d => { d.onclick = () => {
      if (d.dataset.ok) return; d.dataset.ok = '1'; d.classList.add('ok'); d.style.transform = 'none'; d.style.zIndex = 2; got++; hint('');
      sfx.pop(); sfx.note(got - 1); vib(20); { const p = rectC(d); burst(p.x, p.y, 8, true); }
      if (got === 9) { pend.delete(res); res(); } else if (got === 1) hint('Continue tocando nas peças 🧩'); }; }); });
    if (!alive()) return;
    await w(900); brd.classList.add('done'); end.classList.add('on'); sfx.pop(); sfx.chime(); sfx.harp([523, 659, 784, 1047, 1319], .12); flash(); vib([60, 40, 60]); glow();
    shoot({ x: W / 2, y: H * .45, n: 36, sx: 13, sy: 11, r: 22, l: 2, sp: SPR_BLOOM }); await w(4200);
  }
  async function rLock(sp){
    const S = sp.span, key = q(S, '.lk-key'), shackle = q(S, '.lk-sh'), txt = q(S, '.lk-t'), lockG = q(S, '.lk-lock'), river = q(S, '.lk-river'), ref = q(S, '.lk-ref'), rip = q(S, '.lk-rip');
    const typeT = async t => { txt.classList.remove('on'); await w(250); txt.textContent = t; txt.classList.add('on'); };
    await w(900); await typeT(L.lockIntro); key.classList.add('on'); sfx.sparkle(); await w(600);
    await tap(key, 40000);                                      // 1º toque: tranca o cadeado
    key.classList.remove('on'); key.classList.add('go');
    { const dx = lockG.offsetLeft + lockG.offsetWidth / 2 - (key.offsetLeft + key.offsetWidth / 2), dy = lockG.offsetTop + lockG.offsetHeight * .72 - (key.offsetTop + key.offsetHeight / 2);
      await key.animate([{ transform: 'none' }, { transform: 'translate(' + dx + 'px,' + dy + 'px) rotate(-20deg)' }, { transform: 'translate(' + dx + 'px,' + dy + 'px) rotate(70deg)' }], { duration: 1000, easing: 'ease-in-out', fill: 'forwards' }).finished; }
    sfx.clack(); vib([40, 30, 60]); shackle.classList.add('shut'); lockG.classList.add('shut'); flash(); { const p = rectC(lockG); burst(p.x, p.y, 40); } sfx.chime(); glow();
    await w(900);
    key.getAnimations().forEach(a => a.cancel()); key.classList.remove('go'); key.classList.add('on'); key.style.opacity = 1;
    await typeT(L.lockClosed);
    await tap(key, 40000);                                      // 2º toque: joga a chave no rio
    key.classList.remove('on'); key.classList.add('go');
    { const sw = S.clientWidth, sh = S.clientHeight, dx = sw * .3, dy = river.offsetTop + river.offsetHeight * .3 - (key.offsetTop + key.offsetHeight / 2);
      sfx.swoosh();
      await key.animate([{ transform: 'none', opacity: 1 }, { transform: 'translate(' + dx * .55 + 'px,' + -(sh * .26) + 'px) rotate(260deg)', offset: .45 }, { transform: 'translate(' + dx + 'px,' + dy + 'px) rotate(620deg) scale(.55)', opacity: 1, offset: .92 }, { transform: 'translate(' + dx + 'px,' + dy + 'px) rotate(640deg) scale(.4)', opacity: 0 }], { duration: 1500, easing: 'cubic-bezier(.3,.1,.6,1)', fill: 'forwards' }).finished;
      if (!alive()) return;
      sfx.splash(); vib([70, 40, 40]); const kr = rectC(key), rr = river.getBoundingClientRect();
      rip.style.left = kr.x + dx + 'px'; rip.style.top = rr.top + rr.height * .3 + 'px'; rip.classList.remove('on'); void rip.offsetWidth; rip.classList.add('on');
      burst(kr.x + dx, rr.top + rr.height * .25, 24, true); }
    await w(1600); await typeT(fl(L.lockEnd)); ref.textContent = L.lockRef; ref.classList.add('on');
    sfx.pad(262); sfx.harp([523, 659, 784, 1047, 1319], .15); lockG.classList.add('glow');
    for (let i = 0; i < 5; i++) later(() => { burst(W * rand(.2, .8), H * rand(.15, .45), 55); sfx.firework(); }, i * 600);
    await w(5200);
  }

  /* ===================== sequência ===================== */
  const START = Math.max(0, parseInt(new URLSearchParams(location.search).get('pg'), 10) || 0);     // ?pg=N abre a partir da página N (teste)
  const specs = [null, sToc, sCastle, sLetter, sNews, sMural, sBooth, sMeaning, sJar, sBox, sPuzzle, sLock];
  let first = true;
  if (START === 0) {
    const cov = sCover(), toc = sToc(); toc.shownCover = true;
    rslot.appendChild(toc.R); curR = null;
    const lf = newLeaf(cov, null); lf.style.zIndex = 7; spread.appendChild(lf);
    await w(900); sfx.pad(196); spark(q(cov, '.cvph'), 14); q(cov, '.cvbtn').classList.add('on');
    await Promise.race([tap(q(cov, '.cvbtn')), tap(lf), tap(bookEl)]);
    if (!alive()) return;
    sfx.chime(); vib([40, 30, 40]); flash(); burst(W / 2, H / 2, 80);
    bookEl.classList.add('open'); await turn(toc, lf); first = false;
    setTitle('', ''); await rToc(toc); if (!alive()) return; await nextBtn();
  } else {
    bookEl.classList.add('open'); bookEl.style.transition = 'none';
  }
  for (let i = Math.max(START, 2); i < specs.length; i++) {
    if (!alive()) return;
    const sp = specs[i]();
    if (first) { place(sp); first = false; } else await turn(sp);
    if (!alive()) return;
    setTitle(sp.title[0], sp.title[1]);
    try { await sp.run(sp); } catch (e) { console.warn('livro', i, e); }
    if (!alive()) return;
    if (sp.cleanupBig) sp.cleanupBig();
    if (sp.last) break;
    hint(''); await nextBtn(i === 8 ? 'Já abri o bastante ➜' : '');
    if (i === 9) unmute();
  }
  if (!alive()) return;
  root.classList.add('out'); await w(900); cleanup(); root.remove();
}
