import { prisma } from "../src/database.js";

async function main() {
  await prisma.$executeRaw`INSERT INTO recommendations ("name", "youtubeLink", "score") VALUES ("zeca, o bon-vivant", "https://youtu.be/hazn4DNoJGw", 15)`;
  await prisma.$executeRaw`INSERT INTO recommendations ("name", "youtubeLink", "score") VALUES ("mestre adoriran", "https://youtu.be/ceBdGz3eTFg", 150)`;
  await prisma.$executeRaw`INSERT INTO recommendations ("name", "youtubeLink", "score") VALUES ("martinho AKA: Monstro do samba", "https://youtu.be/ObU62GlC7mE", 87)`;
  await prisma.$executeRaw`INSERT INTO recommendations ("name", "youtubeLink", "score") VALUES ("cartola S2", "https://youtu.be/VPgBKEECkMw", 15)`;
  await prisma.$executeRaw`INSERT INTO recommendations ("name", "youtubeLink", "score") VALUES ("beth carvalho mandando muito", "https://youtu.be/zJDSvfWGWV4", 8)`;
  await prisma.$executeRaw`INSERT INTO recommendations ("name", "youtubeLink", "score") VALUES ("essa só conhece quem manja", "https://youtu.be/udZof5bWWc4", 5)`;
  await prisma.$executeRaw`INSERT INTO recommendations ("name", "youtubeLink", "score") VALUES ("essa vai cair", "https://youtu.be/QH2-TGUlwu4", -5)`;
  await prisma.recommendation.create({
    data: {
      name: "zeca",
      youtubeLink: "https://youtu.be/hazn4DNoJGw",
      score: 15,
    },
  });
  await prisma.recommendation.create({
    data: {
      name: "zeca",
      youtubeLink: "https://youtu.be/hazn4DNoJGw",
      score: 15,
    },
  });
}
main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
