'use client';

import { useEffect, useState } from 'react';
import AuthGuard from '@/auth/AuthGuard';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import WorkspaceHeader from '@/components/workspace/WorkspaceHeader';
import MatchList from '@/components/match/MatchList';
import { getAllMatches } from '@/services/match.service';
import type { MatchItem } from '@/services/match.service';

function MatchesContent() {
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllMatches();
        setMatches(data);
      } catch {
        // graceful fallback
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="flex min-h-screen">
      <WorkspaceSidebar />
      <div className="flex-1 flex flex-col">
        <WorkspaceHeader />
        <div className="flex-1 bg-slate-50 p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Matches</h2>
              <p className="text-slate-500 text-sm mt-1">
                Review product matches for your demands.
              </p>
            </div>
            <MatchList matches={matches} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MatchesPage() {
  return (
    <AuthGuard>
      <MatchesContent />
    </AuthGuard>
  );
}