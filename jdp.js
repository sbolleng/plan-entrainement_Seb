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
// Date provisoire : Rome se court mi-mars, mais la date exacte de l'édition
// 2028 n'est pas encore communiquée. Le 19 mars (un dimanche) sert de repère
// jusqu'à l'annonce officielle, à remplacer dès qu'elle tombe.
const MARATHON = new Date('2028-03-19T09:00:00');

const STEPS = [
  { date: new Date('2026-11-15T09:00:00'), name: 'Trail du Béret' },
  { date: new Date('2027-01-16T18:00:00'), name: 'Nocturne des Rois' },
  { date: new Date('2027-03-07T08:00:00'), name: "L'Augerolloise" },
  { date: new Date('2027-10-10T09:40:00'), name: 'Semi de Tournefeuille' }
];
// Le semi de fin mars (single-date) et la VVX ont été retirés de la feuille
// de route ; le semi de San Sebastián, couru, est passé au Palmarès. La Pins
// Just'à Pied (fin mai 2027) et le Trail des 3 Rocs (novembre 2027) n'y sont
// pas tant que leur date 2027 n'est pas publiée.
// Semi de Tournefeuille : heure de départ de l'édition 2026, à confirmer.

function updateCountdown() {
  const now = new Date();
  const t = splitDelay(MARATHON - now);
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

// ===== Suivi en direct et météo du jour J =====
// Le semi de San Sebastián, couru, a quitté la page Objectif, et avec lui son
// suivi des points de passage et sa carte météo (Open-Meteo). Le code reste
// dans l'historique git (commit ba49531) pour resservir sur une prochaine course.

// ===== Mise à jour automatique =====
// Même mécanisme que sur le site de Seb : GitHub Pages laisse le navigateur
// garder la page en cache ~10 min et un onglet resté ouvert ne se recharge
// jamais. On compare la version affichée à celle en ligne, et on recharge.
(function () {
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
    if (document.visibilityState === 'visible') checkNewVersion();
  });
  window.addEventListener('pageshow', e => { if (e.persisted) checkNewVersion(); });
})();

// ===== Onglet Planning · la saison d'un coup d'œil (prototype) =====
// Les courses de la feuille de route, placées sur le calendrier par planning.js.
// effort = km-effort (distance + D+/100 + D−/200, D− supposé égal au D+). Les
// durées de préparation et de récupération suivent pour l'instant la règle
// provisoire par défaut de planning.js, en attendant les vraies durées.
(function () {
  const root = document.getElementById('jdp-planning');
  if (!root || typeof renderPlanning !== 'function') return;
  renderPlanning(root, {
    races: [
      { date: '2026-10-04', name: 'Semi de San Sebastián', effort: 21.1 },
      { date: '2026-11-15', name: 'Trail du Béret', effort: 35.9 },
      { date: '2027-01-16', name: 'Nocturne des Rois', effort: 14, noPrep: true },
      { date: '2027-03-07', name: "L'Augerolloise", effort: 49.5, key: true },
      { from: '2027-05-24', to: '2027-05-31', when: 'fin mai', name: "La Pins Just'à Pied", effort: 21.1 },
      { date: '2027-10-10', name: 'Semi de Tournefeuille', effort: 21.1 },
      { from: '2027-11-01', to: '2027-11-30', when: 'novembre', name: 'Trail des 3 Rocs', effort: 52 },
      { date: '2028-03-19', provisional: 'mi-mars', name: 'Marathon de Rome', effort: 42.2, key: true }
    ],
    views: [
      { id: '12m', label: '12 mois', months: 12 },
      { id: 'rome', label: "Jusqu'à Rome", until: '2028-03' }
    ],
    footnote: "Prototype. Durées de préparation (4, 6 ou 8 semaines) et de récupération (3, 7 ou 14 jours) provisoires, selon l'effort de la course : à définir. La Nocturne des Rois, course plaisir, n'a pas de préparation dédiée. La Pins Just'à Pied est placée sur la fin mai et le Trail des 3 Rocs sur tout le mois de novembre en attendant leur date 2027, le marathon de Rome sur sa date provisoire."
  });
})();
