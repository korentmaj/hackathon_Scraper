const DATA_PATHS = [
  'data/hackathons.json',
  'scraper_flask/data/hackathons.json',
  '../scraper_flask/data/hackathons.json',
  'https://raw.githubusercontent.com/korentmaj/hackathon_Scraper/main/scraper_flask/data/hackathons.json',
  'https://raw.githubusercontent.com/JaiAnshSB26/hackathon_Scraper/main/scraper_flask/data/hackathons.json'
];

const PAGE_SIZE = 24;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const COUNTRIES = [
  {name:'Online / Global', lat:null, lng:null, aliases:['online','virtual','remote','global','worldwide']},
  {name:'United States', lat:39.8283, lng:-98.5795, aliases:['united states','usa','u.s.a','america','nyc','new york','san francisco','los angeles','boston','chicago','seattle','austin','miami','california','texas','njit','uci','rice university']},
  {name:'Canada', lat:56.1304, lng:-106.3468, aliases:['canada','toronto','montreal','vancouver','ottawa','waterloo','marihacks','vanier']},
  {name:'United Kingdom', lat:55.3781, lng:-3.4360, aliases:['united kingdom','uk','u.k','england','london','manchester','cambridge','oxford']},
  {name:'India', lat:20.5937, lng:78.9629, aliases:['india','delhi','mumbai','bangalore','bengaluru','iit','bharat','kaya ai iit']},
  {name:'Singapore', lat:1.3521, lng:103.8198, aliases:['singapore','sg']},
  {name:'Malaysia', lat:4.2105, lng:101.9758, aliases:['malaysia','kuala lumpur']},
  {name:'Germany', lat:51.1657, lng:10.4515, aliases:['germany','berlin','munich','hamburg','hackhpi']},
  {name:'France', lat:46.2276, lng:2.2137, aliases:['france','paris']},
  {name:'Spain', lat:40.4637, lng:-3.7492, aliases:['spain','madrid','barcelona']},
  {name:'Portugal', lat:39.3999, lng:-8.2245, aliases:['portugal','lisbon','porto']},
  {name:'Netherlands', lat:52.1326, lng:5.2913, aliases:['netherlands','amsterdam','delft']},
  {name:'Belgium', lat:50.5039, lng:4.4699, aliases:['belgium','brussels']},
  {name:'Switzerland', lat:46.8182, lng:8.2275, aliases:['switzerland','zurich','geneva']},
  {name:'Austria', lat:47.5162, lng:14.5501, aliases:['austria','vienna']},
  {name:'Slovenia', lat:46.1512, lng:14.9955, aliases:['slovenia','ljubljana','maribor']},
  {name:'Croatia', lat:45.1000, lng:15.2000, aliases:['croatia','zagreb']},
  {name:'Italy', lat:41.8719, lng:12.5674, aliases:['italy','rome','milan','turin']},
  {name:'Ireland', lat:53.1424, lng:-7.6921, aliases:['ireland','dublin']},
  {name:'Poland', lat:51.9194, lng:19.1451, aliases:['poland','warsaw','krakow']},
  {name:'Czechia', lat:49.8175, lng:15.4730, aliases:['czechia','czech republic','prague']},
  {name:'Romania', lat:45.9432, lng:24.9668, aliases:['romania','bucharest']},
  {name:'Greece', lat:39.0742, lng:21.8243, aliases:['greece','athens']},
  {name:'Turkey', lat:38.9637, lng:35.2433, aliases:['turkey','istanbul']},
  {name:'Israel', lat:31.0461, lng:34.8516, aliases:['israel','tel aviv']},
  {name:'United Arab Emirates', lat:23.4241, lng:53.8478, aliases:['united arab emirates','uae','dubai','abu dhabi']},
  {name:'Saudi Arabia', lat:23.8859, lng:45.0792, aliases:['saudi arabia','riyadh']},
  {name:'Nigeria', lat:9.0820, lng:8.6753, aliases:['nigeria','lagos','abuja','gombe','nacos']},
  {name:'Uganda', lat:1.3733, lng:32.2903, aliases:['uganda','kampala','makerere']},
  {name:'Kenya', lat:-0.0236, lng:37.9062, aliases:['kenya','nairobi']},
  {name:'South Africa', lat:-30.5595, lng:22.9375, aliases:['south africa','cape town','johannesburg']},
  {name:'Australia', lat:-25.2744, lng:133.7751, aliases:['australia','sydney','melbourne','brisbane']},
  {name:'New Zealand', lat:-40.9006, lng:174.8860, aliases:['new zealand','auckland','wellington']},
  {name:'Japan', lat:36.2048, lng:138.2529, aliases:['japan','tokyo','osaka','kyoto']},
  {name:'South Korea', lat:35.9078, lng:127.7669, aliases:['south korea','korea','seoul']},
  {name:'China', lat:35.8617, lng:104.1954, aliases:['china','beijing','shanghai','shenzhen','qwen']},
  {name:'Hong Kong', lat:22.3193, lng:114.1694, aliases:['hong kong']},
  {name:'Taiwan', lat:23.6978, lng:120.9605, aliases:['taiwan','taipei']},
  {name:'Indonesia', lat:-0.7893, lng:113.9213, aliases:['indonesia','jakarta','bali']},
  {name:'Philippines', lat:12.8797, lng:121.7740, aliases:['philippines','manila']},
  {name:'Vietnam', lat:14.0583, lng:108.2772, aliases:['vietnam','hanoi','ho chi minh']},
  {name:'Thailand', lat:15.8700, lng:100.9925, aliases:['thailand','bangkok']},
  {name:'Brazil', lat:-14.2350, lng:-51.9253, aliases:['brazil','sao paulo','rio de janeiro']},
  {name:'Mexico', lat:23.6345, lng:-102.5528, aliases:['mexico','mexico city']},
  {name:'Argentina', lat:-38.4161, lng:-63.6167, aliases:['argentina','buenos aires']},
  {name:'Chile', lat:-35.6751, lng:-71.5430, aliases:['chile','santiago']},
  {name:'Colombia', lat:4.5709, lng:-74.2973, aliases:['colombia','bogota']},
  {name:'Peru', lat:-9.1900, lng:-75.0152, aliases:['peru','lima']}
];

const state = {
  all: [],
  visible: [],
  page: 0,
  userLocation: null,
  loadedFrom: '',
  mapVisible: false
};

function $id(id){ return document.getElementById(id); }

function setStatus(text){ $id('status').textContent = text; }

function normalizeText(value){
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function hasAlias(text, alias){
  const normalizedAlias = normalizeText(alias);
  if(!normalizedAlias) return false;
  return new RegExp(`(^| )${escapeRegExp(normalizedAlias)}( |$)`).test(text);
}

function escapeRegExp(value){
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function numberFromValue(value){
  if(value === null || value === undefined || value === '') return null;
  if(typeof value === 'number' && Number.isFinite(value)) return value;
  const match = String(value).replace(/,/g, '').match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function getFirstField(item, names){
  for(const name of names){
    if(item[name] !== undefined && item[name] !== null && item[name] !== '') return item[name];
  }
  return null;
}

function inferPrice(item){
  const value = getFirstField(item, ['price','cost','fee','entry_fee','registration_fee','registrationFee']);
  if(value === null) return null;
  if(typeof value === 'string' && /\b(free|no cost|gratis)\b/i.test(value)) return 0;
  return numberFromValue(value);
}

function inferParticipants(item){
  const value = getFirstField(item, ['participants','participant_count','participantCount','attendees','registrations','registered','capacity']);
  return numberFromValue(value);
}

function inferCountry(item){
  const explicit = getFirstField(item, ['country','location_country','locationCountry']);
  if(explicit){
    const explicitNormalized = normalizeText(explicit);
    const matched = COUNTRIES.find(country => normalizeText(country.name) === explicitNormalized);
    if(matched) return matched;
    return {name: String(explicit), lat: null, lng: null, aliases: []};
  }

  const location = getFirstField(item, ['location','venue','city','address']) || '';
  const text = normalizeText(`${item.title || ''} ${location} ${item.link || ''}`);
  const physicalCountries = COUNTRIES.filter(country => country.name !== 'Online / Global');
  const matchedPhysical = physicalCountries.find(country => country.aliases.some(alias => hasAlias(text, alias)));
  if(matchedPhysical) return matchedPhysical;

  const online = COUNTRIES[0];
  if(online.aliases.some(alias => hasAlias(text, alias))) return online;
  return null;
}

function toRadians(value){
  return value * Math.PI / 180;
}

function distanceKm(from, to){
  if(!from || !to || to.lat === null || to.lng === null) return null;
  const earthRadiusKm = 6371;
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);
  const a = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function parseDatePart(part, defaults = {}){
  const months = {
    jan:0, january:0, feb:1, february:1, mar:2, march:2, apr:3, april:3,
    may:4, jun:5, june:5, jul:6, july:6, aug:7, august:7, sep:8, sept:8,
    september:8, oct:9, october:9, nov:10, november:10, dec:11, december:11
  };
  const clean = String(part || '').toLowerCase().replace(/,/g, ' ').replace(/\s+/g, ' ').trim();
  const monthMatch = clean.match(/\b(january|february|march|april|may|june|july|august|september|sept|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\b/);
  const yearMatch = clean.match(/\b(20\d{2}|19\d{2})\b/);
  const withoutYear = clean.replace(/\b(20\d{2}|19\d{2})\b/g, '');
  const dayMatch = withoutYear.match(/\b([0-3]?\d)(st|nd|rd|th)?\b/);

  const month = monthMatch ? months[monthMatch[1]] : defaults.month;
  const year = yearMatch ? Number(yearMatch[1]) : defaults.year;
  const day = dayMatch ? Number(dayMatch[1]) : defaults.day;

  if(month === undefined || year === undefined || day === undefined) return null;
  return new Date(Date.UTC(year, month, day));
}

function parseDateRange(value){
  const text = String(value || '').replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim();
  if(!text) return {start:null, end:null, status:'unknown'};

  const parts = text.split(/\s+-\s+/);
  const currentYear = new Date().getFullYear();
  const endRaw = parts.length > 1 ? parts[parts.length - 1] : parts[0];
  const startRaw = parts[0];
  const explicitEndYear = (endRaw.match(/\b(20\d{2}|19\d{2})\b/) || [])[1];
  const explicitStartYear = (startRaw.match(/\b(20\d{2}|19\d{2})\b/) || [])[1];
  const endYear = explicitEndYear ? Number(explicitEndYear) : (explicitStartYear ? Number(explicitStartYear) : currentYear);
  let start = parseDatePart(startRaw, {year: explicitStartYear ? Number(explicitStartYear) : endYear});
  let end = parseDatePart(endRaw, {
    year: endYear,
    month: start ? start.getUTCMonth() : undefined
  });

  if(start && !end) end = start;
  if(end && !start) start = end;
  if(start && end && end < start){
    end = new Date(Date.UTC(end.getUTCFullYear() + 1, end.getUTCMonth(), end.getUTCDate()));
  }

  return {
    start,
    end,
    status: getEventStatus(start, end)
  };
}

function startOfTodayUtc(){
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

function getEventStatus(start, end){
  if(!start && !end) return 'unknown';
  const today = startOfTodayUtc();
  if(end && end < today) return 'past';
  if(start && start > today) return 'upcoming';
  return 'ongoing';
}

function enrichHackathon(item, index){
  const country = inferCountry(item);
  const dates = parseDateRange(item.date);
  const price = inferPrice(item);
  const participants = inferParticipants(item);
  const locationText = getFirstField(item, ['location','venue','city','address']) || '';

  return {
    ...item,
    _index: index,
    _country: country,
    _countryName: country ? country.name : 'Unknown',
    _dates: dates,
    _price: price,
    _participants: participants,
    _locationText: locationText,
    _search: normalizeText(`${item.title || ''} ${item.date || ''} ${item.link || ''} ${locationText} ${country ? country.name : ''}`)
  };
}

async function fetchJSON(){
  setStatus('Fetching data...');
  for(const path of DATA_PATHS){
    try{
      const response = await fetch(path, {cache:'no-store'});
      if(!response.ok) continue;
      const data = await response.json();
      state.all = Array.isArray(data) ? data.map(enrichHackathon) : [];
      state.loadedFrom = path;
      populateCountryFilter();
      setStatus(`Loaded ${state.all.length} entries`);
      applyFiltersAndRender();
      return;
    }catch(error){
      console.warn(`Failed to load ${path}`, error);
    }
  }
  setStatus('Failed to load data — check workflow or JSON path.');
}

function populateCountryFilter(){
  const countrySelect = $id('country');
  const selected = countrySelect.value;
  const countries = [...new Set(state.all.map(item => item._countryName))]
    .filter(Boolean)
    .sort((a, b) => {
      if(a === 'Unknown') return 1;
      if(b === 'Unknown') return -1;
      if(a === 'Online / Global') return -1;
      if(b === 'Online / Global') return 1;
      return a.localeCompare(b);
    });

  countrySelect.innerHTML = '<option value="">All countries</option>';
  for(const country of countries){
    const option = document.createElement('option');
    option.value = country;
    option.textContent = country;
    countrySelect.appendChild(option);
  }
  countrySelect.value = [...countrySelect.options].some(option => option.value === selected) ? selected : '';
}

function getDistance(item){
  if(item._countryName === 'Online / Global') return 0;
  return distanceKm(state.userLocation, item._country);
}

function passesNumericFilter(value, threshold, predicate, includeUnknown){
  if(!Number.isFinite(threshold)) return true;
  if(value === null || value === undefined) return includeUnknown;
  return predicate(value, threshold);
}

function applyFiltersAndRender(){
  const query = normalizeText($id('search').value);
  const country = $id('country').value;
  const sort = $id('sort').value;
  const sortDirection = $id('sortDirection').value;
  const hidePast = $id('hidePast').checked;
  const hideOnline = $id('hideOnline').checked;
  const includeUnknown = $id('includeUnknown').checked;
  const maxDistance = Number($id('maxDistance').value);
  const minParticipants = Number($id('minParticipants').value);
  const maxPrice = Number($id('maxPrice').value);
  const hasMaxDistance = Number.isFinite(maxDistance) && $id('maxDistance').value !== '';

  state.visible = state.all.filter(item => {
    if(query && !item._search.includes(query)) return false;
    if(country && item._countryName !== country) return false;
    if(hidePast && item._dates.status === 'past') return false;
    if(hideOnline && item._countryName === 'Online / Global') return false;
    if(!includeUnknown && item._countryName === 'Unknown') return false;
    if(!passesNumericFilter(item._participants, minParticipants, (value, threshold) => value >= threshold, includeUnknown)) return false;
    if(!passesNumericFilter(item._price, maxPrice, (value, threshold) => value <= threshold, includeUnknown)) return false;

    if(hasMaxDistance && state.userLocation){
      const distance = getDistance(item);
      if(distance === null) return includeUnknown;
      if(distance > maxDistance) return false;
    }
    return true;
  });

  state.visible.sort((a, b) => compareHackathons(a, b, sort, sortDirection));
  state.page = 0;
  renderPage();
  renderMap();
  updateCounts();
}

function compareHackathons(a, b, sort, direction){
  const ascending = direction !== 'desc';
  let result = 0;

  if(sort === 'alpha'){
    result = (a.title || '').localeCompare(b.title || '');
  }else if(sort === 'source'){
    result = a._index - b._index;
  }else if(sort === 'distance'){
    result = compareNullable(getDistance(a), getDistance(b), ascending);
  }else if(sort === 'price'){
    result = compareNullable(a._price, b._price, ascending);
  }else if(sort === 'participants'){
    result = compareNullable(a._participants, b._participants, ascending);
  }else{
    result = compareNullable(dateSortValue(a), dateSortValue(b), ascending);
  }

  if(result !== 0) return result;
  return compareNullable(dateSortValue(a), dateSortValue(b), true) || a._index - b._index;
}

function dateSortValue(item){
  return item._dates.start ? item._dates.start.getTime() : null;
}

function compareNullable(a, b, ascending){
  const aMissing = a === null || a === undefined || Number.isNaN(a);
  const bMissing = b === null || b === undefined || Number.isNaN(b);
  if(aMissing && bMissing) return 0;
  if(aMissing) return 1;
  if(bMissing) return -1;
  return ascending ? a - b : b - a;
}

function renderPage(){
  const start = state.page * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageItems = state.visible.slice(start, end);
  renderCards(pageItems, state.page > 0);
  $id('loadMore').style.display = end < state.visible.length ? '' : 'none';
}

function renderMap(){
  const panel = $id('mapPanel');
  const canvas = $id('mapCanvas');
  const counts = $id('mapCounts');

  panel.classList.toggle('hidden', !state.mapVisible);
  $id('toggleMap').textContent = state.mapVisible ? 'Hide map' : 'Show map';
  $id('toggleMap').setAttribute('aria-expanded', String(state.mapVisible));
  if(!state.mapVisible) return;

  const groups = groupVisibleByCountry();
  counts.textContent = `${groups.reduce((sum, group) => sum + group.count, 0)} mapped · ${groups.length} locations`;
  canvas.innerHTML = '';

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 1000 480');
  svg.setAttribute('class', 'world-map');
  svg.setAttribute('aria-hidden', 'true');

  svg.appendChild(makeSvgRect(0, 0, 1000, 480, 'map-ocean'));
  renderMapGrid(svg);
  renderMapContinents(svg);

  const maxCount = Math.max(1, ...groups.map(group => group.count));
  groups.forEach(group => {
    const {x, y} = project(group.country.lat, group.country.lng);
    const radius = 7 + Math.sqrt(group.count / maxCount) * 26;
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('class', 'map-marker');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', radius.toFixed(1));
    circle.setAttribute('tabindex', '0');
    circle.setAttribute('role', 'button');
    circle.dataset.country = group.country.name;
    circle.appendChild(makeSvgTitle(`${group.country.name}: ${group.count} hackathon${group.count === 1 ? '' : 's'}`));
    circle.addEventListener('click', () => filterByMapCountry(group.country.name));
    circle.addEventListener('keydown', event => {
      if(event.key === 'Enter' || event.key === ' ') filterByMapCountry(group.country.name);
    });
    svg.appendChild(circle);

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('class', 'map-label');
    label.setAttribute('x', x);
    label.setAttribute('y', y + 4);
    label.textContent = group.count;
    svg.appendChild(label);
  });

  canvas.appendChild(svg);
}

function groupVisibleByCountry(){
  const groups = new Map();
  for(const item of state.visible){
    if(!item._country || item._country.lat === null || item._country.lng === null) continue;
    const current = groups.get(item._country.name) || {country: item._country, count: 0};
    current.count++;
    groups.set(item._country.name, current);
  }
  return [...groups.values()].sort((a, b) => b.count - a.count);
}

function project(lat, lng){
  return {
    x: ((lng + 180) / 360) * 1000,
    y: ((90 - lat) / 180) * 430 + 25
  };
}

function makeSvgRect(x, y, width, height, className){
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', x);
  rect.setAttribute('y', y);
  rect.setAttribute('width', width);
  rect.setAttribute('height', height);
  rect.setAttribute('class', className);
  return rect;
}

function makeSvgTitle(text){
  const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
  title.textContent = text;
  return title;
}

function renderMapGrid(svg){
  for(let lng = -120; lng <= 120; lng += 60){
    const from = project(-70, lng);
    const to = project(80, lng);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('class', 'map-grid');
    line.setAttribute('x1', from.x);
    line.setAttribute('y1', from.y);
    line.setAttribute('x2', to.x);
    line.setAttribute('y2', to.y);
    svg.appendChild(line);
  }
  for(let lat = -60; lat <= 60; lat += 30){
    const from = project(lat, -180);
    const to = project(lat, 180);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('class', 'map-grid');
    line.setAttribute('x1', from.x);
    line.setAttribute('y1', from.y);
    line.setAttribute('x2', to.x);
    line.setAttribute('y2', to.y);
    svg.appendChild(line);
  }
}

function renderMapContinents(svg){
  const continents = [
    'M132 143 C180 92 257 83 314 122 C353 149 356 205 312 230 C260 259 242 318 190 324 C137 330 92 281 86 226 C82 188 102 164 132 143 Z',
    'M284 306 C331 294 383 330 393 382 C402 430 362 464 322 442 C287 423 270 366 284 306 Z',
    'M430 120 C512 73 645 88 706 141 C760 187 734 247 660 252 C602 256 581 302 519 292 C457 282 399 230 404 178 C406 153 416 132 430 120 Z',
    'M507 285 C552 257 615 283 625 340 C635 395 601 443 554 426 C510 410 480 329 507 285 Z',
    'M671 208 C735 177 815 194 851 250 C879 294 843 343 780 336 C730 330 690 278 671 208 Z',
    'M781 345 C839 337 893 371 906 414 C919 457 858 468 811 443 C775 424 761 382 781 345 Z',
    'M461 422 C510 407 573 420 601 448 C544 463 493 463 461 422 Z'
  ];

  continents.forEach(pathData => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('class', 'map-land');
    path.setAttribute('d', pathData);
    svg.appendChild(path);
  });
}

function filterByMapCountry(countryName){
  $id('country').value = countryName;
  applyFiltersAndRender();
}

function renderCards(items, append = false){
  const grid = $id('grid');
  if(!append) grid.innerHTML = '';
  if(items.length === 0 && !append){
    grid.innerHTML = '<article class="card empty-card"><h3>No hackathons found</h3><p>Try relaxing one of the filters.</p></article>';
    return;
  }

  const fragment = document.createDocumentFragment();
  items.forEach(item => fragment.appendChild(createCard(item)));
  grid.appendChild(fragment);
  animateCards();
}

function createCard(item){
  const card = document.createElement('article');
  card.className = `card ${item._dates.status === 'past' ? 'is-past' : ''}`;

  const title = document.createElement('h3');
  title.textContent = item.title || 'Untitled';

  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.textContent = item.date || 'Date unknown';

  const badges = document.createElement('div');
  badges.className = 'badges';
  badges.appendChild(makeBadge(item._countryName));
  badges.appendChild(makeBadge(statusLabel(item._dates.status), `status-${item._dates.status}`));
  badges.appendChild(makeBadge(formatDistance(item)));
  badges.appendChild(makeBadge(formatParticipants(item._participants)));
  badges.appendChild(makeBadge(formatPrice(item._price)));

  const link = document.createElement('a');
  link.className = 'btn';
  link.href = item.link || '#';
  link.textContent = 'Open';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';

  card.appendChild(title);
  card.appendChild(meta);
  card.appendChild(badges);
  card.appendChild(link);
  return card;
}

function makeBadge(text, className = ''){
  const badge = document.createElement('span');
  badge.className = `badge ${className}`.trim();
  badge.textContent = text;
  return badge;
}

function statusLabel(status){
  if(status === 'past') return 'Past';
  if(status === 'ongoing') return 'Ongoing';
  if(status === 'upcoming') return 'Upcoming';
  return 'Date unknown';
}

function formatDistance(item){
  if(item._countryName === 'Online / Global') return 'Online/global';
  const distance = getDistance(item);
  if(distance === null) return 'Distance unknown';
  return `${Math.round(distance).toLocaleString()} km away`;
}

function formatParticipants(value){
  return value === null || value === undefined ? 'Participants unknown' : `${Math.round(value).toLocaleString()} participants`;
}

function formatPrice(value){
  if(value === null || value === undefined) return 'Price unknown';
  if(value === 0) return 'Free';
  return `$${Math.round(value).toLocaleString()}`;
}

function updateCounts(){
  const hiddenPast = state.all.filter(item => item._dates.status === 'past').length;
  const inferredCountries = state.all.filter(item => item._countryName !== 'Unknown').length;
  $id('counts').textContent = `${state.visible.length} results · ${hiddenPast} past · ${inferredCountries} with country`;
}

function requestLocation(){
  if(!navigator.geolocation){
    $id('locationStatus').textContent = 'Geolocation is not supported';
    return;
  }

  $id('locationStatus').textContent = 'Requesting browser location…';
  navigator.geolocation.getCurrentPosition(position => {
    state.userLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    $id('locationStatus').textContent = `Location enabled · ±${Math.round(position.coords.accuracy || 0)} m`;
    if($id('sort').value !== 'distance') $id('sort').value = 'distance';
    $id('sortDirection').value = 'asc';
    applyFiltersAndRender();
  }, error => {
    $id('locationStatus').textContent = `Location blocked: ${error.message}`;
  }, {
    enableHighAccuracy: false,
    timeout: 10000,
    maximumAge: 10 * 60 * 1000
  });
}

function resetFilters(){
  $id('search').value = '';
  $id('country').value = '';
  $id('sort').value = 'date';
  $id('sortDirection').value = 'asc';
  $id('hidePast').checked = true;
  $id('hideOnline').checked = false;
  $id('maxDistance').value = '';
  $id('minParticipants').value = '';
  $id('maxPrice').value = '';
  $id('includeUnknown').checked = true;
  applyFiltersAndRender();
}

function animateCards(){
  const cards = document.querySelectorAll('.card:not(.animated)');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(16px)';
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
      card.classList.add('animated');
    }, Math.min(index * 30, 360));
  });
}

function debounce(fn, wait = 200){
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
}

function handleScroll(){
  document.body.classList.toggle('scrolled', window.scrollY > 200);
}

$id('loadMore').addEventListener('click', () => {
  state.page++;
  renderPage();
});

['country','sort','sortDirection','hidePast','hideOnline','includeUnknown'].forEach(id => {
  $id(id).addEventListener('change', applyFiltersAndRender);
});

['search','maxDistance','minParticipants','maxPrice'].forEach(id => {
  $id(id).addEventListener('input', debounce(applyFiltersAndRender));
});

$id('useLocation').addEventListener('click', requestLocation);
$id('toggleMap').addEventListener('click', () => {
  state.mapVisible = !state.mapVisible;
  renderMap();
});
$id('resetFilters').addEventListener('click', resetFilters);
window.addEventListener('scroll', debounce(handleScroll, 20));

fetchJSON();
