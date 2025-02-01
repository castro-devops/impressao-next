-- CreateTable
CREATE TABLE "Auth" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expired" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_user" TEXT,
    "user_agent" TEXT,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Auth_token_key" ON "Auth"("token");
