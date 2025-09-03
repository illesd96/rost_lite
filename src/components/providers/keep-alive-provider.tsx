'use client';

import { useEffect, useRef } from 'react';

const KEEP_ALIVE_INTERVAL = 15 * 60 * 1000; // 15 minutes
const STORAGE_KEY = 'webshop-last-ping';
const CHANNEL_NAME = 'webshop-keepalive';

export function KeepAliveProvider({ children }: { children: React.ReactNode }) {
  const intervalRef = useRef<NodeJS.Timeout>();
  const channelRef = useRef<BroadcastChannel>();

  const pingServer = async () => {
    try {
      await fetch('/api/ping', { method: 'POST' });
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
      
      // Notify other tabs
      if (channelRef.current) {
        channelRef.current.postMessage({ type: 'ping', timestamp: Date.now() });
      }
    } catch (error) {
      console.warn('Keep-alive ping failed:', error);
    }
  };

  const shouldPing = () => {
    const lastPing = localStorage.getItem(STORAGE_KEY);
    if (!lastPing) return true;
    
    const timeSinceLastPing = Date.now() - parseInt(lastPing);
    return timeSinceLastPing > KEEP_ALIVE_INTERVAL;
  };

  useEffect(() => {
    // Initialize BroadcastChannel for cross-tab communication
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      channelRef.current = new BroadcastChannel(CHANNEL_NAME);
      
      channelRef.current.onmessage = (event) => {
        if (event.data.type === 'ping') {
          // Another tab pinged, update our local storage
          localStorage.setItem(STORAGE_KEY, event.data.timestamp.toString());
        }
      };
    }

    // Initial ping if needed
    if (shouldPing()) {
      pingServer();
    }

    // Set up interval
    intervalRef.current = setInterval(() => {
      if (shouldPing()) {
        pingServer();
      }
    }, KEEP_ALIVE_INTERVAL);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (channelRef.current) {
        channelRef.current.close();
      }
    };
  }, []);

  return <>{children}</>;
}
