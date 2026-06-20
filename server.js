import express from 'express';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Path to persistent data using process.cwd() for robust path resolution in serverless
const DATA_DIR = path.join(process.cwd(), 'data');
const CONFIG_PATH = path.join(DATA_DIR, 'config.json');
const QUOTES_PATH = path.join(DATA_DIR, 'quotes.json');
const HISTORY_PATH = path.join(DATA_DIR, 'scouting_history.json');
const HOLIDAYS_PATH = path.join(DATA_DIR, 'holidays.json');
const BLOG_PATH = path.join(DATA_DIR, 'blog.json');
const EVENTS_PATH = path.join(DATA_DIR, 'events.json');
const APPLICATIONS_PATH = path.join(DATA_DIR, 'applications.json');
const RESERVATIONS_PATH = path.join(DATA_DIR, 'reservations.json');

// Caching structure
let weatherCache = {
  daily: null,
  hourly: null,
  alerts: null,
  openMeteo: null,
  lastUpdated: 0
};
let geoCache = {
  data: null,
  lastUpdated: 0
};
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in ms
const GEO_CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in ms

const isServerless = !!(process.env.NETLIFY || process.env.LAMBDA_TASK_ROOT || process.env.AWS_EXECUTION_ENV);

// Helper to get file path for reading, checking /tmp first only in serverless environments
function getReadPath(filePath) {
  const fileName = path.basename(filePath);
  if (isServerless) {
    const tmpPath = path.join('/tmp', 'data', fileName);
    if (existsSync(tmpPath)) {
      return tmpPath;
    }
  }
  return path.join(process.cwd(), 'data', fileName);
}

// Helper to read JSON files safely
async function readJsonFile(filePath, defaultVal = []) {
  const readPath = getReadPath(filePath);
  try {
    const data = await fs.readFile(readPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    try {
      const defaultPath = path.join(process.cwd(), 'data', path.basename(filePath));
      const data = await fs.readFile(defaultPath, 'utf8');
      return JSON.parse(data);
    } catch (defaultError) {
      console.error(`Error reading default ${path.basename(filePath)}, using fallback:`, defaultError.message);
      return defaultVal;
    }
  }
}

// Helper to write JSON files safely, supporting writeable /tmp/data for Netlify Functions
async function writeJsonFile(filePath, data) {
  const fileName = path.basename(filePath);
  const jsonStr = JSON.stringify(data, null, 2);
  let writeSuccess = false;

  if (isServerless) {
    const tmpDir = path.join('/tmp', 'data');
    const tmpPath = path.join(tmpDir, fileName);
    try {
      await fs.mkdir(tmpDir, { recursive: true });
      await fs.writeFile(tmpPath, jsonStr, 'utf8');
      writeSuccess = true;
      console.log(`[Cache Sync] Successfully wrote ${fileName} to /tmp storage.`);
    } catch (error) {
      console.error(`Error writing ${fileName} to /tmp:`, error.message);
    }
  }

  try {
    const localPath = path.join(process.cwd(), 'data', fileName);
    await fs.writeFile(localPath, jsonStr, 'utf8');
    writeSuccess = true;
  } catch (error) {
    if (isServerless) {
      console.log(`Local write to ${fileName} failed (expected in serverless):`, error.message);
    } else {
      console.error(`Local write to ${fileName} failed:`, error.message);
    }
  }

  return writeSuccess;
}

// Helper to read camp config
async function readConfig() {
  const defaults = {
    fireDanger: 'Very High',
    campfireRestriction: 'Restricted',
    customAlert: 'Coronado National Forest is currently under VERY HIGH Fire Danger. Campfires are permitted ONLY in designated steel rings in developed campsites.',
    roadStatus: 'Catalina Highway is OPEN (No restrictions).',
    advisoryAlert: 'Normal Forest Operations. No active wildlife or law enforcement alerts.',
    bulletinText: 'Attention Leaders: SPL meeting is today at 1:30 PM at the dining hall. Sunset campfire program starts at 7:45 PM. Weather advisory: evening temperatures are expected to drop to 48°F, please bring warm jackets.',
    adminPin: '1921'
  };
  const config = await readJsonFile(CONFIG_PATH, defaults);
  return { ...defaults, ...config };
}

// Helper to write camp config
async function writeConfig(config) {
  return writeJsonFile(CONFIG_PATH, config);
}

// Helpers to read/write applications
async function readApplications() {
  return readJsonFile(APPLICATIONS_PATH, []);
}

async function writeApplications(applications) {
  return writeJsonFile(APPLICATIONS_PATH, applications);
}

// NWS API coordinates for Camp Lawton (32.4033, -110.7215)
// gridId: TWC, gridX: 101, gridY: 56
const NWS_DAILY_URL = 'https://api.weather.gov/gridpoints/TWC/101,56/forecast';
const NWS_HOURLY_URL = 'https://api.weather.gov/gridpoints/TWC/101,56/forecast/hourly';
const NWS_ALERTS_URL = 'https://api.weather.gov/alerts/active?point=32.4033,-110.7215';

// Open-Meteo 10-day Extended Forecast URL
const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast?latitude=32.4033&longitude=-110.7215&daily=weathercode,temperature_2m_max,temperature_2m_min,windspeed_10m_max,winddirection_10m_dominant,precipitation_probability_max&temperature_unit=fahrenheit&windspeed_unit=mph&timezone=America%2FPhoenix&forecast_days=10';

const HEADERS = {
  'User-Agent': '(CampLawtonPortal, dev@camplawton.org)',
  'Accept': 'application/ld+json'
};

// Helper for fetch with a timeout (e.g. 5000ms)
async function fetchWithTimeout(url, options = {}, timeout = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// WMO weather interpretation code mapping (Open-Meteo WMO standard codes)
function mapWmoCodeToForecast(code) {
  const mapping = {
    0: { desc: 'Sunny', icon: 'https://api.weather.gov/icons/land/day/skc?size=medium' },
    1: { desc: 'Mostly Sunny', icon: 'https://api.weather.gov/icons/land/day/few?size=medium' },
    2: { desc: 'Partly Cloudy', icon: 'https://api.weather.gov/icons/land/day/sct?size=medium' },
    3: { desc: 'Overcast', icon: 'https://api.weather.gov/icons/land/day/bkn?size=medium' },
    45: { desc: 'Foggy', icon: 'https://api.weather.gov/icons/land/day/fog?size=medium' },
    48: { desc: 'Depositing Rime Fog', icon: 'https://api.weather.gov/icons/land/day/fog?size=medium' },
    51: { desc: 'Light Drizzle', icon: 'https://api.weather.gov/icons/land/day/shra?size=medium' },
    53: { desc: 'Moderate Drizzle', icon: 'https://api.weather.gov/icons/land/day/shra?size=medium' },
    55: { desc: 'Dense Drizzle', icon: 'https://api.weather.gov/icons/land/day/shra?size=medium' },
    61: { desc: 'Slight Rain', icon: 'https://api.weather.gov/icons/land/day/rain?size=medium' },
    63: { desc: 'Moderate Rain', icon: 'https://api.weather.gov/icons/land/day/rain?size=medium' },
    65: { desc: 'Heavy Rain', icon: 'https://api.weather.gov/icons/land/day/rain?size=medium' },
    71: { desc: 'Slight Snow', icon: 'https://api.weather.gov/icons/land/day/snow?size=medium' },
    73: { desc: 'Moderate Snow', icon: 'https://api.weather.gov/icons/land/day/snow?size=medium' },
    75: { desc: 'Heavy Snow', icon: 'https://api.weather.gov/icons/land/day/snow?size=medium' },
    77: { desc: 'Snow Grains', icon: 'https://api.weather.gov/icons/land/day/snow?size=medium' },
    80: { desc: 'Slight Rain Showers', icon: 'https://api.weather.gov/icons/land/day/shra?size=medium' },
    81: { desc: 'Moderate Rain Showers', icon: 'https://api.weather.gov/icons/land/day/shra?size=medium' },
    82: { desc: 'Violent Rain Showers', icon: 'https://api.weather.gov/icons/land/day/shra?size=medium' },
    85: { desc: 'Slight Snow Showers', icon: 'https://api.weather.gov/icons/land/day/snow?size=medium' },
    86: { desc: 'Heavy Snow Showers', icon: 'https://api.weather.gov/icons/land/day/snow?size=medium' },
    95: { desc: 'Thunderstorms', icon: 'https://api.weather.gov/icons/land/day/tsra?size=medium' },
    96: { desc: 'Thunderstorms with Hail', icon: 'https://api.weather.gov/icons/land/day/tsra_sct?size=medium' },
    99: { desc: 'Heavy Thunderstorms with Hail', icon: 'https://api.weather.gov/icons/land/day/tsra_hi?size=medium' }
  };
  return mapping[code] || { desc: 'Partly Cloudy', icon: 'https://api.weather.gov/icons/land/day/sct?size=medium' };
}

// Generate realistic mock weather in case APIs are down
function getMockWeather() {
  const baseTime = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const dailyPeriods = [];
  const hourlyPeriods = [];
  const openMeteoMock = {
    daily: {
      time: [],
      weathercode: [],
      temperature_2m_max: [],
      temperature_2m_min: [],
      windspeed_10m_max: [],
      winddirection_10m_dominant: [],
      precipitation_probability_max: []
    }
  };
  
  for (let i = 0; i < 14; i++) {
    const isNight = i % 2 !== 0;
    const dayIndex = Math.floor(i / 2);
    const date = new Date(baseTime);
    date.setDate(baseTime.getDate() + dayIndex);
    const dayName = days[date.getDay()];
    
    dailyPeriods.push({
      number: i + 1,
      name: isNight ? `${dayName} Night` : (dayIndex === 0 ? 'Today' : dayName),
      startTime: date.toISOString(),
      endTime: date.toISOString(),
      isDaytime: !isNight,
      temperature: isNight ? 52 - dayIndex : 72 + (dayIndex % 3),
      temperatureUnit: 'F',
      temperatureTrend: null,
      windSpeed: '10 to 15 mph',
      windDirection: 'SW',
      probabilityOfPrecipitation: { value: (dayIndex % 3 === 0 ? 30 : 0) },
      icon: isNight ? 'https://api.weather.gov/icons/land/night/clear?size=medium' : 'https://api.weather.gov/icons/land/day/clear?size=medium',
      shortForecast: isNight ? 'Clear' : 'Sunny',
      detailedForecast: isNight 
        ? 'Clear, with a low around 52. Southwest wind 10 to 15 mph.'
        : `Sunny and pleasant, with a high near ${72 + (dayIndex % 3)}. Southwest wind 10 to 15 mph.`
    });
  }

  // Next 24 hours hourly forecast
  for (let i = 0; i < 24; i++) {
    const hourDate = new Date(baseTime);
    hourDate.setHours(baseTime.getHours() + i);
    const hour = hourDate.getHours();
    const isNight = hour < 6 || hour > 19;
    
    let temp = 62;
    if (hour >= 6 && hour <= 15) {
      temp = 62 + (hour - 6) * 1.2;
    } else if (hour > 15 && hour <= 19) {
      temp = 74 - (hour - 15) * 1.5;
    } else {
      temp = 68 - ((hour > 19 ? hour - 19 : hour + 5) * 1.3);
    }
    
    hourlyPeriods.push({
      startTime: hourDate.toISOString(),
      temperature: Math.round(temp),
      temperatureUnit: 'F',
      windSpeed: '12 mph',
      windDirection: 'SW',
      probabilityOfPrecipitation: { value: (i % 3 === 0 ? 25 : 0) },
      shortForecast: isNight ? 'Clear' : 'Sunny',
      icon: isNight ? 'https://api.weather.gov/icons/land/night/clear?size=small' : 'https://api.weather.gov/icons/land/day/clear?size=small'
    });
  }

  // Generate 10-day Open-Meteo mock daily
  for (let i = 0; i < 10; i++) {
    const date = new Date(baseTime);
    date.setDate(baseTime.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    openMeteoMock.daily.time.push(dateStr);
    openMeteoMock.daily.weathercode.push(i === 3 ? 95 : (i % 3)); // throw one T-Storm on Day 4
    openMeteoMock.daily.temperature_2m_max.push(72 + (i % 4));
    openMeteoMock.daily.temperature_2m_min.push(52 - (i % 3));
    openMeteoMock.daily.windspeed_10m_max.push(10 + i);
    openMeteoMock.daily.winddirection_10m_dominant.push(220 + (i * 10));
    openMeteoMock.daily.precipitation_probability_max.push(i === 3 ? 80 : (i % 3 === 0 ? 30 : 0));
  }

  return {
    daily: { periods: dailyPeriods },
    hourly: { periods: hourlyPeriods },
    openMeteo: openMeteoMock,
    alerts: []
  };
}

async function fetchWeatherData(force = false) {
  const now = Date.now();
  if (
    !force &&
    weatherCache.daily && 
    weatherCache.hourly && 
    weatherCache.alerts && 
    weatherCache.openMeteo && 
    (now - weatherCache.lastUpdated < CACHE_DURATION)
  ) {
    return { ...weatherCache, source: 'cache' };
  }

  console.log('Fetching live weather data from National Weather Service and Open-Meteo...');
  try {
    // Perform parallel fetches with a 5-second timeout
    const [dailyRes, hourlyRes, alertsRes, openMeteoRes] = await Promise.all([
      fetchWithTimeout(NWS_DAILY_URL, { headers: HEADERS }).then(res => res.ok ? res.json() : null),
      fetchWithTimeout(NWS_HOURLY_URL, { headers: HEADERS }).then(res => res.ok ? res.json() : null),
      fetchWithTimeout(NWS_ALERTS_URL, { headers: HEADERS }).then(res => res.ok ? res.json() : null),
      fetchWithTimeout(OPEN_METEO_URL).then(res => res.ok ? res.json() : null)
    ]);

    if (!dailyRes || !hourlyRes || !alertsRes || !openMeteoRes) {
      console.warn('One or more Weather API requests failed, using partial cache or fallback details...');
      throw new Error('Partial API response failure');
    }

    weatherCache.daily = dailyRes;
    weatherCache.hourly = hourlyRes;
    weatherCache.alerts = alertsRes;
    weatherCache.openMeteo = openMeteoRes;
    weatherCache.lastUpdated = now;

    return { ...weatherCache, source: 'live' };
  } catch (error) {
    console.error('Weather API failure, serving mock/cached weather data:', error.message);
    if (weatherCache.daily && weatherCache.hourly && weatherCache.openMeteo) {
      return { ...weatherCache, source: 'stale-cache' };
    }
    
    const mock = getMockWeather();
    return {
      daily: mock.daily,
      hourly: mock.hourly,
      alerts: mock.alerts,
      openMeteo: mock.openMeteo,
      source: 'mock',
      lastUpdated: now
    };
  }
}

// Helper to fetch seismic data from USGS API
async function fetchSeismicData(force = false) {
  const now = Date.now();
  if (!force && geoCache.data && (now - geoCache.lastUpdated < GEO_CACHE_DURATION)) {
    return geoCache.data;
  }
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=32.4033&longitude=-110.7215&maxradiuskm=200&minmagnitude=1.0&starttime=${thirtyDaysAgo}`;
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      geoCache.data = json;
      geoCache.lastUpdated = now;
      return json;
    }
  } catch (error) {
    console.error('USGS Seismology API failure, serving empty/cached data:', error.message);
  }
  return geoCache.data || { features: [] };
}

// Helper to get day of the year (0-365)
function getDayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}
const apiRouter = express.Router();

// Disable response caching for all API endpoints to prevent stale data sync issues
apiRouter.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

// REST Endpoint: GET /api/weather
apiRouter.get('/weather', async (req, res) => {
  try {
    const force = req.query.force === 'true';
    const weather = await fetchWeatherData(force);
    
    // Parse out current weather from hourly (first period)
    const currentHourly = (weather.hourly && weather.hourly.periods) ? weather.hourly.periods[0] : null;
    const currentDaily = (weather.daily && weather.daily.periods) ? weather.daily.periods[0] : null;
    const relativeHumidity = 18; // Typical Mt Lemmon summer afternoon humidity %

    const currentData = {
      temperature: currentHourly ? currentHourly.temperature : (currentDaily ? currentDaily.temperature : 72),
      shortForecast: currentHourly ? currentHourly.shortForecast : (currentDaily ? currentDaily.shortForecast : 'Sunny'),
      windSpeed: currentHourly ? currentHourly.windSpeed : (currentDaily ? currentDaily.windSpeed : '10 mph'),
      windDirection: currentHourly ? currentHourly.windDirection : (currentDaily ? currentDaily.windDirection : 'SW'),
      relativeHumidity: relativeHumidity,
      precipProbability: (currentHourly && currentHourly.probabilityOfPrecipitation && currentHourly.probabilityOfPrecipitation.value !== null) ? currentHourly.probabilityOfPrecipitation.value : 0,
      icon: currentHourly ? currentHourly.icon : (currentDaily ? currentDaily.icon : 'https://api.weather.gov/icons/land/day/clear?size=medium'),
      elevation: 7000
    };

    // Filter to active Red Flag Warnings or Fire Weather Watches
    const alertsList = [];
    if (weather.alerts && weather.alerts.features) {
      for (const feature of weather.alerts.features) {
        const props = feature.properties;
        if (
          props.event.toLowerCase().includes('red flag') ||
          props.event.toLowerCase().includes('fire weather') ||
          props.event.toLowerCase().includes('high wind')
        ) {
          alertsList.push({
            id: props.id,
            event: props.event,
            severity: props.severity,
            urgency: props.urgency,
            headline: props.headline,
            description: props.description,
            instruction: props.instruction,
            effective: props.effective,
            ends: props.ends || props.expires
          });
        }
      }
    }

    // Parse Open-Meteo into 10 daily periods
    const forecast10Day = [];
    if (weather.openMeteo && weather.openMeteo.daily && Array.isArray(weather.openMeteo.daily.time)) {
      const daily = weather.openMeteo.daily;
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      
      for (let i = 0; i < daily.time.length; i++) {
        const dateStr = daily.time[i];
        const date = new Date(dateStr + 'T12:00:00'); // Prevent timezone shift
        const dayName = i === 0 ? 'Today' : daysOfWeek[date.getDay()];
        
        const wmoCode = (daily.weathercode && daily.weathercode[i] !== undefined) ? daily.weathercode[i] : 0;
        const wmoMapping = mapWmoCodeToForecast(wmoCode);
        
        // Helper to format wind direction from degrees to compass text
        const deg = (daily.winddirection_10m_dominant && daily.winddirection_10m_dominant[i] !== undefined) ? daily.winddirection_10m_dominant[i] : 220;
        let dir = 'SW';
        if (deg >= 337.5 || deg < 22.5) dir = 'N';
        else if (deg >= 22.5 && deg < 67.5) dir = 'NE';
        else if (deg >= 67.5 && deg < 112.5) dir = 'E';
        else if (deg >= 112.5 && deg < 157.5) dir = 'SE';
        else if (deg >= 157.5 && deg < 202.5) dir = 'S';
        else if (deg >= 202.5 && deg < 247.5) dir = 'SW';
        else if (deg >= 247.5 && deg < 292.5) dir = 'W';
        else if (deg >= 292.5 && deg < 337.5) dir = 'NW';

        const maxTemp = (daily.temperature_2m_max && daily.temperature_2m_max[i] !== undefined) ? Math.round(daily.temperature_2m_max[i]) : 72;
        const minTemp = (daily.temperature_2m_min && daily.temperature_2m_min[i] !== undefined) ? Math.round(daily.temperature_2m_min[i]) : 52;
        const windSpeedVal = (daily.windspeed_10m_max && daily.windspeed_10m_max[i] !== undefined) ? Math.round(daily.windspeed_10m_max[i]) : 10;
        const precipProb = (daily.precipitation_probability_max && daily.precipitation_probability_max[i] !== undefined) ? daily.precipitation_probability_max[i] : 0;

        forecast10Day.push({
          number: i + 1,
          name: dayName,
          date: dateStr,
          maxTemp: maxTemp,
          minTemp: minTemp,
          windSpeed: `${windSpeedVal} mph`,
          windDirection: dir,
          shortForecast: wmoMapping.desc,
          icon: wmoMapping.icon,
          precipProbability: precipProb
        });
      }
    }

    res.json({
      success: true,
      source: weather.source,
      lastUpdated: weather.lastUpdated,
      data: {
        current: currentData,
        forecast: forecast10Day, // Extended 10-day forecast!
        alerts: alertsList
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// REST Endpoint: GET /api/fire-status
apiRouter.get('/fire-status', async (req, res) => {
  try {
    const force = req.query.force === 'true';
    const config = await readConfig();
    const weather = await fetchWeatherData(force);
    
    // Check if there's a live Red Flag Warning from NWS
    const redFlagWarnings = [];
    if (weather.alerts && weather.alerts.features) {
      for (const feature of weather.alerts.features) {
        const props = feature.properties;
        if (props.event.toLowerCase().includes('red flag')) {
          redFlagWarnings.push({
            event: props.event,
            headline: props.headline,
            instruction: props.instruction || props.description,
            ends: props.ends || props.expires
          });
        }
      }
    }

    res.json({
      success: true,
      fireDanger: config.fireDanger,
      campfireRestriction: config.campfireRestriction,
      customAlert: config.customAlert,
      bulletinText: config.bulletinText,
      redFlagWarnings: redFlagWarnings,
      hasActiveRedFlag: redFlagWarnings.length > 0,
      source: weather.source,
      lastUpdated: weather.lastUpdated || Date.now()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// REST Endpoint: GET /api/forest-alerts
apiRouter.get('/forest-alerts', async (req, res) => {
  try {
    const force = req.query.force === 'true';
    const config = await readConfig();
    const weather = await fetchWeatherData(force);
    const seismic = await fetchSeismicData(force);

    // Filter NWS alerts
    const nwsAlerts = [];
    if (weather.alerts && weather.alerts.features) {
      for (const feature of weather.alerts.features) {
        const props = feature.properties;
        nwsAlerts.push({
          event: props.event,
          headline: props.headline,
          severity: props.severity,
          instruction: props.instruction || props.description,
          ends: props.ends || props.expires
        });
      }
    }

    // Filter Seismic alerts (magnitudes from USGS within 200km)
    const earthquakes = [];
    if (seismic && seismic.features) {
      for (const feature of seismic.features) {
        const props = feature.properties;
        earthquakes.push({
          mag: props.mag,
          place: props.place,
          time: props.time,
          url: props.url
        });
      }
    }

    res.json({
      success: true,
      roadStatus: config.roadStatus || "Catalina Highway is OPEN (No restrictions).",
      advisoryAlert: config.advisoryAlert || "Normal Forest Operations. No active wildlife or law enforcement alerts.",
      nwsAlerts: nwsAlerts,
      earthquakes: earthquakes,
      lastUpdated: weather.lastUpdated || Date.now(),
      source: weather.source
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// REST Endpoint: GET /api/scouting-data
apiRouter.get('/scouting-data', async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 1-indexed
    const currentDay = now.getDate();
    const dayOfYear = getDayOfYear();

    // 1. Fetch Quote of the Day
    const quotes = await readJsonFile(QUOTES_PATH, [
      { "quote": "Be Prepared.", "author": "Lord Baden-Powell" }
    ]);
    const quote = quotes[dayOfYear % quotes.length];

    // 2. Fetch Today's Holiday
    const holidays = await readJsonFile(HOLIDAYS_PATH, []);
    const todayHoliday = holidays.find(h => h.month === currentMonth && h.day === currentDay);

    // 3. Fetch Scouting History
    const historyItems = await readJsonFile(HISTORY_PATH, []);
    let todayHistory = historyItems.find(h => h.month === currentMonth && h.day === currentDay);
    if (!todayHistory && historyItems.length > 0) {
      // Rotate round-robin based on day of year to keep it fresh
      todayHistory = historyItems[dayOfYear % historyItems.length];
    }

    // 4. Fetch Blog Posts
    const blogPosts = await readJsonFile(BLOG_PATH, []);

    // 5. Fetch Events
    const events = await readJsonFile(EVENTS_PATH, []);

    res.json({
      success: true,
      data: {
        quote: quote,
        holiday: todayHoliday ? todayHoliday.name : "National Outdoor Appreciation Day",
        history: todayHistory || {
          "year": 1916,
          "title": "BSA Federal Charter",
          "description": "The Boy Scouts of America holds a Congressional Federal Charter, recognizing the value of its character-building programs for youth."
        },
        blog: blogPosts,
        events: events
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// REST Endpoint: POST /api/admin/config (PIN authorized)
apiRouter.post('/admin/config', async (req, res) => {
  const { pin, fireDanger, campfireRestriction, customAlert, roadStatus, advisoryAlert, bulletinText } = req.body;
  
  if (!pin) {
    return res.status(400).json({ success: false, error: 'PIN is required' });
  }

  const config = await readConfig();

  if (pin !== config.adminPin) {
    return res.status(401).json({ success: false, error: 'Unauthorized PIN' });
  }

  // Update parameters if provided
  if (fireDanger) config.fireDanger = fireDanger;
  if (campfireRestriction) config.campfireRestriction = campfireRestriction;
  if (customAlert !== undefined) config.customAlert = customAlert;
  if (roadStatus !== undefined) config.roadStatus = roadStatus;
  if (advisoryAlert !== undefined) config.advisoryAlert = advisoryAlert;
  if (bulletinText !== undefined) config.bulletinText = bulletinText;

  const success = await writeConfig(config);
  if (success) {
    res.json({ success: true, message: 'Configuration updated successfully' });
  } else {
    res.status(500).json({ success: false, error: 'Failed to write configuration' });
  }
});

// REST Endpoint: GET /api/reservations (PIN authorized)
apiRouter.get('/reservations', async (req, res) => {
  try {
    const pin = req.query.pin;
    if (!pin) {
      return res.status(400).json({ success: false, error: 'PIN is required to view reservations' });
    }
    const config = await readConfig();
    if (pin !== config.adminPin) {
      return res.status(401).json({ success: false, error: 'Unauthorized PIN' });
    }
    const reservations = await readJsonFile(RESERVATIONS_PATH, []);
    res.json({ success: true, data: reservations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// REST Endpoint: POST /api/reservations (Submit a new reservation)
apiRouter.post('/reservations', async (req, res) => {
  try {
    const { troopNumber, council, scoutsCount, leadersCount, week, campsite, contactName, contactEmail } = req.body;
    if (!troopNumber || !council || !week || !campsite || !contactName || !contactEmail) {
      return res.status(400).json({ success: false, error: 'Missing required reservation fields' });
    }
    const reservations = await readJsonFile(RESERVATIONS_PATH, []);
    const newReservation = {
      id: 'res_' + Date.now(),
      troopNumber,
      council,
      scoutsCount: parseInt(scoutsCount) || 0,
      leadersCount: parseInt(leadersCount) || 0,
      week,
      campsite,
      status: 'Pending Deposit',
      contactName,
      contactEmail
    };
    reservations.push(newReservation);
    await writeJsonFile(RESERVATIONS_PATH, reservations);
    console.log(`[Cloud Database Sync] Successfully synced reservation ${newReservation.id} for ${newReservation.troopNumber} to database.`);
    res.json({ success: true, message: 'Reservation submitted successfully', data: newReservation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// REST Endpoint: POST /api/admin/blog (PIN authorized)
apiRouter.post('/admin/blog', async (req, res) => {
  try {
    const { pin, title, category, summary } = req.body;
    if (!pin) {
      return res.status(400).json({ success: false, error: 'PIN is required to write blog posts' });
    }
    const config = await readConfig();
    if (pin !== config.adminPin) {
      return res.status(401).json({ success: false, error: 'Unauthorized PIN' });
    }
    if (!title || !category || !summary) {
      return res.status(400).json({ success: false, error: 'Missing required fields (title, category, summary)' });
    }
    const blogPosts = await readJsonFile(BLOG_PATH, []);
    const newPost = {
      id: blogPosts.length > 0 ? Math.max(...blogPosts.map(b => b.id)) + 1 : 1,
      date: new Date().toISOString().split('T')[0],
      author: 'Camp Director',
      title: title,
      summary: summary,
      category: category
    };
    blogPosts.unshift(newPost);
    await writeJsonFile(BLOG_PATH, blogPosts);
    res.json({ success: true, message: 'Blog post published successfully', data: newPost });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// STAFF APPLICATIONS API

// 1. Submit a new application
apiRouter.post('/applications', async (req, res) => {
  try {
    const appData = req.body;
    if (!appData || !appData.firstName || !appData.lastName || !appData.email) {
      return res.status(400).json({ success: false, error: 'Missing required profile fields (firstName, lastName, email)' });
    }

    const applications = await readApplications();
    
    // Create new application record
    const newApp = {
      id: 'app_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      status: 'Submitted', // Default status
      adminNotes: '',
      submittedAt: new Date().toISOString(),
      ...appData
    };

    applications.push(newApp);
    const success = await writeApplications(applications);

    if (success) {
      console.log(`[Cloud Database Sync] Successfully synced staff application ${newApp.id} for ${newApp.firstName} ${newApp.lastName} to cloud storage.`);
      
      res.json({ 
        success: true, 
        message: 'Application submitted successfully', 
        id: newApp.id 
      });
    } else {
      res.status(500).json({ success: false, error: 'Failed to save application to database' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Get all applications (Admin PIN protected)
apiRouter.get('/applications', async (req, res) => {
  try {
    const pin = req.headers['x-admin-pin'] || req.query.pin;
    if (!pin) {
      return res.status(400).json({ success: false, error: 'PIN is required to view applications' });
    }

    const config = await readConfig();
    if (pin !== config.adminPin) {
      return res.status(401).json({ success: false, error: 'Unauthorized PIN' });
    }

    const applications = await readApplications();
    // Sort applications by submission time, newest first
    applications.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Update application status or notes (Admin PIN protected)
apiRouter.patch('/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { pin, status, adminNotes } = req.body;

    if (!pin) {
      return res.status(400).json({ success: false, error: 'PIN is required to modify applications' });
    }

    const config = await readConfig();
    if (pin !== config.adminPin) {
      return res.status(401).json({ success: false, error: 'Unauthorized PIN' });
    }

    const applications = await readApplications();
    const appIndex = applications.findIndex(a => a.id === id);

    if (appIndex === -1) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    // Update fields if provided
    if (status !== undefined) applications[appIndex].status = status;
    if (adminNotes !== undefined) applications[appIndex].adminNotes = adminNotes;

    const success = await writeApplications(applications);
    if (success) {
      console.log(`[Cloud Database Sync] Successfully updated application ${id} in cloud database.`);
      res.json({ success: true, message: 'Application updated successfully', data: applications[appIndex] });
    } else {
      res.status(500).json({ success: false, error: 'Failed to update application in database' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Mount the Router at both /api and /.netlify/functions/api
app.use('/api', apiRouter);
app.use('/.netlify/functions/api', apiRouter);;


if (process.env.NODE_ENV !== 'test' && !process.env.NETLIFY && !process.env.LAMBDA_TASK_ROOT) {
  app.listen(PORT, () => {
    console.log(`========================================================`);
    console.log(` Camp Lawton Scout Camp Dashboard running at:`);
    console.log(` http://localhost:${PORT}`);
    console.log(`========================================================`);
  });
}

export default app;
