/*
  Warnings:

  - You are about to drop the column `password` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `user` table. All the data in the column will be lost.
  - Made the column `name` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "password",
DROP COLUMN "role",
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "createdAt" DROP DEFAULT;
