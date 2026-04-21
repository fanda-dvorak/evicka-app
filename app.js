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

  /* ── Elements ── */
  const heart         = document.getElementById('heart');
  const note          = document.getElementById('note');
  const shareBtn      = document.getElementById('shareBtn');
  const anniversaryEl = document.getElementById('anniversary');
  const countdownEl   = document.getElementById('countdown');

  /* ── Rotating messages ── */
  let msgIndex = 0;

  function showMessage(text) {
    note.classList.add('changing');
    setTimeout(() => {
      note.textContent = text;
      note.classList.remove('changing');
    }, 220);
  }

  /* ── Heart click → show/cycle messages + sparkles ── */
  function handleHeartClick() {
    if (!note.classList.contains('show')) {
      note.textContent = LOVE_MESSAGES[0];
      msgIndex = 0;
      note.classList.add('show');
    } else {
      msgIndex = (msgIndex + 1) % LOVE_MESSAGES.length;
      showMessage(LOVE_MESSAGES[msgIndex]);
    }
    if (!reducedMotion) spawnSparkles(12);
  }
  heart.addEventListener('click', handleHeartClick);
  heart.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleHeartClick(); }
  });

  /* ── Sparkles ── */
  function spawnSparkles(n) {
    const r  = heart.getBoundingClientRect();
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

  /* ── Share ── */
  shareBtn.addEventListener('click', async () => {
    const url  = location.href;
    const text = 'Evičko, miluji tě ❤️';
    if (navigator.share) {
      try { await navigator.share({ title: text, text, url }); return; } catch {}
    }
    try {
      await navigator.clipboard.writeText(url);
      shareBtn.classList.add('copied');
      setTimeout(() => shareBtn.classList.remove('copied'), 1400);
    } catch {}
  });

  /* ── Anniversary & countdown ── */
  const startDate = new Date(2025, 2, 21); // 21. 3. 2025

  function monthLabel(n) {
    if (n === 1) return 'měsíc';
    if (n >= 2 && n <= 4) return 'měsíce';
    return 'měsíců';
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function updateAnniversary() {
    const now = new Date();

    let months =
      (now.getFullYear() - startDate.getFullYear()) * 12 +
      (now.getMonth()    - startDate.getMonth());
    if (now.getDate() < startDate.getDate()) months--;
    if (months < 0) months = 0;

    anniversaryEl.textContent = `Jsme spolu ${months} ${monthLabel(months)} ♡`;

    const next = new Date(startDate);
    next.setMonth(startDate.getMonth() + months + 1);

    const diff = next - now;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor(diff / 3600000) % 24;
    const m = Math.floor(diff / 60000)   % 60;
    const s = Math.floor(diff / 1000)    % 60;
    countdownEl.textContent =
      `do dalšího výročí ${d}d ${pad(h)}h ${pad(m)}m ${pad(s)}s`;
  }

  updateAnniversary();
  setInterval(updateAnniversary, 1000);
})();
