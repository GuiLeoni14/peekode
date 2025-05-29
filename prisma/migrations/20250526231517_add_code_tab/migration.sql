-- CreateTable
CREATE TABLE "code_tabs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT,
    "codeSnippetId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "code_tabs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "code_tabs" ADD CONSTRAINT "code_tabs_codeSnippetId_fkey" FOREIGN KEY ("codeSnippetId") REFERENCES "code_snippets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
