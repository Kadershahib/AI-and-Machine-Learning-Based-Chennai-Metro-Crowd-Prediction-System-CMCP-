import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Approximate real coordinates for Chennai Metro Blue Line + Green Line stations
const STATIONS = [
  { name: "Wimco Nagar", line: "Blue", tier: 1, isInterchange: false, isItCorridor: false, latitude: 13.1305, longitude: 80.2957, order: 1 },
  { name: "Washermanpet", line: "Blue", tier: 2, isInterchange: false, isItCorridor: false, latitude: 13.1156, longitude: 80.2887, order: 2 },
  { name: "Mannadi", line: "Blue", tier: 2, isInterchange: false, isItCorridor: false, latitude: 13.1055, longitude: 80.2875, order: 3 },
  { name: "High Court", line: "Blue", tier: 3, isInterchange: false, isItCorridor: false, latitude: 13.0946, longitude: 80.2864, order: 4 },
  { name: "Central (Chennai Central)", line: "Blue", tier: 5, isInterchange: true, isItCorridor: false, latitude: 13.0827, longitude: 80.2757, order: 5 },
  { name: "Government Estate", line: "Blue", tier: 3, isInterchange: false, isItCorridor: false, latitude: 13.0722, longitude: 80.2707, order: 6 },
  { name: "LIC", line: "Blue", tier: 3, isInterchange: false, isItCorridor: false, latitude: 13.0654, longitude: 80.2654, order: 7 },
  { name: "Thousand Lights", line: "Blue", tier: 3, isInterchange: false, isItCorridor: false, latitude: 13.0602, longitude: 80.2564, order: 8 },
  { name: "AG-DMS", line: "Blue", tier: 3, isInterchange: false, isItCorridor: false, latitude: 13.0517, longitude: 80.2499, order: 9 },
  { name: "Teynampet", line: "Blue", tier: 3, isInterchange: false, isItCorridor: false, latitude: 13.0430, longitude: 80.2495, order: 10 },
  { name: "Nandanam", line: "Blue", tier: 3, isInterchange: false, isItCorridor: false, latitude: 13.0335, longitude: 80.2422, order: 11 },
  { name: "Saidapet", line: "Blue", tier: 4, isInterchange: true, isItCorridor: false, latitude: 13.0212, longitude: 80.2222, order: 12 },
  { name: "Guindy", line: "Blue", tier: 5, isInterchange: true, isItCorridor: true, latitude: 13.0067, longitude: 80.2206, order: 13 },
  { name: "Alandur", line: "Blue", tier: 5, isInterchange: true, isItCorridor: true, latitude: 12.9974, longitude: 80.2007, order: 14 },
  { name: "Nanganallur Road", line: "Blue", tier: 3, isInterchange: false, isItCorridor: true, latitude: 12.9873, longitude: 80.1927, order: 15 },
  { name: "Meenambakkam", line: "Blue", tier: 4, isInterchange: false, isItCorridor: false, latitude: 12.9868, longitude: 80.1706, order: 16 },
  { name: "Airport", line: "Blue", tier: 5, isInterchange: false, isItCorridor: false, latitude: 12.9930, longitude: 80.1698, order: 17 },
  { name: "Egmore", line: "Green", tier: 5, isInterchange: true, isItCorridor: false, latitude: 13.0732, longitude: 80.2609, order: 1 },
  { name: "Nehru Park", line: "Green", tier: 2, isInterchange: false, isItCorridor: false, latitude: 13.0783, longitude: 80.2497, order: 2 },
  { name: "Kilpauk Medical College", line: "Green", tier: 3, isInterchange: false, isItCorridor: false, latitude: 13.0798, longitude: 80.2404, order: 3 },
  { name: "Pachaiyappas College", line: "Green", tier: 2, isInterchange: false, isItCorridor: false, latitude: 13.0817, longitude: 80.2306, order: 4 },
  { name: "Shenoy Nagar", line: "Green", tier: 3, isInterchange: false, isItCorridor: false, latitude: 13.0821, longitude: 80.2223, order: 5 },
  { name: "Anna Nagar East", line: "Green", tier: 4, isInterchange: false, isItCorridor: false, latitude: 13.0850, longitude: 80.2101, order: 6 },
  { name: "Anna Nagar Tower", line: "Green", tier: 4, isInterchange: false, isItCorridor: false, latitude: 13.0866, longitude: 80.2076, order: 7 },
  { name: "Thirumangalam", line: "Green", tier: 4, isInterchange: true, isItCorridor: false, latitude: 13.0819, longitude: 80.2013, order: 8 },
  { name: "Koyambedu", line: "Green", tier: 5, isInterchange: false, isItCorridor: false, latitude: 13.0694, longitude: 80.1958, order: 9 },
  { name: "CMBT", line: "Green", tier: 5, isInterchange: false, isItCorridor: false, latitude: 13.0688, longitude: 80.1948, order: 10 },
  { name: "Arumbakkam", line: "Green", tier: 3, isInterchange: false, isItCorridor: false, latitude: 13.0733, longitude: 80.2115, order: 11 },
  { name: "Vadapalani", line: "Green", tier: 4, isInterchange: false, isItCorridor: true, latitude: 13.0503, longitude: 80.2126, order: 12 },
  { name: "Ashok Nagar", line: "Green", tier: 3, isInterchange: false, isItCorridor: false, latitude: 13.0357, longitude: 80.2101, order: 13 },
  { name: "Ekkattuthangal", line: "Green", tier: 3, isInterchange: false, isItCorridor: true, latitude: 13.0198, longitude: 80.2029, order: 14 },
];

async function main() {
  console.log("Seeding stations...");
  for (const s of STATIONS) {
    await prisma.station.upsert({
      where: { name: s.name },
      update: s,
      create: s,
    });
  }
  console.log(`Seeded ${STATIONS.length} stations.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
