import { prisma } from "../../src/database.js";

const youtubeLinks = [
  "https://youtu.be/6gPKMa3Yrn8",
  "https://youtu.be/Z0AXjUy1_gY",
  "https://youtu.be/c139yqQOqGU",
  "https://youtu.be/PH2tPfJ9ggI",
  "https://youtu.be/pKwQlm-wldA",
];

function getRandomNum(arrayLenght: number) {
  return Math.floor(Math.random() * arrayLenght);
}

function createRecommendationData() {
  const randomIndex = getRandomNum(youtubeLinks.length);
  return {
    name: `teste ${randomIndex}`,
    youtubeLink: youtubeLinks[randomIndex],
  };
}
