import { prisma } from "../../../src/database.js";
import { CreateRecommendationData } from "../../../src/services/recommendationsService.js";

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
    name: `teste ${Math.floor(Math.random() * 500)}`,
    youtubeLink: youtubeLinks[randomIndex],
  };
}
async function putRecommendationOnDb(recData: CreateRecommendationData) {
  await prisma.recommendation.create({
    data: recData,
  });
  return prisma.recommendation.findUnique({
    where: { name: recData.name },
  });
}

const recommendationFactory = {
  createRecommendationData,
  putRecommendationOnDb,
};

export default recommendationFactory;
