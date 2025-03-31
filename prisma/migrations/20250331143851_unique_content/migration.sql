/*
  Warnings:

  - You are about to drop the `CodeSnippet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "CodeSnippet";

-- CreateTable
CREATE TABLE "code_snippets" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "content" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "code_snippets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "code_snippets_identifier_key" ON "code_snippets"("identifier");
