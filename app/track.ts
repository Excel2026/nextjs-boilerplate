// app/track.ts
import { track } from "@vercel/analytics/react";

export function trackEvent(name: string, data: Record<string, any> = {}) {
  try {
    track(name, data);
  } catch (e) {
    // ignore any analytics failures
  }
}
