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
  root.innerHTML = '<div class="bkbook" id="bkbook"></div><button class="bkx" id="bkx" type="button">✕ Voltar ao site</button>';
  document.body.appendChild(root); void root.offsetWidth; root.classList.add('on');
  const book = $('bkbook'), pend = new Set(), timers = new Set(); let gone = false, cur = null, bgmWas = null;
  const alive = () => c.alive() && !gone;
  const w = async ms => { const t0 = performance.now(); while (alive() && performance.now() - t0 < ms) await sleep(60); };
  const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); if (alive()) fn(); }, ms); timers.add(t); return t; };
  const tap = (el, max) => new Promise(r => {                 // espera um toque (ou o tempo máximo)
    let done = false; const f = () => { if (done) return; done = true; el.removeEventListener('click', f); clearTimeout(t); pend.delete(f); r(); };
    el.addEventListener('click', f); const t = max ? setTimeout(f, max) : 0; pend.add(f);
  });
  const mute = () => { if (bgmWas === null) { bgmWas = !bgm.paused; try { bgm.pause(); } catch (e) {} } };
  const unmute = () => { if (bgmWas) { try { bgm.volume = 0; bgm.play().catch(() => {}); let v = 0; const t = setInterval(() => { v = Math.min(.25, v + .02); bgm.volume = v; if (v >= .25) clearInterval(t); }, 120); } catch (e) {} } bgmWas = null; };
  const cleanup = () => { gone = true; pend.forEach(f => f()); timers.forEach(clearTimeout); unmute(); };
  $('bkx').onclick = () => { cleanup(); root.classList.remove('on'); setTimeout(() => root.remove(), 700); closeDia10(); };
  const mk = (cls, html, num) => {
    const p = document.createElement('section'); p.className = 'bkp ' + cls.split(' ').map(x => 'pg-' + x).join(' ');
    p.innerHTML = '<div class="bkin">' + html + '</div>' + (num ? '<i class="bkn">— ' + num + ' —</i>' : '');
    return p;
  };
  const nextBtn = async (pg, label) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'bknext'; b.textContent = label || 'Virar a página ➜'; pg.appendChild(b);
    void b.offsetWidth; b.classList.add('on'); await tap(b); b.remove();
  };
  const show = async pg => {
    if (!cur) { book.appendChild(pg); cur = pg; return; }
    pg.classList.add('under'); book.insertBefore(pg, cur); sfx.page(); cur.classList.add('flip'); vib(15);
    const o = cur; await w(980); o.remove(); pg.classList.remove('under'); cur = pg;
  };
  const typeInto = async (el, text, ms, snd) => { el.textContent = ''; for (const ch of text) { if (!alive()) return; el.textContent += ch; if (snd && ch !== ' ') sfx.typek(); await sleep(ms || 30); } };
  const rand = (a, b) => a + Math.random() * (b - a);
  const mesNome = () => MESES[dateOfM(c.m).getMonth()];

  /* ---------- capa ---------- */
  async function pCover(pg){
    await w(500);
    sfx.pad(196); sparkleAt(pg);
    const b = pg.querySelector('.cvbtn'); b.classList.add('on');
    await tap(b);
    sfx.chime(); vib([40, 30, 40]); flash(); burst(W / 2, H / 2, 80);
  }
  function sparkleAt(pg){ const el = pg.querySelector('.cvph'); if (!el) return; const r = el.getBoundingClientRect(); shoot({ x: r.left + r.width / 2, y: r.top + r.height / 2, n: 14, sx: 7, sy: 6, r: 18, l: 1.8, sp: SPR_GOLD }); }

  /* ---------- sumário ---------- */
  async function pToc(pg){
    const items = pg.querySelectorAll('.toc li');
    for (let i = 0; i < items.length; i++) { if (!alive()) return; items[i].classList.add('on'); sfx.click(); await w(330); }
    sfx.harp([523, 659, 784, 1047], .14); await w(900);
  }

  /* ---------- 1. castelo, relógio e sino ---------- */
  async function pCastle(pg){
    const svg = pg.querySelector('svg'), cam = pg.querySelector('.cs-cam'), hh = svg.querySelector('#csH'), mm = svg.querySelector('#csM');
    const dEl = pg.querySelector('.cs-d'), dBox = pg.querySelector('.cs-date'), bell = svg.querySelector('.cs-bell'), vs = pg.querySelector('.cs-verse');
    pg.querySelector('.cs-mo').textContent = mesNome();
    await w(1200);
    cam.style.transform = 'scale(2.35)'; sfx.swoosh(); await w(2600); if (!alive()) return;
    dBox.classList.add('on');
    const N = 10, perDay = 760, t0 = performance.now();
    let lastDay = 0;
    while (alive()) {
      const t = performance.now() - t0, p = Math.min(1, t / (N * perDay)), day = Math.min(N, 1 + Math.floor(t / perDay));
      const hr = p * N * 2 * 360, ease = 1 - Math.pow(1 - Math.min(1, p * 1.0), 6);
      hh.setAttribute('transform', 'rotate(' + hr + ' 150 150)'); mm.setAttribute('transform', 'rotate(' + hr * 12 + ' 150 150)');
      if (day !== lastDay) { lastDay = day; dEl.textContent = day; dEl.classList.remove('pop'); void dEl.offsetWidth; dEl.classList.add('pop'); sfx.tick(); if (day === N) dBox.classList.add('gold'); }
      if (p >= 1) break; await sleep(30);
    }
    if (!alive()) return;
    hh.setAttribute('transform', 'rotate(0 150 150)'); mm.setAttribute('transform', 'rotate(0 150 150)');
    flash(); vib([100, 60, 100]); pg.classList.add('glow');
    for (let i = 0; i < 4; i++) {           // o sino toca
      if (!alive()) return;
      bell.classList.remove('sw'); void bell.getBoundingClientRect(); bell.classList.add('sw');
      sfx.bell(i % 2 ? 196 : 247, 0, .34); sfx.bell((i % 2 ? 196 : 247) * 2, .02, .1); burst(W / 2, H * .22, 18, true); vib(40);
      await w(1350);
    }
    cam.style.transform = 'scale(1.5) translateY(6%)'; await w(900);
    vs.querySelector('q').textContent = L.castleVerse[0]; vs.querySelector('cite').textContent = L.castleVerse[1];
    vs.classList.add('on'); sfx.pad(262); sfx.harp([523, 659, 784, 1047], .18); await w(6500);
  }

  /* ---------- 2. pomba, carta e enigma ---------- */
  async function pLetter(pg){
    const sc = pg.querySelector('.lt-scene'), dv = pg.querySelector('.lt-dove'), env = pg.querySelector('.lt-env'), card = pg.querySelector('.lt-card');
    const sw = sc.clientWidth, sh = sc.clientHeight, tableY = sh * .62;
    dv.style.display = 'block'; dv.style.left = '0px'; dv.style.top = sh * .12 + 'px';
    const flap = setInterval(() => sfx.flap(), 460); timers.add(flap);
    const dw = dv.offsetWidth || 110;
    await dv.animate([{ transform: 'translateX(' + (-dw * 1.4) + 'px)' }, { transform: 'translateX(' + (sw * .5 - dw * .5) + 'px)' }], { duration: 3800, easing: 'ease-out', fill: 'forwards' }).finished;
    if (!alive()) return;
    { const er = env.getBoundingClientRect(), sr = sc.getBoundingClientRect(); sc.appendChild(env); env.classList.remove('hold'); env.style.left = er.left - sr.left + 'px'; env.style.top = er.top - sr.top + 'px'; } sfx.swoosh();
    dv.animate([{ transform: 'translate(' + (sw * .5 - dw * .5) + 'px,0)' }, { transform: 'translate(' + (sw + dw) + 'px,-' + sh * .25 + 'px)' }], { duration: 3000, easing: 'ease-in', fill: 'forwards' }).finished.then(() => { clearInterval(flap); dv.remove(); });
    await env.animate([{ transform: 'translateY(0) rotate(0)' }, { transform: 'translateY(' + (tableY - parseFloat(env.style.top)) * .9 + 'px) rotate(210deg)', offset: .7 }, { transform: 'translateY(' + (tableY - parseFloat(env.style.top)) + 'px) rotate(190deg)' }], { duration: 1300, easing: 'cubic-bezier(.4,0,.8,.6)', fill: 'forwards' }).finished;
    if (!alive()) return;
    env.style.top = tableY + 'px'; env.style.transform = 'rotate(-6deg)'; env.getAnimations().forEach(a => a.cancel());
    sfx.thud(); vib(40); burst(sw / 2 + sc.getBoundingClientRect().left, tableY + sc.getBoundingClientRect().top, 14, true);
    env.animate([{ transform: 'translateY(-16px) rotate(-6deg)' }, { transform: 'translateY(0) rotate(-6deg)' }], { duration: 280, easing: 'ease-out' });
    await w(1200);
    pg.querySelector('.lt-hint').classList.add('on'); env.classList.add('pulse');
    await tap(env, 9000);
    env.classList.remove('pulse'); pg.querySelector('.lt-hint').classList.remove('on');
    env.classList.add('open'); sfx.pop(); sfx.chime(.2); await w(900);
    card.style.display = 'flex';
    const r0 = env.getBoundingClientRect(), r1 = card.getBoundingClientRect();
    card.animate([{ transform: 'translate(' + (r0.left + r0.width / 2 - r1.left - r1.width / 2) + 'px,' + (r0.top - r1.top - r1.height / 2 + 10) + 'px) scale(.2) rotate(-8deg)', opacity: 0 }, { opacity: 1, offset: .3 }, { transform: 'none', opacity: 1 }], { duration: 1100, easing: 'cubic-bezier(.2,.9,.3,1)', fill: 'both' });
    env.style.opacity = 0; sfx.whoosh(); shoot({ x: r0.left + r0.width / 2, y: r0.top, n: 14, sx: 7, sy: 6, r: 18, l: 1.6, sp: SPR_GOLD });
    await w(1300);
    const lines = card.querySelectorAll('.rd-l');
    for (let i = 0; i < lines.length; i++) { if (!alive()) return; lines[i].classList.add('on'); sfx.note(i); await w(1500); }
    const ask = card.querySelector('.rd-q'), ans = card.querySelector('.rd-a'), btn = card.querySelector('.rd-b');
    ask.classList.add('on'); vib(30); await w(900); btn.classList.add('on');
    await tap(btn, 25000); btn.remove();
    ans.classList.add('on'); sfx.harp([523, 659, 784, 1047, 1319], .14); flash(); burst(W / 2, H * .5, 50); await w(3500);
  }

  /* ---------- 3. jornal em preto e branco ---------- */
  async function pNews(pg){
    const paper = pg.querySelector('.np'), N = L.news || {};
    await w(300); sfx.whoosh(); paper.classList.add('in'); await w(900); sfx.thud(); vib(40);
        await typeInto(pg.querySelector('.np-h'), N.head, 28, true); await w(300);
    pg.querySelector('.np-sub').classList.add('on'); await w(900);
    pg.querySelector('.np-ph').classList.add('on'); sfx.shutter(); await w(500); pg.querySelector('.np-stamp').classList.add('on'); sfx.clack(); vib(30); await w(500);
    pg.querySelectorAll('.np-c, .np-box, .np-cl, .np-ft').forEach((e, i) => later(() => { e.classList.add('on'); sfx.tick(); }, i * 450));
    await w(5200);
  }

  /* ---------- 4. mural de fotos ---------- */
  async function pMural(pg){
    const ps = pg.querySelectorAll('.pn'), board = pg.querySelector('.mu-b'), big = pg.querySelector('.mu-big');
    await w(600);
    for (let i = 0; i < ps.length; i++) {
      if (!alive()) return; const p = ps[i], fromL = i % 2 === 0, rv = p.style.getPropertyValue('--r').trim() || '0deg';
      p.classList.add('in'); p.animate([{ transform: 'translate(' + (fromL ? -120 : 120) + 'vw,' + rand(-40, 40) + 'vh) rotate(' + (fromL ? -80 : 80) + 'deg) scale(.6)', opacity: 0 }, { opacity: 1, offset: .2 }, { transform: 'rotate(' + rv + ') scale(1.06)', offset: .78 }, { transform: 'rotate(' + rv + ') scale(1)', opacity: 1 }], { duration: 900, easing: 'cubic-bezier(.3,.7,.3,1)', fill: 'both' });
      later(() => { sfx.pop(); vib(15); }, 700); await w(520);
    }
    await w(700);
    pg.querySelector('.mu-st').classList.add('on'); sfx.harp([659, 784, 988, 1319], .13);
    pg.querySelector('.mu-hint').classList.add('on');
    ps.forEach(p => { p.onclick = () => {
      big.innerHTML = '<img alt="" src="' + E(p.querySelector('img').src) + '"><b>' + E(p.dataset.t) + '</b>'; big.classList.add('on'); sfx.click(); vib(20); burst(W / 2, H * .5, 14, true);
    }; });
    big.onclick = () => { big.classList.remove('on'); sfx.pop(); };
    await w(4500);
  }

  /* ---------- 5. cabine de fotos ---------- */
  async function pBooth(pg){
    const cd = pg.querySelector('.bt-cd'), lamp = pg.querySelector('.bt-lamp'), strip = pg.querySelector('.bt-strip'), out = pg.querySelector('.bt-out'), hint = pg.querySelector('.bt-hint');
    const run = async first => {
      strip.classList.remove('col'); strip.style.transition = 'none'; strip.style.transform = 'translateY(-101%)'; void strip.offsetWidth;
      for (let i = 0; i < 4; i++) {
        for (const n of ['3', '2', '1']) { if (!alive()) return; cd.textContent = n; cd.classList.remove('pop'); void cd.offsetWidth; cd.classList.add('pop'); sfx.tick(); await w(first && i === 0 ? 650 : 330); }
        cd.textContent = '📸'; lamp.classList.add('on'); flash(); sfx.shutter(); vib(30); await w(180); lamp.classList.remove('on');
      }
      cd.textContent = '💖'; sfx.whoosh(); await w(500);
      strip.style.transition = 'transform 3.4s cubic-bezier(.3,.6,.3,1)'; strip.style.transform = 'translateY(0)';
      const iv = setInterval(() => { if (alive()) sfx.tick(); }, 260); timers.add(iv); await w(3500); clearInterval(iv);
      strip.classList.add('col'); sfx.harp([784, 988, 1175, 1568], .12); sparkleOver(out); await w(1200);
    };
    const sparkleOver = el => { const r = el.getBoundingClientRect(); shoot({ x: r.left + r.width / 2, y: r.top + r.height * .5, n: 16, sx: 8, sy: 6, r: 20, l: 1.8, sp: SPR_BLOOM }); };
    await w(500); await run(true); if (!alive()) return;
    hint.classList.add('on'); let again = 0;
    strip.onclick = async () => { if (again) return; again = 1; hint.classList.remove('on'); await run(false); again = 0; hint.classList.add('on'); };
    await w(3500);
  }

  /* ---------- 6. significado do amor com lupa ---------- */
  async function pMeaning(pg){
    const box = pg.querySelector('.mn-box'), zoom = pg.querySelector('.mn-z'), lens = pg.querySelector('.mn-lens'), end = pg.querySelector('.mn-end'), hint = pg.querySelector('.mn-hint');
    await w(900);
    const R = 74, K = 2.2, base = pg.querySelector('.mn-t'), th = base.offsetHeight; box.style.height = th + 14 + 'px';
    let bw = box.clientWidth, bh = box.clientHeight, x = R, y = th / 2, drag = false;
    const put = (nx, ny) => { x = Math.max(R * .3, Math.min(bw - R * .3, nx)); y = Math.max(0, Math.min(bh, ny));
      lens.style.left = x - R + 'px'; lens.style.top = y - R + 'px'; zoom.style.transformOrigin = x + 'px ' + y + 'px'; zoom.style.clipPath = 'circle(' + R / K + 'px at ' + x + 'px ' + y + 'px)'; };
    zoom.style.transform = 'scale(' + K + ')'; lens.style.width = lens.style.height = R * 2 + 'px'; put(R * .4, th * .3); lens.classList.add('on'); zoom.classList.add('on'); sfx.sparkle();
    const bands = Math.max(1, Math.ceil(th / (R / K * 2 * .8))); let stop = false;
    box.addEventListener('pointerdown', e => { drag = true; stop = true; const r = box.getBoundingClientRect(); put(e.clientX - r.left, e.clientY - r.top); hint.classList.remove('on'); });
    addEventListener('pointermove', e => { if (!drag) return; const r = box.getBoundingClientRect(); put(e.clientX - r.left, e.clientY - r.top); });
    addEventListener('pointerup', () => { drag = false; });
    for (let b = 0; b < bands && alive() && !stop; b++) {
      const yy = th * (b + .5) / bands, a = b % 2 ? bw - R * .3 : R * .3, z = b % 2 ? R * .3 : bw - R * .3, dur = 5200, t0 = performance.now();
      while (alive() && !stop) { const p = Math.min(1, (performance.now() - t0) / dur); put(a + (z - a) * p, yy); if (p >= 1) break; await sleep(30); }
    }
    hint.classList.add('on'); await w(stop ? 9000 : 2200);
    end.classList.add('on'); sfx.harp([523, 659, 784, 1047], .16); burst(W / 2, H * .75, 30); await w(3200);
  }

  /* ---------- 7. pote de mensagens ---------- */
  async function pJar(pg){
    const jar = pg.querySelector('.jr-jar'), cardBox = pg.querySelector('.jr-card'), cnt = pg.querySelector('.jr-cnt'), hint = pg.querySelector('.jr-hint');
    const MS = L.jar || []; let bag = [], taps = 0, busy = false, last = -1;
    const draw = () => { if (!bag.length) { bag = MS.map((_, i) => i).sort(() => Math.random() - .5); if (bag[bag.length - 1] === last) bag.reverse(); } last = bag.pop(); return MS[last]; };
    await w(600); jar.classList.add('in'); sfx.pop(); await w(900); hint.classList.add('on');
    let done = false;
    jar.onclick = async () => {
      if (busy) return; busy = true; taps++; sfx.pop(); vib(25); jar.classList.remove('shk'); void jar.offsetWidth; jar.classList.add('shk');
      const slip = document.createElement('i'); slip.className = 'slip'; slip.style.background = ['#ff8fa8', '#ffd166', '#8fd3ff', '#b8e986', '#d9a6ff', '#ffb38a'][Math.floor(Math.random() * 6)];
      pg.querySelector('.jr-st').appendChild(slip);
      const jr = jar.getBoundingClientRect(), sr = pg.querySelector('.jr-st').getBoundingClientRect();
      slip.style.left = jr.left - sr.left + jr.width / 2 - 14 + 'px'; slip.style.top = jr.top - sr.top + 6 + 'px';
      sfx.whoosh(); shoot({ x: jr.left + jr.width / 2, y: jr.top + 10, n: 10, sx: 6, sy: 7, r: 18, l: 1.4, sp: SPR_BLOOM });
      await slip.animate([{ transform: 'translateY(0) rotate(0) scale(.6)', opacity: 0 }, { opacity: 1, offset: .2 }, { transform: 'translateY(-' + sr.height * .22 + 'px) rotate(300deg) scale(1.4)' }], { duration: 750, easing: 'ease-out', fill: 'forwards' }).finished;
      slip.remove(); if (!alive()) return;
      cardBox.classList.remove('on'); void cardBox.offsetWidth; cardBox.querySelector('p').textContent = fl(draw()); cardBox.classList.add('on'); sfx.chime(); sfx.harp([659, 784, 988], .1); burst(W / 2, H * .35, 22);
      if (taps <= 2) { cnt.textContent = taps === 1 ? 'Mais 1 toque ✨' : ''; hint.textContent = ''; }
      if (taps === 2) { later(() => { hint.textContent = L.jarJoke; hint.classList.add('on'); cnt.textContent = '∞ mensagens'; sfx.sparkle(); flash(); done = true; }, 1400); }
      else if (taps > 2) { cnt.textContent = taps + ' abertas · ∞'; }
      busy = false;
    };
    cnt.textContent = ''; hint.textContent = L.jarHint;
    while (alive() && !done) await sleep(120);
    await w(2500);
    pg.dataset.stay = '1';                               // ela pode continuar abrindo; o botão de avançar aparece
  }

  /* ---------- 8. caixinha de música ---------- */
  async function pBox(pg){
    const crank = pg.querySelector('.bx-crank'), cloud = pg.querySelector('.bx-msg'), couple = pg.querySelector('.bx-couple'), hint = pg.querySelector('.bx-hint');
    mute(); const M = L.boxMsgs || []; let n = 0, busy = false;
    await w(900); hint.classList.add('on'); crank.classList.add('on');
    let done = false;
    crank.onclick = async () => {
      if (busy) return; busy = true; hint.classList.remove('on'); crank.classList.remove('spin'); void crank.offsetWidth; crank.classList.add('spin'); couple.classList.add('turn'); vib(25);
      const dur = sfx.march(n) * 1000 || 4200; cloud.classList.remove('on'); sfx.pop();
      noteFloat(pg); await w(900);
      cloud.querySelector('p').textContent = fl(M[n % M.length]); cloud.classList.add('on'); sfx.sparkle();
      await w(Math.max(1500, dur - 900)); couple.classList.remove('turn'); crank.classList.remove('spin'); n++;
      if (n >= 4) done = true; hint.textContent = n >= 4 ? 'Gire de novo se quiser 🎶' : 'Gire de novo 🎶'; hint.classList.add('on'); busy = false;
    };
    const noteFloat = p => { const st = p.querySelector('.bx-st'); for (let i = 0; i < 6; i++) later(() => { const s = document.createElement('i'); s.className = 'nt'; s.textContent = ['♪', '♫', '♬', '💍'][i % 4]; s.style.left = rand(25, 75) + '%'; st.appendChild(s); setTimeout(() => s.remove(), 3200); }, i * 350); };
    while (alive() && !done) await sleep(150);
    await w(3600);
  }

  /* ---------- 9. quebra-cabeça ---------- */
  async function pPuzzle(pg){
    const brd = pg.querySelector('.pz-b'), hint = pg.querySelector('.pz-hint'), end = pg.querySelector('.pz-end');
    const src = P(L.puzzlePhoto != null ? L.puzzlePhoto : 3), img = new Image(); img.src = src; await new Promise(r => { img.onload = img.onerror = r; setTimeout(r, 3000); });
    const Cw = brd.clientWidth, Ch = brd.clientHeight, iw = img.naturalWidth || 3, ih = img.naturalHeight || 4;
    const bgW = Math.max(Cw, Ch * iw / ih), bgH = bgW * ih / iw, offX = (bgW - Cw) / 2, offY = (bgH - Ch) * .18, pw = Cw / 3, ph2 = Ch / 3, pcs = [];
    for (let r = 0; r < 3; r++) for (let q = 0; q < 3; q++) {
      const d = document.createElement('i'); d.className = 'pz';
      d.style.cssText = 'left:' + q * pw + 'px;top:' + r * ph2 + 'px;width:' + pw + 'px;height:' + ph2 + 'px;background-image:url("' + src + '");background-size:' + bgW + 'px ' + bgH + 'px;background-position:-' + (q * pw + offX) + 'px -' + (r * ph2 + offY) + 'px';
      const ang = rand(-28, 28), dx = rand(-.55, .55) * Cw * 1.1, dy = (Math.random() < .5 ? -1 : 1) * rand(.35, .8) * Ch * .6;
      d.style.transform = 'translate(' + dx + 'px,' + dy + 'px) rotate(' + ang + 'deg)'; d.style.zIndex = 5 + Math.floor(Math.random() * 20);
      brd.appendChild(d); pcs.push(d);
    }
    await w(500); pcs.forEach((d, i) => later(() => { d.classList.add('in'); sfx.tick(); }, i * 90)); await w(1200); hint.classList.add('on');
    let got = 0;
    await new Promise(res => { pend.add(res); pcs.forEach(d => { d.onclick = () => {
      if (d.dataset.ok) return; d.dataset.ok = '1'; d.classList.add('ok'); d.style.transform = 'none'; d.style.zIndex = 2; got++; hint.classList.remove('on');
      sfx.pop(); sfx.note(got - 1); vib(20); const r = d.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, 8, true);
      if (got === 9) { pend.delete(res); res(); } else if (got === 1) hint.textContent = 'Continue tocando nas peças 🧩', hint.classList.add('on'); }; }); });
    if (!alive()) return;
    await w(900); brd.classList.add('done'); end.classList.add('on'); sfx.pop(); sfx.chime(); sfx.harp([523, 659, 784, 1047, 1319], .12); flash(); vib([60, 40, 60]);
    shoot({ x: W / 2, y: H * .45, n: 36, sx: 13, sy: 11, r: 22, l: 2, sp: SPR_BLOOM }); await w(4200);
  }

  /* ---------- 10. cadeado de Paris ---------- */
  async function pLock(pg){
    const key = pg.querySelector('.lk-key'), shackle = pg.querySelector('.lk-sh'), txt = pg.querySelector('.lk-t'), lockG = pg.querySelector('.lk-lock'), river = pg.querySelector('.lk-river'), ref = pg.querySelector('.lk-ref');
    const typeT = async t => { txt.classList.remove('on'); await w(250); txt.textContent = t; txt.classList.add('on'); };
    await w(900); await typeT(L.lockIntro); key.classList.add('on'); sfx.sparkle(); await w(600);
    const kr = () => key.getBoundingClientRect(), lr = () => lockG.getBoundingClientRect();
    await tap(key, 40000);                                  // 1º toque: tranca o cadeado
    key.classList.remove('on'); key.classList.add('go');
    { const a = kr(), b = lr(); const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height * .72 - (a.top + a.height / 2);
      await key.animate([{ transform: 'none' }, { transform: 'translate(' + dx + 'px,' + dy + 'px) rotate(-20deg)' }, { transform: 'translate(' + dx + 'px,' + dy + 'px) rotate(70deg)' }], { duration: 1000, easing: 'ease-in-out', fill: 'forwards' }).finished; }
    sfx.clack(); vib([40, 30, 60]); shackle.classList.add('shut'); lockG.classList.add('shut'); flash(); burst(W / 2, lr().top + 30, 40); sfx.chime();
    await w(900);
    key.getAnimations().forEach(a => a.cancel()); key.classList.remove('go'); key.classList.add('on'); key.style.opacity = 1;
    await typeT(L.lockClosed);
    await tap(key, 40000);                                  // 2º toque: joga a chave no rio
    key.classList.remove('on'); key.classList.add('go');
    { const a = kr(), rv = river.getBoundingClientRect(), dx = W * .36, dy = rv.top + rv.height * .35 - (a.top + a.height / 2);
      sfx.swoosh();
      await key.animate([{ transform: 'none', opacity: 1 }, { transform: 'translate(' + dx * .55 + 'px,' + -(H * .24) + 'px) rotate(260deg)', offset: .45 }, { transform: 'translate(' + dx + 'px,' + dy + 'px) rotate(620deg) scale(.55)', opacity: 1, offset: .92 }, { transform: 'translate(' + dx + 'px,' + dy + 'px) rotate(640deg) scale(.4)', opacity: 0 }], { duration: 1500, easing: 'cubic-bezier(.3,.1,.6,1)', fill: 'forwards' }).finished;
      if (!alive()) return;
      sfx.splash(); vib([70, 40, 40]); const rip = pg.querySelector('.lk-rip'); rip.style.left = rv.left + dx + (a.left + a.width / 2) - rv.left - dx + 'px';
      rip.style.left = (a.left + a.width / 2 + dx) + 'px'; rip.style.top = rv.top + rv.height * .35 + 'px'; rip.classList.remove('on'); void rip.offsetWidth; rip.classList.add('on');
      burst(a.left + a.width / 2 + dx, rv.top + rv.height * .3, 24, true); }
    await w(1600); await typeT(fl(L.lockEnd)); ref.textContent = L.lockRef; ref.classList.add('on');
    sfx.pad(262); sfx.harp([523, 659, 784, 1047, 1319], .15); lockG.classList.add('glow');
    for (let i = 0; i < 5; i++) { later(() => { burst(W * rand(.2, .8), H * rand(.15, .45), 55); sfx.firework(); }, i * 600); }
    await w(5200);
  }

  /* ===================== montagem das páginas ===================== */
  const hd = (t, n) => '<div class="bkh"><span>' + E(L.coverKicker || 'Capítulo II') + '</span><h2 class="bkt">' + E(t) + '</h2></div>';
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
  const envHTML = '<div class="lt-env hold"><i class="e-back"></i><i class="e-paper"></i><i class="e-front"></i><i class="e-flap"></i><i class="e-seal">♥</i></div>';
  const N = L.news || {}, MU = L.mural || [], BT = L.booth || [];
  const rot = ['-4deg', '3deg', '-2.5deg', '4deg', '-3.5deg', '2deg'];
  const pages = [
    { cls: 'cover', html: '<div class="cvf"><small>' + E(L.coverKicker) + '</small><div class="cvph"><img alt="" src="' + E(P(L.coverPhoto || 0)) + '"></div><h1>' + E(L.coverTitle) + '</h1><h3>' + E(L.coverSub) + '</h3><p>' + E(fl(L.coverPhrase)) + '</p><button class="cvbtn" type="button">Toque para abrir</button></div>', run: pCover, noNext: true },
    { cls: 'toc-p', num: 1, html: '<h2 class="bkt">' + E(L.tocTitle) + '</h2><ol class="toc">' + (L.toc || []).map((t, i) => '<li><b>' + ROM[i] + '</b><span>' + E(t) + '</span><i></i><em>' + (i + 2) + '</em></li>').join('') + '</ol>', run: pToc },
    { cls: 'scene castle', html: '<div class="cs-cam">' + castleSvg() + '</div><div class="cs-t"><small>' + ROM[0] + '</small><b>' + E(L.castleTitle) + '</b></div><div class="cs-date"><span class="cs-mo"></span><b class="cs-d">1</b></div><div class="cs-verse"><q></q><cite></cite></div><div class="cs-stars"></div>', run: pCastle, num: 2 },
    { cls: 'letter', num: 3, html: hd(L.letterTitle) + '<div class="lt-scene"><span class="lt-dove" style="display:none">' + DOVE_SVG + envHTML + '</span><div class="lt-table"></div></div><p class="lt-hint">Toque na carta ✉️</p><div class="lt-card"><div class="rd-in">' + (L.riddle || []).map(l => '<p class="rd-l">' + E(l) + '</p>').join('') + '<p class="rd-q">' + E(L.riddleAsk) + '</p><button class="rd-b" type="button">Revelar a resposta</button><p class="rd-a">' + E(fl(L.riddleAnswer)) + '</p></div></div>', run: pLetter },
    { cls: 'news', num: 4, html: '<div class="np"><div class="np-top"><span>' + E(N.line) + '</span></div><h2 class="np-name">' + E(N.name) + '</h2><div class="np-rule"></div><h3 class="np-h"></h3><p class="np-sub">' + E(N.sub) + '</p><div class="np-g"><figure class="np-ph"><i class="np-stamp">' + E(N.stamp) + '</i><img alt="" src="' + E(P(N.photo)) + '"><figcaption>' + E(N.cap) + '</figcaption></figure><div class="np-cols">' + (N.cols || []).map(t => '<p class="np-c">' + E(t) + '</p>').join('') + '</div></div><div class="np-row"><div class="np-box"><b>' + E((N.box || [])[0]) + '</b><span>' + E((N.box || [])[1]) + '</span></div><div class="np-cl"><b>' + E((N.class || [])[0]) + '</b><span>' + E((N.class || [])[1]) + '</span></div></div><p class="np-ft">' + E(N.foot) + '</p></div>', run: pNews },
    { cls: 'mural', num: 5, html: '<h2 class="bkt bdk">' + E(L.muralTitle) + '</h2><div class="mu-b">' + MU.map((m, i) => '<figure class="pn" style="--r:' + rot[i % 6] + '" data-t="' + E(m.t) + '"><i class="pin"></i><img alt="" loading="eager" src="' + E(P(m.p)) + '"><figcaption>' + E(m.t) + '</figcaption></figure>').join('') + '<svg class="mu-st" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M12 12 Q50 24 88 14 M12 12 Q30 48 14 86 M88 14 Q70 48 86 84 M14 86 Q50 74 86 84 M12 50 Q50 58 88 48" fill="none" stroke="#c0392b" stroke-width=".5" stroke-dasharray="2 1.5" opacity=".7"/></svg></div><p class="mu-hint">Toque nas fotos 💞</p><div class="mu-big"></div>', run: pMural },
    { cls: 'booth', num: 6, html: '<h2 class="bkt bdk">' + E(L.boothTitle) + '</h2><div class="bt"><div class="bt-m"><div class="bt-sign">FOTOS</div><div class="bt-lens"><div class="bt-cd">…</div></div><div class="bt-lamp"></div></div><div class="bt-slot"></div><div class="bt-out"><div class="bt-strip">' + BT.map(i => '<div class="bt-f"><img alt="" src="' + E(P(i)) + '"></div>').join('') + '<small>' + E(L.boothSign) + '</small></div></div></div><p class="bt-hint">Toque na tira para tirar de novo 📸</p>', run: pBooth },
    { cls: 'meaning', num: 7, html: hd(L.meaningTitle) + '<h1 class="mn-w">' + E(L.meaningWord) + '</h1><p class="mn-pr">' + E(L.meaningPron) + '</p><div class="mn-box"><div class="mn-t">' + E(fl(L.meaningText)) + '</div><div class="mn-t mn-z">' + E(fl(L.meaningText)) + '</div><div class="mn-lens"></div></div><p class="mn-hint">Arraste a lupa 🔍</p><p class="mn-end">' + E(fl(L.meaningEnd)) + '</p>', run: pMeaning },
    { cls: 'jar', num: 8, html: '<h2 class="bkt">' + E(L.jarTitle) + '</h2><div class="jr-st"><div class="jr-card"><p></p></div><button class="jr-jar" type="button" aria-label="pote"><svg viewBox="0 0 200 250">' +
        '<defs><linearGradient id="jg" x1="0" x2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".55"/><stop offset=".5" stop-color="#ffffff" stop-opacity=".08"/><stop offset="1" stop-color="#ffffff" stop-opacity=".3"/></linearGradient><clipPath id="jc"><path d="M50 70 Q28 78 28 108 V206 Q28 236 58 236 H142 Q172 236 172 206 V108 Q172 78 150 70Z"/></clipPath></defs>' +
        '<g clip-path="url(#jc)">' + Array.from({ length: 46 }, (_, i) => { const cl = ['#ff8fa8', '#ffd166', '#8fd3ff', '#b8e986', '#d9a6ff', '#ffb38a', '#ff6b8e'][i % 7], x = 34 + (i * 37) % 130, y = 92 + (i * 53) % 138, r = (i * 47) % 160 - 80; return '<rect x="' + x + '" y="' + y + '" width="26" height="16" rx="2" fill="' + cl + '" transform="rotate(' + r + ' ' + (x + 13) + ' ' + (y + 8) + ')"/>'; }).join('') + '</g>' +
        '<path d="M50 70 Q28 78 28 108 V206 Q28 236 58 236 H142 Q172 236 172 206 V108 Q172 78 150 70Z" fill="url(#jg)" stroke="#fff" stroke-opacity=".7" stroke-width="3"/><rect x="52" y="44" width="96" height="26" rx="6" fill="#c8924f"/><rect x="52" y="44" width="96" height="9" rx="4" fill="#dcae6f"/><path d="M42 100 Q40 150 46 200" stroke="#fff" stroke-opacity=".7" stroke-width="5" fill="none" stroke-linecap="round"/></svg></button></div><p class="jr-cnt"></p><p class="jr-hint"></p>', run: pJar },
    { cls: 'box', num: 9, html: '<h2 class="bkt bdk">' + E(L.boxTitle) + '</h2><div class="bx-st"><div class="bx-msg"><p></p></div><div class="bx-body"><div class="bx-lid"></div><div class="bx-disc"><span class="bx-couple">👰🤵</span></div><div class="bx-front"><i></i><i></i><i></i><i></i><i></i></div><button class="bx-crank" type="button" aria-label="manivela"><i></i></button></div></div><p class="bx-hint">' + E(L.boxHint) + '</p>', run: pBox },
    { cls: 'puzzle', num: 10, html: '<h2 class="bkt">' + E(L.puzzleTitle) + '</h2><div class="pz-b"></div><p class="pz-hint">' + E(L.puzzleHint) + '</p><p class="pz-end">' + E(fl(L.puzzleEnd)) + '</p>', run: pPuzzle },
    { cls: 'scene lock', html: '<svg class="lk-svg" viewBox="0 0 360 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d1b52"/><stop offset=".45" stop-color="#c2527a"/><stop offset=".72" stop-color="#ffb36b"/><stop offset="1" stop-color="#ffd8a0"/></linearGradient><linearGradient id="rv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9a6b"/><stop offset="1" stop-color="#3b2a63"/></linearGradient></defs><rect width="360" height="640" fill="url(#sk)"/><circle cx="250" cy="330" r="44" fill="#fff2c4" opacity=".85"/>' +
        '<g fill="#3a2350"><path d="M250 186 L252.2 232 L247.8 232Z"/><path d="M246 232 H254 L259 292 H241Z"/><rect x="238" y="290" width="24" height="5"/><path d="M241 295 H259 L264 326 H236Z"/><rect x="229" y="324" width="42" height="6"/><path d="M231 330 H243 L248 350 Q250 345 252 350 L257 330 H269 L279 372 H265 L259 352 Q250 342 241 352 L235 372 H221Z"/></g>' +
        '<path d="M0 372 H360 V392 H0Z" fill="#2b1a42"/><rect x="0" y="392" width="360" height="248" fill="url(#rv)"/></svg>' +
        '<div class="lk-river"><i></i><i></i><i></i><i></i></div><div class="lk-rip"><b></b><b></b><b></b></div>' +
        '<div class="lk-rail"><div class="lk-bars">' + Array.from({ length: 14 }, () => '<i></i>').join('') + '</div><div class="lk-small">' + Array.from({ length: 22 }, (_, i) => '<s style="left:' + (2 + (i * 4.4) % 94) + '%;top:' + (i % 3) * 14 + 'px;background:' + ['#d9b25f', '#c0392b', '#8fd3ff', '#b8e986', '#d9a6ff', '#ff8fa8'][i % 6] + '"></s>').join('') + '</div></div>' +
        '<div class="lk-lock"><svg viewBox="0 0 120 150"><path class="lk-sh" d="M32 66 V44 a28 28 0 0 1 56 0 V66" fill="none" stroke="#c9d1d9" stroke-width="12" stroke-linecap="round"/><rect x="14" y="62" width="92" height="76" rx="14" fill="#f0c04e" stroke="#a97d1c" stroke-width="4"/><rect x="14" y="62" width="92" height="22" rx="12" fill="#ffe08a" opacity=".6"/><text x="60" y="112" text-anchor="middle" font-size="19" font-family="Fraunces,serif" font-style="italic" fill="#7a4a10">' + E(L.lockInitials) + '</text></svg></div>' +
        '<button class="lk-key" type="button" aria-label="chave">🗝️</button><div class="lk-tb"><p class="lk-t"></p><cite class="lk-ref"></cite></div><div class="cs-t lk-title"><small>' + ROM[9] + '</small><b>' + E(L.lockTitle) + '</b></div>', run: pLock, last: true }
  ];
  const START = Math.max(0, parseInt(new URLSearchParams(location.search).get('pg'), 10) || 0);     // ?pg=N abre a partir da página N (teste)
  for (let i = START; i < pages.length; i++) {
    if (!alive()) return;
    const d = pages[i], pg = mk(d.cls, d.html, d.num); await show(pg);
    if (d.cls.includes('castle')) pg.querySelector('.cs-stars').innerHTML = Array.from({ length: 36 }, () => '<i style="left:' + rand(0, 100) + '%;top:' + rand(0, 70) + '%;animation-delay:' + rand(0, 3) + 's"></i>').join('');
    try { await d.run(pg); } catch (e) { console.warn('livro', d.cls, e); }
    if (!alive()) return;
    if (d.cls.includes('box')) unmute();
    if (d.last) break;
    if (d.noNext) continue;
    await nextBtn(pg, d.cls === 'jar' ? 'Já abri o bastante ➜' : '');
    if (d.cls.includes('box')) unmute();
  }
  if (!alive()) return;
  root.classList.add('out'); await w(900); cleanup(); root.remove();
}
