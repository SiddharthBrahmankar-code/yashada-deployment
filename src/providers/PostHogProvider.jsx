'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';

export function PostHogProvider({ children }) {
  useEffect(() => {
    // Only initialize PostHog in the browser environment
    if (typeof window !== 'undefined') {
      // Dummy API Key for initialization (User will replace via implementation_plan instructions)
      posthog.init('phc_dummy_api_key_replace_me_before_production', {
        api_host: 'https://app.posthog.com',
        person_profiles: 'identified_only',
        capture_pageview: false // Capture pageviews manually if needed
      });
    }
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
