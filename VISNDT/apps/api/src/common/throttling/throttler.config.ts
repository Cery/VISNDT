import { ThrottlerModule } from '@nestjs/throttler';

/**
 * Shared throttling factory for app-level rate limit configuration.
 *
 * Default: 100 requests per 60 seconds (1 minute).
 * Per-endpoint overrides via @Throttle() decorator.
 */
export const ThrottlerConfig = ThrottlerModule.forRoot([
  {
    ttl: 60000,
    limit: 100,
  },
]);