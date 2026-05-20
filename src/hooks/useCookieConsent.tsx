'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

/**
 * Consent state model for VialWise's cookie banner.
 * - `unknown` — visitor hasn't made a choice yet → show banner
 * - `accepted` — visitor accepted all categories → all tracking on
 * - `rejected` — visitor rejected non-essential → no tracking
 * - `customized` — visitor opted in/out per category
 */
export type ConsentState =
  | { status: 'unknown' }
  | { status: 'accepted' }
  | { status: 'rejected' }
  | { status: 'customized'; analytics: boolean };

const STORAGE_KEY = 'vialwise-cookie-consent';
const CONSENT_VERSION = 1; // bump to re-prompt all users when policy changes

type StoredConsent = {
  version: number;
  state: ConsentState;
  decidedAt: string; // ISO timestamp
};

interface CookieConsentContextValue {
  consent: ConsentState;
  /** True once the consent state has been read from localStorage (false during SSR + first paint). */
  hydrated: boolean;
  /** True when the consent banner should be visible. */
  shouldShowBanner: boolean;
  /** True when analytics scripts (GA4, Clarity) are permitted to load. */
  analyticsAllowed: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  customize: (analytics: boolean) => void;
  /** Re-opens the banner so the user can change their choice (footer link). */
  reopenBanner: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>({ status: 'unknown' });
  const [hydrated, setHydrated] = useState(false);
  const [bannerReopened, setBannerReopened] = useState(false);

  // Hydrate from localStorage on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: StoredConsent = JSON.parse(raw);
        if (parsed.version === CONSENT_VERSION) {
          setConsent(parsed.state);
        }
      }
    } catch {
      // localStorage may throw in private browsing or with quota issues — ignore.
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((next: ConsentState) => {
    setConsent(next);
    setBannerReopened(false);
    try {
      const stored: StoredConsent = {
        version: CONSENT_VERSION,
        state: next,
        decidedAt: new Date().toISOString(),
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      // ignore
    }
  }, []);

  const acceptAll = useCallback(() => persist({ status: 'accepted' }), [persist]);
  const rejectAll = useCallback(() => persist({ status: 'rejected' }), [persist]);
  const customize = useCallback((analytics: boolean) => persist({ status: 'customized', analytics }), [persist]);
  const reopenBanner = useCallback(() => setBannerReopened(true), []);

  const value = useMemo<CookieConsentContextValue>(() => {
    const analyticsAllowed =
      consent.status === 'accepted' ||
      (consent.status === 'customized' && consent.analytics === true);

    const shouldShowBanner = hydrated && (consent.status === 'unknown' || bannerReopened);

    return {
      consent,
      hydrated,
      shouldShowBanner,
      analyticsAllowed,
      acceptAll,
      rejectAll,
      customize,
      reopenBanner,
    };
  }, [consent, hydrated, bannerReopened, acceptAll, rejectAll, customize, reopenBanner]);

  return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>;
}

export function useCookieConsent(): CookieConsentContextValue {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error('useCookieConsent must be used within CookieConsentProvider');
  }
  return ctx;
}
