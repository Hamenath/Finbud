'use client';

import { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '@/config/api';

export interface MarketTick {
  symbol: string;
  name: string;
  category: string;
  price: string;
  raw_price: number;
  change: string;
  change_percent: number;
  isPositive: boolean;
  tick_direction: 'UP' | 'DOWN' | 'FLAT' | 'INITIAL';
  timestamp: string;
}

export function useMarketTicks() {
  const [ticks, setTicks] = useState<MarketTick[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastTickTime, setLastTickTime] = useState<string>('');
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Convert http/https API_BASE_URL to ws/wss
    const getWsUrl = () => {
      try {
        const url = new URL(API_BASE_URL);
        const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
        return `${protocol}//${url.host}/ws/market-ticks`;
      } catch (err) {
        return 'ws://127.0.0.1:8000/ws/market-ticks';
      }
    };

    const connect = () => {
      if (!isMounted) return;
      const wsUrl = getWsUrl();
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!isMounted) return;
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        if (!isMounted) return;
        try {
          const payload = JSON.parse(event.data);
          if (payload.data && Array.isArray(payload.data)) {
            setTicks(payload.data);
            setLastTickTime(new Date().toLocaleTimeString());
          }
        } catch (err) {
          console.error('[Market Ticker WS Parse Error]', err);
        }
      };

      ws.onclose = () => {
        if (!isMounted) return;
        setIsConnected(false);
        // Attempt reconnection after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };

      ws.onerror = (err) => {
        ws.close();
      };
    };

    connect();

    return () => {
      isMounted = false;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  return { ticks, isConnected, lastTickTime };
}

