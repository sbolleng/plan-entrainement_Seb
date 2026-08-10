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

  // ===== Comptes à rebours =====
  // Une date sans heure (2027-01-31) est interprétée à minuit, heure locale.
  function parseTarget(str) {
    return new Date(str.indexOf('T') === -1 ? str + 'T00:00:00' : str);
  }

  // Décompose un écart en millisecondes en jours / heures / minutes / secondes.
  function splitDelay(ms) {
    return {
      d: Math.floor(ms / 86400000),
      h: Math.floor(ms / 3600000) % 24,
      m: Math.floor(ms / 60000) % 60,
      s: Math.floor(ms / 1000) % 60
    };
  }

  function updateTimelineCountdowns() {
    const now = new Date();
    document.querySelectorAll('.tl-countdown[data-target]').forEach(el => {
      const target = parseTarget(el.dataset.target);
      const diff = Math.round((target - now) / (1000 * 60 * 60 * 24));
      el.textContent = diff > 0 ? 'J-' + diff : (diff === 0 ? "aujourd'hui" : 'J+' + Math.abs(diff));
    });
  }
  updateTimelineCountdowns();

  // ===== Compteur J / H / M / S par course (onglet Objectif) =====
  const CD_UNITS = [
    { key: 'd', label: 'Jours' },
    { key: 'h', label: 'Heures' },
    { key: 'm', label: 'Minutes' },
    { key: 's', label: 'Secondes' }
  ];

  function buildRaceCountdowns() {
    document.querySelectorAll('.race-cd[data-target]').forEach(el => {
      if (el.dataset.built) return;
      el.innerHTML = CD_UNITS.map(u =>
        '<div class="rc-cell"><span class="rc-num" data-unit="' + u.key + '">--</span>' +
        '<span class="rc-lab">' + u.label + '</span></div>'
      ).join('');
      el.dataset.built = '1';
    });
  }

  function updateRaceCountdowns() {
    const now = Date.now();
    document.querySelectorAll('.race-cd[data-target]').forEach(el => {
      const diff = parseTarget(el.dataset.target).getTime() - now;
      if (diff <= 0) {
        if (!el.classList.contains('is-past')) {
          el.classList.add('is-past');
          el.innerHTML = 'Course courue';
        }
        return;
      }
      const t = splitDelay(diff);
      el.querySelectorAll('.rc-num').forEach(num => {
        const v = t[num.dataset.unit];
        num.textContent = num.dataset.unit === 'd' ? v : String(v).padStart(2, '0');
      });
    });
  }
  buildRaceCountdowns();
  updateRaceCountdowns();

  // ===== Compteur d'en-tête · prochaine course de la feuille de route =====
  const RACES = [
    { date: new Date('2026-10-18T09:00:00'), name: 'Clam Trail' },
    // Le bloc d'automne-hiver n'est pas tranché : on vise la première échéance
    // possible (Deauville 15/11), puis la première course d'hiver possible (D2B 17/01).
    { date: new Date('2026-11-15T08:00:00'), name: "bloc hiver · option à trancher" },
    { date: new Date('2027-01-17T09:00:00'), name: "course d'hiver · option à trancher" },
    { date: new Date('2027-03-07T08:00:00'), name: 'Forez Trails' },
    { date: new Date('2027-09-12T07:00:00'), name: 'Sancy' }
  ];

  function updateCountdown() {
    const now = new Date();
    const next = RACES.find(r => r.date > now);
    if (!next) return;
    const t = splitDelay(next.date - now);
    document.getElementById('countdown-days').textContent = t.d;
    document.getElementById('countdown-label').textContent = t.d > 1 ? 'jours' : 'jour';
    document.getElementById('countdown-hms').textContent =
      String(t.h).padStart(2, '0') + 'h ' + String(t.m).padStart(2, '0') + 'm ' + String(t.s).padStart(2, '0') + 's';
    document.getElementById('countdown-sub').textContent = '→ ' + next.name;
  }
  updateCountdown();

  // Un seul intervalle pour tous les compteurs à la seconde.
  setInterval(function () {
    updateCountdown();
    updateRaceCountdowns();
    updateTimelineCountdowns();
  }, 1000);

  // ===== Highlight dynamique du jour en cours =====
  function pad2(n) { return n.toString().padStart(2, '0'); }
  function todayISO() {
    const d = new Date();
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }
  function markToday() {
    const t = todayISO();
    document.querySelectorAll('.day-row[data-date]').forEach(row => {
      const d = row.dataset.date;
      row.classList.remove('is-today', 'is-past');
      if (d === t) row.classList.add('is-today');
      else if (d < t) row.classList.add('is-past');
    });
  }
  markToday();

  // ===== Stats · graphiques de progression (données Strava, calculées le 10/08/2026) =====
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
    // Juillet et août sont des mois de reprise course/marche : la distance et le D+ sont
    // réels, mais allure, cadence et efficience ne sont pas comparables aux mois de course
    // continue (les blocs de marche les faussent) — laissés à null volontairement.
    { label: 'Juil', distanceKm: 17.3,  dplusM: 175,  paceSecPerKm: null, cadenceSpm: null, hrBpm: null, effBeats: null, dpk: 10.1 },
    { label: 'Août', distanceKm: 31.2,  dplusM: 613,  paceSecPerKm: null, cadenceSpm: null, hrBpm: null, effBeats: null, dpk: 19.7 },
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



  // ===== Renfo · indicateurs calculés depuis data/renfo.js =====
  const DOM_LABEL = { F: 'Cuisses · force', S: 'Stabilité · fessiers', A: 'Abdos · tronc', H: 'Haut du corps' };
  const DOM_TAG   = { F: 'tag-green', S: 'tag-orange', A: 'tag-purple', H: 'tag-blue' };

  // Tonnage = charge externe uniquement. Le poids du corps n'est pas compté :
  // il fausserait la comparaison entre un exercice lesté et une planche.
  function tonnage(ex) { return ex.tenue ? 0 : ex.series * ex.reps * ex.charge; }
  function seanceTonnage(s) { return s.exercices.reduce((a, e) => a + tonnage(e), 0); }

  function daysBetween(a, b) { return Math.round((b - a) / 86400000); }

  // Lundi de la semaine ISO contenant d
  function weekStart(d) {
    const x = new Date(d);
    x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
    x.setHours(0, 0, 0, 0);
    return x;
  }

  function renderRenfo() {
    if (typeof RENFO_LOG === 'undefined') return;
    const el = document.getElementById('renfo-kpi');
    if (!el) return;

    const seances = RENFO_LOG.seances.map(s => ({ ...s, d: new Date(s.date + 'T12:00:00') }))
                                     .sort((a, b) => a.d - b.d);
    if (!seances.length) return;
    const now = new Date();

    // --- tuiles ---
    const last7 = seances.filter(s => daysBetween(s.d, now) < 7);
    const tonnage7 = last7.reduce((a, s) => a + seanceTonnage(s), 0);

    const parDom = {};
    last7.forEach(s => s.exercices.forEach(e => { parDom[e.dom] = (parDom[e.dom] || 0) + tonnage(e); }));
    const domTop = Object.keys(parDom).sort((a, b) => parDom[b] - parDom[a])[0];

    const derniereF = seances.filter(s => s.exercices.some(e => e.dom === 'F')).pop();
    const joursF = derniereF ? daysBetween(derniereF.d, now) : null;

    const tuile = (k, v, sub, alerte) =>
      '<div class="rk-tile' + (alerte ? ' is-alert' : '') + '">' +
      '<span class="rk-key">' + k + '</span>' +
      '<span class="rk-val">' + v + '</span>' +
      '<span class="rk-sub">' + sub + '</span></div>';

    el.innerHTML =
      tuile('Séances · 7 jours', last7.length, last7.length ? 'objectif 5 par semaine' : 'aucune séance', last7.length < 3) +
      tuile('Tonnage · 7 jours', tonnage7.toLocaleString('fr-FR') + ' kg', 'charge externe soulevée', false) +
      tuile('Dominante servie', domTop ? DOM_LABEL[domTop] : '—', domTop ? Math.round(parDom[domTop] / tonnage7 * 100) + ' % du tonnage' : 'aucune donnée', false) +
      tuile('Depuis les cuisses', joursF === null ? '—' : joursF + ' j', 'dernière séance dominante F', joursF !== null && joursF > 7);

    // --- tonnage par semaine, 8 dernières semaines ---
    const semaines = [];
    for (let i = 7; i >= 0; i--) {
      const start = weekStart(new Date(now.getTime() - i * 7 * 86400000));
      const end = new Date(start.getTime() + 7 * 86400000);
      const dedans = seances.filter(s => s.d >= start && s.d < end);
      semaines.push({
        label: String(start.getDate()).padStart(2, '0') + '/' + String(start.getMonth() + 1).padStart(2, '0'),
        val: dedans.length ? dedans.reduce((a, s) => a + seanceTonnage(s), 0) : null,
        current: i === 0
      });
    }
    renderBarChart('chart-renfo', semaines, { formatter: v => Math.round(v / 100) / 10 + ' t' });

    // --- progression de charge par exercice ---
    const parExo = {};
    seances.forEach(s => s.exercices.forEach(e => {
      (parExo[e.nom] = parExo[e.nom] || []).push({ date: s.date, e: e, dom: e.dom });
    }));
    const lignes = Object.keys(parExo).sort().map(nom => {
      const h = parExo[nom];
      const d = h[h.length - 1], p = h.length > 1 ? h[h.length - 2] : null;
      const vol = d.e.series * d.e.reps;
      const volPrec = p ? p.e.series * p.e.reps : null;
      let tend = '<span class="muted">première fois</span>';
      if (p) {
        const dc = d.e.charge - p.e.charge, dv = vol - volPrec;
        if (dc > 0) tend = '<span class="rk-up">+' + dc + ' kg</span>';
        else if (dc < 0) tend = '<span class="rk-down">' + dc + ' kg</span>';
        else if (dv > 0) tend = '<span class="rk-up">+' + dv + ' reps</span>';
        else if (dv < 0) tend = '<span class="rk-down">' + dv + ' reps</span>';
        else tend = '<span class="muted">stable</span>';
      }
      const charge = d.e.charge ? d.e.charge + ' kg' : 'poids du corps';
      const fait = d.e.series + '×' + d.e.reps + (d.e.tenue ? ' s' : '');
      return '<tr><td><strong>' + nom + '</strong></td>' +
        '<td><span class="tag ' + DOM_TAG[d.dom] + '" style="margin:0;">' + d.dom + '</span></td>' +
        '<td><span class="mono" style="font-size:0.76rem;">' + fait + '</span></td>' +
        '<td><span class="mono" style="font-size:0.76rem;">' + charge + '</span></td>' +
        '<td>' + tend + '</td>' +
        '<td><span class="muted" style="font-size:0.75rem;">' + d.date.split('-').reverse().slice(0, 2).join('/') + ' · ' + h.length + ' fois</span></td></tr>';
    }).join('');
    const tb = document.getElementById('renfo-exos');
    if (tb) tb.innerHTML = lignes;

    const maj = document.getElementById('renfo-maj');
    if (maj) maj.textContent = 'Mis à jour le ' + RENFO_LOG.maj.split('-').reverse().join('/') +
      ' · ' + seances.length + ' séances enregistrées depuis le ' + seances[0].date.split('-').reverse().join('/');
  }
  renderRenfo();
