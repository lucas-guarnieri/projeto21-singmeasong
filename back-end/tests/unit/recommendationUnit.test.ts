import { jest } from "@jest/globals";
import {
  recommendationService,
  CreateRecommendationData,
} from "../../src/services/recommendationsService.js";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { Recommendation } from "@prisma/client";

describe("recommendationservice create test suite", () => {
  it("should create recommendation", async () => {
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

  it("should not create recommendation", async () => {
    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementationOnce((): any => {
        return true;
      });

    const promise = recommendationService.insert(recommendationData);
    expect(recommendationRepository.findByName).toBeCalled();
    expect(promise).rejects.toEqual({
      message: "Recommendations names must be unique",
      type: "conflict",
    });
  });
});

describe("recommendationservice upvote test suite", () => {
  it("should upvote recommendation", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return recommendationData;
      });
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {});

    await recommendationService.upvote(1);
    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
  });

  it("should return error on upvote recommendation", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return false;
      });
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {});

    const promise = recommendationService.upvote(1);
    expect(promise).rejects.toEqual({
      message: "",
      type: "not_found",
    });
  });
});

describe("recommendationservice downvote test suite", () => {
  beforeEach(() => jest.resetAllMocks());
  it("should downvote recommendation", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockResolvedValueOnce(recommendationFullData);
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockResolvedValueOnce(recommendationFullData);

    await recommendationService.downvote(recommendationFullData.id);
    expect(recommendationRepository.find).toBeCalled;
    expect(recommendationRepository.updateScore).toBeCalled;
    jest.clearAllMocks();
  });

  it("should return error on downvote recommendation", async () => {
    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null);

    const promise = recommendationService.downvote(recommendationFullData.id);
    expect(promise).rejects.toEqual({
      message: "",
      type: "not_found",
    });
  });

  it("should downvote recommendation and delete", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockResolvedValueOnce(recommendationFullData);
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockResolvedValueOnce({ ...recommendationFullData, score: -10 });

    jest.spyOn(recommendationRepository, "remove").mockResolvedValueOnce(null);

    await recommendationService.downvote(recommendationFullData.id);
    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
    expect(recommendationRepository.remove).toBeCalled();
  });
});

describe("recommendationservice get random test suite", () => {
  it("get random recommendation, gt", async () => {
    jest.spyOn(Math, "random").mockImplementationOnce((): any => {
      return 0.1;
    });
    jest.spyOn(Math, "floor").mockImplementationOnce((): any => {
      return 1;
    });
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementationOnce((): any => {
        return [{ obj: "test" }];
      });
    await recommendationService.getRandom();
    expect(recommendationRepository.findAll).toBeCalled();
  });

  it("get random recommendation, lte", async () => {
    jest.spyOn(Math, "random").mockImplementationOnce((): any => {
      return 0.9;
    });
    jest.spyOn(Math, "floor").mockImplementationOnce((): any => {
      return 1;
    });
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementationOnce((): any => {
        return [{ obj: "test" }];
      });
    await recommendationService.getRandom();
    expect(recommendationRepository.findAll).toBeCalled();
  });

  it("get erro in random recommendation, empty database", async () => {
    jest.spyOn(Math, "random").mockImplementationOnce((): any => {
      return 0.9;
    });
    jest.spyOn(Math, "floor").mockImplementationOnce((): any => {
      return 1;
    });
    jest.spyOn(recommendationRepository, "findAll").mockResolvedValueOnce([]);

    const promise = recommendationService.getRandom();
    expect(recommendationRepository.findAll).toBeCalled();
    expect(promise).rejects.toEqual({
      message: "",
      type: "not_found",
    });
  });
});

describe("recommendationservice get, getTop test suite", () => {
  it("get recommendations", async () => {
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockResolvedValueOnce([recommendationFullData]);

    const response = await recommendationService.get();
    expect(recommendationRepository.findAll).toBeCalled();
    expect(response[0]).toEqual(recommendationFullData);
  });

  it("get top recommendations", async () => {
    jest
      .spyOn(recommendationRepository, "getAmountByScore")
      .mockResolvedValueOnce([recommendationFullData]);

    const response = await recommendationService.getTop(1);
    expect(recommendationRepository.findAll).toBeCalled();
    expect(response[0]).toEqual(recommendationFullData);
  });
});

const recommendationData: CreateRecommendationData = {
  name: "test",
  youtubeLink: "https://youtu.be/QH2-TGUlwu4",
};
const recommendationFullData: Recommendation = {
  id: 1,
  name: "test",
  youtubeLink: "https://youtu.be/QH2-TGUlwu4",
  score: 10,
};
