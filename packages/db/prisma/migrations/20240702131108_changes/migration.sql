/*
  Warnings:

  - You are about to drop the column `description` on the `Testcase` table. All the data in the column will be lost.
  - You are about to drop the column `solution` on the `Testcase` table. All the data in the column will be lost.
  - You are about to drop the `TestcaseStatus` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `starterCode` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passedTestcases` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalTestcases` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `Submission` required. This step will fail if there are existing NULL values in that column.
  - Made the column `problemId` on table `Submission` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `input` to the `Testcase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `output` to the `Testcase` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_problemId_fkey";

-- DropForeignKey
ALTER TABLE "TestcaseStatus" DROP CONSTRAINT "TestcaseStatus_testcaseId_fkey";

-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "starterCode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "passedTestcases" INTEGER NOT NULL,
ADD COLUMN     "testcaseResults" JSONB,
ADD COLUMN     "totalTestcases" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "problemId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Testcase" DROP COLUMN "description",
DROP COLUMN "solution",
ADD COLUMN     "input" TEXT NOT NULL,
ADD COLUMN     "output" TEXT NOT NULL;

-- DropTable
DROP TABLE "TestcaseStatus";

-- CreateIndex
CREATE INDEX "Submission_userId_idx" ON "Submission"("userId");

-- CreateIndex
CREATE INDEX "Submission_problemId_idx" ON "Submission"("problemId");

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
