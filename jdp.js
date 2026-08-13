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
