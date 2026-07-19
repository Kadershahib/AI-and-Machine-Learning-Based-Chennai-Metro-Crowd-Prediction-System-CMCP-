export type MetroLine = "Blue" | "Green";

export interface Station {
  id: string;
  name: string;
  line: MetroLine;
  tier: number;
  isInterchange: boolean;
  isItCorridor: boolean;
  latitude: number;
  longitude: number;
  order: number;
}
