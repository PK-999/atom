"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ComparisonError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error for client observability without exposing secrets
    console.error("Comparison route error:", error.message);
  }, [error]);

  return (
    <div
      role="alert"
      className="max-w-xl mx-auto px-4 py-16 text-center space-y-6"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Unable to load comparison evidence
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          We encountered an issue retrieving verified energy observations from
          the catalog. You can try refreshing the comparison or start with
          default settings.
        </p>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer"
        >
          Retry comparison
        </button>

        <Link
          href="/compare"
          className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Reset to default
        </Link>

        <Link
          href="/"
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}
