import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { Station, CrowdLevel } from "../../types";
import { buildStationIcon } from "./StationMarker";
import StationPopup from "./StationPopup";
import { lineColor } from "../../utils/crowdColorMap";

interface Props {
  stations: Station[];
  crowdByStation: Record<string, CrowdLevel>;
  confidenceByStation: Record<string, number>;
  hour: number;
}

const CHENNAI_CENTER: [number, number] = [13.05, 80.23];

export default function MetroMap({ stations, crowdByStation, confidenceByStation, hour }: Props) {
  const blueStations = stations
    .filter((s) => s.line === "Blue")
    .sort((a, b) => a.order - b.order);
  const greenStations = stations
    .filter((s) => s.line === "Green")
    .sort((a, b) => a.order - b.order);

  return (
    <div className="overflow-hidden rounded-2xl border border-base-700 shadow-panel">
      <MapContainer
        center={CHENNAI_CENTER}
        zoom={12}
        scrollWheelZoom
        style={{ height: "560px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Polyline
          positions={blueStations.map((s) => [s.latitude, s.longitude])}
          pathOptions={{ color: lineColor.Blue, weight: 4, opacity: 0.8 }}
        />
        <Polyline
          positions={greenStations.map((s) => [s.latitude, s.longitude])}
          pathOptions={{ color: lineColor.Green, weight: 4, opacity: 0.8 }}
        />

        {stations.map((station) => {
          const level = crowdByStation[station.name] || "Low";
          const confidence = confidenceByStation[station.name] ?? 0.85;
          return (
            <Marker
              key={station.id}
              position={[station.latitude, station.longitude]}
              icon={buildStationIcon(level, station.isInterchange)}
            >
              <Popup>
                <StationPopup station={station} level={level} confidence={confidence} hour={hour} />
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
