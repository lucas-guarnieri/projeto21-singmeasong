import { prisma } from "../../src/database.js";
import recommendationFactory from "./factories/recommendationFactory.js";
import supertest from "supertest";

import app from "../../src/app.js";

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
    const recommendationData = recommendationFactory.createRecommendationData();
    await recommendationFactory.putRecommendationOnDb(recommendationData);
    const response = await supertest(app)
      .post("/recommendations")
      .send(recommendationData);
    expect(response.status).toBe(409);
  });
});
