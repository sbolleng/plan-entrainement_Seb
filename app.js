function showSection(id, btn) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('nav .tab').forEach(t => t.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    btn.classList.add('active');
  }

  function showSubsection(id, btn) {
    const nav = btn.closest('.subnav');
    nav.parentElement.querySelectorAll('.subsection').forEach(s => s.classList.remove('active'));
    nav.querySelectorAll('.subtab').forEach(t => t.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    btn.classList.add('active');
  }

  function updateTimelineCountdowns() {
    const now = new Date();
    document.querySelectorAll('.tl-countdown[data-target]').forEach(el => {
      const target = new Date(el.dataset.target + 'T00:00:00');
      const diff = Math.round((target - now) / (1000 * 60 * 60 * 24));
      el.textContent = diff > 0 ? '· J-' + diff : (diff === 0 ? "· aujourd'hui" : '· J+' + Math.abs(diff));
    });
  }
  updateTimelineCountdowns();

  function updateCountdown() {
    const races = [
      { date: new Date('2027-03-07T08:00:00'), name: 'Forez Trails' },
      { date: new Date('2027-09-13T08:00:00'), name: 'Sancy' }
    ];
    const now = new Date();
    const next = races.find(r => r.date > now);
    if (!next) return;
    const diff = Math.ceil((next.date - now) / (1000 * 60 * 60 * 24));
    document.getElementById('countdown-days').textContent = diff;
    document.getElementById('countdown-sub').textContent = '→ ' + next.name;
  }
  updateCountdown();

  function toggleCheck(cid, id) {
    const container = document.getElementById(cid);
    const cb = document.getElementById(id);
    container.classList.toggle('done', cb.checked);
  }

  // ===== Highlight dynamique du jour en cours =====
  function pad2(n) { return n.toString().padStart(2, '0'); }
  function todayISO() {
    const d = new Date();
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }
  function markToday() {
    const t = todayISO();
    document.querySelectorAll('.week-day-card[data-date]').forEach(card => {
      const d = card.dataset.date;
      card.classList.remove('today', 'past');
      if (d === t) card.classList.add('today');
      else if (d < t) card.classList.add('past');
    });
  }
  markToday();

  // ===== Suivi des séances (coché + commentaire) — stocké en local sur cet appareil =====
  function saveLog(el) {
    const day = el.dataset.day;
    const key = 'sancy-log-' + day;
    let data = {};
    try { data = JSON.parse(localStorage.getItem(key) || '{}'); } catch (e) { data = {}; }
    if (el.type === 'checkbox') data.done = el.checked;
    else data.comment = el.value;
    localStorage.setItem(key, JSON.stringify(data));
  }
  function loadLogs() {
    document.querySelectorAll('[data-day]').forEach(el => {
      const key = 'sancy-log-' + el.dataset.day;
      let data = {};
      try { data = JSON.parse(localStorage.getItem(key) || '{}'); } catch (e) { data = {}; }
      if (el.type === 'checkbox') el.checked = !!data.done;
      if (el.tagName === 'TEXTAREA') el.value = data.comment || '';
    });
  }
  loadLogs();
