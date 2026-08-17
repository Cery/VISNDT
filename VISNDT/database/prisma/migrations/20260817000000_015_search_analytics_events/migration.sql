-- Migration 015: Search Analytics Events
-- Extend ConversionEventType enum with discovery analytics event types
-- M23.0.3 Search Analytics Foundation

ALTER TYPE "ConversionEventType" ADD VALUE 'SEARCH_SUBMITTED';
ALTER TYPE "ConversionEventType" ADD VALUE 'RESULT_VIEWED';
ALTER TYPE "ConversionEventType" ADD VALUE 'ENTITY_CLICKED';
ALTER TYPE "ConversionEventType" ADD VALUE 'DETAIL_OPENED';