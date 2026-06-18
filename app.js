// ── CONFIG ──────────────────────────────────────────────────────────────────
// These two values come from your Supabase project settings.
// In Vercel: Settings → Environment Variables → add both keys below.
// Locally: replace the placeholder strings to test.

const SUPABASE_URL = 'https://pcvnhnehdqfxcxsgencx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjdm5obmVoZHFmeGN4c2dlbmN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNzU2ODAsImV4cCI6MjA5MDY1MTY4MH0.JPN48mQuaAxddQZRKT4gbzVjV_BkAq9U-1OETj8n0Fk';
const ADMIN_PASSWORD = window.ENV_ADMIN_PASSWORD || 'QBC-7176-Crawl';

// Prize milestones are not yet confirmed by the Chamber. Flip this to true
// once prize tiers are finalized — it will re-enable milestone UI everywhere
// (passport progress bar, check-in success screen, admin prize panel)
// without needing to dig through the code again.
const PRIZES_ENABLED = false;

// ── BUSINESS DATA ────────────────────────────────────────────────────────────
// This is your fallback/seed list. Once Supabase is wired up,
// the live list is loaded from the `businesses` table.
// To add/edit businesses without touching code: update the Supabase table.
 
const SEED_BUSINESSES = [
  { id:1, stop_number:1, name:'Native Flower Company', type:'allied', emoji:'🌸', about:'We are a cut flower shop specializing in every day unique and creative floral designs as well as weddings, corporate events, and parties.', pin:'0430' },
  { id:2, stop_number:2, name:'Weller Book Works', type:'allied', emoji:'📚', about:'Weller Book Works is the Grand Dame of Salt Lake bookstores. Founded by Gus Weller in 1929, our store has been in various locations and known by different names.', pin:'0607' },
  { id:3, stop_number:3, name:'Oliver & Princess Natasha Vintage Shop', type:'allied', emoji:'👗', about:'Proudly ally-owned & committed to supporting a diverse community of vendors, including LGBTQIA+ makers & collectors.', pin:'1531' },
  { id:4, stop_number:4, name:'MILK+', type:'allied', emoji:'🍸', about:'MILK+ is a 21+ nightclub, bar, and entertainment venue in Salt Lake City dedicated to creating an inclusive space where people from all backgrounds can connect, celebrate, and have fun.', pin:'0049' },
  { id:5, stop_number:5, name:'Mountain West Cider', type:'allied', emoji:'🍻', about:'Mountain West Cider crafts every day, seasonal and artisanal hard ciders and wine using ingredients sourced from across the Mountain West region.', pin:'0425' },
  { id:6, stop_number:6, name:'Lucky Ones Coffee', type:'allied', emoji:'☕', about:'Lucky Ones Coffee is a nonprofit, community-centered café creating meaningful employment opportunities for neurodiverse individuals and adults with disabilities.', pin:'0280' },
  { id:7, stop_number:7, name:'SomaSense Wellness', type:'allied', emoji:'🧘', about:'I am a massage therapist and master esthetician specializing in therapeutic massage, advanced bodywork, and relaxing skincare services.', pin:'1945' },
  { id:8, stop_number:8, name:'Project Rainbow Utah', type:'allied', emoji:'🏳️‍🌈', about:'Project Rainbow empowers and uplifts our LGBTQ Community through visibility campaigns and our community fund which supports grassroots efforts across Utah.', pin:'2065' },
  { id:9, stop_number:9, name:'HK Brewing Collective Taproom & Bar', type:'allied', emoji:'🍹', about:'HK Brewing Co. Taproom & Bar is a women-owned cocktail bar and community space in Salt Lake City serving creative cocktails, standout zero-proof drinks, award-winning mocktails, and more!', pin:'0370' },
  { id:10, stop_number:10, name:'The King\'s English Bookshop', type:'allied', emoji:'📖', about:'A general interest independent bookstore selling new books to all ages since 1977.', pin:'1511' },
  { id:11, stop_number:11, name:'Ogden Therapy Cooperative', type:'allied', emoji:'🫶', about:'Inclusive mental health therapy cooperative, with individual, relationship, and family therapy services, incubator space for private practice therapists to launch their practices, and community...', pin:'0707' },
  { id:12, stop_number:12, name:'Wiconi Counseling Center', type:'allied', emoji:'🫂', about:'Mental health therapists serving the LGBTQ+ community in Davis and Weber Counties.', pin:'0872' },
  { id:13, stop_number:13, name:'Soma Psychotherapy', type:'allied', emoji:'🧠', about:'Soma Psychotherapy is a progressive, trauma-informed therapy practice based in Millcreek, Utah, offering in-person and telehealth services to individuals, couples, and families across the state.', pin:'4578' },
  { id:14, stop_number:14, name:'Parfé Diem', type:'allied', emoji:'🍮', about:'Parfé Diem is a local dessert shop in Salt Lake City’s Sugarhouse neighborhood, specializing in a modern take on the beloved Southern classic,banana pudding.', pin:'2040' },
  { id:15, stop_number:15, name:'Space Tea', type:'allied', emoji:'🧋', about:'Space Tea enhances our local community through high-quality boba drinks and desserts, events, and partnerships, all at competitive prices accessible to our neighborhood.', pin:'1085' },
  { id:16, stop_number:16, name:'btone FITNESS Brickyard', type:'allied', emoji:'🏋️', about:'btone FITNESS Brickyard is a small-group reformer studio in Millcreek’s Brickyard neighborhood. We use an athletic, Pilates-inspired hybrid to build muscle, strength, balance, and functional...', pin:'1295' },
  { id:17, stop_number:17, name:'Dented Brick Distillery', type:'allied', emoji:'🥃', about:'A boutique grain-to-glass distillery with two amazing origin stories! Our spirits are made from an on site artesian well water.', pin:'3100' },
  { id:18, stop_number:18, name:'SkinSaitions LLC', type:'allied', emoji:'✨', about:'We are a Safe Queer friendly salon that offers Electrolysis (permanent hair removal), Waxing, Relaxing Facials, and many Clinical treatments to keep your youthful skin.', pin:'1945' },
  { id:19, stop_number:19, name:'Adecco Staffing', type:'allied', emoji:'💼', about:'Employment Staffing', pin:'0054' },
  { id:20, stop_number:20, name:'Scion Cider Bar', type:'allied', emoji:'🍾', about:'Scion is an award winning, cider-focused bar featuring a curated menu of modern & traditional ciders, apple based spirits & specialty sippers from small orchards, urban producers & artisans across...', pin:'0916' },
  { id:21, stop_number:21, name:'Salt Lake Game Show Experience', type:'allied', emoji:'🎮', about:'Ever wanted to be a contestant on a TV game show? Now’s your chance to experience what it’s like!', pin:'1154' },
  { id:22, stop_number:22, name:'Alliance Counseling', type:'allied', emoji:'🫶', about:'We are a small group behavioral health practice serving the queer community.', pin:'0352' },
  { id:23, stop_number:23, name:'Cat Palmer Photography', type:'allied', emoji:'📷', about:'I am a headshot photographer dedicated to helping people feel seen, confident, and connected through authentic portraits.', pin:'0412' },
  { id:24, stop_number:24, name:'El Cholo', type:'allied', emoji:'🌮', about:'Founded in Los Angeles, California, in 1923, El Cholo has been serving authentic Mexican cuisine and creating memorable dining experiences for over a century.', pin:'2166' },
  { id:25, stop_number:25, name:'Argentinas Best Empanadas', type:'allied', emoji:'🥟', about:'Our empanadas are a reflection of the charming rusticity of our Argentinian family food traditions. Our empanadas aim to emulate that nostalgic memories of grandma’s baking empanadas in her...', pin:'0357' },
  { id:26, stop_number:26, name:'Sweet Hazel & Co.', type:'allied', emoji:'🍫', about:'Beyond being delicious, Sweet Hazel & Co candy bars are inclusive. The entire product range is dairy-free and egg-free with multiple options for gluten-free, nut-free, and sugar-free.', pin:'1000' },
  { id:27, stop_number:27, name:'Melancholy Bar & Lounge', type:'allied', emoji:'🍷', about:'We are a niche wine and cocktail bar located in the heart of Salt Lake City. We’re not your average bar, we\'re a thoughtfully curated space where natural wines, seasonal cocktails, and vintage...', pin:'0556' },
  { id:28, stop_number:28, name:'Pantry Products', type:'allied', emoji:'🧴', about:'As a 100% female-owned and LGBTQ+ owned business, we take pride in creating high-quality, all-natural self-care and wellness products.', pin:'0888' },
  { id:29, stop_number:29, name:'Skinworks School of Advanced Skincare', type:'allied', emoji:'💆', about:'We are a boutique beauty school specializing in esthetics, offering hands-on education and professional student-performed services.', pin:'2121' },
  { id:30, stop_number:30, name:'Lovebound Library', type:'allied', emoji:'💞', about:'Lovebound Library is Utah’s first romance only bookstore. We are a safe space for everyone to come and explore their journey with romance novels!', pin:'0145' },
  { id:31, stop_number:31, name:'Sugar House Coffee', type:'allied', emoji:'☕', about:'Sugar House Coffee offers local faire, freshly roasted Rimini Coffee, delicious sandwiches and smoothies all day long.', pin:'2011' },
  { id:32, stop_number:32, name:'Under the Umbrella Bookstore', type:'allied', emoji:'📚', about:'Under the Umbrella is a queer little bookstore on Ute, Goshute, Shoshone, and Paiute land (Salt Lake City, Utah), sharing and celebrating queer books written by queer authors and offering a safe,...', pin:'0511' },
  { id:33, stop_number:33, name:'Nikau Chiropractic', type:'allied', emoji:'🦴', about:'Nikau Chiropractic is a queer-owned practice dedicated to high-quality, inclusive care for people of all backgrounds and identities.', pin:'0810' },
];
 
const MILESTONES = [
  { id:'m-3', count:3, icon:'🎟', label:'Entry prize', sub:'Raffle ticket, claim at the Chamber booth.' },
  { id:'m-10', count:10, icon:'🛍', label:'Swag bag', sub:'QBC swag bag, claim at the Chamber booth.' },
  { id:'m-20', count:20, icon:'🏆', label:'Grand prize', sub:'Grand prize entry, claim at the Chamber booth.' },
  { id:'m-33', count:33, icon:'🌈', label:'Crawl Legend', sub:'You visited every stop. You ARE the crawl.' },
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
// Geocoded from real addresses.
const BUSINESS_COORDS = {
  'Native Flower Company': [40.7481, -111.881],
  'Weller Book Works': [40.7583, -111.8769],
  'Oliver & Princess Natasha Vintage Shop': [40.7326, -111.8673],
  'MILK+': [40.748, -111.8901],
  'Mountain West Cider': [40.7817, -111.9009],
  'Lucky Ones Coffee': [40.7836, -111.898],
  'SomaSense Wellness': [40.7216, -111.8649],
  'Project Rainbow Utah': [40.7177, -111.8417],
  'HK Brewing Collective Taproom & Bar': [40.7608, -111.8961],
  'The King\'s English Bookshop': [40.7326, -111.8553],
  'Ogden Therapy Cooperative': [41.2249, -111.9624],
  'Wiconi Counseling Center': [41.0595, -111.9756],
  'Soma Psychotherapy': [40.6551, -111.8601],
  'Parfé Diem': [40.7193, -111.8673],
  'Space Tea': [40.7434, -111.8913],
  'btone FITNESS Brickyard': [40.7006, -111.8649],
  'Dented Brick Distillery': [40.6924, -111.8961],
  'SkinSaitions LLC': [40.7216, -111.8649],
  'Adecco Staffing': [40.7177, -111.8926],
  'Scion Cider Bar': [40.7477, -111.8985],
  'Salt Lake Game Show Experience': [40.7417, -111.8985],
  'Alliance Counseling': [40.7633, -111.8865],
  'Cat Palmer Photography': [40.7605, -111.9081],
  'El Cholo': [40.7161, -111.8697],
  'Argentinas Best Empanadas': [40.7619, -111.8865],
  'Sweet Hazel & Co.': [40.7456, -111.8937],
  'Melancholy Bar & Lounge': [40.7568, -111.8985],
  'Pantry Products': [40.7484, -111.8865],
  'Skinworks School of Advanced Skincare': [40.7172, -111.89],
  'Lovebound Library': [40.7481, -111.8878],
  'Sugar House Coffee': [40.72, -111.8649],
  'Under the Umbrella Bookstore': [40.7658, -111.9036],
  'Nikau Chiropractic': [40.7506, -111.8719],
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
  function genCode() {
    return 'QBC-' + Math.random().toString(36).slice(2, 7).toUpperCase();
  }

  if (supabaseClient) {
    // If email already exists, return that passport instead of creating a duplicate
    const { data: existing } = await supabaseClient
      .from('passports')
      .select('*, checkins(*)')
      .eq('email', email)
      .single();
    if (existing) return existing;

    const passport = {
      passport_code: genCode(),
      first_name: firstName,
      last_name: lastName || null,
      email: email,
      referral_source: source || null,
    };

    let attempts = 0;
    while (attempts < 5) {
      const { data, error } = await supabaseClient
        .from('passports')
        .insert([passport])
        .select()
        .single();

      if (!error) return data;

      // Retry only on passport_code collision
      if (error.code === '23505' && error.message?.includes('passport_code')) {
        passport.passport_code = genCode();
        attempts++;
        continue;
      }

      const detail = error.message || JSON.stringify(error);
      console.error('Supabase insert error:', error);
      throw new Error(`Passport insert failed (${error.code || '400'}): ${detail}`);
    }
    throw new Error('Could not generate a unique passport code — please try again.');
  } else {
    return {
      passport_code: genCode(),
      first_name: firstName,
      last_name: lastName || null,
      email,
      referral_source: source || null,
      id: 'demo-' + Date.now(),
    };
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

  const popupHtml = `
    <div style="font-family:sans-serif;min-width:160px">
      <div style="font-weight:700;font-size:14px;margin-bottom:4px">${b.name}</div>
      <div style="font-size:12px;color:#666;margin-bottom:6px">Stop ${b.stop_number ?? ''}</div>
      ${visited
        ? `<div style="color:#e8357a;font-weight:600;font-size:12px">✓ Visited</div>`
        : `<button onclick="showCheckin(${b.stop_number ?? b.id})"
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
    const passportUrl = `${location.origin}?p=${passport.passport_code}`;
    document.getElementById('ob-passport-url').textContent = passportUrl;
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

  errEl.classList.add('hidden');
 
  if (!email || !email.includes('@')) {
    showError('lookup-error', 'Please enter a valid email address.'); return;
  }
 
  if (supabaseClient) {
    const { data } = await supabaseClient
      .from('passports')
      .select('passport_code, first_name')
      .eq('email', email)
      .single();
    if (data) {
      // Load passport directly — email sending not yet wired up
      currentPassportId = data.passport_code;
      await loadPassport(data.passport_code);
    } else {
      showError('lookup-error', 'No passport found for that email. Try claiming one first.');
    }
  } else {
    showError('lookup-error', 'No passport found for that email. Try claiming one first.');
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

  const milestonesEl = document.getElementById('milestones');
  if (milestonesEl) milestonesEl.classList.toggle('hidden', !PRIZES_ENABLED);

  if (PRIZES_ENABLED) {
    MILESTONES.forEach(m => {
      const el = document.getElementById(m.id);
      if (el) el.classList.toggle('unlocked', count >= m.count);
    });
  }

  updateMapMarkers();
  renderStops();
}
 
function renderStops() {
  const list = document.getElementById('stops-list');

  list.innerHTML = businesses.map((b, i) => {
    const visited = visitedStopIds.has(b.id);
    return `
      <div class="stop-card ${visited ? 'visited' : ''}">
        <div class="stop-emoji">${b.emoji || '📍'}</div>
        <div class="stop-info">
          <div class="stop-name">${b.name}</div>
          <div class="stop-area">Stop ${i + 1}</div>
        </div>
        <div class="stop-right">
          <button class="check-btn" ${visited ? 'disabled' : `onclick="showCheckin(${b.stop_number ?? b.id})"`}>${visited ? '✓ Visited' : 'Check in'}</button>
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
  document.getElementById('ci-pin-input').value = '';
  document.getElementById('ci-pin-error').classList.add('hidden');
 
  window._pendingCheckinBizId = businessId;
  showScreen('screen-checkin');
}
 
async function doCheckin() {
  const bizId = window._pendingCheckinBizId;
  if (!bizId || !currentPassportId) return;

  // Validate PIN
  // businesses may be loaded from Supabase (no pin field) — fall back to SEED_BUSINESSES by name
  const biz = businesses.find(b => b.stop_number === bizId || b.id === bizId);
  const pinSource = (biz && biz.pin) ? biz : SEED_BUSINESSES.find(s => s.name === biz?.name);
  if (pinSource && pinSource.pin) {
    const entered = (document.getElementById('ci-pin-input').value || '').trim();
    const pinError = document.getElementById('ci-pin-error');
    if (entered !== String(pinSource.pin)) {
      pinError.classList.remove('hidden');
      document.getElementById('ci-pin-input').focus();
      return;
    }
    pinError.classList.add('hidden');
  }

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
 
  const stamped = businesses.find(b => b.id === bizId);
  const count = visitedStopIds.size;
  const total = businesses.length;

  document.getElementById('ci-stamp-emoji').textContent = stamped?.emoji || '📍';
  document.getElementById('ci-success-count').textContent = `Stop ${count} of ${total}.`;
  document.getElementById('ci-success-sub').textContent =
    count >= total
      ? 'You visited every stop. You are a Crawl Legend. 🌈'
      : PRIZES_ENABLED
        ? `${total - count} more stop${total - count !== 1 ? 's' : ''} to go for the grand prize.`
        : `${total - count} more stop${total - count !== 1 ? 's' : ''} to go.`;
 
  // Check milestone unlocks (only if prizes are confirmed and enabled)
  const milestoneBox = document.getElementById('ci-milestone-box');
  const newMilestone = PRIZES_ENABLED ? [...MILESTONES].reverse().find(m => count === m.count) : null;
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
    document.getElementById('ci-next-area').textContent = `Stop ${nextNum} of ${businesses.length}`;
    nextEl.classList.remove('hidden');
  } else {
    nextEl.classList.add('hidden');
  }
 
  // Update passport view in memory so it reflects the new stamp immediately
  renderPassport();

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
    ${PRIZES_ENABLED ? `<div class="admin-stat"><div class="admin-stat-val">${s.prizeClaims}</div><div class="admin-stat-lbl">Prize claims</div></div>` : ''}
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
 
  const prizesSection = document.getElementById('admin-prizes')?.closest('.admin-section');
  if (prizesSection) prizesSection.classList.toggle('hidden', !PRIZES_ENABLED);

  if (PRIZES_ENABLED) {
    document.getElementById('admin-prizes').innerHTML = `
      <div class="admin-prize-row"><div class="admin-prize-label"><div class="prize-tag p-entry">Entry (3 stops)</div>Raffle ticket</div><div class="admin-prize-val">—</div></div>
      <div class="admin-prize-row"><div class="admin-prize-label"><div class="prize-tag p-swag">Swag (10 stops)</div>Chamber bag</div><div class="admin-prize-val">—</div></div>
      <div class="admin-prize-row"><div class="admin-prize-label"><div class="prize-tag p-grand">Grand (20 stops)</div>Grand prize</div><div class="admin-prize-val">—</div></div>
    `;
  }
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
        .select('checked_in_at, passports(passport_code, first_name, last_name, email), businesses(name)')
        .order('checked_in_at');
      data = (res.data || []).map(c => ({
        checked_in_at:  c.checked_in_at,
        passport_code:  c.passports?.passport_code  || '',
        first_name:     c.passports?.first_name     || '',
        last_name:      c.passports?.last_name      || '',
        email:          c.passports?.email          || '',
        business_name:  c.businesses?.name          || '',
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
function copyPassportLink() {
  const url = document.getElementById('ob-passport-url')?.textContent;
  if (!url) return;
  navigator.clipboard.writeText(url).then(() => showToast('Link copied!')).catch(() => {
    // Fallback for older browsers
    const el = document.createElement('textarea');
    el.value = url; document.body.appendChild(el);
    el.select(); document.execCommand('copy');
    document.body.removeChild(el);
    showToast('Link copied!');
  });
}

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
