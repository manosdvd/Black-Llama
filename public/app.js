// Camp Lawton Scout Camp Dashboard Client Logic

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const emberCanvas = document.getElementById('emberCanvas');
  const redFlagBanner = document.getElementById('redFlagBanner');
  const logoBtn = document.getElementById('logoBtn');
  const adminTriggerBtn = document.getElementById('adminTriggerBtn');
  const adminDialog = document.getElementById('adminDialog');
  const adminCloseBtn = document.getElementById('adminCloseBtn');
  const adminCancelBtn = document.getElementById('adminCancelBtn');
  const adminForm = document.getElementById('adminForm');
  const adminPinInput = document.getElementById('adminPinInput');
  const pinError = document.getElementById('pinError');
  const adminControlsBlock = document.getElementById('adminControlsBlock');
  const adminSaveBtn = document.getElementById('adminSaveBtn');
  const adminSuccessMsg = document.getElementById('adminSuccessMsg');
  const pinFormGroup = document.getElementById('pinFormGroup');
  
  // Staff Applications Admin Elements
  const adminApplicationsTab = document.getElementById('adminApplicationsTab');
  const applicationsCount = document.getElementById('applicationsCount');
  const applicationsList = document.getElementById('applicationsList');
  const appSearchInput = document.getElementById('appSearchInput');
  const appStatusFilter = document.getElementById('appStatusFilter');
  const btnExportApps = document.getElementById('btnExportApps');

  // Input elements inside Admin Form
  const adminFireDanger = document.getElementById('adminFireDanger');
  const adminRestriction = document.getElementById('adminRestriction');
  const adminAlertText = document.getElementById('adminAlertText');

  // Dashboard status elements
  const campStatusMsg = document.getElementById('campStatusMsg');
  const fireDangerBadge = document.getElementById('fireDangerBadge');
  const gaugeNeedle = document.getElementById('gaugeNeedle');
  const gaugeDangerText = document.getElementById('gaugeDangerText');
  const gaugeContainer = document.querySelector('.gauge-container');
  const campfireRestrictionCard = document.getElementById('campfireRestrictionCard');
  const restrictionStatusText = document.getElementById('restrictionStatusText');
  const restrictionDescText = document.getElementById('restrictionDescText');
  const customFireAlertText = document.getElementById('customFireAlertText');
  
  // Weather elements
  const currentTemp = document.getElementById('currentTemp');
  const weatherDesc = document.getElementById('weatherDesc');
  const weatherIcon = document.getElementById('weatherIcon');
  const windValue = document.getElementById('windValue');
  const windCompassNeedle = document.getElementById('windCompassNeedle');
  const humidityValue = document.getElementById('humidityValue');
  const humidityBar = document.getElementById('humidityBar');
  const precipValue = document.getElementById('precipValue');
  const precipBar = document.getElementById('precipBar');
  const forecastGrid = document.getElementById('forecastGrid');
  const campTempCooling = document.getElementById('campTempCooling');
  
  // Camp Time & Refresh Selectors
  const campTime = document.getElementById('campTime');
  const btnRefreshWeather = document.getElementById('btnRefreshWeather');
  const weatherLastUpdated = document.getElementById('weatherLastUpdated');
  const btnRefreshFire = document.getElementById('btnRefreshFire');
  const fireLastUpdated = document.getElementById('fireLastUpdated');
  
  // Forest Alerts selectors
  const alertRoadStatus = document.getElementById('alertRoadStatus');
  const alertAdvisory = document.getElementById('alertAdvisory');
  const alertWeatherList = document.getElementById('alertWeatherList');
  const alertGeoList = document.getElementById('alertGeoList');
  const alertsLastUpdated = document.getElementById('alertsLastUpdated');
  const btnRefreshAlerts = document.getElementById('btnRefreshAlerts');
  
  // Admin form fields for alerts
  const adminRoadStatus = document.getElementById('adminRoadStatus');
  const adminAdvisoryAlert = document.getElementById('adminAdvisoryAlert');
  const adminBulletinText = document.getElementById('adminBulletinText');

  // Admin tabs & lists for reservations and blog
  const adminReservationsTab = document.getElementById('adminReservationsTab');
  const adminBlogTab = document.getElementById('adminBlogTab');
  const reservationsCount = document.getElementById('reservationsCount');
  const reservationsList = document.getElementById('reservationsList');
  const resSearchInput = document.getElementById('resSearchInput');
  const resStatusFilter = document.getElementById('resStatusFilter');
  const adminBlogTitle = document.getElementById('adminBlogTitle');
  const adminBlogCategory = document.getElementById('adminBlogCategory');
  const adminBlogSummary = document.getElementById('adminBlogSummary');
  const btnPublishPost = document.getElementById('btnPublishPost');
  const blogPublishStatus = document.getElementById('blogPublishStatus');

  // Advisor elements
  const advisorStatusBadge = document.getElementById('advisorStatusBadge');
  const advCampfireText = document.getElementById('advCampfireText');
  const advCookingText = document.getElementById('advCookingText');
  const advHikeText = document.getElementById('advHikeText');

  // Scouting Almanac Elements
  const quoteText = document.getElementById('quoteText');
  const quoteAuthor = document.getElementById('quoteAuthor');
  const holidayText = document.getElementById('holidayText');
  const historyYear = document.getElementById('historyYear');
  const historyTitle = document.getElementById('historyTitle');
  const historyDesc = document.getElementById('historyDesc');

  // Feed elements
  const blogGrid = document.getElementById('blogGrid');
  const eventsGrid = document.getElementById('eventsGrid');

  // Modals & Links Elements
  const linkReservations = document.getElementById('linkReservations');
  const reservationDialog = document.getElementById('reservationDialog');
  const reservationCloseBtn = document.getElementById('reservationCloseBtn');
  const reservationCancelBtn = document.getElementById('reservationCancelBtn');
  const reservationForm = document.getElementById('reservationForm');
  const reservationSuccessMsg = document.getElementById('reservationSuccessMsg');

  const linkLeadersGuide = document.getElementById('linkLeadersGuide');
  const leadersGuideDialog = document.getElementById('leadersGuideDialog');
  const leadersGuideCloseBtn = document.getElementById('leadersGuideCloseBtn');
  const leadersGuideCancelBtn = document.getElementById('leadersGuideCancelBtn');

  const linkStaffHandbook = document.getElementById('linkStaffHandbook');
  const staffHandbookDialog = document.getElementById('staffHandbookDialog');
  const staffHandbookCloseBtn = document.getElementById('staffHandbookCloseBtn');
  const staffHandbookCancelBtn = document.getElementById('staffHandbookCancelBtn');

  const linkCampMap = document.getElementById('linkCampMap');
  const campMapDialog = document.getElementById('campMapDialog');
  const campMapCloseBtn = document.getElementById('campMapCloseBtn');
  const campMapCancelBtn = document.getElementById('campMapCancelBtn');
  const mapBoard = document.getElementById('mapBoard');
  const mapLocName = document.getElementById('mapLocName');
  const mapLocElev = document.getElementById('mapLocElev');
  const mapLocDesc = document.getElementById('mapLocDesc');
  const mapLocStats = document.getElementById('mapLocStats');
  const mapLocCap = document.getElementById('mapLocCap');
  const mapLocActs = document.getElementById('mapLocActs');

  const linkMeritBadges = document.getElementById('linkMeritBadges');
  const meritBadgeDialog = document.getElementById('meritBadgeDialog');
  const meritBadgeCloseBtn = document.getElementById('meritBadgeCloseBtn');
  const meritBadgeCancelBtn = document.getElementById('meritBadgeCancelBtn');
  const mbSearchInput = document.getElementById('mbSearchInput');
  const mbDeptFilter = document.getElementById('mbDeptFilter');
  const mbGrid = document.getElementById('mbGrid');

  // State
  let isAdminAuthenticated = false;
  let currentEmberPin = '';
  let loadedApplications = [];

  // 1. CAMPFIRE EMBERS CANVAS PARTICLE SYSTEM
  let canvasCtx = null;
  let particles = [];
  const maxParticles = 40;

  function initEmberCanvas() {
    canvasCtx = emberCanvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create initial particles
    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle(true));
    }
    
    requestAnimationFrame(animateParticles);
  }

  function resizeCanvas() {
    emberCanvas.width = window.innerWidth;
    emberCanvas.height = window.innerHeight;
  }

  function createParticle(randomY = false) {
    const w = emberCanvas.width;
    const h = emberCanvas.height;
    return {
      x: Math.random() * w,
      y: randomY ? Math.random() * h : h + 20,
      size: Math.random() * 2.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: -(Math.random() * 1.2 + 0.5),
      color: getRandomEmberColor(),
      alpha: Math.random() * 0.5 + 0.3,
      fadeRate: Math.random() * 0.003 + 0.001
    };
  }

  function getRandomEmberColor() {
    const colors = [
      'rgba(255, 122, 0, ',  // Amber Orange
      'rgba(255, 76, 0, ',   // Campfire Red-Orange
      'rgba(255, 183, 0, ',  // Lantern Yellow
      'rgba(238, 82, 83, '   // Soft Crimson
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function animateParticles() {
    if (!canvasCtx) return;
    canvasCtx.clearRect(0, 0, emberCanvas.width, emberCanvas.height);

    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      p.x += p.speedX;
      p.y += p.speedY;
      p.alpha -= p.fadeRate;

      // Render particle
      canvasCtx.beginPath();
      canvasCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      canvasCtx.fillStyle = p.color + p.alpha + ')';
      canvasCtx.shadowBlur = p.size * 3;
      canvasCtx.shadowColor = 'rgba(255, 122, 0, 0.4)';
      canvasCtx.fill();

      // Recycle dead particles
      if (p.alpha <= 0 || p.y < -10 || p.x < -10 || p.x > emberCanvas.width + 10) {
        particles[i] = createParticle(false);
      }
    }
    requestAnimationFrame(animateParticles);
  }

  // 2. DIAL & COMPASS ROTATION ANIMATIONS
  function rotateFireDangerNeedle(level) {
    let degrees = 36; // Default to Very High
    let classSuffix = 'veryhigh';

    switch (level) {
      case 'Low':
        degrees = -72;
        classSuffix = 'low';
        break;
      case 'Moderate':
        degrees = -36;
        classSuffix = 'mod';
        break;
      case 'High':
        degrees = 0;
        classSuffix = 'high';
        break;
      case 'Very High':
        degrees = 36;
        classSuffix = 'veryhigh';
        break;
      case 'Extreme':
        degrees = 72;
        classSuffix = 'extreme';
        break;
    }

    // Set needle rotation
    gaugeNeedle.style.transform = `rotate(${degrees}deg)`;
    
    // Set text display
    gaugeDangerText.textContent = level.toUpperCase();
    fireDangerBadge.textContent = level + ' Danger';
    
    // Update gauge container class for color highlighting
    gaugeContainer.className = 'gauge-container';
    gaugeContainer.classList.add(`active-danger-${classSuffix}`);
    
    // Set appropriate text colors
    gaugeDangerText.style.color = `var(--danger-${classSuffix})`;
  }

  function rotateCompassNeedle(direction) {
    const windAngles = {
      'N': 0, 'NNE': 22.5, 'NE': 45, 'ENE': 67.5,
      'E': 90, 'ESE': 112.5, 'SE': 135, 'SSE': 157.5,
      'S': 180, 'SSW': 202.5, 'SW': 225, 'WSW': 247.5,
      'W': 270, 'WNW': 292.5, 'NW': 315, 'NNW': 337.5
    };
    
    let dir = direction ? direction.toUpperCase().trim() : 'SW';
    if (dir === 'NORTH') dir = 'N';
    if (dir === 'SOUTH') dir = 'S';
    if (dir === 'EAST') dir = 'E';
    if (dir === 'WEST') dir = 'W';

    const angle = windAngles[dir] !== undefined ? windAngles[dir] : 225;
    windCompassNeedle.style.transform = `rotate(${angle}deg)`;
  }

  // 3. FETCH AND RENDER DASHBOARD DATA
  async function loadDashboardData(force = false) {
    try {
      const weatherUrl = force ? '/api/weather?force=true' : '/api/weather';
      const fireUrl = force ? '/api/fire-status?force=true' : '/api/fire-status';
      const alertsUrl = force ? '/api/forest-alerts?force=true' : '/api/forest-alerts';
      // Parallel fetches for weather, fire danger, and scouting almanac/blog/events
      const [weatherRes, fireRes, scoutingRes, alertsRes] = await Promise.all([
        fetch(weatherUrl).then(r => r.json()),
        fetch(fireUrl).then(r => r.json()),
        fetch('/api/scouting-data').then(r => r.json()),
        fetch(alertsUrl).then(r => r.json())
      ]);

      if (weatherRes.success) {
        renderWeather(weatherRes);
      }
      
      if (fireRes.success) {
        renderFireStatus(fireRes);
      }

      if (alertsRes && alertsRes.success) {
        renderForestAlerts(alertsRes);
      }

      if (weatherRes.success && fireRes.success) {
        updateCampActivityGuidelines(fireRes, weatherRes.data.current);
      }

      if (scoutingRes.success) {
        renderScoutingAlmanac(scoutingRes.data);
        renderBlogAndEvents(scoutingRes.data);
      }
    } catch (error) {
      console.error('API connection failure:', error);
    }
  }

  function renderWeather(weatherRes) {
    const weatherData = weatherRes.data;
    const current = weatherData.current;
    
    // Main stats
    currentTemp.textContent = current.temperature;
    campTempCooling.textContent = `Camp: ${current.temperature}°F`;
    weatherDesc.textContent = current.shortForecast;
    weatherIcon.src = current.icon;
    weatherIcon.alt = current.shortForecast;
    
    windValue.textContent = `${current.windDirection} ${current.windSpeed}`;
    rotateCompassNeedle(current.windDirection);
    
    humidityValue.textContent = `${current.relativeHumidity}%`;
    humidityBar.style.width = `${current.relativeHumidity}%`;
    
    if (precipValue) precipValue.textContent = `${current.precipProbability}%`;
    if (precipBar) precipBar.style.width = `${current.precipProbability}%`;
    
    // Render Extended 10-Day Forecast Grid
    forecastGrid.innerHTML = '';
    
    weatherData.forecast.forEach(period => {
      const card = document.createElement('div');
      card.className = 'forecast-card';
      
      card.innerHTML = `
        <span class="fc-day">${period.name}</span>
        <img class="fc-icon" src="${period.icon}" alt="${period.shortForecast}">
        <span class="fc-temp">${period.maxTemp}°<span>${period.minTemp}°</span></span>
        <span class="fc-precip" style="font-size: 0.72rem; color: #3498db; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.15rem; margin-block: 0.1rem 0;">💧 ${period.precipProbability}%</span>
        <span class="fc-desc">${period.shortForecast}</span>
      `;
      forecastGrid.appendChild(card);
    });

    // Render updated timestamp and data source label
    if (weatherLastUpdated) {
      const date = new Date(weatherRes.lastUpdated);
      const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      let sourceHTML = weatherRes.source.toUpperCase();
      
      if (weatherRes.source === 'live') {
        sourceHTML = '<span style="color: #2ecc71; font-weight: 700;">LIVE</span>';
      } else if (weatherRes.source === 'cache') {
        sourceHTML = '<span style="color: var(--ember-500); font-weight: 700;">CACHED</span>';
      } else if (weatherRes.source === 'stale-cache') {
        sourceHTML = '<span style="color: var(--ember-600); font-weight: 700;">STALE CACHE</span>';
      } else if (weatherRes.source === 'mock') {
        sourceHTML = '<span style="color: var(--fire-500); font-weight: 700;">SIMULATED</span>';
      }
      
      weatherLastUpdated.innerHTML = `Updated: ${timeStr} (${sourceHTML})`;
    }
  }

  function renderFireStatus(fireData) {
    // 1. Red Flag warnings from NWS
    if (fireData.hasActiveRedFlag) {
      redFlagBanner.classList.remove('hidden');
      const latestWarning = fireData.redFlagWarnings[0];
      const warningText = redFlagBanner.querySelector('.banner-text');
      warningText.innerHTML = `<strong>RED FLAG WARNING ACTIVE:</strong> ${latestWarning.headline}. Absolutely no open campfires permitted.`;
      
      campStatusMsg.innerHTML = `⚠️ <strong>CRITICAL FIRE ALERT:</strong> A Red Flag Warning has been issued for Mt. Lemmon. Open flames, charcoal, and campfires are strictly BANNED.`;
      document.querySelector('.status-indicator').className = 'status-indicator alert';
    } else {
      redFlagBanner.classList.add('hidden');
      document.querySelector('.status-indicator').className = 'status-indicator active';
      campStatusMsg.innerHTML = `Welcome to Camp Lawton! The camp is currently open. Today's Coronado National Forest fire danger is rated <strong>${fireData.fireDanger.toUpperCase()}</strong>. Please follow campfire guidelines.`;
    }

    // 2. Rotate Needle
    rotateFireDangerNeedle(fireData.fireDanger);

    // 3. Campfire Restrictions Card
    restrictionStatusText.textContent = fireData.campfireRestriction;
    
    const restrictionCard = campfireRestrictionCard;
    restrictionCard.className = 'restriction-box'; // reset
    
    if (fireData.campfireRestriction === 'Banned') {
      restrictionCard.style.borderLeftColor = 'var(--fire-500)';
      restrictionStatusText.style.backgroundColor = 'var(--fire-500)';
      restrictionStatusText.style.color = '#fff';
      restrictionDescText.innerHTML = `<strong>TOTAL FLAME BAN.</strong> No wood fires, charcoal, or open flames permitted anywhere in the camp. Propane stoves with on/off valves are permitted only under adult supervision in designated campsites.`;
    } else if (fireData.campfireRestriction === 'Restricted') {
      restrictionCard.classList.add('highlight-border-orange');
      restrictionStatusText.style.backgroundColor = 'var(--ember-500)';
      restrictionStatusText.style.color = '#000';
      restrictionDescText.textContent = `Wood and charcoal fires are restricted to designated steel campfire rings in developed campsites. No fires outside rings. Clear 10ft around rings.`;
    } else { // Permitted
      restrictionCard.style.borderLeftColor = 'var(--danger-low)';
      restrictionStatusText.style.backgroundColor = 'var(--danger-low)';
      restrictionStatusText.style.color = '#fff';
      restrictionDescText.textContent = `Campfires are permitted in designated campfire rings. Please burn only dry firewood, keep water bucket nearby, and ensure fire is cold out before leaving.`;
    }

    // 4. Custom alert message
    if (fireData.customAlert) {
      customFireAlertText.textContent = fireData.customAlert;
      document.getElementById('customFireAlertBox').classList.remove('hidden');
    } else {
      document.getElementById('customFireAlertBox').classList.add('hidden');
    }

    // 4b. Camp Bulletin Board rendering
    const bulletinCard = document.getElementById('bulletinCard');
    const bulletinContent = document.getElementById('bulletinContent');
    if (bulletinCard && bulletinContent) {
      if (fireData.bulletinText) {
        bulletinContent.textContent = fireData.bulletinText;
        bulletinCard.classList.remove('hidden');
      } else {
        bulletinCard.classList.add('hidden');
      }
    }

    // 5. Update timestamp and source
    if (fireLastUpdated && fireData.lastUpdated) {
      const date = new Date(fireData.lastUpdated);
      const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      let sourceHTML = (fireData.source || '').toUpperCase();
      
      if (fireData.source === 'live') {
        sourceHTML = '<span style="color: #2ecc71; font-weight: 700;">LIVE</span>';
      } else if (fireData.source === 'cache') {
        sourceHTML = '<span style="color: var(--ember-500); font-weight: 700;">CACHED</span>';
      } else if (fireData.source === 'stale-cache') {
        sourceHTML = '<span style="color: var(--ember-600); font-weight: 700;">STALE CACHE</span>';
      } else if (fireData.source === 'mock') {
        sourceHTML = '<span style="color: var(--fire-500); font-weight: 700;">SIMULATED</span>';
      }
      
      fireLastUpdated.innerHTML = `Updated: ${timeStr} (${sourceHTML})`;
    }
  }

  function renderForestAlerts(alertsRes) {
    // 1. Road Status
    if (alertRoadStatus) {
      alertRoadStatus.textContent = alertsRes.roadStatus;
    }
    
    // 2. Advisory
    if (alertAdvisory) {
      alertAdvisory.textContent = alertsRes.advisoryAlert;
    }
    
    // 3. NOAA Weather Alerts
    if (alertWeatherList) {
      alertWeatherList.innerHTML = '';
      if (alertsRes.nwsAlerts && alertsRes.nwsAlerts.length > 0) {
        alertsRes.nwsAlerts.forEach(alert => {
          const li = document.createElement('li');
          let colorStyle = 'var(--stone-400)';
          if (alert.severity === 'Extreme' || alert.severity === 'Severe') {
            colorStyle = 'var(--fire-500)';
          } else if (alert.severity === 'Moderate') {
            colorStyle = 'var(--ember-500)';
          }
          li.innerHTML = `<span style="color: ${colorStyle}; font-weight: 600;">${alert.event}</span>: ${alert.headline}`;
          alertWeatherList.appendChild(li);
        });
      } else {
        alertWeatherList.innerHTML = '<li style="color: #2ecc71; list-style: none; margin-left: -1.1rem;">✅ No active weather alerts.</li>';
      }
    }
    
    // 4. USGS Geological Activities
    if (alertGeoList) {
      alertGeoList.innerHTML = '';
      if (alertsRes.earthquakes && alertsRes.earthquakes.length > 0) {
        alertsRes.earthquakes.forEach(eq => {
          const li = document.createElement('li');
          const date = new Date(eq.time);
          const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          li.innerHTML = `<span style="color: var(--ember-400); font-weight: 600;">M ${eq.mag}</span> - ${eq.place} (${dateStr})`;
          alertGeoList.appendChild(li);
        });
      } else {
        alertGeoList.innerHTML = '<li style="color: var(--stone-500); list-style: none; margin-left: -1.1rem;">No recent seismic activity.</li>';
      }
    }
    
    // 5. Update timestamp and source
    if (alertsLastUpdated && alertsRes.lastUpdated) {
      const date = new Date(alertsRes.lastUpdated);
      const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      let sourceHTML = (alertsRes.source || '').toUpperCase();
      
      if (alertsRes.source === 'live') {
        sourceHTML = '<span style="color: #2ecc71; font-weight: 700;">LIVE</span>';
      } else if (alertsRes.source === 'cache') {
        sourceHTML = '<span style="color: var(--ember-500); font-weight: 700;">CACHED</span>';
      } else if (alertsRes.source === 'stale-cache') {
        sourceHTML = '<span style="color: var(--ember-600); font-weight: 700;">STALE CACHE</span>';
      } else if (alertsRes.source === 'mock') {
        sourceHTML = '<span style="color: var(--fire-500); font-weight: 700;">SIMULATED</span>';
      }
      
      alertsLastUpdated.innerHTML = `Updated: ${timeStr} (${sourceHTML})`;
    }
  }

  function renderScoutingAlmanac(scoutingData) {
    // Quote
    quoteText.textContent = `"${scoutingData.quote.quote}"`;
    quoteAuthor.textContent = `— ${scoutingData.quote.author}`;
    
    // Holiday
    holidayText.textContent = scoutingData.holiday;
    
    // History
    historyYear.textContent = scoutingData.history.year;
    historyTitle.textContent = scoutingData.history.title;
    historyDesc.textContent = scoutingData.history.description;
  }

  function renderBlogAndEvents(scoutingData) {
    // 1. Blog Posts
    blogGrid.innerHTML = '';
    if (scoutingData.blog && scoutingData.blog.length > 0) {
      scoutingData.blog.slice(0, 2).forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'blog-card';
        postCard.innerHTML = `
          <div class="blog-meta">
            <span class="blog-category">${post.category}</span>
            <span class="blog-date">${formatDateStr(post.date)}</span>
          </div>
          <h4>${post.title}</h4>
          <p class="blog-summary">${post.summary}</p>
          <a href="#" class="blog-readmore">Read Article ➔</a>
        `;
        blogGrid.appendChild(postCard);
      });
    } else {
      blogGrid.innerHTML = '<p class="no-data">No blog posts available.</p>';
    }

    // 2. Council Events
    eventsGrid.innerHTML = '';
    if (scoutingData.events && scoutingData.events.length > 0) {
      scoutingData.events.slice(0, 2).forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        eventCard.innerHTML = `
          <div class="event-meta">
            <span class="event-category">${event.category}</span>
            <span class="event-date">${event.date}</span>
          </div>
          <h4>${event.title}</h4>
          <p class="event-desc">${event.description}</p>
          <span class="event-location">📍 ${event.location}</span>
        `;
        eventsGrid.appendChild(eventCard);
      });
    } else {
      eventsGrid.innerHTML = '<p class="no-data">No upcoming events scheduled.</p>';
    }
  }

  function formatDateStr(dateStr) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateStr + 'T12:00:00'); // Prevent shift
    return date.toLocaleDateString('en-US', options);
  }

  function updateCampActivityGuidelines(fireData, weatherCurrent) {
    const hasRedFlag = fireData.hasActiveRedFlag;
    const danger = fireData.fireDanger;
    const restriction = fireData.campfireRestriction;
    const wind = parseFloat(weatherCurrent.windSpeed) || 0;
    
    // 1. Advisor Status Badge
    if (hasRedFlag || danger === 'Extreme' || restriction === 'Banned') {
      advisorStatusBadge.textContent = 'RESTRICTED OPERATIONS';
      advisorStatusBadge.className = 'advisor-status alert';
      
      advCampfireText.innerHTML = `<strong>BANNED.</strong> Campfire program is suspended or modified to digital/lantern lights only. No match strikes or fire building.`;
      advCookingText.innerHTML = `<strong>PROPANE ONLY.</strong> Wood/coal dutch oven cooking is suspended. Propane stoves/grills with control valves may be used on picnic tables.`;
      advHikeText.innerHTML = `<strong>MONITORED.</strong> Hiking trails remain open, but wilderness trekking is restricted. Carry double water rations (3L per scout).`;
    } else if (danger === 'Very High' || restriction === 'Restricted' || wind > 20) {
      advisorStatusBadge.textContent = 'CAUTION OPERATIONS';
      advisorStatusBadge.className = 'advisor-status';
      advisorStatusBadge.style.backgroundColor = 'rgba(255, 159, 67, 0.15)';
      advisorStatusBadge.style.color = 'var(--ember-500)';
      advisorStatusBadge.style.border = '1px solid rgba(255, 159, 67, 0.2)';
      
      advCampfireText.innerHTML = `<strong>DESIGNATED RINGS ONLY.</strong> Main campfire program allowed in the large assembly ring. Campsite campfires require constant adult supervision.`;
      advCookingText.innerHTML = `<strong>MODIFIED.</strong> Charcoal cooking restricted. Dutch ovens allowed ONLY inside steel rings. Water bucket must be within arm's reach.`;
      advHikeText.innerHTML = `<strong>CAUTION.</strong> High winds or dry fuels present. Stay on marked trails. Avoid ridge hiking during peak wind gusts.`;
    } else {
      advisorStatusBadge.textContent = 'NORMAL OPERATIONS';
      advisorStatusBadge.className = 'advisor-status';
      advisorStatusBadge.style.backgroundColor = '';
      advisorStatusBadge.style.color = '';
      advisorStatusBadge.style.border = '';
      
      advCampfireText.innerHTML = `<strong>PERMITTED.</strong> Enjoy traditional campfires in site rings. Extinguish fully with water until coals are cool to touch.`;
      advCookingText.innerHTML = `<strong>PERMITTED.</strong> Dutch oven charcoal cooking allowed inside campground rings or fire boxes.`;
      advHikeText.innerHTML = `<strong>EXCELLENT.</strong> Perfect weather for backcountry treks. Enjoy trails up to Mt. Lemmon Peak. Wear standard hiking boots.`;
    }
  }

  // 4. ADMIN MODAL CONTROLS & AUTHENTICATION
  logoBtn.addEventListener('dblclick', openAdminPanel);
  adminTriggerBtn.addEventListener('click', openAdminPanel);
  
  function openAdminPanel() {
    adminDialog.showModal();
    adminPinInput.value = '';
    pinError.classList.add('hidden');
    adminSuccessMsg.classList.add('hidden');
    
    // Reset tab views to default
    resetAdminTabs();

    if (isAdminAuthenticated) {
      showAdminControls();
    } else {
      showPinForm();
    }
  }

  function resetAdminTabs() {
    adminDialog.classList.remove('wide-mode');
    adminSaveBtn.classList.remove('hidden');
    
    const allTabBtns = document.querySelectorAll('.admin-tab-btn');
    allTabBtns.forEach(btn => {
      if (btn.getAttribute('data-tab') === 'dashboard') {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const allTabContents = document.querySelectorAll('.admin-tab-content');
    allTabContents.forEach(content => {
      if (content.id === 'tabContent-dashboard') {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });
  }

  function closeAdminPanel() {
    adminDialog.close();
    adminDialog.classList.remove('wide-mode');
  }

  function showPinForm() {
    pinFormGroup.classList.remove('hidden');
    adminControlsBlock.classList.remove('show');
    adminSaveBtn.textContent = 'Authenticate';
  }

  async function showAdminControls() {
    pinFormGroup.classList.add('hidden');
    adminControlsBlock.classList.add('show');
    adminSaveBtn.textContent = 'Save Settings';
    
    try {
      const res = await fetch('/api/fire-status').then(r => r.json());
      if (res.success) {
        adminFireDanger.value = res.fireDanger;
        adminRestriction.value = res.campfireRestriction;
        adminAlertText.value = res.customAlert || '';
        if (adminBulletinText) adminBulletinText.value = res.bulletinText || '';
      }
      
      const alertsRes = await fetch('/api/forest-alerts').then(r => r.json());
      if (alertsRes.success) {
        adminRoadStatus.value = alertsRes.roadStatus || '';
        adminAdvisoryAlert.value = alertsRes.advisoryAlert || '';
      }
      
      // Update applications count in the tab header
      const appsRes = await fetch(`/api/applications?pin=${currentEmberPin}`).then(r => r.json());
      if (appsRes.success) {
        applicationsCount.textContent = appsRes.data.length;
      }

      // Update reservations count in the tab header
      const resRes = await fetch(`/api/reservations?pin=${currentEmberPin}`).then(r => r.json());
      if (resRes.success) {
        reservationsCount.textContent = resRes.data.length;
      }
    } catch (e) {
      console.error('Error pre-populating admin controls:', e);
    }
  }

  adminCloseBtn.addEventListener('click', closeAdminPanel);
  adminCancelBtn.addEventListener('click', closeAdminPanel);

  // Form Submission
  adminForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!isAdminAuthenticated) {
      const pin = adminPinInput.value.trim();
      
      try {
        const res = await fetch('/api/admin/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin })
        }).then(r => r.json());

        if (res.success) {
          isAdminAuthenticated = true;
          currentEmberPin = pin;
          showAdminControls();
        } else {
          pinError.classList.remove('hidden');
          adminPinInput.value = '';
          adminPinInput.focus();
        }
      } catch (error) {
        console.error('Admin authentication error:', error);
        pinError.textContent = 'Connection error. Try again.';
        pinError.classList.remove('hidden');
      }
    } else {
      const payload = {
        pin: currentEmberPin,
        fireDanger: adminFireDanger.value,
        campfireRestriction: adminRestriction.value,
        customAlert: adminAlertText.value.trim(),
        roadStatus: adminRoadStatus.value.trim(),
        advisoryAlert: adminAdvisoryAlert.value.trim(),
        bulletinText: adminBulletinText.value.trim()
      };

      try {
        const res = await fetch('/api/admin/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(r => r.json());

        if (res.success) {
          adminSuccessMsg.classList.remove('hidden');
          loadDashboardData();
          
          setTimeout(() => {
            closeAdminPanel();
          }, 1500);
        } else {
          isAdminAuthenticated = false;
          currentEmberPin = '';
          showPinForm();
          pinError.textContent = 'Session expired. Please re-authenticate.';
          pinError.classList.remove('hidden');
        }
      } catch (error) {
        console.error('Error saving admin settings:', error);
        alert('Failed to save settings. Server error.');
      }
    }
  });

  // 4b. ADMIN TABS AND STAFF APPLICATION SYSTEM
  const tabs = document.querySelectorAll('.admin-tab-btn');
  const tabContents = document.querySelectorAll('.admin-tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetTab = tab.getAttribute('data-tab');
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `tabContent-${targetTab}`) {
          content.classList.add('active');
        }
      });

      if (targetTab === 'applications') {
        adminDialog.classList.add('wide-mode');
        adminSaveBtn.classList.add('hidden'); // Hide config save settings button
        fetchApplications();
      } else if (targetTab === 'reservations') {
        adminDialog.classList.add('wide-mode');
        adminSaveBtn.classList.add('hidden'); // Hide config save settings button
        fetchReservations();
      } else if (targetTab === 'blog') {
        adminDialog.classList.remove('wide-mode');
        adminSaveBtn.classList.add('hidden'); // Hide config save settings button (blog has its own publish button)
      } else {
        adminDialog.classList.remove('wide-mode');
        adminSaveBtn.classList.remove('hidden'); // Show config save settings button
      }
    });
  });

  async function fetchApplications() {
    try {
      applicationsList.innerHTML = '<p style="color: var(--stone-600); text-align: center; font-size: 0.85rem; padding: 1.5rem 0;">Loading applications...</p>';
      const res = await fetch(`/api/applications?pin=${currentEmberPin}`);
      const result = await res.json();
      if (result.success) {
        loadedApplications = result.data;
        applicationsCount.textContent = loadedApplications.length;
        renderApplications();
      } else {
        applicationsList.innerHTML = `<p style="color: var(--fire-500); text-align: center; font-size: 0.85rem; padding: 1.5rem 0;">Error: ${result.error}</p>`;
      }
    } catch (err) {
      applicationsList.innerHTML = '<p style="color: var(--fire-500); text-align: center; font-size: 0.85rem; padding: 1.5rem 0;">Connection failure.</p>';
      console.error('Error loading applications:', err);
    }
  }

  function renderApplications() {
    const query = appSearchInput.value.toLowerCase().trim();
    const statusFilter = appStatusFilter.value;

    applicationsList.innerHTML = '';

    const filtered = loadedApplications.filter(app => {
      const matchesSearch = 
        app.firstName.toLowerCase().includes(query) ||
        app.lastName.toLowerCase().includes(query) ||
        app.email.toLowerCase().includes(query) ||
        (app.scoutUnit && app.scoutUnit.toLowerCase().includes(query));
      
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    if (filtered.length === 0) {
      applicationsList.innerHTML = '<p style="color: var(--stone-600); text-align: center; font-size: 0.85rem; padding: 1.5rem 0;">No matching applications found.</p>';
      return;
    }

    filtered.forEach(app => {
      const card = document.createElement('div');
      card.className = 'admin-app-card';
      
      const sizingStr = `T-Shirt: ${app.tshirtSize || 'N/A'}, Jacket: ${app.jacketSize || 'N/A'}`;
      const expertiseStr = app.expertise && app.expertise.length > 0 ? app.expertise.join(', ') : 'None';
      const availStr = `${app.startDate || 'N/A'} to ${app.endDate || 'N/A'}`;
      const detailsId = `details-${app.id}`;
      const btnId = `btn-${app.id}`;
      const statusClass = 'status-' + app.status.toLowerCase().replace(/ /g, '-');

      card.innerHTML = `
        <div class="admin-app-header">
          <div>
            <span class="admin-app-name">${app.firstName} ${app.lastName}</span>
            ${app.preferredName ? `<span style="font-size: 0.8rem; color: var(--ember-500); margin-left: 0.25rem;">"${app.preferredName}"</span>` : ''}
            <div class="admin-app-meta">Submitted: ${new Date(app.submittedAt).toLocaleDateString()} | Phone: ${app.phone} | Email: ${app.email}</div>
          </div>
          <span class="admin-app-status ${statusClass}">${app.status}</span>
        </div>
        
        <div class="admin-app-body">
          <div><strong>Positions Ranked:</strong><br>${formatPreferences(app.preferences)}</div>
          <div><strong>Availability:</strong><br>${availStr}</div>
          <div><strong>Scouting Status:</strong><br>${app.scoutingStatus === 'Registered' ? `${app.scoutCouncil} (Unit ${app.scoutUnit})` : 'Not Registered'}</div>
        </div>

        <!-- Collapsible details section -->
        <div id="${detailsId}" class="hidden" style="border-top: 1px dashed rgba(255,255,255,0.05); padding-top: 0.75rem; margin-top: -0.25rem; font-size: 0.8rem; flex-direction: column; gap: 0.75rem; display: none;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
              <strong>Address:</strong> ${app.address}, ${app.city}, ${app.state} ${app.zipCode}<br>
              <strong>Age Group:</strong> ${formatAgeGroup(app.ageGroup)}<br>
              <strong>US Work Auth:</strong> ${app.workAuth || 'Yes'}<br>
              <strong>Uniform Sizing:</strong> ${sizingStr}
            </div>
            <div>
              <strong>Scout Rank:</strong> ${app.scoutRank || 'None'}<br>
              <strong>Leadership:</strong> ${app.scoutLeadership || 'None'}<br>
              <strong>OA Member:</strong> ${app.oaMember || 'No'}<br>
              <strong>NCS Cert:</strong> ${app.ncsHolder === 'Yes' ? `${app.ncsSection} (Exp ${app.ncsExpiration})` : 'No'}
            </div>
          </div>
          
          ${app.prevStaff === 'Yes' ? `<div><strong>Previous Camp Staff:</strong> ${app.prevStaffInfo}</div>` : ''}
          ${app.expertiseDesc ? `<div><strong>Expertise Details (${expertiseStr}):</strong> ${app.expertiseDesc}</div>` : `<div><strong>Expertise Areas:</strong> ${expertiseStr}</div>`}
          ${app.conflicts ? `<div><strong>Conflicts:</strong> ${app.conflicts}</div>` : ''}

          <div style="border-top: 1px solid rgba(255,255,255,0.03); padding-top: 0.5rem; display: grid; grid-template-columns: 1fr 1.5fr; gap: 1rem;">
            <div>
              <strong>References:</strong>
              <ol style="margin-left: 1rem; margin-top: 0.2rem; padding-left: 0.25rem;">
                ${app.references.map(ref => `<li>${ref.name} (${ref.relationship}): ${ref.contact}</li>`).join('')}
              </ol>
            </div>
            <div>
              <strong>Initials Acknowledged:</strong><br>
              [${app.initials?.altitude || ''}] Altitude & Terrain | [${app.initials?.wildlife || ''}] Wildlife Protocol<br>
              [${app.initials?.water || ''}] Water & KYBO Sanitation | [${app.initials?.medical || ''}] BSA Health Records
            </div>
          </div>
          
          ${app.handSignatureData ? `
          <div style="border-top: 1px solid rgba(255,255,255,0.03); padding-top: 0.5rem; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <strong>Signature:</strong> <em>${app.typedSignature}</em> (Signed: ${app.signatureDate})
              ${app.guardianInfo ? `<br><strong>Parent Signature:</strong> <em>${app.guardianConsent?.guardianTypedSignature}</em> (Signed: ${app.guardianConsent?.guardianSignatureDate})` : ''}
            </div>
            <img src="${app.handSignatureData}" alt="Hand Signature" style="max-height: 45px; background: rgba(255,255,255,0.05); padding: 2px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1);">
          </div>
          ` : ''}
        </div>

        <div class="admin-app-actions">
          <button type="button" class="btn btn-secondary" id="${btnId}" style="font-size: 0.75rem; padding: 0.35rem 0.65rem;">
            ▼ View Full Application
          </button>
          
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <label style="font-size: 0.75rem; font-weight: 600; color: var(--stone-600); text-transform: uppercase;">Status:</label>
            <select class="app-status-select" data-id="${app.id}" style="padding: 0.25rem 0.5rem; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; color: #fff; font-size: 0.75rem;">
              <option value="Submitted" ${app.status === 'Submitted' ? 'selected' : ''}>Submitted</option>
              <option value="Under Review" ${app.status === 'Under Review' ? 'selected' : ''}>Under Review</option>
              <option value="Interview Scheduled" ${app.status === 'Interview Scheduled' ? 'selected' : ''}>Interview Scheduled</option>
              <option value="Hired" ${app.status === 'Hired' ? 'selected' : ''}>Hired</option>
              <option value="Declined" ${app.status === 'Declined' ? 'selected' : ''}>Declined</option>
            </select>
          </div>

          <div class="admin-app-notes-group">
            <textarea class="admin-notes-textarea" data-id="${app.id}" rows="1" placeholder="Enter recruiter comments/notes...">${app.adminNotes || ''}</textarea>
          </div>
        </div>
      `;

      applicationsList.appendChild(card);

      const detailsEl = card.querySelector(`#${detailsId}`);
      const btnToggle = card.querySelector(`#${btnId}`);
      btnToggle.addEventListener('click', () => {
        if (detailsEl.classList.contains('hidden')) {
          detailsEl.classList.remove('hidden');
          detailsEl.style.display = 'flex';
          btnToggle.textContent = '▲ Hide Application Details';
        } else {
          detailsEl.classList.add('hidden');
          detailsEl.style.display = 'none';
          btnToggle.textContent = '▼ View Full Application';
        }
      });

      const statusSelect = card.querySelector('.app-status-select');
      statusSelect.addEventListener('change', async () => {
        await updateApplicationField(app.id, { status: statusSelect.value });
      });

      const notesTextarea = card.querySelector('.admin-notes-textarea');
      notesTextarea.addEventListener('blur', async () => {
        await updateApplicationField(app.id, { adminNotes: notesTextarea.value });
      });
    });
  }

  function formatPreferences(prefs) {
    if (!prefs) return 'N/A';
    const mapped = [];
    if (prefs.campManagement !== 'none') mapped.push({ name: 'Management', rank: prefs.campManagement });
    if (prefs.areaDirector !== 'none') mapped.push({ name: 'Director', rank: prefs.areaDirector });
    if (prefs.areaInstructor !== 'none') mapped.push({ name: 'Instructor', rank: prefs.areaInstructor });
    if (prefs.supportStaff !== 'none') mapped.push({ name: 'Support', rank: prefs.supportStaff });
    if (prefs.counselorInTraining !== 'none') mapped.push({ name: 'CIT', rank: prefs.counselorInTraining });
    
    mapped.sort((a,b) => a.rank - b.rank);
    return mapped.map(m => `#${m.rank}: ${m.name}`).join('<br>') || 'None Ranked';
  }

  function formatAgeGroup(val) {
    if (val === '14') return '14 Years (CIT)';
    if (val === '16') return '16+ Years (Junior Staff)';
    if (val === '18') return '18+ Years (Adult/Dir)';
    if (val === '21') return '21+ Years (Management)';
    return val || 'N/A';
  }

  async function updateApplicationField(id, dataToUpdate) {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: currentEmberPin, ...dataToUpdate })
      });
      const result = await res.json();
      if (result.success) {
        const idx = loadedApplications.findIndex(a => a.id === id);
        if (idx !== -1) {
          loadedApplications[idx] = result.data;
          if (dataToUpdate.status) {
            renderApplications();
          }
        }
      } else {
        alert('Failed to update application details: ' + result.error);
      }
    } catch (err) {
      console.error('Error updating application field:', err);
    }
  }

  function exportApplicationsToCSV() {
    if (loadedApplications.length === 0) {
      alert('No applications to export.');
      return;
    }
    
    const headers = [
      'ID', 'Submission Date', 'Status', 'First Name', 'Last Name', 'Email', 'Phone',
      'Age Group', 'Work Auth', 'Scouting Status', 'Unit', 'Start Date', 'End Date',
      'T-Shirt Size', 'Jacket Size', 'Notes'
    ];

    const rows = loadedApplications.map(app => [
      app.id,
      new Date(app.submittedAt).toLocaleDateString(),
      app.status,
      app.firstName,
      app.lastName,
      app.email,
      app.phone,
      app.ageGroup,
      app.workAuth,
      app.scoutingStatus,
      app.scoutUnit || '',
      app.startDate,
      app.endDate,
      app.tshirtSize,
      app.jacketSize,
      (app.adminNotes || '').replace(/"/g, '""')
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Camp_Lawton_Staff_Applications_2026_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  appSearchInput.addEventListener('input', renderApplications);
  appStatusFilter.addEventListener('change', renderApplications);
  btnExportApps.addEventListener('click', exportApplicationsToCSV);

  // 5. INITIALIZE
  initEmberCanvas();
  loadDashboardData();
  
  // Refresh dashboard data every 5 minutes
  setInterval(loadDashboardData, 5 * 60 * 1000);

  // Dynamic Camp Time Clock (Arizona Time Zone MST)
  function updateCampTime() {
    if (!campTime) return;
    const options = {
      timeZone: 'America/Phoenix',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    campTime.textContent = `Camp Time: ${formatter.format(new Date())} MST`;
  }
  
  setInterval(updateCampTime, 1000);
  updateCampTime();

  // Force Refresh weather data
  if (btnRefreshWeather) {
    btnRefreshWeather.addEventListener('click', async () => {
      btnRefreshWeather.disabled = true;
      btnRefreshWeather.textContent = '🔄 Loading...';
      
      await loadDashboardData(true);
      
      btnRefreshWeather.disabled = false;
      btnRefreshWeather.textContent = '🔄 Force Refresh';
    });
  }

  // Force Refresh fire danger data
  if (btnRefreshFire) {
    btnRefreshFire.addEventListener('click', async () => {
      btnRefreshFire.disabled = true;
      btnRefreshFire.textContent = '🔄 Loading...';
      
      await loadDashboardData(true);
      
      btnRefreshFire.disabled = false;
      btnRefreshFire.textContent = '🔄 Refresh';
    });
  }

  // Force Refresh forest alerts data
  if (btnRefreshAlerts) {
    btnRefreshAlerts.addEventListener('click', async () => {
      btnRefreshAlerts.disabled = true;
      btnRefreshAlerts.textContent = '🔄 Loading...';
      
      await loadDashboardData(true);
      
      btnRefreshAlerts.disabled = false;
      btnRefreshAlerts.textContent = '🔄 Refresh';
    });
  }

  // Admin Reservations & Blog Logic
  let loadedReservations = [];

  async function fetchReservations() {
    try {
      reservationsList.innerHTML = '<p style="color: var(--stone-600); text-align: center; font-size: 0.85rem; padding: 1.5rem 0;">Loading reservations...</p>';
      const res = await fetch(`/api/reservations?pin=${currentEmberPin}`);
      const result = await res.json();
      if (result.success) {
        loadedReservations = result.data;
        renderReservations();
      } else {
        reservationsList.innerHTML = `<p style="color: var(--fire-500); text-align: center; font-size: 0.85rem; padding: 1.5rem 0;">Failed to load: ${result.error}</p>`;
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
      reservationsList.innerHTML = '<p style="color: var(--fire-500); text-align: center; font-size: 0.85rem; padding: 1.5rem 0;">Connection error.</p>';
    }
  }

  function renderReservations() {
    if (!reservationsList) return;
    reservationsList.innerHTML = '';
    
    const searchVal = resSearchInput.value.toLowerCase().trim();
    const statusVal = resStatusFilter.value;
    
    const filtered = loadedReservations.filter(res => {
      const matchSearch = !searchVal || 
        res.troopNumber.toLowerCase().includes(searchVal) ||
        res.contactName.toLowerCase().includes(searchVal) ||
        res.campsite.toLowerCase().includes(searchVal) ||
        res.council.toLowerCase().includes(searchVal);
      const matchStatus = statusVal === 'all' || res.status === statusVal;
      return matchSearch && matchStatus;
    });
    
    if (filtered.length === 0) {
      reservationsList.innerHTML = '<p style="color: var(--stone-600); text-align: center; font-size: 0.85rem; padding: 1.5rem 0;">No reservations found.</p>';
      return;
    }
    
    filtered.forEach(res => {
      const div = document.createElement('div');
      div.className = 'app-item-card';
      div.style.background = 'rgba(255,255,255,0.02)';
      div.style.border = '1px solid rgba(255,255,255,0.05)';
      div.style.borderRadius = '8px';
      div.style.padding = '0.75rem';
      div.style.display = 'flex';
      div.style.flexDirection = 'column';
      div.style.gap = '0.4rem';
      
      let badgeColor = 'var(--stone-600)';
      if (res.status === 'Confirmed') badgeColor = '#2ecc71';
      else if (res.status === 'Pending Deposit') badgeColor = 'var(--ember-500)';
      
      div.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <strong style="color: #fff; font-size: 0.95rem;">${res.troopNumber} (${res.council})</strong>
          <span style="font-size: 0.7rem; padding: 0.15rem 0.4rem; border-radius: 4px; background: ${badgeColor}; color: #fff; font-weight: 600;">${res.status}</span>
        </div>
        <div style="font-size: 0.8rem; color: var(--stone-400); display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: 0.25rem;">
          <div>📅 ${res.week}</div>
          <div>⛺ Campsite: <strong>${res.campsite}</strong></div>
          <div>👥 Attendance: <strong>${res.scoutsCount} Scouts, ${res.leadersCount} Leaders</strong></div>
          <div>✉️ Contact: <strong>${res.contactName} (${res.contactEmail})</strong></div>
        </div>
      `;
      reservationsList.appendChild(div);
    });
  }

  // Reservation list filtering listeners
  if (resSearchInput) resSearchInput.addEventListener('input', renderReservations);
  if (resStatusFilter) resStatusFilter.addEventListener('change', renderReservations);

  // Blog post publishing listener
  if (btnPublishPost) {
    btnPublishPost.addEventListener('click', async () => {
      const title = adminBlogTitle.value.trim();
      const category = adminBlogCategory.value.trim();
      const summary = adminBlogSummary.value.trim();
      
      if (!title || !category || !summary) {
        blogPublishStatus.style.color = 'var(--fire-500)';
        blogPublishStatus.textContent = '⚠️ All fields are required.';
        return;
      }
      
      btnPublishPost.disabled = true;
      blogPublishStatus.style.color = '#fff';
      blogPublishStatus.textContent = 'Publishing...';
      
      try {
        const res = await fetch('/api/admin/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pin: currentEmberPin,
            title,
            category,
            summary
          })
        }).then(r => r.json());
        
        if (res.success) {
          blogPublishStatus.style.color = '#2ecc71';
          blogPublishStatus.textContent = '🎉 Post published successfully!';
          
          // Reset form fields
          adminBlogTitle.value = '';
          adminBlogCategory.value = '';
          adminBlogSummary.value = '';
          
          // Reload dashboard data to render the new post
          await loadDashboardData();
          
          setTimeout(() => {
            blogPublishStatus.textContent = '';
          }, 3000);
        } else {
          blogPublishStatus.style.color = 'var(--fire-500)';
          blogPublishStatus.textContent = '⚠️ Error: ' + res.error;
        }
      } catch (err) {
        console.error('Error publishing blog post:', err);
        blogPublishStatus.style.color = 'var(--fire-500)';
        blogPublishStatus.textContent = '⚠️ Connection error.';
      } finally {
        btnPublishPost.disabled = false;
      }
    });
  }

  // ==========================================
  // INTERACTIVE PLACEHOLDER DIALOG LOGIC
  // ==========================================

  // 1. OPEN & CLOSE DIALOG EVENTS
  if (linkReservations && reservationDialog) {
    linkReservations.addEventListener('click', (e) => {
      e.preventDefault();
      reservationDialog.showModal();
      reservationSuccessMsg.classList.add('hidden');
      reservationForm.classList.remove('hidden');
    });
  }

  [reservationCloseBtn, reservationCancelBtn].forEach(btn => {
    if (btn) btn.addEventListener('click', () => reservationDialog.close());
  });

  if (linkLeadersGuide && leadersGuideDialog) {
    linkLeadersGuide.addEventListener('click', (e) => {
      e.preventDefault();
      leadersGuideDialog.showModal();
    });
  }

  [leadersGuideCloseBtn, leadersGuideCancelBtn].forEach(btn => {
    if (btn) btn.addEventListener('click', () => leadersGuideDialog.close());
  });

  if (linkStaffHandbook && staffHandbookDialog) {
    linkStaffHandbook.addEventListener('click', (e) => {
      e.preventDefault();
      staffHandbookDialog.showModal();
    });
  }

  [staffHandbookCloseBtn, staffHandbookCancelBtn].forEach(btn => {
    if (btn) btn.addEventListener('click', () => staffHandbookDialog.close());
  });

  if (linkCampMap && campMapDialog) {
    linkCampMap.addEventListener('click', (e) => {
      e.preventDefault();
      campMapDialog.showModal();
    });
  }

  [campMapCloseBtn, campMapCancelBtn].forEach(btn => {
    if (btn) btn.addEventListener('click', () => campMapDialog.close());
  });

  if (linkMeritBadges && meritBadgeDialog) {
    linkMeritBadges.addEventListener('click', (e) => {
      e.preventDefault();
      meritBadgeDialog.showModal();
      renderMeritBadges();
    });
  }

  [meritBadgeCloseBtn, meritBadgeCancelBtn].forEach(btn => {
    if (btn) btn.addEventListener('click', () => meritBadgeDialog.close());
  });

  // Main callout section buttons
  const btnMainReservations = document.getElementById('btnMainReservations');
  const btnMainLeadersGuide = document.getElementById('btnMainLeadersGuide');
  const btnMainCampMap = document.getElementById('btnMainCampMap');
  const btnMainMeritBadges = document.getElementById('btnMainMeritBadges');
  const btnMainStaffHandbook = document.getElementById('btnMainStaffHandbook');

  if (btnMainReservations) {
    btnMainReservations.addEventListener('click', () => {
      reservationDialog.showModal();
      reservationSuccessMsg.classList.add('hidden');
      reservationForm.classList.remove('hidden');
    });
  }
  if (btnMainLeadersGuide) {
    btnMainLeadersGuide.addEventListener('click', (e) => {
      e.preventDefault();
      leadersGuideDialog.showModal();
    });
  }
  if (btnMainCampMap) {
    btnMainCampMap.addEventListener('click', (e) => {
      e.preventDefault();
      campMapDialog.showModal();
    });
  }
  if (btnMainMeritBadges) {
    btnMainMeritBadges.addEventListener('click', (e) => {
      e.preventDefault();
      meritBadgeDialog.showModal();
      renderMeritBadges();
    });
  }
  if (btnMainStaffHandbook) {
    btnMainStaffHandbook.addEventListener('click', () => {
      staffHandbookDialog.showModal();
    });
  }


  // 2. RESERVATION SUBMISSION
  if (reservationForm) {
    reservationForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const payload = {
        troopNumber: document.getElementById('resTroopNumber').value.trim(),
        council: document.getElementById('resCouncil').value.trim(),
        scoutsCount: parseInt(document.getElementById('resScoutsCount').value) || 0,
        leadersCount: parseInt(document.getElementById('resLeadersCount').value) || 0,
        week: document.getElementById('resWeek').value,
        campsite: document.getElementById('resCampsite').value,
        contactName: document.getElementById('resContactName').value.trim(),
        contactEmail: document.getElementById('resContactEmail').value.trim()
      };

      try {
        const res = await fetch('/api/reservations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(r => r.json());

        if (res.success) {
          reservationSuccessMsg.textContent = '🎉 Reservation submitted successfully! Pending deposit.';
          reservationSuccessMsg.classList.remove('hidden');
          reservationForm.classList.add('hidden');
          
          // If admin reservations tab was already loaded, reload it in the background
          if (isAdminAuthenticated) {
            fetchReservations();
          }

          setTimeout(() => {
            reservationDialog.close();
            reservationForm.reset();
          }, 2000);
        } else {
          alert('Failed to submit reservation: ' + res.error);
        }
      } catch (err) {
        console.error('Reservation submission error:', err);
        alert('Connection error submitting reservation.');
      }
    });
  }


  // 3. LEADER'S GUIDE TABS LOGIC
  const guideTabBtns = document.querySelectorAll('[data-guide-tab]');
  const guideTabContents = document.querySelectorAll('.guide-tab-content');

  guideTabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
      guideTabBtns.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetTab = tab.getAttribute('data-guide-tab');
      guideTabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `guideTab-${targetTab}`) {
          content.classList.add('active');
        }
      });
    });
  });


  // 4. INTERACTIVE MAP LOGIC
  const mapLocations = {
    hq: { 
      name: "Camp Headquarters (HQ)", 
      elevation: "Elevation: 7,750 ft", 
      desc: "The main administrative hub of Camp Lawton. All troop leaders must check-in here upon arrival on Sunday. The camp office, health lodge, and trading post are located in this complex.", 
      capacity: "N/A", 
      activities: "Registration, First Aid, Trading Post" 
    },
    dining: { 
      name: "Dining Hall & Parade Grounds", 
      elevation: "Elevation: 7,765 ft", 
      desc: "The heart of camp life. Serves three hot meals daily for campers and staff. The Parade Grounds in front hosts our morning and evening flag ceremonies.", 
      capacity: "250 people", 
      activities: "Meals, Flag Ceremonies, SPL Meetings" 
    },
    pool: { 
      name: "Swimming Pool", 
      elevation: "Elevation: 7,720 ft", 
      desc: "A heated pool equipped with changing rooms and showers. Offers swimming and lifesaving merit badges, swim checks, and recreational free swim sessions.", 
      capacity: "75 swimmers", 
      activities: "Swimming & Lifesaving MB, Free Swim" 
    },
    climbing: { 
      name: "Climbing Wall & Rappelling Tower", 
      elevation: "Elevation: 7,810 ft", 
      desc: "A 40-foot outdoor climbing wall with multiple routes of varying difficulty, and a dedicated rappelling deck. Certified instructors guide scouts safely.", 
      capacity: "12 climbers", 
      activities: "Climbing Merit Badge, High Adventure Rappelling" 
    },
    shooting: { 
      name: "Shooting Sports Range", 
      elevation: "Elevation: 7,850 ft", 
      desc: "Features separate ranges for archery, rifle shooting (.22 caliber), and shotgun shooting. Strict safety protocols are enforced by NRA-certified Range Safety Officers.", 
      capacity: "20 shooters", 
      activities: "Archery, Rifle, Shotgun Merit Badges" 
    },
    apache: { 
      name: "Apache Campsite", 
      elevation: "Elevation: 7,760 ft", 
      desc: "A spacious campsite located close to the Dining Hall and Parade Grounds. Features heavy pine shade, central campfire ring, steel bear-proof food chest, and double latrines.", 
      capacity: "30 Scouts", 
      activities: "Troop Camping, Patrol Cooking" 
    },
    navajo: { 
      name: "Navajo Campsite", 
      elevation: "Elevation: 7,755 ft", 
      desc: "The largest campsite in Camp Lawton, featuring a flat clearing ideal for large troops. Heavily shaded by Ponderosa pines. Includes bear storage and picnic shelter.", 
      capacity: "40 Scouts", 
      activities: "Troop Camping, Patrol Cooking" 
    },
    zuni: { 
      name: "Zuni Campsite", 
      elevation: "Elevation: 7,780 ft", 
      desc: "A secluded and scenic campsite located on the southern ridge of the camp, offering spectacular sunset views of Coronado Forest. Has private trail access.", 
      capacity: "25 Scouts", 
      activities: "Troop Camping, Astronomy views" 
    },
    hopi: { 
      name: "Hopi Campsite", 
      elevation: "Elevation: 7,795 ft", 
      desc: "Located on the upper loop adjacent to the Climbing Wall program area. Excellent site for troops focused on high adventure climbing activities.", 
      capacity: "25 Scouts", 
      activities: "Troop Camping" 
    }
  };

  const mapMarkers = document.querySelectorAll('.map-marker');

  mapMarkers.forEach(marker => {
    marker.addEventListener('click', () => {
      // Deactivate other markers
      mapMarkers.forEach(m => m.classList.remove('active'));
      // Activate clicked marker
      marker.classList.add('active');

      const locKey = marker.getAttribute('data-location');
      const locData = mapLocations[locKey];

      if (locData) {
        mapLocName.textContent = locData.name;
        mapLocElev.textContent = locData.elevation;
        mapLocDesc.textContent = locData.desc;
        
        mapLocCap.textContent = locData.capacity;
        mapLocActs.textContent = locData.activities;
        mapLocStats.classList.remove('hidden');
      }
    });
  });


  // 5. MERIT BADGE SEARCH & FILTER LOGIC
  const meritBadges = [
    { name: "Archery", dept: "Shooting Sports", prereq: "None", difficulty: "Medium", schedule: "Block A & C" },
    { name: "Rifle Shooting", dept: "Shooting Sports", prereq: "Safety Briefing", difficulty: "Hard", schedule: "Block B & D" },
    { name: "Shotgun Shooting", dept: "Shooting Sports", prereq: "Physical strength", difficulty: "Hard", schedule: "Block A & D" },
    { name: "Environmental Science", dept: "Ecology", prereq: "Active observation diary", difficulty: "Hard", schedule: "Block B & C (Eagle Required)" },
    { name: "Mammal Study", dept: "Ecology", prereq: "None", difficulty: "Easy", schedule: "Block A & D" },
    { name: "Forestry", dept: "Ecology", prereq: "Leaf collection", difficulty: "Medium", schedule: "Block C" },
    { name: "Geology", dept: "Ecology", prereq: "None", difficulty: "Easy", schedule: "Block B" },
    { name: "Wilderness Survival", dept: "Outdoor Skills", prereq: "Overnight campout prep", difficulty: "Hard", schedule: "Block A & D" },
    { name: "First Aid", dept: "First Aid", prereq: "Requirements 1-5 completed pre-camp", difficulty: "Medium", schedule: "Block A & B (Eagle Required)" },
    { name: "Emergency Preparedness", dept: "First Aid", prereq: "First Aid merit badge", difficulty: "Hard", schedule: "Block C & D (Eagle Required)" },
    { name: "Climbing", dept: "Climbing", prereq: "Knot tying familiarity", difficulty: "Medium", schedule: "Block B & C" },
    { name: "Pioneering", dept: "Outdoor Skills", prereq: "Knot tying proficiency", difficulty: "Hard", schedule: "Block A & B" },
    { name: "Leatherwork", dept: "Outdoor Skills", prereq: "None", difficulty: "Easy", schedule: "Block C & D" },
    { name: "Wood Carving", dept: "Outdoor Skills", prereq: "Totin' Chip card", difficulty: "Medium", schedule: "Block B & D" },
    { name: "Orienteering", dept: "Outdoor Skills", prereq: "Compass work", difficulty: "Medium", schedule: "Block C" }
  ];

  function renderMeritBadges() {
    if (!mbGrid) return;
    
    const query = mbSearchInput.value.toLowerCase().trim();
    const deptFilter = mbDeptFilter.value;
    
    mbGrid.innerHTML = '';
    
    const filtered = meritBadges.filter(badge => {
      const matchSearch = badge.name.toLowerCase().includes(query) || 
                          badge.dept.toLowerCase().includes(query) ||
                          badge.prereq.toLowerCase().includes(query);
      const matchDept = deptFilter === 'all' || badge.dept === deptFilter;
      return matchSearch && matchDept;
    });

    if (filtered.length === 0) {
      mbGrid.innerHTML = '<p style="grid-column: span 2; text-align: center; color: var(--stone-600); font-size: 0.85rem; padding: 1.5rem 0;">No matching merit badges found.</p>';
      return;
    }

    filtered.forEach(badge => {
      const card = document.createElement('div');
      card.className = 'mb-card';
      
      const diffClass = 'diff-' + badge.difficulty.toLowerCase();
      
      card.innerHTML = `
        <div class="mb-header">
          <span class="mb-name">${badge.name}</span>
          <span class="mb-dept">${badge.dept}</span>
        </div>
        <div class="mb-details">
          <strong>Prerequisites:</strong> ${badge.prereq}
        </div>
        <div class="mb-meta">
          <span>📅 ${badge.schedule}</span>
          <span class="mb-difficulty ${diffClass}">${badge.difficulty}</span>
        </div>
      `;
      mbGrid.appendChild(card);
    });
  }

  if (mbSearchInput) mbSearchInput.addEventListener('input', renderMeritBadges);
  if (mbDeptFilter) mbDeptFilter.addEventListener('change', renderMeritBadges);
});

