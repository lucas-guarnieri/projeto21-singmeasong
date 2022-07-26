import supertest from "supertest";

import {
  deleteAllData,
  scenaryDeleteNegative,
  scenaryFullArray,
} from "./factories/scenariosFactory.js";
import { prisma } from "../../src/database.js";
import recommendationFactory from "./factories/recommendationFactory.js";
import app from "../../src/app.js";

beforeEach(async () => {
  await deleteAllData();
});

describe("recommendations test suite", () => {
  it("insert recommendation given valid data", async () => {
    const recommendationData = recommendationFactory.createRecommendationData();
    const response = await supertest(app)
      .post("/recommendations")
      .send(recommendationData);
    expect(response.status).toBe(201);

    const createdRecommendation = await prisma.recommendation.findFirst({
      where: { name: recommendationData.name },
    });
    expect(createdRecommendation).not.toBeNull();
  });

  it("given wrong data, return 422 on inserting recommendation", async () => {
    const recommendationData = { name: "name" };
    const response = await supertest(app)
      .post("/recommendations")
      .send(recommendationData);
    expect(response.status).toBe(422);
  });

  it("given not youtube html link, return 422 on inserting recommendation", async () => {
    const recommendationData = {
      name: "name",
      youtubeLink: "https://github.com/",
    };
    const response = await supertest(app)
      .post("/recommendations")
      .send(recommendationData);
    expect(response.status).toBe(422);
  });

  it("given repeated recommendation name, return 409", async () => {
    const recommendationData = await insertTestRecommendation();
    const response = await supertest(app)
      .post("/recommendations")
      .send(recommendationData);
    expect(response.status).toBe(409);
  });

  it("get recommendations", async () => {
    await scenaryFullArray();
    const response = await supertest(app).get("/recommendations");
    const recommendationsArray = response.body;
    expect(recommendationsArray).not.toBeNull();
    expect(recommendationsArray.length).toBe(7);
  });

  it("get recomemendations by id", async () => {
    const recommendationData = await insertIwthId();
    const response = await supertest(app).get(
      `/recommendations/${recommendationData.id}`
    );
    const recommendationName = response.body;

    expect(recommendationName.name).toBe(recommendationData.name);
  });

  it("get top 3 recommendatios", async () => {
    await scenaryFullArray();
    const response = await supertest(app).get(`/recommendations/top/3`);
    const recommendationArray = response.body;
    expect(recommendationArray.length).toBe(3);
  });

  it("get random recommendation", async () => {
    await scenaryFullArray();
    const response = await supertest(app).get(`/recommendations/random`);
    const recommendation = response.body;
    expect(response.body).not.toBeNull();
  });

  it("get random recommendation with empty database", async () => {
    const response = await supertest(app).get(`/recommendations/random`);
    const recommendation = response.body;
    expect(response.status).toBe(404);
  });

  it("upvote existing recommendation", async () => {
    const recommendationData = await insertIwthId();
    const response = await supertest(app).post(
      `/recommendations/${recommendationData.id}/upvote`
    );
    expect(response.status).toBe(200);
    const recommendationCheck = await prisma.recommendation.findUnique({
      where: { id: recommendationData.id },
    });
    expect(recommendationCheck.score).toBe(1);
  });
});

it("upvote non-existing recommendation", async () => {
  const response = await supertest(app).post(`/recommendations/${500}/upvote`);
  expect(response.status).toBe(404);
});

it("downvote existing recommendation", async () => {
  const recommendationData = await insertIwthId();
  const response = await supertest(app).post(
    `/recommendations/${recommendationData.id}/downvote`
  );
  expect(response.status).toBe(200);
  const recommendationCheck = await prisma.recommendation.findUnique({
    where: { id: recommendationData.id },
  });
  expect(recommendationCheck.score).toBe(-1);
});

it("downvote non-existing recommendation", async () => {
  const response = await supertest(app).post(`/recommendations/${500}/upvote`);
  expect(response.status).toBe(404);
});

it("downvote existing recommendation with -5", async () => {
  const recommendation = await scenaryDeleteNegative();
  const response = await supertest(app).post(
    `/recommendations/${recommendation.id}/downvote`
  );
  expect(response.status).toBe(200);

  const recommendationCheck = await prisma.recommendation.findUnique({
    where: { id: recommendation.id },
  });
  expect(recommendationCheck).toBeNull();
});

async function insertTestRecommendation() {
  const recommendationData = recommendationFactory.createRecommendationData();
  await recommendationFactory.putRecommendationOnDb(recommendationData);
  return recommendationData;
}
async function insertIwthId() {
  const recommendationData = recommendationFactory.createRecommendationData();
  await recommendationFactory.putRecommendationOnDb(recommendationData);
  const recommendation = await prisma.recommendation.findUnique({
    where: { name: recommendationData.name },
  });
  return recommendation;
}
