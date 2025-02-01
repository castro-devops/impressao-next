/*
  Warnings:

  - You are about to drop the column `key` on the `Session` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Session_key_key";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "key";
