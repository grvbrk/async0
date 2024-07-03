/*
  Warnings:

  - You are about to drop the column `status` on the `hasUserSolved` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "hasUserSolved" DROP CONSTRAINT "hasUserSolved_submissionId_fkey";

-- AlterTable
ALTER TABLE "hasUserSolved" DROP COLUMN "status";

-- AddForeignKey
ALTER TABLE "hasUserSolved" ADD CONSTRAINT "hasUserSolved_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
