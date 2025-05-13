const cityCoords = {
  "Lublin":   [51.2465, 22.5684],
  "Warszawa": [52.2297, 21.0122],
  "Krakow":   [50.0647, 19.9450],
  "Londyn":   [51.5074, -0.1278],
  "New York": [40.7128, -74.0060],
  "Sanok":    [49.5550, 22.2050]
};

const map = L.map('map').setView([51.2465, 22.5684], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '© OpenStreetMap contributors'}).addTo(map);

let currentMarker = null;
const latInput = document.getElementById('lat');
const lngInput = document.getElementById('lng');
const tempInput = document.getElementById('temperature');
const windInput = document.getElementById('wind_speed');

function placeMarker(latlng) {
  if (currentMarker) map.removeLayer(currentMarker);
  currentMarker = L.marker(latlng).addTo(map);
  // Aktualizuj pola koordynatów
  latInput.value = latlng[0].toFixed(6);
  lngInput.value = latlng[1].toFixed(6);

  fetchWeather(latlng[0], latlng[1]);
}

async function fetchWeather(lat, lon) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    const resp = await fetch(url);
    const data = await resp.json();
    const cw = data.current_weather;
    tempInput.value = cw.temperature;
    windInput.value = cw.windspeed;
  } catch (err) {
    console.error('Błąd pobierania pogody:', err);
    tempInput.value = '—';
    windInput.value = '—';
  }
}


map.on('click', e => {placeMarker([e.latlng.lat, e.latlng.lng]);});

document.getElementById('city-select').addEventListener('change', function() {
  const city = this.value;
  if (cityCoords[city]) {
    const coords = cityCoords[city];
    map.setView(coords, 13);
    placeMarker(coords);
  }
});
