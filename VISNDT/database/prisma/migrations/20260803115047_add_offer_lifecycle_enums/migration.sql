-- AlterEnum: OfferStatus — add lifecycle values
ALTER TYPE "OfferStatus" ADD VALUE 'SUBMITTED';
ALTER TYPE "OfferStatus" ADD VALUE 'ACCEPTED';
ALTER TYPE "OfferStatus" ADD VALUE 'REJECTED';
ALTER TYPE "OfferStatus" ADD VALUE 'WITHDRAWN';

-- AlterEnum: WorkflowEntityType — add OFFER
ALTER TYPE "WorkflowEntityType" ADD VALUE 'OFFER';

-- AlterEnum: WorkflowAction — add WITHDRAWN
ALTER TYPE "WorkflowAction" ADD VALUE 'WITHDRAWN';