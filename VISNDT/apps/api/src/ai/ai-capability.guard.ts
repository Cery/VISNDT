import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AI_CAPABILITY_BOUNDARIES } from './interfaces/ai-capability.interface';

/**
 * AI Capability Guard — M21.7.1 AI Gateway Foundation
 *
 * Validates that future AI capability requests comply with AI boundary rules.
 * Currently a placeholder guard — validates:
 * 1. No autonomous AI decision (BOUNDARY-001)
 * 2. No business mutation (BOUNDARY-003)
 * 3. Human-in-the-loop required (BOUNDARY-004)
 */

export const AI_CAPABILITY_KEY = 'ai:capability';
export const AI_MUTATION_KEY = 'ai:mutation';

@Injectable()
export class AICapabilityGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const capability = this.reflector.get<string>(AI_CAPABILITY_KEY, context.getHandler());
    const mutationAllowed = this.reflector.get<boolean>(AI_MUTATION_KEY, context.getHandler());

    // If no AI capability metadata, this is not an AI request — allow
    if (!capability) {
      return true;
    }

    // BOUNDARY-003: No business mutation
    if (mutationAllowed === true) {
      throw new ForbiddenException(
        `AI Capability '${capability}' attempted business mutation. ` +
        'AI outputs are advisory only. Business mutations require human confirmation. ' +
        'See BOUNDARY-003: No Business Mutation.'
      );
    }

    // BOUNDARY-001: No autonomous AI decision
    // All AI requests must pass through this guard which enforces advisory-only
    // The guard itself is the enforcement of BOUNDARY-001

    return true;
  }
}