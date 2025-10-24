// Initialize Leaflet map
const map = L.map('map').setView([20.5937, 78.9629], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Fetch listing coordinates
async function getListingCoordinates() {
  try {
    if (!listingData || listingData.lat == null || listingData.lon == null) {
      throw new Error("No coordinates found");
    }
    return { lat: listingData.lat, lon: listingData.lon };
  } catch (err) {
    console.error("Error fetching listing location:", err);
    alert("Failed to load listing location.");
    return null;
  }
}

// Haversine formula for distance
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Show map with user and listing
async function showMapWithDistance() {
  const listingCoords = await getListingCoordinates();
  if (!listingCoords) return;

  if (!navigator.geolocation) {
    alert("Geolocation not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLat = position.coords.latitude;
      const userLon = position.coords.longitude;

      // User marker
      L.marker([userLat, userLon])
        .addTo(map)
        .bindPopup("Your Location")
        .openPopup();

      // Listing marker
      L.marker([listingCoords.lat, listingCoords.lon])
        .addTo(map)
        .bindPopup("Listing Location")
        .openPopup();

      // Draw line
      const line = L.polyline(
        [
          [userLat, userLon],
          [listingCoords.lat, listingCoords.lon]
        ],
        { color: "blue" }
      ).addTo(map);

      // Fit map to show both points
      map.fitBounds(line.getBounds(), { padding: [50, 50] });

      // Distance popup
      const distance = calculateDistance(userLat, userLon, listingCoords.lat, listingCoords.lon).toFixed(2);
      const midLat = (userLat + listingCoords.lat) / 2;
      const midLon = (userLon + listingCoords.lon) / 2;

      L.popup()
        .setLatLng([midLat, midLon])
        .setContent(`<b>Distance:</b> ${distance} km`)
        .openOn(map);
    },
    () => {
      alert("Unable to access your current location.");
    }
  );
}

// Run map logic
showMapWithDistance();
