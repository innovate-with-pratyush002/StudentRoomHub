// Initialize map
const map = L.map('map').setView([20.5937, 78.9629], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let marker;

// Handle map click
map.on('click', async function (e) {
  const { lat, lng } = e.latlng;

  if (marker) map.removeLayer(marker);
  marker = L.marker([lat, lng], { draggable: true }).addTo(map);

  setCoordinates(lat, lng);
  await updateAddress(lat, lng);

  // Update when dragged
  marker.on('dragend', async (e) => {
    const pos = e.target.getLatLng();
    setCoordinates(pos.lat, pos.lng);
    await updateAddress(pos.lat, pos.lng);
  });
});

// Handle "Use My Current Location"
document.getElementById('locateBtn').addEventListener('click', () => {
  if (!navigator.geolocation) return alert("Geolocation not supported by your browser.");

  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    if (marker) map.removeLayer(marker);
    marker = L.marker([lat, lon], { draggable: true }).addTo(map);
    map.setView([lat, lon], 15);

    setCoordinates(lat, lon);
    await updateAddress(lat, lon);

    // Update when dragged
    marker.on('dragend', async (e) => {
      const pos = e.target.getLatLng();
      setCoordinates(pos.lat, pos.lng);
      await updateAddress(pos.lat, pos.lng);
    });
  }, () => {
    alert("Unable to access location. Check GPS permission.");
  });
});

// Helper: Update form fields
function setCoordinates(lat, lon) {
  document.getElementById('lat').value = lat;
  document.getElementById('lon').value = lon;
}

// Helper: Reverse geocode
async function updateAddress(lat, lon) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
    const data = await res.json();

    if (data.display_name) {
      document.getElementById('location').value = data.display_name;
      document.getElementById('state').value = data.address?.state || '';
    }
  } catch (err) {
    console.error("Failed to fetch address:", err);
  }
}
