-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE', 'SUSPENDED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "registerPin" TEXT,
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'PENDING';
