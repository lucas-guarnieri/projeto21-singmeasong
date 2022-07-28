import { prisma } from "../../../src/database.js";

export async function deleteAllData() {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
}
