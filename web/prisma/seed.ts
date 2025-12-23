import { prisma } from "../src/lib/prisma";

async function main() {
  // Active scoring ruleset (editable from admin later)
  const activeRules = await prisma.scoringRuleset.findFirst({
    where: { isActive: true },
  });
  if (!activeRules) {
    await prisma.scoringRuleset.create({
      data: {
        isActive: true,
        pointsCorrectOutcome: 1,
        pointsExactScore: 3,
        bonusByStage: {
          ROUND_OF_16: 1,
          QUARTERFINAL: 1,
          SEMIFINAL: 2,
          THIRD_PLACE: 2,
          FINAL: 3,
        },
      },
    });
  }

  // Seed a small mock calendar (API simulada)
  const existing = await prisma.match.count();
  if (existing > 0) return;

  await prisma.match.createMany({
    data: [
      {
        externalId: "MOCK-001",
        stage: "GROUP",
        status: "SCHEDULED",
        kickoffAt: new Date("2026-06-11T21:00:00Z"),
        city: "Ciudad de México",
        venue: "Estadio Azteca",
        homeTeam: "México",
        awayTeam: "Canadá",
      },
      {
        externalId: "MOCK-002",
        stage: "GROUP",
        status: "SCHEDULED",
        kickoffAt: new Date("2026-06-12T00:00:00Z"),
        city: "Los Ángeles",
        venue: "SoFi Stadium",
        homeTeam: "Estados Unidos",
        awayTeam: "Japón",
      },
      {
        externalId: "MOCK-003",
        stage: "GROUP",
        status: "SCHEDULED",
        kickoffAt: new Date("2026-06-12T18:00:00Z"),
        city: "Toronto",
        venue: "BMO Field",
        homeTeam: "Brasil",
        awayTeam: "Alemania",
      },
      {
        externalId: "MOCK-004",
        stage: "ROUND_OF_16",
        status: "SCHEDULED",
        kickoffAt: new Date("2026-06-28T18:00:00Z"),
        city: "Miami",
        venue: "Hard Rock Stadium",
        homeTeam: "1A",
        awayTeam: "2B",
      },
      {
        externalId: "MOCK-005",
        stage: "FINAL",
        status: "SCHEDULED",
        kickoffAt: new Date("2026-07-19T20:00:00Z"),
        city: "Nueva York / Nueva Jersey",
        venue: "MetLife Stadium",
        homeTeam: "Ganador SF1",
        awayTeam: "Ganador SF2",
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

