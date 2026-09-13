'use client';

import React, { useEffect, useRef } from 'react';
import { useMarketStore } from '@/lib/store';
import { LiveTick } from '@/lib/types/market';

const BINANCE_STREAM_URL =
  'wss://stream.binance.com:9443/ws/btcusdt@ticker/ethusdt@ticker/solusdt@ticker/bnbusdt@ticker/avaxusdt@ticker/linkusdt@ticker/nearusdt@ticker';

const SYMBOL_MAP: Record<string, string> = {
  BTCUSDT: 'BTC',
  ETHUSDT: 'ETH',
  SOLUSDT: 'SOL',
  BNBUSDT: 'BNB',
  AVAXUSDT: 'AVAX',
  LINKUSDT: 'LINK',
  NEARUSDT: 'NEAR',
};

export function RealTimeProvider({ children }: { children: React.ReactNode }) {
  const setInitialAssets = useMarketStore((s) => s.setInitialAssets);
  const updateTick = useMarketStore((s) => s.updateTick);
  const setConnectionStatus = useMarketStore((s) => s.setConnectionStatus);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Initial assets fetch from database
  useEffect(() => {
    async function loadAssets() {
      try {
        const res = await fetch('/api/market/assets');
        if (res.ok) {
          const data = await res.json();
          setInitialAssets(data.assets || []);
        }
      } catch (err) {
        console.warn('Could not load initial assets from API:', err);
      }
    }
    loadAssets();
  }, [setInitialAssets]);

  // 2. Real-time Crypto WebSocket connection to Binance Stream
  useEffect(() => {
    let isSubscribed = true;

    function connectWs() {
      if (!isSubscribed) return;

      try {
        setConnectionStatus('CONNECTING');
        const ws = new WebSocket(BINANCE_STREAM_URL);
        wsRef.current = ws;

        ws.onopen = () => {
          if (!isSubscribed) return;
          setConnectionStatus('LIVE');
        };

        ws.onmessage = (event) => {
          if (!isSubscribed) return;
          try {
            const data = JSON.parse(event.data);
            const rawSymbol = data.s; // e.g. BTCUSDT
            const mappedSymbol = SYMBOL_MAP[rawSymbol];

            if (mappedSymbol) {
              const price = parseFloat(data.c);
              const change24h = parseFloat(data.P);
              const volume24h = parseFloat(data.q);

              const tick: LiveTick = {
                symbol: mappedSymbol,
                price,
                change24h,
                volume24h,
                timestamp: Date.now(),
              };

              updateTick(tick);
            }
          } catch (err) {
            console.error('Error parsing live tick stream:', err);
          }
        };

        ws.onerror = () => {
          if (!isSubscribed) return;
          setConnectionStatus('RECONNECTING');
        };

        ws.onclose = () => {
          if (!isSubscribed) return;
          setConnectionStatus('RECONNECTING');
          reconnectTimeoutRef.current = setTimeout(() => {
            connectWs();
          }, 3000);
        };
      } catch (err) {
        console.error('WebSocket connection error:', err);
        setConnectionStatus('DEMO');
      }
    }

    connectWs();

    return () => {
      isSubscribed = false;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [setConnectionStatus, updateTick]);

  // 3. Connect to SSE stream for stocks, alerts, regime, and macro events
  useEffect(() => {
    let eventSource: EventSource | null = null;
    let isCancelled = false;

    try {
      eventSource = new EventSource('/api/market/stream');

      eventSource.onmessage = (e) => {
        if (isCancelled) return;
        try {
          const payload = JSON.parse(e.data);
          if (payload.type === 'TICK' && payload.tick) {
            updateTick(payload.tick);
          }
        } catch {
          // Handled gracefully
        }
      };

      eventSource.onerror = () => {
        // SSE error or reconnection handled automatically by browser EventSource
      };
    } catch {
      // EventSource not supported or unavailable
    }

    return () => {
      isCancelled = true;
      if (eventSource) eventSource.close();
    };
  }, [updateTick]);

  return <>{children}</>;
}
