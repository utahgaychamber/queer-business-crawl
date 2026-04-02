// ── CONFIG ──────────────────────────────────────────────────────────────────
// These two values come from your Supabase project settings.
// In Vercel: Settings → Environment Variables → add both keys below.
// Locally: replace the placeholder strings to test.

const SUPABASE_URL = 'https://pcvnhnehdqfxcxsgencx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjdm5obmVoZHFmeGN4c2dlbmN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNzU2ODAsImV4cCI6MjA5MDY1MTY4MH0.JPN48mQuaAxddQZRKT4gbzVjV_BkAq9U-1OETj8n0Fk';
const ADMIN_PASSWORD = window.ENV_ADMIN_PASSWORD || 'qbc-admin-2025';

// ── BUSINESS DATA ────────────────────────────────────────────────────────────
// This is your fallback/seed list. Once Supabase is wired up,
// the live list is loaded from the `businesses` table.
// To add/edit businesses without touching code: update the Supabase table.
 
const SEED_BUSINESSES = [
  { id:1,  name:'Brave Books SLC',              neighborhood:'9th & 9th',       type:'owned', emoji:'📚', about:'An independent bookstore celebrating queer voices, trans authors, and LGBTQ+ stories.' },
  { id:2,  name:'Velvet Underground Vintage',    neighborhood:'9th & 9th',       type:'owned', emoji:'👗', about:'Curated vintage clothing and accessories with a queer eye for style.' },
  { id:3,  name:'Gilded Cactus Bar',             neighborhood:'Sugar House',     type:'owned', emoji:'🍹', about:'A welcoming neighborhood bar with a full cocktail menu and regular community events.' },
  { id:4,  name:'Bloom Florals',                 neighborhood:'Sugar House',     type:'owned', emoji:'🌸', about:'Sustainable, locally-sourced floral arrangements for every occasion.' },
  { id:5,  name:'Prism Print Studio',            neighborhood:'Granary District',type:'owned', emoji:'🖨', about:'Screen printing, risograph, and design services with a community focus.' },
  { id:6,  name:'Wild Honey Candle Co.',         neighborhood:'Granary District',type:'owned', emoji:'🕯', about:'Hand-poured soy candles made in SLC. Every scent tells a Utah story.' },
  { id:7,  name:'Copper & Kind Coffee',          neighborhood:'Downtown',        type:'allied',emoji:'☕', about:'Specialty coffee shop committed to being a safe and affirming space for all.' },
  { id:8,  name:'Spectrum Fitness SLC',          neighborhood:'Downtown',        type:'owned', emoji:'💪', about:'An inclusive gym where every body is welcome and celebrated.' },
  { id:9,  name:'Saltair Salon Collective',      neighborhood:'Capitol Hill',    type:'owned', emoji:'✂️', about:'A worker-owned salon collective specializing in inclusive, affirming hair care.' },
  { id:10, name:'The Porch Kitchen',             neighborhood:'Millcreek',       type:'allied',emoji:'🍽', about:'Farm-to-table comfort food with a menu that changes with the seasons.' },
  { id:11, name:'Red Mesa Ceramics',             neighborhood:'Millcreek',       type:'allied',emoji:'🏺', about:'Hand-thrown ceramics, classes, and gallery space celebrating southwestern tradition.' },
  { id:12, name:'Pioneer Park Provisions',       neighborhood:'West Side',       type:'allied',emoji:'🧺', about:'Local grocery and deli sourcing from Utah farms and producers.' },
];
 
const MILESTONES = [
  { id:'m-3',  count:3,  icon:'🎟', label:'Entry prize',  sub:'Raffle ticket — claim at the Chamber booth.' },
  { id:'m-6',  count:6,  icon:'🛍', label:'Swag bag',     sub:'QBC swag bag — claim at the Chamber booth.' },
  { id:'m-10', count:10, icon:'🏆', label:'Grand prize',  sub:'Grand prize entry — claim at the Chamber booth.' },
  { id:'m-12', count:12, icon:'🌈', label:'Crawl Legend', sub:'You visited every stop. You ARE the crawl.' },
];
 
// ── STATE ────────────────────────────────────────────────────────────────────
let supabaseClient = null;
let currentPassportId = null;
let currentPassportUuid = null; // DB uuid — used for checkins FK
let currentPassport = null;
let businesses = [...SEED_BUSINESSES];
let visitedStopIds = new Set();
let currentFilter = 'all';
let passportMap = null;
let mapMarkers = {};

// ── MAP COORDINATES ──────────────────────────────────────────────────────────
// Approximate SLC locations per business — update with real addresses in May.
const BUSINESS_COORDS = {
  'Brave Books SLC':             [40.7516, -111.8607],
  'Velvet Underground Vintage':  [40.7511, -111.8615],
  'Gilded Cactus Bar':           [40.7200, -111.8574],
  'Bloom Florals':               [40.7195, -111.8562],
  'Prism Print Studio':          [40.7468, -111.8955],
  'Wild Honey Candle Co.':       [40.7461, -111.8963],
  'Copper & Kind Coffee':        [40.7610, -111.8912],
  'Spectrum Fitness SLC':        [40.7603, -111.8900],
  'Saltair Salon Collective':    [40.7764, -111.8886],
  'The Porch Kitchen':           [40.6876, -111.8714],
  'Red Mesa Ceramics':           [40.6869, -111.8722],
  'Pioneer Park Provisions':     [40.7608, -111.9112],
};
 
// ── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  // Init Supabase if keys are present
  if (SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      await loadBusinesses();
    } catch (e) {
      console.warn('Supabase init failed, using seed data:', e);
    }
  }
 
  // Check URL params — passport link or QR check-in
  const params = new URLSearchParams(window.location.search);
  const pid = params.get('p');
  const bid = params.get('b');
 
  if (pid && bid) {
    // QR scan: ?p=PASSPORT_ID&b=BUSINESS_ID
    // Load passport first so we have the UUID and existing checkins
    currentPassportId = pid;
    if (supabaseClient) {
      const passportData = await getPassport(pid);
      if (passportData) {
        currentPassport = passportData;
        currentPassportUuid = passportData.id;
        visitedStopIds = new Set((passportData.checkins || []).map(c => c.business_id));
      }
    }
    await showCheckin(parseInt(bid));
  } else if (pid) {
    // Direct passport link: ?p=PASSPORT_ID
    currentPassportId = pid;
    await loadPassport(pid);
  } else {
    showScreen('screen-landing');
  }
});
 
// ── SUPABASE HELPERS ─────────────────────────────────────────────────────────
async function loadBusinesses() {
  if (!supabaseClient) return;
  try {
    const { data, error } = await supabaseClient
      .from('businesses')
      .select('*')
      .eq('active', true)
      .order('sort_order');
    if (!error && data && data.length > 0) {
      businesses = data;
    }
  } catch (e) { /* fall back to seed */ }
}
 
async function createPassport(firstName, lastName, email, source) {
  // Generate a longer code to dramatically reduce collision chance
  function genCode() {
    return 'QBC-' + Math.random().toString(36).slice(2, 7).toUpperCase();
  }

  const passport = {
    passport_code: genCode(),
    first_name: firstName,
    last_name: lastName || null,
    email: email,
    referral_source: source || null,
  };

  if (supabaseClient) {
    let attempts = 0;
    while (attempts < 5) {
      const { data, error } = await supabaseClient
        .from('passports')
        .insert([passport])
        .select()
        .single();

      if (!error) return data;

      // Retry only on unique-constraint collision (code already taken)
      if (error.code === '23505') {
        passport.passport_code = genCode();
        attempts++;
        continue;
      }

      // Surface the real Supabase error for easier debugging
      const detail = error.message || JSON.stringify(error);
      console.error('Supabase insert error:', error);
      throw new Error(`Passport insert failed (${error.code || '400'}): ${detail}`);
    }
    throw new Error('Could not generate a unique passport code — please try again.');
  } else {
    // Demo mode — return local object
    return { ...passport, id: passport.passport_code };
  }
}
 
async function getPassport(passportId) {
  if (supabaseClient) {
    const { data, error } = await supabaseClient
      .from('passports')
      .select('*, checkins(*)')
      .eq('passport_code', passportId)
      .single();
    if (error) return null;
    return data;
  } else {
    return null;
  }
}
 
async function recordCheckin(passportId, businessId) {
  if (!supabaseClient) return { demo: true };
  const { data, error } = await supabaseClient
    .from('checkins')
    .insert([{
      passport_id: passportId,
      business_id: businessId,
      checked_in_at: new Date().toISOString(),
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
}
 
async function getAdminStats() {
  if (!supabaseClient) return null;
  const [passports, checkins] = await Promise.all([
    supabaseClient.from('passports').select('id', { count: 'exact' }),
    supabaseClient.from('checkins').select('business_id, passport_id, checked_in_at').order('checked_in_at', { ascending: false }),
  ]);
  return {
    passportCount: passports.count || 0,
    checkins: checkins.data || [],
  };
}
 
// ── MAP ──────────────────────────────────────────────────────────────────────
function initMap() {
  const container = document.getElementById('passport-map');
  if (!container) return;

  // Destroy existing map instance before re-init (prevents Leaflet errors)
  if (passportMap) {
    passportMap.remove();
    passportMap = null;
    mapMarkers = {};
  }

  passportMap = L.map('passport-map', { zoomControl: true, scrollWheelZoom: false })
    .setView([40.7484, -111.8910], 12); // SLC center

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(passportMap);

  businesses.forEach(b => {
    const coords = BUSINESS_COORDS[b.name];
    if (!coords) return;
    const visited = visitedStopIds.has(b.id);
    const marker = makeMarker(b, coords, visited);
    marker.addTo(passportMap);
    mapMarkers[b.id] = marker;
  });
}

function makeMarker(b, coords, visited) {
  const color  = visited ? '#e8357a' : '#aaaaaa';
  const border = visited ? '#c0215f' : '#888888';
  const icon = L.divIcon({
    className: '',
    html: `<div style="
      width:18px;height:18px;border-radius:50%;
      background:${color};border:2.5px solid ${border};
      box-shadow:0 2px 6px rgba(0,0,0,0.25);
    "></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });

  const typeLabel = b.type === 'owned' ? 'LGBTQ+ Owned' : 'Allied';
  const popupHtml = `
    <div style="font-family:sans-serif;min-width:160px">
      <div style="font-weight:700;font-size:14px;margin-bottom:4px">${b.name}</div>
      <div style="font-size:12px;color:#666;margin-bottom:6px">${b.neighborhood} · ${typeLabel}</div>
      ${visited
        ? `<div style="color:#e8357a;font-weight:600;font-size:12px">✓ Visited</div>`
        : `<button onclick="showCheckin(${b.stop_number})"
             style="background:#e8357a;color:#fff;border:none;border-radius:6px;
                    padding:5px 12px;font-size:12px;cursor:pointer;width:100%">
             Check in here
           </button>`
      }
    </div>`;

  return L.marker(coords, { icon }).bindPopup(popupHtml);
}

function updateMapMarkers() {
  if (!passportMap) return;
  businesses.forEach(b => {
    const coords = BUSINESS_COORDS[b.name];
    if (!coords || !mapMarkers[b.id]) return;
    const visited = visitedStopIds.has(b.id);
    // Replace marker with updated color
    passportMap.removeLayer(mapMarkers[b.id]);
    mapMarkers[b.id] = makeMarker(b, coords, visited).addTo(passportMap);
  });
}

// ── SCREEN NAVIGATION ────────────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('active');
    window.scrollTo(0, 0);
  }
}
 
// ── ONBOARDING ───────────────────────────────────────────────────────────────
async function submitOnboarding() {
  const firstName = document.getElementById('ob-fname').value.trim();
  const lastName  = document.getElementById('ob-lname').value.trim();
  const email     = document.getElementById('ob-email').value.trim();
  const source    = document.getElementById('ob-source').value;
  const errEl     = document.getElementById('ob-error');
  const btn       = document.getElementById('ob-submit');
 
  errEl.classList.add('hidden');
 
  if (!firstName) { showError('ob-error', 'Please enter your first name.'); return; }
  if (!email || !email.includes('@')) { showError('ob-error', 'Please enter a valid email address.'); return; }
 
  btn.disabled = true;
  btn.textContent = 'Creating your passport…';
 
  try {
    const passport = await createPassport(firstName, lastName, email, source);
    currentPassportId = passport.passport_code;
    currentPassportUuid = passport.id;
    currentPassport = passport;
    visitedStopIds = new Set();

    // Update the URL so the user has a real bookmarkable passport link
    window.history.replaceState({}, '', `?p=${passport.passport_code}`);

    document.getElementById('ob-passport-name').textContent = `${firstName} ${lastName}`.trim();
    document.getElementById('ob-passport-id').textContent = `PASSPORT #${passport.passport_code}`;
    showScreen('screen-ob-success');
  } catch (e) {
    console.error('Onboarding error:', e);
    showError('ob-error', e.message || 'Something went wrong. Please try again.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Send my passport link';
  }
}
 
// ── PASSPORT LOOKUP ──────────────────────────────────────────────────────────
async function lookupPassport() {
  const email = document.getElementById('lookup-email').value.trim();
  const errEl = document.getElementById('lookup-error');
  const sucEl = document.getElementById('lookup-success');
 
  errEl.classList.add('hidden');
  sucEl.classList.add('hidden');
 
  if (!email || !email.includes('@')) {
    showError('lookup-error', 'Please enter a valid email address.'); return;
  }
 
  if (supabaseClient) {
    const { data } = await supabaseClient
      .from('passports')
      .select('code, first_name')
      .eq('email', email)
      .single();
    if (data) {
      sucEl.textContent = `Passport link resent to ${email}!`;
      sucEl.classList.remove('hidden');
    } else {
      showError('lookup-error', 'No passport found for that email. Try claiming one first.');
    }
  } else {
    sucEl.textContent = `Passport link sent to ${email}!`;
    sucEl.classList.remove('hidden');
  }
}
 
// ── LOAD PASSPORT VIEW ───────────────────────────────────────────────────────
async function loadPassport(passportId) {
  showScreen('screen-passport');
  // Init map after screen is visible so Leaflet can measure the container
  setTimeout(initMap, 50);
 
  if (passportId && supabaseClient) {
    const data = await getPassport(passportId);
    if (data) {
      currentPassport = data;
      currentPassportUuid = data.id;
      const checkins = data.checkins || [];
      visitedStopIds = new Set(checkins.map(c => c.business_id)); // uuids
 
      const initials = ((data.first_name || '?')[0] + (data.last_name || '?')[0]).toUpperCase();
      document.getElementById('passport-avatar').textContent = initials;
      document.getElementById('passport-owner-name').textContent = `${data.first_name} ${data.last_name}`.trim();
      document.getElementById('passport-owner-id').textContent = `Passport #${data.passport_code}`;
    }
  }
 
  renderPassport();
}
 
function renderPassport() {
  const total = businesses.length;
  const count = visitedStopIds.size;
 
  document.getElementById('progress-count').textContent = `${count} of ${total}`;
  document.getElementById('progress-fill').style.width = `${Math.round((count/total)*100)}%`;
 
  MILESTONES.forEach(m => {
    const el = document.getElementById(m.id);
    if (el) el.classList.toggle('unlocked', count >= m.count);
  });

  updateMapMarkers();
  renderStops();
}
 
function renderStops() {
  const list = document.getElementById('stops-list');
  const filtered = currentFilter === 'all'
    ? businesses
    : businesses.filter(b => b.type === currentFilter);
 
  list.innerHTML = filtered.map(b => {
    const visited = visitedStopIds.has(b.id);
    return `
      <div class="stop-card ${visited ? 'visited' : ''}">
        <div class="stop-emoji">${b.emoji || '📍'}</div>
        <div class="stop-info">
          <div class="stop-name">${b.name}</div>
          <div class="stop-area">${b.neighborhood}</div>
        </div>
        <div class="stop-right">
          <div class="stop-type-tag ${b.type === 'owned' ? 'tag-owned' : 'tag-allied'}">${b.type === 'owned' ? 'LGBTQ+ Owned' : 'Allied'}</div>
          <button class="check-btn" ${visited ? 'disabled' : `onclick="showCheckin(${b.stop_number})"`}>${visited ? '✓ Visited' : 'Check in'}</button>
        </div>
      </div>
    `;
  }).join('');
}
 
function setFilter(f, el) {
  currentFilter = f;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  renderStops();
}
 
// ── CHECK-IN (QR LANDING) ────────────────────────────────────────────────────
async function showCheckin(businessId) {
  // QR codes use ?b=<stop_number> (integer). DB businesses have uuid ids.
  // Match by stop_number first (DB), fall back to id (seed data).
  const biz = businesses.find(b => b.stop_number === businessId || b.id === businessId);
  if (!biz) { showScreen('screen-landing'); return; }
  window._pendingCheckinBizUuid = biz.id; // uuid for DB insert
 
  const stopNum = businesses.indexOf(biz) + 1;
  const alreadyVisited = visitedStopIds.has(biz.id); // compare uuid, not stop number
  const newCount = alreadyVisited ? visitedStopIds.size : visitedStopIds.size + 1;
 
  document.getElementById('ci-stop-num').textContent = `Stop #${stopNum}`;
  document.getElementById('ci-biz-name').textContent = biz.name;
  document.getElementById('ci-biz-area').textContent = `${biz.neighborhood} · Salt Lake City`;
  document.getElementById('ci-type-tag').textContent = biz.type === 'owned' ? 'LGBTQ+ Owned' : 'Allied';
  document.getElementById('ci-stop-tag').textContent = `Stop ${stopNum} of ${businesses.length}`;
  document.getElementById('ci-biz-about').textContent = biz.about || '';
  document.getElementById('ci-progress-text').textContent = `${newCount} of ${businesses.length}`;
  document.getElementById('ci-progress-fill').style.width = `${Math.round((newCount/businesses.length)*100)}%`;
 
  if (currentPassport) {
    const name = `${currentPassport.first_name} ${currentPassport.last_name}`.trim();
    const initials = ((currentPassport.first_name||'?')[0] + (currentPassport.last_name||'?')[0]).toUpperCase();
    document.getElementById('ci-avatar').textContent = initials;
    document.getElementById('ci-passport-name').textContent = name;
    document.getElementById('ci-passport-id').textContent = `Passport #${currentPassport.passport_code}`;
  }
 
  document.getElementById('ci-already').classList.toggle('hidden', !alreadyVisited);
  document.getElementById('ci-stamp-btn').disabled = alreadyVisited;
 
  document.getElementById('ci-body').classList.remove('hidden');
  document.getElementById('ci-success').classList.add('hidden');
  document.getElementById('ci-success').classList.remove('visible');
 
  window._pendingCheckinBizId = businessId;
  showScreen('screen-checkin');
}
 
async function doCheckin() {
  const bizId = window._pendingCheckinBizId;
  if (!bizId || !currentPassportId) return;
 
  const btn = document.getElementById('ci-stamp-btn');
  btn.disabled = true;
  btn.textContent = 'Stamping…';
 
  try {
    const bizUuid = window._pendingCheckinBizUuid || bizId;
    await recordCheckin(currentPassportUuid || currentPassportId, bizUuid);
    visitedStopIds.add(bizUuid); // store uuid to match DB checkins
  } catch (e) {
    console.error('Checkin error:', e);
    // In demo mode, just add locally
    visitedStopIds.add(bizId);
  }
 
  const biz = businesses.find(b => b.id === bizId);
  const count = visitedStopIds.size;
  const total = businesses.length;
 
  document.getElementById('ci-stamp-emoji').textContent = biz?.emoji || '📍';
  document.getElementById('ci-success-count').textContent = `Stop ${count} of ${total}.`;
  document.getElementById('ci-success-sub').textContent =
    count >= total
      ? 'You visited every stop. You are a Crawl Legend. 🌈'
      : `${total - count} more stop${total - count !== 1 ? 's' : ''} to go for the grand prize.`;
 
  // Check milestone unlocks
  const newMilestone = [...MILESTONES].reverse().find(m => count === m.count);
  const milestoneBox = document.getElementById('ci-milestone-box');
  if (newMilestone) {
    document.getElementById('ci-milestone-icon').textContent = newMilestone.icon;
    document.getElementById('ci-milestone-title').textContent = newMilestone.label + ' unlocked!';
    document.getElementById('ci-milestone-sub').textContent = newMilestone.sub;
    milestoneBox.classList.remove('hidden');
  } else {
    milestoneBox.classList.add('hidden');
  }
 
  // Suggest next stop
  const unvisited = businesses.filter(b => !visitedStopIds.has(b.id));
  const nextStop = unvisited[0];
  const nextEl = document.getElementById('ci-next-stop');
  if (nextStop) {
    const nextNum = businesses.indexOf(nextStop) + 1;
    document.getElementById('ci-next-num').textContent = String(nextNum).padStart(2,'0');
    document.getElementById('ci-next-name').textContent = nextStop.name;
    document.getElementById('ci-next-area').textContent = nextStop.neighborhood;
    nextEl.classList.remove('hidden');
  } else {
    nextEl.classList.add('hidden');
  }
 
  document.getElementById('ci-body').classList.add('hidden');
  const successEl = document.getElementById('ci-success');
  successEl.classList.remove('hidden');
  successEl.classList.add('visible');
 
  btn.disabled = false;
  btn.textContent = 'Stamp my passport';
}
 
// ── ADMIN ────────────────────────────────────────────────────────────────────
function adminLogin() {
  const pw = document.getElementById('admin-password').value;
  const errEl = document.getElementById('admin-login-error');
  if (pw === ADMIN_PASSWORD) {
    errEl.classList.add('hidden');
    loadAdminDashboard();
    showScreen('screen-admin');
  } else {
    errEl.classList.remove('hidden');
  }
}
 
async function loadAdminDashboard() {
  const stats = await getAdminStats();
 
  if (!stats) {
    // Demo data
    renderAdminStats({ passportCount:247, checkinCount:1042, avgStops:4.2, prizeClaims:63 });
    renderAdminBizList(businesses.map((b,i) => ({ ...b, checkins: Math.floor(98 - i*4.5) })));
    renderAdminFeed([
      { name:'Alex M.', biz:'Wild Honey Candle Co.', time:'2m ago' },
      { name:'Sam R.',  biz:'Bloom Florals',         time:'3m ago' },
      { name:'Casey T.',biz:'Brave Books SLC',       time:'5m ago' },
      { name:'Jordan D.',biz:'Spectrum Fitness SLC', time:'6m ago' },
      { name:'Riley K.',biz:'Gilded Cactus Bar',     time:'8m ago' },
    ]);
    return;
  }
 
  const checkins = stats.checkins || [];
  const checkinCount = checkins.length;
  const uniquePassports = new Set(checkins.map(c => c.passport_id)).size;
  const avgStops = uniquePassports > 0 ? (checkinCount / uniquePassports).toFixed(1) : 0;

  // Count check-ins per passport to find prize-tier claimants
  const perPassport = {};
  checkins.forEach(c => { perPassport[c.passport_id] = (perPassport[c.passport_id] || 0) + 1; });
  const prizeClaims = Object.values(perPassport).filter(n => n >= 3).length;

  renderAdminStats({ passportCount: stats.passportCount, checkinCount, avgStops, prizeClaims });

  // Count per business (uuid → count)
  const bizCounts = {};
  checkins.forEach(c => { bizCounts[c.business_id] = (bizCounts[c.business_id] || 0) + 1; });
  const bizWithCounts = businesses.map(b => ({ ...b, checkins: bizCounts[b.id] || 0 }))
    .sort((a, b) => b.checkins - a.checkins);
  renderAdminBizList(bizWithCounts);

  // Recent feed — show truncated passport_id and business name
  const recent = checkins.slice(0, 10).map(c => {
    const biz = businesses.find(b => b.id === c.business_id);
    const mins = Math.round((Date.now() - new Date(c.checked_in_at)) / 60000);
    const label = c.passport_id ? c.passport_id.slice(0, 8) + '…' : 'Unknown';
    return { name: label, biz: biz?.name || 'Unknown', time: mins < 60 ? `${mins}m ago` : `${Math.round(mins / 60)}h ago` };
  });
  renderAdminFeed(recent);
}
 
function renderAdminStats(s) {
  document.getElementById('admin-stats').innerHTML = `
    <div class="admin-stat"><div class="admin-stat-val pink">${s.passportCount}</div><div class="admin-stat-lbl">Passports issued</div></div>
    <div class="admin-stat"><div class="admin-stat-val purple">${s.checkinCount}</div><div class="admin-stat-lbl">Total check-ins</div></div>
    <div class="admin-stat"><div class="admin-stat-val teal">${s.avgStops}</div><div class="admin-stat-lbl">Avg stops / person</div></div>
    <div class="admin-stat"><div class="admin-stat-val">${s.prizeClaims}</div><div class="admin-stat-lbl">Prize claims</div></div>
  `;
}
 
function renderAdminBizList(list) {
  const max = list[0]?.checkins || 1;
  document.getElementById('admin-biz-list').innerHTML = list.slice(0,8).map((b,i) => `
    <div class="admin-biz-row">
      <div class="admin-biz-rank">${i+1}</div>
      <div class="admin-biz-name">${b.name}</div>
      <div class="admin-biz-bar-wrap"><div class="admin-biz-bar-track"><div class="admin-biz-bar-fill" style="width:${Math.round(b.checkins/max*100)}%"></div></div></div>
      <div class="admin-biz-count">${b.checkins}</div>
    </div>
  `).join('');
}
 
function renderAdminFeed(items) {
  document.getElementById('admin-feed').innerHTML = items.map(f => `
    <div class="admin-feed-item">
      <div class="admin-feed-dot"></div>
      <div class="admin-feed-text"><strong>${f.name}</strong> checked in at ${f.biz}</div>
      <div class="admin-feed-time">${f.time}</div>
    </div>
  `).join('');
 
  document.getElementById('admin-prizes').innerHTML = `
    <div class="admin-prize-row"><div class="admin-prize-label"><div class="prize-tag p-entry">Entry (3 stops)</div>Raffle ticket</div><div class="admin-prize-val">—</div></div>
    <div class="admin-prize-row"><div class="admin-prize-label"><div class="prize-tag p-swag">Swag (6 stops)</div>Chamber bag</div><div class="admin-prize-val">—</div></div>
    <div class="admin-prize-row"><div class="admin-prize-label"><div class="prize-tag p-grand">Grand (10 stops)</div>Grand prize</div><div class="admin-prize-val">—</div></div>
  `;
}
 
async function exportCSV(type) {
  if (!supabaseClient) { showToast('Connect Supabase to enable exports.'); return; }
  showToast('Preparing export…');
  try {
    let data, filename;

    if (type === 'passports') {
      const res = await supabaseClient
        .from('passports')
        .select('passport_code, first_name, last_name, email, referral_source, created_at')
        .order('created_at');
      data = res.data;
      filename = 'qbc-passports.csv';

    } else if (type === 'checkins') {
      const res = await supabaseClient
        .from('checkins')
        .select('checked_in_at, passport_id, business_id')
        .order('checked_in_at');
      data = res.data;
      filename = 'qbc-checkins.csv';

    } else if (type === 'full') {
      // Join checkins with passport and business info via FK relationships
      const res = await supabaseClient
        .from('checkins')
        .select('checked_in_at, passports(passport_code, first_name, last_name, email), businesses(name, neighborhood, type)')
        .order('checked_in_at');
      data = (res.data || []).map(c => ({
        checked_in_at:  c.checked_in_at,
        passport_code:  c.passports?.passport_code  || '',
        first_name:     c.passports?.first_name     || '',
        last_name:      c.passports?.last_name      || '',
        email:          c.passports?.email          || '',
        business_name:  c.businesses?.name          || '',
        neighborhood:   c.businesses?.neighborhood  || '',
        type:           c.businesses?.type          || '',
      }));
      filename = 'qbc-full-report.csv';
    }

    downloadCSV(data, filename);
  } catch (e) {
    console.error('Export error:', e);
    showToast('Export failed — check console.');
  }
}

function downloadCSV(data, filename) {
  if (!data || data.length === 0) { showToast('No data to export.'); return; }
  const headers = Object.keys(data[0]);
  const rows = data.map(row =>
    headers.map(h => JSON.stringify(row[h] ?? '')).join(',')
  );
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
  showToast(`Downloaded ${filename}`);
}
 
// ── UTILITIES ────────────────────────────────────────────────────────────────
function showError(elId, msg) {
  const el = document.getElementById(elId);
  if (el) { el.textContent = msg; el.classList.remove('hidden'); }
}
 
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}
