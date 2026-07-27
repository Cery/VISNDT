-- CreateTable
CREATE TABLE "demand_parameter" (
    "id" UUID NOT NULL,
    "demand_id" UUID NOT NULL,
    "parameter_definition_id" UUID NOT NULL,
    "value" TEXT,
    "value_min" DOUBLE PRECISION,
    "value_max" DOUBLE PRECISION,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "demand_parameter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "demand_parameter_parameter_definition_id_idx" ON "demand_parameter"("parameter_definition_id");

-- CreateIndex
CREATE UNIQUE INDEX "demand_parameter_demand_id_parameter_definition_id_key" ON "demand_parameter"("demand_id", "parameter_definition_id");

-- AddForeignKey
ALTER TABLE "demand_parameter" ADD CONSTRAINT "demand_parameter_demand_id_fkey" FOREIGN KEY ("demand_id") REFERENCES "demand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demand_parameter" ADD CONSTRAINT "demand_parameter_parameter_definition_id_fkey" FOREIGN KEY ("parameter_definition_id") REFERENCES "parameter_definition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
