-- CreateTable
CREATE TABLE "user_invitation" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "organization_id" UUID NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "used_at" TIMESTAMP(3),

    CONSTRAINT "user_invitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_invitation_token_key" ON "user_invitation"("token");

-- CreateIndex
CREATE INDEX "user_invitation_email_idx" ON "user_invitation"("email");

-- CreateIndex
CREATE INDEX "user_invitation_organization_id_idx" ON "user_invitation"("organization_id");

-- CreateIndex
CREATE INDEX "user_invitation_status_idx" ON "user_invitation"("status");

-- CreateIndex
CREATE INDEX "user_invitation_token_idx" ON "user_invitation"("token");

-- AddForeignKey
ALTER TABLE "user_invitation" ADD CONSTRAINT "user_invitation_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_invitation" ADD CONSTRAINT "user_invitation_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
