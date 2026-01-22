import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

/* ---------- Icons ---------- */
const createIcon = (color) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

const fuelIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/2972/2972185.png",
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const currentIcon = createIcon("green");
const pickupIcon = createIcon("blue");
const dropoffIcon = createIcon("red");

/* ---------- Distance Utilities ---------- */
const toRad = (v) => (v * Math.PI) / 180;

const haversineMiles = ([lat1, lon1], [lat2, lon2]) => {
  const R = 3958.8; // miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const interpolate = (start, end, fraction) => [
  start[0] + (end[0] - start[0]) * fraction,
  start[1] + (end[1] - start[1]) * fraction,
];

/* ---------- Component ---------- */
function MapView({ route }) {
  const [animatedCP, setAnimatedCP] = useState([]);
  const [animatedPD, setAnimatedPD] = useState([]);
  const [fuelStops, setFuelStops] = useState([]);

  const { current, pickup, dropoff } = route || {};

  /* ---------- Animate Routes ---------- */
  useEffect(() => {
    let step = 0;
    const steps = 30;

    const timer = setInterval(() => {
      step++;
      setAnimatedCP([
        current,
        interpolate(current, pickup, step / steps),
      ]);
      setAnimatedPD([
        pickup,
        interpolate(pickup, dropoff, step / steps),
      ]);
      if (step >= steps) clearInterval(timer);
    }, 40);

    return () => clearInterval(timer);
  }, [current, pickup, dropoff]);

  /* ---------- Fuel Stops ---------- */
  useEffect(() => {
    const segments = [
      { from: current, to: pickup },
      { from: pickup, to: dropoff },
    ];

    let distanceCovered = 0;
    let nextFuelAt = 1000;
    const stops = [];

    segments.forEach(({ from, to }) => {
      const segDist = haversineMiles(from, to);

      while (distanceCovered + segDist >= nextFuelAt) {
        const remaining = nextFuelAt - distanceCovered;
        const fraction = remaining / segDist;
        stops.push(interpolate(from, to, fraction));
        nextFuelAt += 1000;
      }

      distanceCovered += segDist;
    });

    setFuelStops(stops);
  }, [current, pickup, dropoff]);

  if (!route) return null;

  return (
    <>
      {/* MAP */}
      <div style={{ height: "400px", marginBottom: "12px" }}>
        <MapContainer center={pickup} zoom={6} style={{ height: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />

          {/* MARKERS */}
          <Marker position={current} icon={currentIcon}>
            <Tooltip permanent>C: Current</Tooltip>
          </Marker>

          <Marker position={pickup} icon={pickupIcon}>
            <Tooltip permanent>P: Pickup</Tooltip>
          </Marker>

          <Marker position={dropoff} icon={dropoffIcon}>
            <Tooltip permanent>D: Dropoff</Tooltip>
          </Marker>

          {/* FUEL STOPS */}
          {fuelStops.map((pos, i) => (
            <Marker key={i} position={pos} icon={fuelIcon}>
              <Tooltip>
                ⛽ Fuel stop<br />
                Every 1000 miles (assumed)
              </Tooltip>
            </Marker>
          ))}

          {/* ROUTES */}
          {animatedCP.length > 0 && (
            <Polyline positions={animatedCP} color="blue" weight={4} />
          )}
          {animatedPD.length > 0 && (
            <Polyline positions={animatedPD} color="red" weight={4} />
          )}
        </MapContainer>
      </div>

      {/* MAP LEGEND */}
      <div
        style={{
          fontSize: "14px",
          background: "#f9f9f9",
          padding: "10px",
          borderRadius: "6px",
          border: "1px solid #ddd",
          marginBottom: "20px",
        }}
      >
        <strong>Map Legend:</strong>
        <div>🟢 C — Current Location</div>
        <div>🔵 P — Pickup Location</div>
        <div>🔴 D — Dropoff Location</div>
        <div>⛽ Fuel Stop — Every 1000 miles (assumed)</div>
        <div style={{ marginTop: "6px", color: "#555" }}>
          Routes are approximated using straight-line distance
        </div>
      </div>
    </>
  );
}

export default MapView;
