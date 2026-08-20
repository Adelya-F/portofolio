-- CreateEnum
CREATE TYPE "BlogSourceType" AS ENUM ('ORIGINAL', 'EXTERNAL');

-- AlterTable
ALTER TABLE "blog_posts" ADD COLUMN     "externalUrl" TEXT,
ADD COLUMN     "sourceType" "BlogSourceType" NOT NULL DEFAULT 'ORIGINAL',
ALTER COLUMN "content" DROP NOT NULL;
