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

  // ===== Stats · graphiques de progression (données Strava, calculées le 19/07/2026) =====
  // Pour mettre à jour : remplacer ce tableau par un export frais depuis Strava.
  const statsMonthly = [
    { label: 'Nov',  distanceKm: 68.1,  dplusM: 436,  paceSecPerKm: 386, cadenceSpm: 154, hrBpm: 152 },
    { label: 'Déc',  distanceKm: 75.1,  dplusM: 790,  paceSecPerKm: 404, cadenceSpm: 151, hrBpm: 151 },
    { label: 'Jan',  distanceKm: 71.4,  dplusM: 621,  paceSecPerKm: 354, cadenceSpm: 161, hrBpm: 156 },
    { label: 'Fév',  distanceKm: 62.4,  dplusM: 402,  paceSecPerKm: 365, cadenceSpm: 158, hrBpm: 165 },
    { label: 'Mar',  distanceKm: 72.8,  dplusM: 1290, paceSecPerKm: 381, cadenceSpm: 163, hrBpm: 163 },
    { label: 'Avr',  distanceKm: 118.9, dplusM: 1118, paceSecPerKm: 363, cadenceSpm: 163, hrBpm: 156 },
    { label: 'Mai',  distanceKm: 65.1,  dplusM: 650,  paceSecPerKm: 376, cadenceSpm: 163, hrBpm: 160 },
    { label: 'Juin', distanceKm: 75.5,  dplusM: 690,  paceSecPerKm: 347, cadenceSpm: 167, hrBpm: 145 },
    { label: 'Juil*', distanceKm: 0,    dplusM: 0,    paceSecPerKm: null, cadenceSpm: null, hrBpm: null },
  ];

  function fmtPace(sec) {
    if (!sec) return '—';
    const m = Math.floor(sec / 60), s = Math.round(sec % 60);
    return m + ':' + String(s).padStart(2, '0');
  }

  function renderBarChart(containerId, values, opts) {
    const el = document.getElementById(containerId);
    if (!el) return;
    opts = opts || {};
    const nums = values.map(v => v.val).filter(v => v !== null && v !== undefined);
    if (!nums.length) return;
    const max = opts.max || Math.max(...nums);
    const min = opts.invert ? Math.min(...nums) : 0;
    el.innerHTML = values.map(v => {
      const isNull = v.val === null || v.val === undefined;
      let pct;
      if (isNull) pct = 0;
      else if (opts.invert) {
        // faster/lower is "taller" (e.g. pace): invert scale
        pct = Math.round(((max - v.val) / (max - min)) * 80 + 20);
      } else {
        pct = Math.round((v.val / max) * 100);
      }
      const display = isNull ? '—' : (opts.formatter ? opts.formatter(v.val) : Math.round(v.val));
      const currentClass = v.current ? ' is-current' : '';
      return '<div class="stats-bar-col' + currentClass + '">' +
        '<span class="stats-bar-val">' + display + '</span>' +
        '<div class="stats-bar" style="height:' + Math.max(pct, 2) + '%"></div>' +
        '<span class="stats-bar-label">' + v.label + '</span>' +
        '</div>';
    }).join('');
  }

  function renderStatsCharts() {
    renderBarChart('chart-distance', statsMonthly.map((m, i) => ({
      label: m.label, val: m.distanceKm, current: i === statsMonthly.length - 1
    })));
    renderBarChart('chart-dplus', statsMonthly.map((m, i) => ({
      label: m.label, val: m.dplusM, current: i === statsMonthly.length - 1
    })));
    renderBarChart('chart-pace', statsMonthly.map((m, i) => ({
      label: m.label, val: m.paceSecPerKm, current: i === statsMonthly.length - 1
    })), { invert: true, formatter: fmtPace });
    renderBarChart('chart-cadence', statsMonthly.map((m, i) => ({
      label: m.label, val: m.cadenceSpm, current: i === statsMonthly.length - 1
    })));
    renderBarChart('chart-hr', statsMonthly.map((m, i) => ({
      label: m.label, val: m.hrBpm, current: i === statsMonthly.length - 1
    })));
  }
  renderStatsCharts();

  // ===== Suivi nutrition (checklist simple) — stocké en local sur cet appareil =====
  function saveNutriLog(el) {
    const key = 'sancy-nutri-' + el.dataset.nutri;
    localStorage.setItem(key, el.checked ? '1' : '0');
    el.closest('.check-item').classList.toggle('done', el.checked);
  }
  function loadNutriLogs() {
    document.querySelectorAll('[data-nutri]').forEach(el => {
      const val = localStorage.getItem('sancy-nutri-' + el.dataset.nutri);
      el.checked = val === '1';
      el.closest('.check-item').classList.toggle('done', el.checked);
    });
  }
  loadNutriLogs();
