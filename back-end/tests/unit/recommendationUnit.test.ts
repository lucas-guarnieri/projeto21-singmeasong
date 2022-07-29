import { jest } from "@jest/globals";
import {
  recommendationService,
  CreateRecommendationData,
} from "../../src/services/recommendationsService.js";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";

jest.mock("../../src/repositories/recommendationRepository.js");

describe("recommendationservice test suite", () => {
  it("shoulde create recommendation", async () => {
    const recommendationData: CreateRecommendationData = {
      name: "test",
      youtubeLink: "https://youtu.be/QH2-TGUlwu4",
    };
    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementationOnce((): any => {
        return false;
      });
    jest
      .spyOn(recommendationRepository, "create")
      .mockImplementationOnce((): any => {});
    await recommendationService.insert(recommendationData);

    expect(recommendationRepository.findByName).toBeCalled();
    expect(recommendationRepository.create).toBeCalled();
  });
});
