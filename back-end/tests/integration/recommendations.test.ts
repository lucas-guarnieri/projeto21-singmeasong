import { prisma } from "../../src/database.js";
import supertest from "supertest";

import app from "../../src/app.js";

describe("recommendations test suite", () => {
  it("check for seeding", async () => {
    const result = await prisma.$queryRaw`SELECT * from recommendations`;
    console.log("-----------------------------", result);
    expect(result).not.toBeNull();
  });
});
