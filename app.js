(function () {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Background floating hearts ── */
  const bg = document.getElementById('bg');
  if (!reducedMotion) {
    const chars = ['♥', '♡', '❤', '♥', '♡'];
    for (let i = 0; i < 16; i++) {
      const el    = document.createElement('div');
      el.className = 'bh';
      el.textContent = chars[i % chars.length];
      const size  = (Math.random() * 22 + 9).toFixed(1);
      const left  = (Math.random() * 96 + 2).toFixed(1);
      const dur   = (Math.random() * 12 + 11).toFixed(1);
      const delay = -(Math.random() * 18).toFixed(1);
      const op    = (Math.random() * 0.18 + 0.05).toFixed(2);
      el.style.cssText =
        `left:${left}%;font-size:${size}px;` +
        `animation-duration:${dur}s;animation-delay:${delay}s;` +
        `--op:${op};color:rgba(210,40,90,${op});`;
      bg.appendChild(el);
    }
  }

  /* ── Stage elements ── */
  const s0       = document.getElementById('s0');
  const s1       = document.getElementById('s1');
  const heartBtn = document.getElementById('heartBtn');
  let messagesShown = false;

  /* ── Stage transition ── */
  function goTo(from, to) {
    from.classList.add('stage--out');
    setTimeout(() => from.classList.add('stage--gone'), 650);
    to.classList.remove('stage--gone');
    requestAnimationFrame(() => requestAnimationFrame(() => to.classList.remove('stage--out')));
  }

  s0.addEventListener('click', () => goTo(s0, s1));

  heartBtn.addEventListener('click', e => {
    e.stopPropagation();
    if (!reducedMotion) spawnSparkles(12);
    if (messagesShown) return;
    messagesShown = true;
    s1.classList.add('stage--messages');
    revealMessages();
  });
  heartBtn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); heartBtn.click(); }
  });

  /* ── Message reveal ── */
  const MSG_DELAYS = [0, 1500, 3200, 5200, 7400, 9600];

  function revealMessages() {
    const wrap = document.getElementById('messagesWrap');
    if (!wrap || wrap.childElementCount > 0) return;
    wrap.classList.remove('messages-wrap--collapsed');

    LOVE_MESSAGES.forEach((text, i) => {
      const p = document.createElement('p');
      p.className = 'msg' + (i === LOVE_MESSAGES.length - 1 ? ' msg--sig' : '');
      p.textContent = text;
      wrap.appendChild(p);
      setTimeout(() => p.classList.add('show'), (MSG_DELAYS[i] ?? i * 900) + 300);
    });

    const annDelay = (MSG_DELAYS[LOVE_MESSAGES.length] ?? LOVE_MESSAGES.length * 900) + 300;

    const box  = document.createElement('div');  box.className = 'ann-box';
    const main = document.createElement('p');    main.id = 'annMain'; main.className = 'ann-main';
    const cd   = document.createElement('p');    cd.id   = 'annCd';   cd.className   = 'ann-cd';
    box.appendChild(main);
    box.appendChild(cd);
    wrap.appendChild(box);

    setTimeout(() => {
      box.classList.add('show');
      updateAnniversary();
      setInterval(updateAnniversary, 1000);
    }, annDelay);
  }

  /* ── Sparkles ── */
  function spawnSparkles(n) {
    const r  = heartBtn.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    for (let i = 0; i < n; i++) {
      const el    = document.createElement('div');
      el.className = 'sparkle';
      el.textContent = '❤';
      const angle = (i / n) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
      const dist  = 55 + Math.random() * 90;
      const size  = (10 + Math.random() * 16).toFixed(0);
      const rot   = ((Math.random() - 0.5) * 90).toFixed(0) + 'deg';
      el.style.cssText =
        `left:${cx}px;top:${cy}px;font-size:${size}px;` +
        `--dx:${(Math.cos(angle) * dist).toFixed(0)}px;` +
        `--dy:${(Math.sin(angle) * dist).toFixed(0)}px;` +
        `--rot:${rot};` +
        `animation-delay:${(i * 0.035).toFixed(3)}s;` +
        `color:hsl(${340 + Math.random() * 30},80%,${55 + Math.random() * 15}%);`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1200);
    }
  }

  /* ── Anniversary & countdown ── */
  const startDate = new Date(2025, 2, 21);

  function monthLabel(n) {
    if (n === 1) return 'měsíc';
    if (n >= 2 && n <= 4) return 'měsíce';
    return 'měsíců';
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function updateAnniversary() {
    const annMain = document.getElementById('annMain');
    const annCd   = document.getElementById('annCd');
    if (!annMain || !annCd) return;

    const now = new Date();
    let months =
      (now.getFullYear() - startDate.getFullYear()) * 12 +
      (now.getMonth()    - startDate.getMonth());
    if (now.getDate() < startDate.getDate()) months--;
    if (months < 0) months = 0;

    annMain.textContent = `Náš čas spolu: ${months} ${monthLabel(months)} ♡`;

    const next = new Date(startDate);
    next.setMonth(startDate.getMonth() + months + 1);

    const diff = next - now;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor(diff / 3600000) % 24;
    const m = Math.floor(diff / 60000)   % 60;
    const s = Math.floor(diff / 1000)    % 60;
    annCd.textContent = `do dalšího společného měsíce ${d}d ${pad(h)}h ${pad(m)}m ${pad(s)}s`;
  }
})();
