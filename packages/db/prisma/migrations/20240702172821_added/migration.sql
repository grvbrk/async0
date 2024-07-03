-- CreateTable
CREATE TABLE "hasUserSolved" (
    "id" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'Pending',
    "submissionId" TEXT,
    "userId" TEXT,
    "problemId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hasUserSolved_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "hasUserSolved_userId_idx" ON "hasUserSolved"("userId");

-- CreateIndex
CREATE INDEX "hasUserSolved_problemId_idx" ON "hasUserSolved"("problemId");

-- CreateIndex
CREATE UNIQUE INDEX "hasUserSolved_submissionId_userId_problemId_key" ON "hasUserSolved"("submissionId", "userId", "problemId");

-- AddForeignKey
ALTER TABLE "hasUserSolved" ADD CONSTRAINT "hasUserSolved_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hasUserSolved" ADD CONSTRAINT "hasUserSolved_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hasUserSolved" ADD CONSTRAINT "hasUserSolved_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
