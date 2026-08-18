/* JDP — navigation et comptes à rebours.
   Repris d'app.js, réduit à ce dont cette page a besoin : pas de stats, pas
   de renfo, pas de graphiques tant qu'il n'y a pas de données. */

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

// Une date sans heure (2027-01-09) est interprétée à minuit, heure locale.
function parseTarget(str) {
  return new Date(str.indexOf('T') === -1 ? str + 'T00:00:00' : str);
}

function splitDelay(ms) {
  return {
    d: Math.floor(ms / 86400000),
    h: Math.floor(ms / 3600000) % 24,
    m: Math.floor(ms / 60000) % 60,
    s: Math.floor(ms / 1000) % 60
  };
}

// ===== Pastilles J-nn =====
function updateTimelineCountdowns() {
  const now = new Date();
  document.querySelectorAll('.tl-countdown[data-target]').forEach(el => {
    const diff = Math.round((parseTarget(el.dataset.target) - now) / 86400000);
    el.textContent = diff > 0 ? 'J-' + diff : (diff === 0 ? "aujourd'hui" : 'J+' + Math.abs(diff));
  });
}

// ===== Compteur J / H / M / S par course =====
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

// ===== Compteur d'en-tête · l'objectif, pas la prochaine course =====
// Contrairement au site d'origine, le gros compteur reste braqué sur Paris
// 2028 du début à la fin. La prochaine étape défile en dessous, en petit.
const PARIS = new Date('2028-04-09T08:45:00');

const STEPS = [
  { date: new Date('2026-10-04T09:00:00'), name: 'Semi de San Sebastián' },
  { date: new Date('2026-11-15T09:00:00'), name: 'Trail du Béret' },
  { date: new Date('2027-01-09T18:00:00'), name: 'Nocturne des Rois' },
  { date: new Date('2027-03-07T08:00:00'), name: "L'Augerolloise" },
  { date: new Date('2027-03-28T09:30:00'), name: 'Montauban · 10 km ou semi' },
  { date: new Date('2027-09-19T09:00:00'), name: 'Semi test · à trouver' },
  { date: new Date('2027-10-24T08:00:00'), name: "Trail d'automne · à définir" }
];

function updateCountdown() {
  const now = new Date();
  const t = splitDelay(PARIS - now);
  document.getElementById('countdown-days').textContent = t.d;
  document.getElementById('countdown-label').textContent = t.d > 1 ? 'jours' : 'jour';
  document.getElementById('countdown-hms').textContent =
    String(t.h).padStart(2, '0') + 'h ' + String(t.m).padStart(2, '0') + 'm ' + String(t.s).padStart(2, '0') + 's';

  const next = STEPS.find(s => s.date > now);
  const el = document.getElementById('countdown-next');
  if (el) {
    el.textContent = next
      ? 'prochaine étape · ' + next.name + ' · J-' + Math.round((next.date - now) / 86400000)
      : 'toutes les étapes sont passées';
  }
}

buildRaceCountdowns();
updateRaceCountdowns();
updateTimelineCountdowns();
updateCountdown();

setInterval(function () {
  updateCountdown();
  updateRaceCountdowns();
  updateTimelineCountdowns();
}, 1000);

// ===== Profil · graphiques de progression =====================================
// Données issues de l'export Strava complet du 18/08/2026 (compte JDP).
// Recalculées sur les douze derniers mois glissants, septembre 2025 → août 2026.
// Août 2026 est un mois partiel : il s'arrête à la dernière activité, le 16.
//
// paceEffortSec = allure d'effort en secondes par km-effort, où le km-effort
// ajoute 1 km fictif tous les 100 m de D+ (convention trail française). C'est
// ce qui permet de comparer un footing plat à une sortie en montagne.
// effBeats = battements par km-effort. Plus bas = meilleur rendement cardiaque.
const statsMonthly = [
  { label: 'Sep',  distanceKm: 98.6,  dplusM: 685,  paceEffortSec: 354, hrBpm: 168, effBeats: 992,  dpk: 6.9, renfoCount: 3 },
  { label: 'Oct',  distanceKm: 80.3,  dplusM: 401,  paceEffortSec: 351, hrBpm: 162, effBeats: 950,  dpk: 5.0, renfoCount: 4 },
  { label: 'Nov',  distanceKm: 88.4,  dplusM: 751,  paceEffortSec: 353, hrBpm: 159, effBeats: 938,  dpk: 8.5, renfoCount: 5 },
  { label: 'Déc',  distanceKm: 53.8,  dplusM: 659,  paceEffortSec: 378, hrBpm: 158, effBeats: 993,  dpk: 12.3, renfoCount: 4 },
  { label: 'Jan',  distanceKm: 70.5,  dplusM: 729,  paceEffortSec: 352, hrBpm: 152, effBeats: 881,  dpk: 10.3, renfoCount: 3 },
  { label: 'Fév',  distanceKm: 112.6, dplusM: 900,  paceEffortSec: 388, hrBpm: 162, effBeats: 1047, dpk: 8.0, renfoCount: 0 },
  { label: 'Mar',  distanceKm: 88.7,  dplusM: 1213, paceEffortSec: 335, hrBpm: 154, effBeats: 860,  dpk: 13.7, renfoCount: 0 },
  { label: 'Avr',  distanceKm: 62.2,  dplusM: 86,   paceEffortSec: 444, hrBpm: 147, effBeats: 1117, dpk: 1.4, renfoCount: 1 },
  { label: 'Mai',  distanceKm: 95.2,  dplusM: 318,  paceEffortSec: 364, hrBpm: 164, effBeats: 996,  dpk: 3.3, renfoCount: 0 },
  { label: 'Juin', distanceKm: 70.7,  dplusM: 336,  paceEffortSec: 377, hrBpm: 158, effBeats: 997,  dpk: 4.7, renfoCount: 0 },
  { label: 'Juil', distanceKm: 88.8,  dplusM: 271,  paceEffortSec: 382, hrBpm: 160, effBeats: 1019, dpk: 3.0, renfoCount: 1 },
  { label: 'Août', distanceKm: 75.0,  dplusM: 1347, paceEffortSec: 345, hrBpm: 158, effBeats: 962,  dpk: 18.0, renfoCount: 1 }
];

function fmtPace(sec) {
  if (sec === null || sec === undefined) return '—';
  const m = Math.floor(sec / 60), s = Math.round(sec % 60);
  return m + ':' + String(s).padStart(2, '0');
}

// Régression linéaire sur les points non nuls, pour la ligne de tendance.
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
  // Pour les métriques « plus bas = mieux » (allure, battements) on inverse la
  // hauteur : la barre la plus haute reste la meilleure performance.
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

  const parts = [];
  if (opts.trend !== false) {
    const reg = linreg(raw);
    if (reg) {
      const n = series.length;
      const xAt = function (i) { return ((i + 0.5) / n) * 100; };
      parts.push('<line x1="' + xAt(reg.first) + '" y1="' + (100 - toPct(reg.intercept + reg.slope * reg.first)) +
        '" x2="' + xAt(reg.last) + '" y2="' + (100 - toPct(reg.intercept + reg.slope * reg.last)) +
        '" stroke="var(--accent2)" stroke-width="1.5" stroke-dasharray="4 3" vector-effect="non-scaling-stroke" />');
    }
  }
  (opts.refLines || []).forEach(function (r) {
    const y = 100 - toPct(r.val);
    parts.push('<line x1="0" y1="' + y + '" x2="100" y2="' + y + '" stroke="' + (r.color || 'var(--red)') +
      '" stroke-width="1" stroke-dasharray="2 3" vector-effect="non-scaling-stroke" />');
  });
  const svg = parts.length
    ? '<svg class="stats-trend" viewBox="0 0 100 100" preserveAspectRatio="none">' + parts.join('') + '</svg>'
    : '';

  el.innerHTML = '<div class="stats-plot">' + cols + svg + '</div>' +
                 '<div class="stats-labels">' + series.map(s => '<span>' + s.label + '</span>').join('') + '</div>';
}

function seriesFrom(key) {
  return statsMonthly.map((m, i) => ({
    label: m.label, val: m[key], current: i === statsMonthly.length - 1
  }));
}

function renderStatsCharts() {
  renderBarChart('chart-distance', seriesFrom('distanceKm'));
  renderBarChart('chart-dplus', seriesFrom('dplusM'));
  renderBarChart('chart-pace', seriesFrom('paceEffortSec'), { invert: true, formatter: fmtPace });
  renderBarChart('chart-efficiency', seriesFrom('effBeats'), { invert: true });
  renderBarChart('chart-renfo', seriesFrom('renfoCount'), { trend: false });
}

renderStatsCharts();
