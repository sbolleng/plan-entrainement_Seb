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

  // ===== Stats · graphiques de progression (données Strava, calculées le 20/07/2026) =====
  // Pour mettre à jour : remplacer ce tableau par un export frais depuis Strava.
  // paceSecPerKm = allure d'effort (km-effort = km + D+/100), extérieur uniquement.
  // effBeats = battements par km-effort (efficience cardiaque, baisse = mieux).
  const statsMonthly = [
    { label: 'Nov',  distanceKm: 68.1,  dplusM: 436,  paceSecPerKm: 322, cadenceSpm: 154, hrBpm: 152, effBeats: 773, dpk: 6.4 },
    { label: 'Déc',  distanceKm: 75.1,  dplusM: 790,  paceSecPerKm: 350, cadenceSpm: 151, hrBpm: 151, effBeats: 862, dpk: 10.5 },
    { label: 'Jan',  distanceKm: 71.4,  dplusM: 621,  paceSecPerKm: 326, cadenceSpm: 161, hrBpm: 156, effBeats: 875, dpk: 8.7 },
    { label: 'Fév',  distanceKm: 62.4,  dplusM: 402,  paceSecPerKm: 319, cadenceSpm: 158, hrBpm: 165, effBeats: 893, dpk: 6.4 },
    { label: 'Mar',  distanceKm: 72.8,  dplusM: 1290, paceSecPerKm: 325, cadenceSpm: 163, hrBpm: 163, effBeats: 861, dpk: 17.7 },
    { label: 'Avr',  distanceKm: 118.9, dplusM: 1118, paceSecPerKm: 332, cadenceSpm: 163, hrBpm: 156, effBeats: 825, dpk: 9.4 },
    { label: 'Mai',  distanceKm: 65.1,  dplusM: 650,  paceSecPerKm: 339, cadenceSpm: 163, hrBpm: 160, effBeats: 780, dpk: 10.0 },
    { label: 'Juin', distanceKm: 75.5,  dplusM: 690,  paceSecPerKm: 307, cadenceSpm: 167, hrBpm: 145, effBeats: 781, dpk: 9.1 },
    { label: 'Juil', distanceKm: null,  dplusM: null, paceSecPerKm: null, cadenceSpm: null, hrBpm: null, effBeats: null, dpk: null },
  ];

  function fmtPace(sec) {
    if (sec === null || sec === undefined) return '—';
    const m = Math.floor(sec / 60), s = Math.round(sec % 60);
    return m + ':' + String(s).padStart(2, '0');
  }

  // Régression linéaire simple sur les points non nuls -> {slope, intercept}
  function linreg(values) {
    const pts = [];
    values.forEach((v, i) => { if (v !== null && v !== undefined) pts.push([i, v]); });
    if (pts.length < 2) return null;
    const n = pts.length;
    const sx = pts.reduce((a, p) => a + p[0], 0);
    const sy = pts.reduce((a, p) => a + p[1], 0);
    const sxy = pts.reduce((a, p) => a + p[0] * p[1], 0);
    const sxx = pts.reduce((a, p) => a + p[0] * p[0], 0);
    const denom = n * sxx - sx * sx;
    if (!denom) return null;
    const slope = (n * sxy - sx * sy) / denom;
    return { slope: slope, intercept: (sy - slope * sx) / n, first: pts[0][0], last: pts[pts.length - 1][0] };
  }

  function renderBarChart(containerId, series, opts) {
    const el = document.getElementById(containerId);
    if (!el) return;
    opts = opts || {};
    const raw = series.map(s => s.val);
    const nums = raw.filter(v => v !== null && v !== undefined);
    if (!nums.length) return;

    const max = opts.max !== undefined ? opts.max : Math.max(...nums);
    const min = opts.invert ? Math.min(...nums) : 0;
    // hauteur en % : pour les métriques "plus bas = mieux" (allure, battements) on inverse
    const toPct = function (v) {
      if (v === null || v === undefined) return 0;
      if (opts.invert) {
        if (max === min) return 60;
        return ((max - v) / (max - min)) * 70 + 25;
      }
      return (v / max) * 100;
    };

    const cols = series.map(s => {
      const pct = Math.max(toPct(s.val), 2);
      const empty = (s.val === null || s.val === undefined);
      const display = empty ? '—' : (opts.formatter ? opts.formatter(s.val) : Math.round(s.val));
      const cls = 'stats-col' + (s.current ? ' is-current' : '') + (empty ? ' is-empty' : '');
      return '<div class="' + cls + '">' +
        '<div class="stats-bar" style="height:' + pct + '%"></div>' +
        '<span class="stats-val" style="bottom:' + pct + '%">' + display + '</span>' +
        '</div>';
    }).join('');

    // Ligne de tendance
    let svg = '';
    const parts = [];
    if (opts.trend !== false) {
      const reg = linreg(raw);
      if (reg) {
        const n = series.length;
        const xAt = function (i) { return ((i + 0.5) / n) * 100; };
        const y1 = 100 - toPct(reg.intercept + reg.slope * reg.first);
        const y2 = 100 - toPct(reg.intercept + reg.slope * reg.last);
        parts.push('<line x1="' + xAt(reg.first) + '" y1="' + y1 + '" x2="' + xAt(reg.last) + '" y2="' + y2 +
          '" stroke="var(--accent2)" stroke-width="1.5" stroke-dasharray="4 3" vector-effect="non-scaling-stroke" />');
      }
    }
    // Lignes de référence horizontales
    (opts.refLines || []).forEach(function (r) {
      const y = 100 - toPct(r.val);
      parts.push('<line x1="0" y1="' + y + '" x2="100" y2="' + y + '" stroke="' + (r.color || 'var(--red)') +
        '" stroke-width="1" stroke-dasharray="2 3" vector-effect="non-scaling-stroke" />');
    });
    if (parts.length) {
      svg = '<svg class="stats-trend" viewBox="0 0 100 100" preserveAspectRatio="none">' + parts.join('') + '</svg>';
    }

    const labels = series.map(s => '<span>' + s.label + '</span>').join('');
    el.innerHTML = '<div class="stats-plot">' + cols + svg + '</div>' +
                   '<div class="stats-labels">' + labels + '</div>';
  }

  function seriesFrom(key) {
    return statsMonthly.map((m, i) => ({
      label: m.label, val: m[key], current: i === statsMonthly.length - 1
    }));
  }

  // ---- Graphiques en courbe (SVG + points positionnés) --------------------
  // Les propriétés de layout critiques sont posées en inline pour rester
  // fonctionnelles même si la feuille de style n'est pas à jour.
  function renderLineChart(containerId, cfg) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const H = cfg.height || 140;
    const all = [];
    cfg.series.forEach(s => s.values.forEach(v => { if (v !== null && v !== undefined) all.push(v); }));
    (cfg.refLines || []).forEach(r => all.push(r.val));
    if (!all.length) return;

    const min = cfg.min !== undefined ? cfg.min : Math.min(...all);
    const max = cfg.max !== undefined ? cfg.max : Math.max(...all);
    const span = (max - min) || 1;
    const n = cfg.labels.length;

    const xAt = i => n > 1 ? 4 + (i / (n - 1)) * 92 : 50;
    const yAt = v => 8 + (1 - (v - min) / span) * 84;   // 0 = haut

    let svgParts = '';

    (cfg.refLines || []).forEach(function (r) {
      const y = yAt(r.val);
      svgParts += '<line x1="0" y1="' + y + '" x2="100" y2="' + y + '" stroke="' + r.color +
        '" stroke-width="1" stroke-dasharray="3 3" vector-effect="non-scaling-stroke" opacity="0.7" />';
    });

    cfg.series.forEach(function (s) {
      const pts = [];
      s.values.forEach(function (v, i) {
        if (v !== null && v !== undefined) pts.push(xAt(i) + ',' + yAt(v));
      });
      if (pts.length > 1) {
        svgParts += '<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + s.color +
          '" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"' +
          (s.dashed ? ' stroke-dasharray="5 4"' : '') + ' />';
      }
    });

    let dots = '';
    cfg.series.forEach(function (s) {
      s.values.forEach(function (v, i) {
        if (v === null || v === undefined) return;
        const left = xAt(i), bottom = 100 - yAt(v);
        dots += '<span style="position:absolute;left:' + left + '%;bottom:' + bottom +
          '%;width:7px;height:7px;border-radius:50%;background:' + s.color +
          ';transform:translate(-50%,50%);"></span>';
        const show = s.showValues === 'all' || (Array.isArray(s.showValues) && s.showValues.indexOf(i) !== -1);
        if (show) {
          const txt = cfg.formatter ? cfg.formatter(v) : v;
          dots += '<span style="position:absolute;left:' + left + '%;bottom:' + bottom +
            '%;transform:translate(-50%,0);margin-bottom:9px;font-family:\'Space Mono\',monospace;' +
            'font-size:0.55rem;color:var(--muted);white-space:nowrap;">' + txt + '</span>';
        }
      });
    });

    const labels = cfg.labels.map(function (lb, i) {
      if (!lb) return '';
      return '<span style="position:absolute;left:' + xAt(i) + '%;transform:translateX(-50%);' +
        'font-size:0.58rem;color:var(--muted);white-space:nowrap;">' + lb + '</span>';
    }).join('');

    el.innerHTML =
      '<div style="position:relative;height:' + H + 'px;">' +
        '<svg viewBox="0 0 100 100" preserveAspectRatio="none" ' +
        'style="position:absolute;inset:0;width:100%;height:100%;overflow:visible;">' + svgParts + '</svg>' +
        dots +
      '</div>' +
      '<div style="position:relative;height:1.1rem;margin-top:0.5rem;">' + labels + '</div>';
  }

  function renderStatsCharts() {
    renderBarChart('chart-distance', seriesFrom('distanceKm'));
    renderBarChart('chart-dplus', seriesFrom('dplusM'));
    renderBarChart('chart-pace', seriesFrom('paceSecPerKm'), { invert: true, formatter: fmtPace });

    const moisReels = ['Nov', 'Déc', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];

    // Cadence · courbe
    renderLineChart('chart-cadence', {
      labels: moisReels,
      min: 145, max: 172,
      series: [{
        values: statsMonthly.slice(0, 8).map(m => m.cadenceSpm),
        color: 'var(--accent)', showValues: 'all'
      }],
      refLines: [{ val: 170, color: 'var(--accent2)' }]
    });

    // Efficience cardiaque · courbe (baisse = mieux)
    renderLineChart('chart-efficiency', {
      labels: moisReels,
      min: 750, max: 910,
      series: [{
        values: statsMonthly.slice(0, 8).map(m => m.effBeats),
        color: 'var(--accent)', showValues: 'all'
      }]
    });

    // D+/km · réel + trajectoire cible jusqu'au Sancy
    renderLineChart('chart-dpk', {
      height: 160,
      min: 0, max: 65,
      labels: ['Nov 25', '', '', '', 'Mar 26', '', '', '', 'Juil 26', '', '', '',
               'Nov 26', '', '', '', 'Mar 27', '', '', '', 'Juil 27', '', 'Sep 27'],
      formatter: v => v.toFixed(0),
      series: [
        {
          values: [6.4, 10.5, 8.7, 6.4, 17.7, 9.4, 10.0, 9.1,
                   null, null, null, null, null, null, null, null,
                   null, null, null, null, null, null, null],
          color: 'var(--accent)', showValues: [4, 7]
        },
        {
          values: [null, null, null, null, null, null, null, 9.1,
                   5, 10, 13, 16, 18, 20, 22, 24,
                   33, 22, 28, 34, 40, 28, 60],
          color: '#7eb8f5', dashed: true, showValues: [16, 20, 22]
        }
      ],
      refLines: [
        { val: 33, color: 'var(--accent2)' },
        { val: 60, color: 'var(--red)' }
      ]
    });
  }
  renderStatsCharts();

  // ===== Plan de reprise (Clinique du Coureur) — stocké en local =====
  function updateRepCounts() {
    for (let w = 1; w <= 8; w++) {
      const boxes = document.querySelectorAll('input[data-rep^="S' + w + '-"]');
      let done = 0;
      boxes.forEach(b => { if (b.checked) done++; });
      const badge = document.querySelector('.rep-week-count[data-week="' + w + '"]');
      if (badge) badge.textContent = done + '/5';
    }
  }
  function saveRep(el) {
    localStorage.setItem('sancy-rep-' + el.dataset.rep, el.checked ? '1' : '0');
    const row = el.closest('.rep-row');
    if (row) row.classList.toggle('done', el.checked);
    updateRepCounts();
  }
  function loadRep() {
    document.querySelectorAll('[data-rep]').forEach(el => {
      const val = localStorage.getItem('sancy-rep-' + el.dataset.rep);
      if (val !== null) {
        el.checked = val === '1';
        const row = el.closest('.rep-row');
        if (row) row.classList.toggle('done', el.checked);
      }
    });
    updateRepCounts();
  }
  loadRep();

