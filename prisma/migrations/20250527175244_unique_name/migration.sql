/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `code_tabs` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "code_tabs_name_key" ON "code_tabs"("name");
