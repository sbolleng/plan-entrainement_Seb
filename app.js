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
    { date: new Date('2026-10-18T09:00:00'), name: 'Clam Trail · 10 K' },
    // Bloc d'automne-hiver tranché le 17/08/2026 : Rock'Angel puis D2B.
    { date: new Date('2026-12-05T09:00:00'), name: "Rock'Angel" },
    { date: new Date('2027-01-17T09:00:00'), name: 'D2B' },
    { date: new Date('2027-03-07T08:00:00'), name: 'Forez Trails' },
    { date: new Date('2027-09-12T10:00:00'), name: 'La Directissime' }
  ];

  function updateCountdown() {
    const now = new Date();
    const next = RACES.find(r => r.name === 'La Directissime');
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

  // ===== Stats · graphiques de progression (données Strava, calculées le 27/09/2026) =====
  // Pour mettre à jour : ajouter un mois par mois à la suite dans ce tableau.
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
    // continue (les blocs de marche les faussent) — laissés à null volontairement. C'est le
    // trou visible sur les graphes entre juin et septembre.
    { label: 'Juil', distanceKm: 17.3,  dplusM: 175,  paceSecPerKm: null, cadenceSpm: null, hrBpm: null, effBeats: null, dpk: 10.1 },
    { label: 'Août', distanceKm: 104.3, dplusM: 1454, paceSecPerKm: null, cadenceSpm: null, hrBpm: null, effBeats: null, dpk: 13.9 },
    // Septembre : protocole terminé le 5/09, course continue reprise. La mesure
    // reprend après le trou de juillet-août, calculée sur les 8 sorties du mois
    // (moyennes pondérées par le temps de déplacement de chaque sortie).
    { label: 'Sept', distanceKm: 89.1, dplusM: 876, paceSecPerKm: 311, cadenceSpm: 171, hrBpm: 154, effBeats: 800, dpk: 9.8 },
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
    renderBarChart('chart-cadence', seriesFrom('cadenceSpm'), { refLines: [{ val: 170, color: 'var(--accent2)' }] });
    renderBarChart('chart-efficiency', seriesFrom('effBeats'), { invert: true });

    // D+/km · réel + trajectoire cible jusqu'à la Directissime
    renderLineChart('chart-dpk', {
      height: 160,
      min: 0, max: 45,
      labels: ['Nov 25', '', '', '', 'Mar 26', '', '', '', 'Juil 26', '', '', '',
               'Nov 26', '', '', '', 'Mar 27', '', '', '', 'Juil 27', '', 'Sep 27'],
      formatter: v => v.toFixed(0),
      series: [
        {
          values: [6.4, 10.5, 8.7, 6.4, 17.7, 9.4, 10.0, 9.1,
                   10.1, 13.9, 9.8, null, null, null, null, null,
                   null, null, null, null, null, null, null],
          color: 'var(--accent)', showValues: [4, 7, 10]
        },
        {
          values: [null, null, null, null, null, null, null, 9.1,
                   5, 10, 13, 16, 18, 20, 22, 24,
                   33, 22, 28, 34, 40, 28, 23],
          color: '#7eb8f5', dashed: true, showValues: [16, 20, 22]
        }
      ],
      refLines: [
        { val: 33, color: 'var(--accent2)' },
        { val: 23, color: 'var(--red)' }
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

  // ===== Nutrition · rendu depuis data/nutrition.js =====
  function renderNutrition() {
    if (typeof NUTRITION_LOG === 'undefined') return;
    const ringsEl = document.getElementById('nutri-rings');
    if (!ringsEl) return;

    const NUTRI_KEYS = ['p', 'g', 'l', 'f', 's', 'w', 'cafe', 'alcool'];
    const MEAL_KEYS = ['p', 'g', 'l', 'f']; // ceux qu'une proposition de repas peut vraiment combler
    const byDate = {};
    NUTRITION_LOG.jours.forEach(function (j) { byDate[j.date] = j; });

    function emptyTotals() {
      const t = {};
      NUTRI_KEYS.forEach(function (k) { t[k] = 0; });
      return t;
    }

    function totalsFor(jour) {
      if (!jour) return null;
      const t = emptyTotals();
      jour.repas.forEach(function (r) { NUTRI_KEYS.forEach(function (k) { t[k] += r[k] || 0; }); });
      return t;
    }

    function isRespected(t) {
      return NUTRI_KEYS.every(function (k) {
        const target = NUTRITION_TARGETS[k];
        if (target.min !== null && t[k] < target.min) return false;
        if (target.max !== null && t[k] > target.max) return false;
        return true;
      });
    }

    // ---- Aujourd'hui : jauges + conseil ----
    const now = new Date();
    const todayKey = todayISO();
    const todayJour = byDate[todayKey];
    const todayTotals = totalsFor(todayJour) || emptyTotals();
    const hasToday = !!todayJour && todayJour.repas.length > 0;

    const dateEl = document.getElementById('nutri-date');
    if (dateEl) {
      const txt = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
      dateEl.textContent = txt.charAt(0).toUpperCase() + txt.slice(1);
    }

    const R = 42, C = 2 * Math.PI * R;
    function arc(startFrac, endFrac) {
      const len = Math.max(0, (endFrac - startFrac)) * C;
      return { dasharray: len.toFixed(2) + ' ' + C.toFixed(2), rotateDeg: (startFrac * 360).toFixed(2) };
    }

    function fmt(v) { return (Math.round(v * 10) / 10).toLocaleString('fr-FR'); }

    // café et alcool sont des compteurs (picto + Nx), pas des jauges continues.
    const COUNTER_ICONS = { cafe: '☕', alcool: '🍺' };

    ringsEl.innerHTML = NUTRI_KEYS.map(function (key) {
      const n = NUTRITION_TARGETS[key];
      const value = Math.round(todayTotals[key] * 10) / 10;
      const over = n.max !== null && value > n.max;
      const remaining = over
        ? 'Dépassé de ' + fmt(value - n.max) + n.unit
        : n.min !== null && value < n.min
        ? 'Reste ' + fmt(n.min - value) + n.unit
        : n.min !== null && n.max !== null
        ? 'Dans la cible'
        : n.max !== null
        ? 'Marge ' + fmt(n.max - value) + n.unit
        : 'Objectif atteint';

      if (COUNTER_ICONS[key]) {
        return (
          '<div class="nutrient nutrient-extra nutrient-counter">' +
            '<div class="nutrient-name">' + n.label + '</div>' +
            '<div class="counter-icon-wrap' + (over ? ' over' : '') + '"><span class="counter-icon">' + COUNTER_ICONS[key] + '</span></div>' +
            '<div class="counter-value' + (over ? ' over' : '') + '">' + fmt(value) + '×</div>' +
            (remaining ? '<div class="nutrient-sub">' + remaining + '</div>' : '') +
          '</div>'
        );
      }

      const bandStart = n.min !== null ? n.min / n.capBasis : 0;
      const bandEnd = n.max !== null ? n.max / n.capBasis : 1;
      const fillFrac = Math.min(1, value / n.capBasis);
      const band = arc(bandStart, bandEnd);
      const fill = arc(0, fillFrac);
      const targetTxt = n.min !== null && n.max !== null ? fmt(n.min) + '–' + fmt(n.max)
        : n.min !== null ? 'min ' + fmt(n.min)
        : 'max ' + fmt(n.max);
      return (
        '<div class="nutrient' + ((key === 'w' || key === 's') ? ' nutrient-extra' : '') + '">' +
          '<div class="nutrient-name">' + n.label + '</div>' +
          '<div class="ring-wrap">' +
            '<svg viewBox="0 0 100 100">' +
              '<circle cx="50" cy="50" r="' + R + '" fill="none" stroke="var(--surface2)" stroke-width="8"/>' +
              '<circle cx="50" cy="50" r="' + R + '" fill="none" stroke="rgba(74,222,128,0.35)" stroke-width="8" ' +
                'stroke-dasharray="' + band.dasharray + '" transform="rotate(' + band.rotateDeg + ' 50 50)"/>' +
              '<circle cx="50" cy="50" r="' + R + '" fill="none" stroke="' + (over ? 'var(--red)' : 'var(--accent)') + '" ' +
                'stroke-width="8" stroke-linecap="round" ' +
                'stroke-dasharray="' + fill.dasharray + '" transform="rotate(' + fill.rotateDeg + ' 50 50)"/>' +
            '</svg>' +
            '<div class="ring-center">' +
              '<span class="ring-current">' + fmt(value) + n.unit + '</span>' +
              '<span class="ring-target">' + targetTxt + n.unit + '</span>' +
            '</div>' +
          '</div>' +
          (remaining ? '<div class="nutrient-sub">' + remaining + '</div>' : '') +
        '</div>'
      );
    }).join('');

    const adviceEl = document.getElementById('nutri-advice');
    if (adviceEl) {
      if (!hasToday) {
        adviceEl.innerHTML = '<p class="lede">Aucun repas noté aujourd\'hui pour l\'instant — dis-moi ce que tu manges et je te propose la suite au fil de la journée.</p>';
      } else {
        // Repas manquants : seuls p/g/l/f peuvent vraiment se combler par une proposition de repas.
        const short = MEAL_KEYS
          .map(function (k) {
            const n = NUTRITION_TARGETS[k];
            return { key: k, n: n, gap: n.min - todayTotals[k], rel: (n.min - todayTotals[k]) / n.min };
          })
          .filter(function (x) { return x.gap > 0; })
          .sort(function (a, b) { return b.rel - a.rel; });

        // Eau : simple rappel, pas de proposition de repas.
        const water = NUTRITION_TARGETS.w;
        const waterVal = Math.round(todayTotals.w * 10) / 10;
        const waterMsg = waterVal < water.min
          ? 'Eau : ' + fmt(waterVal) + ' ' + water.unit + ' / ' + fmt(water.min) + ' ' + water.unit + ' — reste ' +
            fmt(water.min - waterVal) + ' ' + water.unit + ', pense à boire, surtout après une sortie.'
          : 'Eau : ' + fmt(waterVal) + ' ' + water.unit + ' / ' + fmt(water.min) + ' ' + water.unit + ' — objectif atteint.';

        // Macros déjà au-dessus de leur plafond : à signaler pour alléger la suite.
        const overMacros = MEAL_KEYS.filter(function (k) {
          const n = NUTRITION_TARGETS[k];
          return n.max !== null && todayTotals[k] > n.max;
        }).map(function (k) {
          const n = NUTRITION_TARGETS[k];
          return n.label + ' : ' + fmt(todayTotals[k]) + ' ' + n.unit + ' / max ' + fmt(n.max) + ' ' + n.unit +
            ' — déjà au-dessus du plafond, reste léger de ce côté pour la suite de la journée.';
        });

        // Plafonds simples (sel, café, alcool) : jamais une proposition, juste une marge ou une alerte.
        const capKeys = ['s', 'cafe', 'alcool'];
        const capMsgs = capKeys.map(function (k) {
          const n = NUTRITION_TARGETS[k];
          const v = Math.round(todayTotals[k] * 10) / 10;
          const advice = v > n.max ? n.overAdvice : v > n.max * 0.8 ? n.nearAdvice : n.fineAdvice;
          const sep = n.unit === '×' ? '' : ' ';
          return n.label + ' : ' + fmt(v) + sep + n.unit + ' / ' + fmt(n.max) + sep + n.unit + ' — ' + advice;
        });
        const extraLines = overMacros.concat([waterMsg]).concat(capMsgs).map(function (m) { return '<li>' + m + '</li>'; }).join('');

        if (short.length === 0) {
          adviceEl.innerHTML = '<p class="ok-msg">Toutes les cibles avec plancher sont déjà atteintes aujourd\'hui.</p><ul>' + extraLines + '</ul>';
        } else {
          const top = short.slice(0, 2);
          const names = top.map(function (x) { return 'des ' + x.n.label.toLowerCase(); });
          const namesTxt = names.length > 1 ? names[0] + ' et ' + names[1] : names[0];
          const pairKey = top.length > 1 ? [top[0].key, top[1].key].sort().join(',') : null;
          const mealSuggestion = pairKey && NUTRITION_PAIR_MEALS[pairKey] ? NUTRITION_PAIR_MEALS[pairKey] : null;
          adviceEl.innerHTML =
            '<p class="lede">D\'après les repas déjà loggés, il te manque surtout <strong>' + namesTxt +
            '</strong> pour finir la journée. <strong>Demande-moi</strong> à tout moment "qu\'est-ce que je mange ce soir ?" pour une proposition à jour' +
            (mealSuggestion ? ' — exemple pour l\'instant :</p><ul><li><strong>Proposition</strong> : ' + mealSuggestion + '</li>' : '.</p><ul>') +
            top.map(function (x) {
              return '<li><strong>' + x.n.label + '</strong> : reste ' + fmt(x.gap) + ' ' + x.n.unit +
                (x.n.sources ? ' — ' + x.n.sources : '') + '.</li>';
            }).join('') +
            extraLines +
            '</ul>';
        }
      }
    }

    // ---- Mois en cours : mosaïque + séries ----
    const calEl = document.getElementById('nutri-cal');
    if (calEl) {
      const year = now.getFullYear(), month = now.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      // Colonnes fixes lundi->dimanche : la case du 1er du mois se place sous
      // son vrai jour de semaine (ex. 1er septembre 2026 = mardi -> colonne 2,
      // colonne 1/lundi laissée vide).
      const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // 0 = lundi
      const todayDate = now.getDate();

      const statusByDay = {};
      for (let d = 1; d <= daysInMonth; d++) {
        const key = year + '-' + pad2(month + 1) + '-' + pad2(d);
        const t = totalsFor(byDate[key]);
        if (d > todayDate) statusByDay[d] = 'future';
        else if (!t) statusByDay[d] = 'none';
        else statusByDay[d] = isRespected(t) ? 'ok' : 'miss';
      }

      let html = '';
      for (let i = 0; i < firstWeekday; i++) html += '<div class="nutri-day future"></div>';
      for (let d = 1; d <= daysInMonth; d++) {
        let cls = 'nutri-day ' + statusByDay[d];
        if (d === todayDate) cls += ' today';
        html += '<div class="' + cls + '"></div>';
      }
      calEl.innerHTML = html;

      // Série en cours (en remontant depuis aujourd'hui) et meilleure série du mois.
      let current = 0;
      for (let d = todayDate; d >= 1; d--) {
        if (statusByDay[d] === 'ok') current++; else break;
      }
      let best = 0, run = 0;
      for (let d = 1; d <= todayDate; d++) {
        if (statusByDay[d] === 'ok') { run++; best = Math.max(best, run); } else { run = 0; }
      }

      const curEl = document.getElementById('nutri-streak-current');
      const bestEl = document.getElementById('nutri-streak-best');
      if (curEl) curEl.textContent = current;
      if (bestEl) bestEl.textContent = best;

      const todayStreakEl = document.getElementById('nutri-today-streak');
      if (todayStreakEl) {
        todayStreakEl.textContent = current > 0 ? '● ' + current + ' jour' + (current > 1 ? 's' : '') + ' respecté' + (current > 1 ? 's' : '') + ' d\'affilée' : '';
      }

      const monthLabelEl = document.getElementById('nutri-month-label');
      if (monthLabelEl) {
        const label = now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
        monthLabelEl.textContent = label.charAt(0).toUpperCase() + label.slice(1);
      }
    }
  }
  renderNutrition();

  // ===== Mise à jour automatique =====
  // GitHub Pages laisse le navigateur garder index.html en cache ~10 min, et
  // un onglet resté ouvert sur le téléphone ne se recharge jamais : on compare
  // la version affichée à celle en ligne et on recharge si elle est plus récente.
  function checkNewVersion() {
    const meta = document.querySelector('meta[name="site-version"]');
    if (!meta || !window.fetch || location.protocol === 'file:') return;
    const current = meta.content;
    fetch(location.pathname + '?check=' + Date.now(), { cache: 'no-store' })
      .then(r => (r.ok ? r.text() : ''))
      .then(html => {
        const m = html.match(/<meta name="site-version" content="([^"]+)"/);
        if (!m || m[1] <= current) return;
        try {
          if (sessionStorage.getItem('siteReloadedFor') === m[1]) return;
          sessionStorage.setItem('siteReloadedFor', m[1]);
        } catch (e) { /* stockage indisponible : on recharge quand même une fois */ }
        location.replace(location.pathname + '?v=' + m[1] + location.hash);
      })
      .catch(() => {});
  }
  checkNewVersion();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    markToday();
    renderNutrition();
    checkNewVersion();
  });
  window.addEventListener('pageshow', e => { if (e.persisted) checkNewVersion(); });

  // ===== Objectif · difficulté des courses (km-effort avec descente) =====
  // km-effort = distance + D+/100 + D−/200 (coefficient de descente choisi par
  // Seb le 29/09/2026). Courses en boucle : D− = D+. Dates des options
  // approximatives (« ~ »).
  const PLAN_DIFFICULTY = [
    { date: '2026-10-18', name: 'Clam Trail', km: 10, dp: 128, dm: 128, kind: 'firm' },
    { date: '2026-12-05', name: "Rock'Angel", km: 18.3, dp: 750, dm: 750, kind: 'firm' },
    { date: '2027-01-17', name: 'D2B', km: 23.5, dp: 300, dm: 300, kind: 'firm', note: 'sable : difficulté sous-estimée par la formule' },
    { date: '2027-03-07', name: "Forez · L'Augerolloise", km: 33, dp: 1100, dm: 1100, kind: 'firm', label: 'Forez 27' },
    { date: '2027-05-30', name: 'Maxi-Race · Marathon eXpérience', km: 42, dp: 1700, dm: 1700, kind: 'option', approx: true },
    { date: '2027-06-15', name: 'Sancy Trail · Chambon Neige et Lac', km: 24, dp: 1160, dm: 1160, kind: 'option', approx: true },
    { date: '2027-06-26', name: 'Trail du Bois des Côtes · 32 km', km: 32, dp: 1250, dm: 1250, kind: 'option', approx: true },
    { date: '2027-06-28', name: 'Trail des 3 Pics · T3P L', km: 36, dp: 2200, dm: 2200, kind: 'option', approx: true, label: 'T3P L' },
    { date: '2027-07-18', name: 'Trail des 4×1800', km: 32, dp: 2000, dm: 2000, kind: 'option', approx: true },
    { date: '2027-09-12', name: 'La Directissime', km: 34, dp: 770, dm: 1800, kind: 'goal', approx: true, label: 'Directissime' }
  ];

  function kmEffort(r) { return r.km + r.dp / 100 + r.dm / 200; }

  function renderDifficultyChart() {
    const el = document.getElementById('chart-difficulty');
    if (!el) return;

    const t0 = new Date('2026-09-20').getTime(), t1 = new Date('2027-10-10').getTime();
    const yMax = 80;
    const xAt = d => 3 + ((new Date(d + 'T12:00:00').getTime() - t0) / (t1 - t0)) * 94;
    const yAt = v => 6 + (1 - v / yMax) * 86;
    const nf = v => (Math.round(v * 10) / 10).toLocaleString('fr-FR');
    const COLORS = { past: 'var(--muted)', firm: 'var(--accent)', option: 'var(--accent)', goal: '#b482ff' };

    const pts = PLAN_DIFFICULTY.map(r => Object.assign({}, r, { ke: kmEffort(r), x: xAt(r.date) }))
      .map(r => Object.assign(r, { y: yAt(r.ke) }));

    let svg = '';
    [20, 40, 60, 80].forEach(v => {
      svg += '<line x1="0" x2="100" y1="' + yAt(v) + '" y2="' + yAt(v) +
        '" stroke="var(--border)" stroke-width="1" vector-effect="non-scaling-stroke" />';
    });
    const path = pts.filter(p => p.kind === 'firm' || p.kind === 'goal').map(p => p.x + ',' + p.y).join(' ');
    svg += '<polyline points="' + path + '" fill="none" stroke="var(--accent)" stroke-width="2" ' +
      'vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round" />';

    el.innerHTML =
      '<div class="dc-plot">' +
        '<svg viewBox="0 0 100 100" preserveAspectRatio="none">' + svg + '</svg>' +
        [20, 40, 60, 80].map(v => '<span class="dc-ytick" style="bottom:' + (100 - yAt(v)) + '%">' + v + '</span>').join('') +
        '<div class="dc-tip" role="status" hidden></div>' +
      '</div>' +
      '<div class="dc-xaxis"></div>';

    const plot = el.querySelector('.dc-plot');
    const tip = el.querySelector('.dc-tip');

    function showTip(p, dot) {
      tip.textContent = '';
      const v = document.createElement('strong');
      v.textContent = nf(p.ke) + ' km-effort';
      const n = document.createElement('div');
      n.textContent = p.name + (p.kind === 'option' ? ' (option)' : '');
      const d = document.createElement('div');
      d.className = 'dc-tip-sub';
      const dateTxt = new Date(p.date + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
      d.textContent = (p.approx ? '~' : '') + dateTxt + ' · ' + nf(p.km) + ' km · +' + p.dp + ' / −' + p.dm + ' m' +
        (p.note ? ' · ' + p.note : '');
      tip.append(v, n, d);
      tip.hidden = false;
      tip.style.left = Math.min(Math.max(p.x, 18), 82) + '%';
      tip.style.bottom = (100 - p.y) + '%';
      plot.querySelectorAll('.dc-dot.is-on').forEach(x => x.classList.remove('is-on'));
      dot.classList.add('is-on');
    }
    function hideTip() {
      tip.hidden = true;
      plot.querySelectorAll('.dc-dot.is-on').forEach(x => x.classList.remove('is-on'));
    }

    pts.forEach(p => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'dc-dot dc-' + p.kind;
      dot.style.left = p.x + '%';
      dot.style.bottom = (100 - p.y) + '%';
      dot.style.setProperty('--dc-color', COLORS[p.kind]);
      dot.setAttribute('aria-label', p.name + ' : ' + nf(p.ke) + ' km-effort');
      dot.addEventListener('pointerenter', () => showTip(p, dot));
      dot.addEventListener('focus', () => showTip(p, dot));
      dot.addEventListener('click', () => showTip(p, dot));
      dot.addEventListener('pointerleave', hideTip);
      dot.addEventListener('blur', hideTip);
      plot.appendChild(dot);
      if (p.label) {
        const lb = document.createElement('span');
        lb.className = 'dc-label';
        lb.style.left = p.x + '%';
        lb.style.bottom = (100 - p.y) + '%';
        if (p.x > 85) lb.classList.add('is-end');
        lb.textContent = p.label + ' · ' + Math.round(p.ke);
        plot.appendChild(lb);
      }
    });

    const axis = el.querySelector('.dc-xaxis');
    ['2026-10-01', '2026-12-01', '2027-02-01', '2027-04-01', '2027-06-01', '2027-08-01', '2027-10-01'].forEach(d => {
      const s = document.createElement('span');
      s.style.left = xAt(d) + '%';
      const m = new Date(d + 'T12:00:00');
      s.textContent = m.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '') + ' ' + String(m.getFullYear()).slice(2);
      axis.appendChild(s);
    });

    const tbody = document.getElementById('difficulty-table');
    if (tbody) {
      tbody.textContent = '';
      pts.forEach(p => {
        const tr = document.createElement('tr');
        const kindTxt = { past: 'courue', firm: 'prévue', option: 'option', goal: 'objectif' }[p.kind];
        [(p.approx ? '~' : '') + new Date(p.date + 'T12:00:00').toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
         p.name, kindTxt, nf(p.km) + ' km', '+' + p.dp + ' / −' + p.dm, nf(p.ke)].forEach((txt, i) => {
          const td = document.createElement('td');
          td.textContent = txt;
          if (i === 2 || i === 0) td.className = 'muted';
          if (i === 5) td.className = 'mono';
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    }
  }
  renderDifficultyChart();
