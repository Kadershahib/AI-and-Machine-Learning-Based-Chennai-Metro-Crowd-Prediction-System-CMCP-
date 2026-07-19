/**
 * Simplified schematic (not geographic) coordinates for rendering the metro
 * lines as a clean transit-diagram, similar to real metro wayfinding maps.
 * Coordinates are in an abstract 0-1000 x 0-500 SVG viewBox space.
 */
import { Station } from "../types";

export interface SchematicPoint {
  stationName: string;
  x: number;
  y: number;
}

// Blue line runs diagonally NE -> SW across the schematic
export const BLUE_LINE_PATH: SchematicPoint[] = [
  { stationName: "Wimco Nagar", x: 860, y: 40 },
  { stationName: "Washermanpet", x: 800, y: 70 },
  { stationName: "Mannadi", x: 740, y: 100 },
  { stationName: "High Court", x: 690, y: 130 },
  { stationName: "Central (Chennai Central)", x: 630, y: 160 },
  { stationName: "Government Estate", x: 580, y: 185 },
  { stationName: "LIC", x: 540, y: 210 },
  { stationName: "Thousand Lights", x: 500, y: 235 },
  { stationName: "AG-DMS", x: 460, y: 258 },
  { stationName: "Teynampet", x: 420, y: 280 },
  { stationName: "Nandanam", x: 380, y: 302 },
  { stationName: "Saidapet", x: 335, y: 325 },
  { stationName: "Guindy", x: 290, y: 350 },
  { stationName: "Alandur", x: 245, y: 375 },
  { stationName: "Nanganallur Road", x: 200, y: 398 },
  { stationName: "Meenambakkam", x: 155, y: 422 },
  { stationName: "Airport", x: 110, y: 445 },
];

// Green line runs roughly W -> E, crossing the blue line at Egmore-adjacent zone
export const GREEN_LINE_PATH: SchematicPoint[] = [
  { stationName: "Egmore", x: 630, y: 100 },
  { stationName: "Nehru Park", x: 580, y: 95 },
  { stationName: "Kilpauk Medical College", x: 530, y: 90 },
  { stationName: "Pachaiyappas College", x: 480, y: 88 },
  { stationName: "Shenoy Nagar", x: 430, y: 95 },
  { stationName: "Anna Nagar East", x: 380, y: 105 },
  { stationName: "Anna Nagar Tower", x: 335, y: 118 },
  { stationName: "Thirumangalam", x: 290, y: 135 },
  { stationName: "Koyambedu", x: 245, y: 155 },
  { stationName: "CMBT", x: 200, y: 175 },
  { stationName: "Arumbakkam", x: 290, y: 200 },
  { stationName: "Vadapalani", x: 290, y: 250 },
  { stationName: "Ashok Nagar", x: 290, y: 300 },
  { stationName: "Ekkattuthangal", x: 290, y: 350 },
];

export function schematicPointsFor(stations: Station[]) {
  const blue = BLUE_LINE_PATH.filter((p) =>
    stations.some((s) => s.name === p.stationName)
  );
  const green = GREEN_LINE_PATH.filter((p) =>
    stations.some((s) => s.name === p.stationName)
  );
  return { blue, green };
}
