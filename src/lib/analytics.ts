import { Analytics } from '@/types';

export function trackEvent(event: Omit<Analytics, 'timestamp'>): void {
  // Client-side tracking
  if (typeof window !== 'undefined') {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    }).catch(console.error);
  }
}

export function trackPageView(page: string): void {
  trackEvent({
    eventType: 'view',
    page,
  });
}

export function trackClick(page: string, element: string): void {
  trackEvent({
    eventType: 'click',
    page,
    metadata: { element },
  });
}
