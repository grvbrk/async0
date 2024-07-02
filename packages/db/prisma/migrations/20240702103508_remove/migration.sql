/*
  Warnings:

  - You are about to drop the column `description` on the `Problem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TestcaseStatus" DROP CONSTRAINT "TestcaseStatus_testcaseId_fkey";

-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "description";

-- AddForeignKey
ALTER TABLE "TestcaseStatus" ADD CONSTRAINT "TestcaseStatus_testcaseId_fkey" FOREIGN KEY ("testcaseId") REFERENCES "Testcase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
