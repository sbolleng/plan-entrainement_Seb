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
  { date: new Date('2026-10-04T09:30:00'), name: 'Semi de San Sebastián' },
  { date: new Date('2026-11-15T09:00:00'), name: 'Trail du Béret' },
  { date: new Date('2027-01-16T18:00:00'), name: 'Nocturne des Rois' },
  { date: new Date('2027-03-07T08:00:00'), name: "L'Augerolloise" },
  { date: new Date('2027-10-24T08:00:00'), name: "Trail d'automne 27" }
];
// Le semi de fin mars (single-date), la VVX et le semi de test de
// printemps 27 ont été retirés de la feuille de route.

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

// ===== Suivi live San Sebastián · points de passage saisis à la main =====
// Pas d'accès possible aux données de live.irteerak.com depuis le site (pas
// d'API publique connue) : on compare les temps relevés manuellement sur
// leur page aux objectifs de la stratégie de course.
(function () {
  const SS_CHECKPOINTS = {
    '5k':     { distKm: 5,    targetSec: 26 * 60 + 30 },
    '10k':    { distKm: 10,   targetSec: 52 * 60 + 30 },
    '20k':    { distKm: 20,   targetSec: 3600 + 44 * 60 + 25 },
    'finish': { distKm: 21.1, targetSec: 3600 + 50 * 60 + 2 }
  };
  const SS_ORDER = ['5k', '10k', '20k', 'finish'];
  const SS_GOAL_CIBLE = 3600 + 48 * 60;
  const SS_GOAL_PHARE = 3600 + 50 * 60;
  const SS_GOAL_PR = 3600 + 53 * 60;
  const SS_GAUGE_MIN = 3600 + 40 * 60;
  const SS_GAUGE_MAX = 3600 + 58 * 60;
  const SS_STORAGE_PREFIX = 'jdp-ss-cp-';

  // Le pavé numérique du téléphone n'a pas de « : » : on accepte aussi les
  // chiffres seuls, lus par la droite (2129 → 21:29, 14450 → 1:44:50).
  function ssParseTime(str) {
    const raw = str.trim();
    if (raw === '') return null;
    let nums;
    if (/[^0-9]/.test(raw)) {
      nums = raw.split(/[^0-9]+/).filter(p => p !== '').map(Number);
    } else {
      if (raw.length < 3 || raw.length > 6) return null;
      const hh = raw.slice(0, -4), mm = raw.slice(-4, -2), ss = raw.slice(-2);
      nums = hh ? [Number(hh), Number(mm), Number(ss)] : [Number(mm), Number(ss)];
    }
    if (nums.length < 2 || nums.length > 3 || nums[nums.length - 1] >= 60) return null;
    if (nums.length === 2) return nums[0] * 60 + nums[1];
    return nums[0] * 3600 + nums[1] * 60 + nums[2];
  }

  function ssFormatClock(sec) {
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    return (h > 0 ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(s).padStart(2, '0');
  }

  function ssFormatDuration(totalSec) {
    const sign = totalSec < 0 ? '-' : '';
    totalSec = Math.round(Math.abs(totalSec));
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    const mm = h > 0 ? String(m).padStart(2, '0') : String(m);
    const ss = String(s).padStart(2, '0');
    return sign + (h > 0 ? h + 'h' + mm + "'" + ss : m + "'" + ss);
  }

  function ssFormatDelta(deltaSec) {
    const sign = deltaSec >= 0 ? '+' : '-';
    const abs = Math.round(Math.abs(deltaSec));
    const m = Math.floor(abs / 60);
    const s = abs % 60;
    return sign + m + ':' + String(s).padStart(2, '0');
  }

  function ssFormatPace(secPerKm) {
    const m = Math.floor(secPerKm / 60);
    const s = Math.round(secPerKm % 60);
    return m + "'" + String(s).padStart(2, '0') + '/km';
  }

  function ssRecompute() {
    const track = document.getElementById('ss-live-track');
    if (!track) return;

    let prevDist = 0, prevSec = 0, lastFilled = null, lastFilledSec = null, lastFilledDist = null;

    SS_ORDER.forEach(cp => {
      const def = SS_CHECKPOINTS[cp];
      const input = track.querySelector('[data-cp-input="' + cp + '"]');
      const card = track.querySelector('[data-cp="' + cp + '"]');
      const deltaEl = track.querySelector('[data-cp-delta="' + cp + '"]');
      const paceEl = track.querySelector('[data-cp-pace="' + cp + '"]');
      const sec = ssParseTime(input.value);

      if (sec === null) {
        card.classList.remove('is-done');
        deltaEl.textContent = '—';
        deltaEl.className = 'cp-delta';
        paceEl.textContent = '';
        prevDist = def.distKm;
        prevSec = null;
        return;
      }

      card.classList.add('is-done');
      const delta = sec - def.targetSec;
      deltaEl.textContent = ssFormatDelta(delta);
      const cls = delta <= 10 ? 'ok' : (delta <= 45 ? 'warn' : 'bad');
      deltaEl.className = 'cp-delta ' + cls;

      if (prevSec !== null) {
        const paceSec = (sec - prevSec) / (def.distKm - prevDist);
        paceEl.textContent = ssFormatPace(paceSec);
      } else {
        paceEl.textContent = '';
      }

      prevDist = def.distKm;
      prevSec = sec;
      lastFilled = cp;
      lastFilledSec = sec;
      lastFilledDist = def.distKm;
    });

    const msgEl = document.getElementById('ss-live-msg');
    const fillEl = document.getElementById('ss-fg-fill');
    const emojiEl = msgEl.querySelector('.emoji');
    const textEl = msgEl.querySelector('span:last-child');

    if (lastFilled === null) {
      fillEl.style.width = '0%';
      emojiEl.textContent = '⏳';
      textEl.textContent = 'Entre un temps au premier point de passage pour voir la projection.';
      return;
    }

    const isFinished = lastFilled === 'finish';
    const projectedSec = isFinished ? lastFilledSec : (lastFilledSec / lastFilledDist) * 21.1;
    const pct = Math.max(0, Math.min(100, ((projectedSec - SS_GAUGE_MIN) / (SS_GAUGE_MAX - SS_GAUGE_MIN)) * 100));
    fillEl.style.width = pct + '%';

    const projStr = ssFormatDuration(projectedSec);
    if (projectedSec <= SS_GOAL_CIBLE) {
      emojiEl.textContent = '🟢';
      textEl.textContent = (isFinished ? 'Terminé ! ' : 'Projection ≈ ' + projStr + ' — ') +
        (isFinished ? 'Temps final : ' + projStr + '. Sous le temps cible, magnifique !' : 'en avance sur le temps cible, parfait.');
    } else if (projectedSec <= SS_GOAL_PHARE) {
      emojiEl.textContent = '🟢';
      textEl.textContent = (isFinished ? 'Terminé ! Temps final : ' + projStr + '. ' : 'Projection ≈ ' + projStr + ' — ') +
        'Entre la cible et l\'objectif phare, très bien.';
    } else if (projectedSec <= SS_GOAL_PR) {
      emojiEl.textContent = '🟡';
      textEl.textContent = (isFinished ? 'Terminé ! Temps final : ' + projStr + '. ' : 'Projection ≈ ' + projStr + ' — ') +
        'Sous le PR mais au-dessus de l\'objectif phare.';
    } else {
      emojiEl.textContent = isFinished ? '🏁' : '🔴';
      textEl.textContent = (isFinished ? 'Terminé ! Temps final : ' + projStr + '. ' : 'Projection ≈ ' + projStr + ' — ') +
        (isFinished ? 'Au-dessus du PR actuel, mais une course dans la jambe.' : 'au-dessus du PR actuel, ajuste l\'allure si tu peux.');
    }
  }

  function ssInit() {
    const track = document.getElementById('ss-live-track');
    if (!track) return;

    SS_ORDER.forEach(cp => {
      const input = track.querySelector('[data-cp-input="' + cp + '"]');
      const stored = localStorage.getItem(SS_STORAGE_PREFIX + cp);
      if (stored) input.value = stored;
      input.addEventListener('input', () => {
        if (input.value.trim() === '') {
          localStorage.removeItem(SS_STORAGE_PREFIX + cp);
        } else {
          localStorage.setItem(SS_STORAGE_PREFIX + cp, input.value);
        }
        ssRecompute();
      });
      input.addEventListener('change', () => {
        const sec = ssParseTime(input.value);
        if (sec === null) return;
        input.value = ssFormatClock(sec);
        localStorage.setItem(SS_STORAGE_PREFIX + cp, input.value);
      });
    });

    ssRecompute();
  }

  ssInit();
})();

// ===== Météo course San Sebastián · Open-Meteo (gratuit, sans clé, CORS ouvert) =====
// Modèle ECMWF inclus dans l'agrégation Open-Meteo — référence en fiabilité
// à courte échéance (ici J-2), donc pas besoin de comparer plusieurs sources.
(function () {
  const SS_LAT = 43.3183;
  const SS_LON = -1.9812;
  const SS_RACE_DAY = '2026-10-04';
  const SS_RACE_HOURS = [9, 10, 11]; // fenêtre de course (départ 9h30, ~1h50)
  const SS_PAST_CUTOFF = new Date('2026-10-05T00:00:00');
  const SS_WEATHER_CACHE_KEY = 'jdp-ss-weather-v1';
  const SS_WEATHER_CACHE_TTL = 15 * 60 * 1000;

  const WMO_LABELS = {
    0: ['☀️', 'Ciel dégagé'], 1: ['🌤️', 'Principalement dégagé'], 2: ['⛅', 'Partiellement nuageux'], 3: ['☁️', 'Couvert'],
    45: ['🌫️', 'Brouillard'], 48: ['🌫️', 'Brouillard givrant'],
    51: ['🌦️', 'Bruine légère'], 53: ['🌦️', 'Bruine'], 55: ['🌦️', 'Bruine forte'],
    56: ['🌧️', 'Bruine verglaçante'], 57: ['🌧️', 'Bruine verglaçante forte'],
    61: ['🌧️', 'Pluie légère'], 63: ['🌧️', 'Pluie'], 65: ['🌧️', 'Pluie forte'],
    66: ['🌧️', 'Pluie verglaçante'], 67: ['🌧️', 'Pluie verglaçante forte'],
    71: ['❄️', 'Neige légère'], 73: ['❄️', 'Neige'], 75: ['❄️', 'Neige forte'], 77: ['❄️', 'Grains de neige'],
    80: ['🌦️', 'Averses légères'], 81: ['🌦️', 'Averses'], 82: ['🌧️', 'Averses fortes'],
    85: ['❄️', 'Averses de neige'], 86: ['❄️', 'Averses de neige fortes'],
    95: ['⛈️', 'Orage'], 96: ['⛈️', 'Orage avec grêle'], 99: ['⛈️', 'Orage avec grêle fort']
  };

  function renderWeatherError() {
    const body = document.getElementById('ss-weather-body');
    if (body) body.innerHTML = '<span class="weather-error">Météo indisponible pour l\'instant.</span>';
  }

  function renderWeatherPast() {
    const body = document.getElementById('ss-weather-body');
    if (body) body.innerHTML = '<span class="weather-error">Course passée.</span>';
  }

  function renderWeather(data) {
    const body = document.getElementById('ss-weather-body');
    if (!body) return;
    const idx = data.hourly.time.findIndex(t => t === SS_RACE_DAY + 'T' + String(SS_RACE_HOURS[0]).padStart(2, '0') + ':00');
    if (idx === -1) { renderWeatherError(); return; }

    const temp = Math.round(data.hourly.temperature_2m[idx]);
    const wind = Math.round(data.hourly.wind_speed_10m[idx]);
    const code = data.hourly.weathercode[idx];
    const [emoji, label] = WMO_LABELS[code] || ['🌡️', 'Prévision indisponible'];

    let maxPrecip = 0;
    SS_RACE_HOURS.forEach(h => {
      const i = data.hourly.time.findIndex(t => t === SS_RACE_DAY + 'T' + String(h).padStart(2, '0') + ':00');
      if (i !== -1) maxPrecip = Math.max(maxPrecip, data.hourly.precipitation_probability[i]);
    });

    body.innerHTML =
      '<div class="weather-main"><span class="weather-icon">' + emoji + '</span><span class="weather-temp">' + temp + '°C</span></div>' +
      '<div class="weather-desc">' + label + ' · dim. 4 oct., 9h30</div>' +
      '<div class="weather-detail">💨 ' + wind + ' km/h · ☔ ' + maxPrecip + '%</div>';
  }

  function ssWeatherInit() {
    const container = document.getElementById('ss-weather');
    if (!container) return;

    if (new Date() >= SS_PAST_CUTOFF) {
      renderWeatherPast();
      return;
    }

    try {
      const cached = JSON.parse(sessionStorage.getItem(SS_WEATHER_CACHE_KEY) || 'null');
      if (cached && (Date.now() - cached.fetchedAt) < SS_WEATHER_CACHE_TTL) {
        renderWeather(cached.data);
        return;
      }
    } catch (e) { /* cache illisible, on refait l'appel */ }

    const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + SS_LAT + '&longitude=' + SS_LON +
      '&hourly=temperature_2m,precipitation_probability,wind_speed_10m,weathercode&timezone=Europe%2FMadrid' +
      '&start_date=' + SS_RACE_DAY + '&end_date=' + SS_RACE_DAY;

    fetch(url)
      .then(r => { if (!r.ok) throw new Error('bad response'); return r.json(); })
      .then(data => {
        try { sessionStorage.setItem(SS_WEATHER_CACHE_KEY, JSON.stringify({ fetchedAt: Date.now(), data })); } catch (e) { /* stockage plein, tant pis */ }
        renderWeather(data);
      })
      .catch(renderWeatherError);
  }

  ssWeatherInit();
})();
