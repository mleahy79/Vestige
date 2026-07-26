// Cached analysis results live in sessionStorage, not localStorage, so they
// clear when the tab closes rather than lingering on disk indefinitely.
// clearAnalysisCache() is also called on sign-out — a consultant switching
// between two clients' repos in the same browser session, without closing
// the tab, should never see the previous client's cached findings.

export const ANALYSIS_STORAGE_KEY = "vestige_archaeology_result";
export const SIGNOFF_STORAGE_KEY = "vestige_signoffs";

export function clearAnalysisCache() {
  try {
    sessionStorage.removeItem(ANALYSIS_STORAGE_KEY);
    sessionStorage.removeItem(SIGNOFF_STORAGE_KEY);
  } catch { /* ignore */ }
}
