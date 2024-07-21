/*
  Warnings:

  - You are about to drop the `SavedSolution` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SavedSolution" DROP CONSTRAINT "SavedSolution_solutionId_fkey";

-- DropForeignKey
ALTER TABLE "SavedSolution" DROP CONSTRAINT "SavedSolution_userId_fkey";

-- DropTable
DROP TABLE "SavedSolution";

-- CreateTable
CREATE TABLE "LikedSolution" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "solutionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LikedSolution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LikedSolution_userId_idx" ON "LikedSolution"("userId");

-- CreateIndex
CREATE INDEX "LikedSolution_solutionId_idx" ON "LikedSolution"("solutionId");

-- CreateIndex
CREATE UNIQUE INDEX "LikedSolution_userId_solutionId_key" ON "LikedSolution"("userId", "solutionId");

-- AddForeignKey
ALTER TABLE "LikedSolution" ADD CONSTRAINT "LikedSolution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedSolution" ADD CONSTRAINT "LikedSolution_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution"("id") ON DELETE CASCADE ON UPDATE CASCADE;
