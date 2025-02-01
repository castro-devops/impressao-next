/*
  Warnings:

  - A unique constraint covering the columns `[ip_user]` on the table `Auth` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expiresAt` to the `Auth` table without a default value. This is not possible if the table is not empty.
  - Made the column `ip_user` on table `Auth` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Auth" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "expired" SET DEFAULT false,
ALTER COLUMN "ip_user" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Auth_ip_user_key" ON "Auth"("ip_user");
