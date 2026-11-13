'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getMarketWebSocketUrl, API_ENDPOINTS } from '@/config/api';

export type MarketStatus = 'LIVE' | 'DELAYED' | 'MARKET_CLOSED' | 'DAILY_NAV' | 'STALE' | 'UNAVAILABLE';
export type ConnectionState = 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'RECONNECTING';

export interface MarketTick {
  symbol: string;
  name: string;
  category: string;
  price: string;
  raw_price: number;
  previous_price: string;
  price_change: string;
  change: string;
  change_percent: number;
  isPositive: boolean;
  status: MarketStatus;
  market_status?: string;
  freshness?: string;
  delay_verification?: string;
  provider: string;
  upstream_frequency?: string;
  currency: string;
  unit: string;
  provider_timestamp?: string;
  received_timestamp?: string;
  broadcast_timestamp?: string;
  market_hours: string;
  tick_direction: 'UP' | 'DOWN' | 'FLAT';
  pricing_mode?: string;
  official_amfi_nav?: string;
}

export function useMarketTicks() {
  const [ticks, setTicks] = useState<MarketTick[]>([]);
  const [connectionState, setConnectionState] = useState<ConnectionState>('CONNECTING');
  const [lastTickTime, setLastTickTime] = useState<string>('');
  const [isUsingRestFallback, setIsUsingRestFallback] = useState<boolean>(false);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef<number>(0);
  const isComponentMounted = useRef<boolean>(true);

  // Fallback REST polling mechanism: Invoked when WebSocket cannot connect or disconnects
  const fetchRestTickers = useCallback(async () => {
    try {
      const res = await fetch(API_ENDPOINTS.marketTickers, {
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0 && isComponentMounted.current) {
        setTicks(data);
        setLastTickTime(new Date().toLocaleTimeString());
        setIsUsingRestFallback(true);
      }
    } catch (err) {
      console.warn('[FINBUD REST Fallback Fetch Warning]:', err);
    }
  }, []);

  const startRestPolling = useCallback(() => {
    if (pollIntervalRef.current) return;
    fetchRestTickers(); // Immediate initial fetch
    pollIntervalRef.current = setInterval(fetchRestTickers, 5000); // Poll every 5 seconds
  }, [fetchRestTickers]);

  const stopRestPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    setIsUsingRestFallback(false);
  }, []);

  const scheduleReconnect = useCallback(() => {
    if (!isComponentMounted.current) return;
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);

    // Exponential backoff with jitter: min 1s, max 15s + random jitter
    const attempts = reconnectAttemptsRef.current;
    const baseDelay = Math.min(1000 * Math.pow(1.5, attempts), 15000);
    const jitter = Math.random() * 800;
    const delay = Math.round(baseDelay + jitter);

    reconnectAttemptsRef.current += 1;

    reconnectTimeoutRef.current = setTimeout(() => {
      connect();
    }, delay);
  }, []);

  const connect = useCallback(() => {
    // Prevent duplicate active connections
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    if (!isComponentMounted.current) return;

    setConnectionState(reconnectAttemptsRef.current > 0 ? 'RECONNECTING' : 'CONNECTING');

    const wsUrl = getMarketWebSocketUrl();
    let ws: WebSocket;

    try {
      ws = new WebSocket(wsUrl);
      wsRef.current = ws;
    } catch (err) {
      console.warn('[FINBUD WebSocket Init Failure - Engaging REST Fallback]:', err);
      startRestPolling();
      scheduleReconnect();
      return;
    }

    ws.onopen = () => {
      if (!isComponentMounted.current) {
        ws.close();
        return;
      }
      setConnectionState('CONNECTED');
      reconnectAttemptsRef.current = 0; // Reset backoff on successful handshake
      stopRestPolling(); // Stop polling while WebSocket is cleanly connected
    };

    ws.onmessage = (event) => {
      if (!isComponentMounted.current) return;
      try {
        const payload = JSON.parse(event.data);
        if (payload.data && Array.isArray(payload.data)) {
          setTicks(payload.data);
          setLastTickTime(new Date().toLocaleTimeString());
        }
      } catch (err) {
        console.error('[FINBUD Market Stream Parse Error]:', err);
      }
    };

    ws.onclose = (event) => {
      if (!isComponentMounted.current) return;
      setConnectionState('DISCONNECTED');
      wsRef.current = null;
      // Start REST polling fallback immediately so UI always has real quotes
      startRestPolling();
      // Do not reconnect if the server intentionally rejected with policy code 1008
      if (event.code !== 1008) {
        scheduleReconnect();
      }
    };

    ws.onerror = () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [scheduleReconnect, startRestPolling, stopRestPolling]);

  useEffect(() => {
    isComponentMounted.current = true;
    connect();

    return () => {
      isComponentMounted.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      stopRestPolling();
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounted');
        wsRef.current = null;
      }
    };
  }, [connect, stopRestPolling]);

  return {
    ticks,
    connectionState,
    isConnected: connectionState === 'CONNECTED',
    isUsingRestFallback,
    lastTickTime
  };
}
