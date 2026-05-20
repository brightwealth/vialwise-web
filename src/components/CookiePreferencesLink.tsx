'use client';

import { useCookieConsent } from '@/hooks/useCookieConsent';

interface CookiePreferencesLinkProps {
  className?: string;
}

export function CookiePreferencesLink({ className }: CookiePreferencesLinkProps) {
  const { reopenBanner } = useCookieConsent();
  return (
    <button
      type="button"
      onClick={reopenBanner}
      className={className ?? 'text-espresso/70 hover:text-espresso underline-offset-2 hover:underline'}
    >
      Cookie preferences
    </button>
  );
}
