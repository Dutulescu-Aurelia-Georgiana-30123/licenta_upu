import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";

function createPinIcon(color) {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: 22px;
        height: 22px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 12px rgba(0,0,0,0.35);
      ">
        <div style="
          width: 7px;
          height: 7px;
          background: white;
          border-radius: 50%;
          margin: 5px;
        "></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

const emergencyIcon = createPinIcon("#dc2626");
const normalIcon = createPinIcon("#2563eb");

const userIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 28px;
      height: 28px;
      background: #facc15;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 4px 14px rgba(0,0,0,0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      color: #713f12;
      font-size: 15px;
    ">
      ●
    </div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -17],
});

function isEmergencyHospital(item) {
  const tags = item.tags || {};

  const text = `
    ${tags.name || ""}
    ${tags.emergency || ""}
    ${tags.healthcare || ""}
    ${tags.amenity || ""}
  `.toLowerCase();

  return (
    tags.emergency === "yes" ||
    text.includes("upu") ||
    text.includes("urgen") ||
    text.includes("smurd") ||
    text.includes("emergency")
  );
}

function HospitalMap({ height, hospitals, userLocation }) {
  return (
    <MapContainer
      center={
        userLocation
          ? [userLocation.lat, userLocation.lon]
          : [45.9432, 24.9668]
      }
      zoom={userLocation ? 13 : 7}
      style={{ height, width: "100%" }}
      scrollWheelZoom
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {hospitals.map((hospital) => (
        <Marker
          key={hospital.id}
          position={[hospital.lat, hospital.lon]}
          icon={hospital.isEmergency ? emergencyIcon : normalIcon}
        >
          <Popup>
            <strong>{hospital.name}</strong>
            <br />
            {hospital.isEmergency
              ? "Unitate cu urgență"
              : "Spital / unitate medicală"}
          </Popup>
        </Marker>
      ))}

      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lon]}
          icon={userIcon}
        >
          <Popup>
            <strong>Locația ta</strong>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

export default function NearbyHospitalsMap() {
  const [expanded, setExpanded] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const loadHospitals = async () => {
      try {
        const query = `
          [out:json][timeout:30];
          area["ISO3166-1"="RO"][admin_level=2]->.romania;
          (
            node["amenity"="hospital"](area.romania);
            way["amenity"="hospital"](area.romania);
            relation["amenity"="hospital"](area.romania);

            node["healthcare"="hospital"](area.romania);
            way["healthcare"="hospital"](area.romania);
            relation["healthcare"="hospital"](area.romania);

            node["emergency"="yes"](area.romania);
            way["emergency"="yes"](area.romania);
            relation["emergency"="yes"](area.romania);
          );
          out center tags;
        `;

        const res = await fetch("https://overpass-api.de/api/interpreter", {
          method: "POST",
          body: query,
        });

        const data = await res.json();

        const parsed = (data.elements || [])
          .map((item) => {
            const lat = item.lat || item.center?.lat;
            const lon = item.lon || item.center?.lon;

            if (!lat || !lon) return null;

            return {
              id: `${item.type}-${item.id}`,
              name: item.tags?.name || "Unitate medicală",
              lat,
              lon,
              isEmergency: isEmergencyHospital(item),
            };
          })
          .filter(Boolean);

        setHospitals(parsed);
      } catch (err) {
        console.error(err);
        setHospitals([]);
      } finally {
        setLoading(false);
      }
    };

    loadHospitals();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
  (position) => {
    setUserLocation({
      lat: position.coords.latitude,
      lon: position.coords.longitude,
    });
  },
  (error) => {
    console.error("Locația nu a putut fi obținută:", error);
  },
  {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  }
);
    }
  }, []);

  if (loading) {
    return (
      <div style={{ color: "#667085", fontWeight: 800 }}>
        Se încarcă spitalele din România...
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          borderRadius: 22,
          overflow: "hidden",
          border: "1px solid #dbe7f3",
        }}
      >
        <HospitalMap
          height={260}
          hospitals={hospitals}
          userLocation={userLocation}
        />

        <div
          style={{
            display: "flex",
            gap: 12,
            padding: 12,
            background: "#f8fafc",
            borderTop: "1px solid #dbe7f3",
            flexWrap: "wrap",
            fontSize: 12,
            fontWeight: 800,
            color: "#475569",
          }}
        >
          <span style={{ color: "#facc15" }}>● Locația ta</span>
          <span style={{ color: "#dc2626" }}>● Urgență / UPU</span>
          <span style={{ color: "#2563eb" }}>
            ● Spital / unitate medicală
          </span>
        </div>

        <button
          onClick={() => setExpanded(true)}
          style={{
            width: "100%",
            padding: "14px 16px",
            border: "none",
            background: "#ffffff",
            fontWeight: 900,
            color: "#0f172a",
            cursor: "pointer",
            borderTop: "1px solid #dbe7f3",
          }}
        >
          Mărește harta
        </button>
      </div>

      {expanded &&
        createPortal(
          <div
            onClick={() => setExpanded(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(15,23,42,0.72)",
              zIndex: 999999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
              boxSizing: "border-box",
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "96vw",
                height: "92vh",
                background: "white",
                borderRadius: 28,
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 25px 80px rgba(0,0,0,0.35)",
              }}
            >
              <button
                onClick={() => setExpanded(false)}
                style={{
                  position: "absolute",
                  top: 18,
                  right: 18,
                  zIndex: 999999,
                  border: "none",
                  borderRadius: 14,
                  padding: "10px 14px",
                  background: "#0f172a",
                  color: "white",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                Închide
              </button>

              <HospitalMap
                height="100%"
                hospitals={hospitals}
                userLocation={userLocation}
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}