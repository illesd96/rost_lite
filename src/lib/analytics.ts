// Analytics tracking for QR code visits
export interface QRCodeVisit {
  id: string;
  page: '/osszetevok' | '/';
  timestamp: Date;
  userAgent: string;
  ipAddress?: string;
  referrer: string | null;
  isDirectVisit: boolean;
  sessionId: string;
}

export interface QRCodeAnalytics {
  totalVisits: number;
  osszetevokDirectVisits: number;
  mainPageNoReferrerVisits: number;
  todayVisits: number;
  weeklyVisits: number;
  monthlyVisits: number;
}

// Generate a unique session ID
export function generateSessionId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Check if visit is likely from QR code
export function isLikelyQRCodeVisit(referrer: string | null, page: string): boolean {
  // Direct visit to /osszetevok (no referrer and no link from main page)
  if (page === '/osszetevok' && !referrer) {
    return true;
  }
  
  // Direct visit to main page with no referrer (could be QR code)
  if (page === '/' && !referrer) {
    return true;
  }
  
  return false;
}

// Get user's IP address (for server-side)
export function getClientIP(request: Request): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return null;
}

// Client-side tracking function
export function trackQRCodeVisit(page: '/osszetevok' | '/') {
  // Only track if no referrer (likely direct visit)
  const referrer = document.referrer;
  const isDirectVisit = !referrer || referrer === '';
  
  if (!isLikelyQRCodeVisit(referrer, page)) {
    return;
  }
  
  // Get or create session ID
  let sessionId = sessionStorage.getItem('qr-session-id');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('qr-session-id', sessionId);
  }
  
  // Check if we already tracked this session for this page
  const trackingKey = `qr-tracked-${page}-${sessionId}`;
  if (sessionStorage.getItem(trackingKey)) {
    return; // Already tracked this session
  }
  
  // Mark as tracked
  sessionStorage.setItem(trackingKey, 'true');
  
  // Send tracking data
  const trackingData = {
    page,
    referrer: referrer || null,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    sessionId,
    isDirectVisit
  };
  
  // Send to analytics endpoint
  fetch('/api/analytics/qr-code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(trackingData),
  }).catch(error => {
    console.error('Failed to track QR code visit:', error);
  });
}

