// Elements
const locationInput = document.getElementById('locationField');
const stateInput = document.getElementById('stateField');
const currentBtn = document.getElementById('currentLocationBtn');
const form = document.querySelector('.edit-form');

// Initialize map
let map = L.map('map').setView([20.5937, 78.9629], 5); // default India
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let marker;

// Helper: set marker at lat/lon and attach drag event
function setMarker(lat, lon) {
  if (marker) {
    marker.setLatLng([lat, lon]);
  } else {
    marker = L.marker([lat, lon], { draggable: true }).addTo(map);
  }

  // Update hidden fields on drag
  marker.off('dragend');
  marker.on('dragend', async () => {
    const pos = marker.getLatLng();
    await updateFieldsFromCoords(pos.lat, pos.lng);
  });

  map.setView([lat, lon], 13);
}

// Reverse geocode and update input + hidden fields
async function updateFieldsFromCoords(lat, lon) {
  try {
    const revRes = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: { lat, lon, format: 'json' }
    });

    if (revRes.data && revRes.data.address) {
      locationInput.value = revRes.data.address.city || revRes.data.address.town || revRes.data.address.village || '';
      stateInput.value = revRes.data.address.state || '';
    }

    document.getElementById('latField').value = lat;
    document.getElementById('lonField').value = lon;

  } catch (err) {
    console.error(err);
  }
}

// Geocode address to lat/lon (triggered on input change)
async function updateMapFromAddress() {
  const address = `${locationInput.value}, ${stateInput.value}`;
  if (!address.trim()) return;

  try {
    const res = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { q: address, format: 'json', limit: 1 }
    });

    if (res.data && res.data.length > 0) {
      const lat = parseFloat(res.data[0].lat);
      const lon = parseFloat(res.data[0].lon);
      setMarker(lat, lon);
      await updateFieldsFromCoords(lat, lon);
    }
  } catch (err) {
    console.error(err);
  }
}

// Initialize map with DB location
if (listingData.lat && listingData.lon) {
  setMarker(listingData.lat, listingData.lon);
  updateFieldsFromCoords(listingData.lat, listingData.lon);
} else if (locationInput.value && stateInput.value) {
  updateMapFromAddress();
}

// Event listeners for input change (manual typing)
locationInput.addEventListener('change', updateMapFromAddress);
stateInput.addEventListener('change', updateMapFromAddress);

// Use current location button
currentBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      setMarker(lat, lon);
      await updateFieldsFromCoords(lat, lon);
    }, (err) => {
      alert('Could not get your location');
      console.error(err);
    });
  } else {
    alert('Geolocation not supported by your browser');
  }
});

// Map click to set marker
map.on('click', async (e) => {
  const { lat, lng } = e.latlng;
  setMarker(lat, lng);
  await updateFieldsFromCoords(lat, lng);
});

// Ensure hidden fields updated before form submit
form.addEventListener('submit', () => {
  if (marker) {
    const pos = marker.getLatLng();
    document.getElementById('latField').value = pos.lat;
    document.getElementById('lonField').value = pos.lng;
  }
});
