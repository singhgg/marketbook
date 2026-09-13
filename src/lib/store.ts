import { create } from 'zustand';
import { MarketAsset, LiveTick, ConnectionStatus } from './types/market';
import { calculateMBX50, IndexConstituent } from './calculations/mbx50';

interface AlertItem {
  id: string;
  symbol: string;
  condition: string;
  threshold: number;
  triggered: boolean;
}

interface MarketState {
  assets: Record<string, MarketAsset>;
  liveTicks: Record<string, LiveTick>;
  tickDirections: Record<string, 'UP' | 'DOWN' | 'NONE'>;
  connectionStatus: ConnectionStatus;
  lastUpdated: number;
  activeAlerts: AlertItem[];
  triggeredAlerts: string[];
  wsConnected: boolean;

  // Actions
  setInitialAssets: (assets: MarketAsset[]) => void;
  updateTick: (tick: LiveTick) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setAlerts: (alerts: AlertItem[]) => void;
  dismissAlert: (id: string) => void;
  getMBX50Data: () => ReturnType<typeof calculateMBX50>;
}

export const useMarketStore = create<MarketState>((set, get) => ({
  assets: {},
  liveTicks: {},
  tickDirections: {},
  connectionStatus: 'CONNECTING',
  lastUpdated: Date.now(),
  activeAlerts: [
    { id: 'alt_1', symbol: 'BTC', condition: 'GREATER_THAN', threshold: 65000, triggered: false },
    { id: 'alt_2', symbol: 'ETH', condition: 'LESS_THAN', threshold: 3400, triggered: false },
  ],
  triggeredAlerts: [],
  wsConnected: false,

  setInitialAssets: (assetsList) => {
    const assetsMap: Record<string, MarketAsset> = {};
    const ticksMap: Record<string, LiveTick> = {};

    assetsList.forEach((asset) => {
      assetsMap[asset.symbol] = asset;
      ticksMap[asset.symbol] = {
        symbol: asset.symbol,
        price: asset.price,
        change24h: asset.change24h,
        volume24h: asset.volume24h,
        timestamp: Date.now(),
      };
    });

    set({
      assets: assetsMap,
      liveTicks: ticksMap,
      connectionStatus: 'LIVE',
      lastUpdated: Date.now(),
    });
  },

  updateTick: (tick) => {
    const currentTicks = get().liveTicks;
    const previousTick = currentTicks[tick.symbol];
    let direction: 'UP' | 'DOWN' | 'NONE' = 'NONE';

    if (previousTick) {
      if (tick.price > previousTick.price) direction = 'UP';
      else if (tick.price < previousTick.price) direction = 'DOWN';
    }

    const currentAssets = get().assets;
    const updatedAsset = currentAssets[tick.symbol]
      ? {
          ...currentAssets[tick.symbol],
          price: tick.price,
          change24h: tick.change24h ?? currentAssets[tick.symbol].change24h,
          volume24h: tick.volume24h ?? currentAssets[tick.symbol].volume24h,
          lastUpdated: new Date().toISOString(),
        }
      : undefined;

    // Check alerts
    const activeAlerts = get().activeAlerts;
    const triggeredAlerts = [...get().triggeredAlerts];

    activeAlerts.forEach((alert) => {
      if (alert.symbol === tick.symbol) {
        let isTriggered = false;
        if (alert.condition === 'GREATER_THAN' && tick.price >= alert.threshold) isTriggered = true;
        if (alert.condition === 'LESS_THAN' && tick.price <= alert.threshold) isTriggered = true;

        if (isTriggered && !triggeredAlerts.includes(alert.id)) {
          triggeredAlerts.push(alert.id);
        }
      }
    });

    set((state) => ({
      liveTicks: {
        ...state.liveTicks,
        [tick.symbol]: tick,
      },
      assets: updatedAsset
        ? {
            ...state.assets,
            [tick.symbol]: updatedAsset,
          }
        : state.assets,
      tickDirections: {
        ...state.tickDirections,
        [tick.symbol]: direction,
      },
      triggeredAlerts,
      lastUpdated: Date.now(),
      connectionStatus: 'LIVE',
      wsConnected: true,
    }));

    // Reset subtle tick direction flash after 1200ms
    if (direction !== 'NONE') {
      setTimeout(() => {
        set((state) => ({
          tickDirections: {
            ...state.tickDirections,
            [tick.symbol]: 'NONE',
          },
        }));
      }, 1200);
    }
  },

  setConnectionStatus: (status) => set({ connectionStatus: status }),

  setAlerts: (alerts) => set({ activeAlerts: alerts }),

  dismissAlert: (id) =>
    set((state) => ({
      triggeredAlerts: state.triggeredAlerts.filter((aId) => aId !== id),
    })),

  getMBX50Data: () => {
    const assets = get().assets;
    const constituents: IndexConstituent[] = [
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        category: 'CRYPTO',
        weight: 0.22,
        currentPrice: assets['BTC']?.price ?? 64250,
        change24h: assets['BTC']?.change24h ?? 2.34,
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        category: 'CRYPTO',
        weight: 0.14,
        currentPrice: assets['ETH']?.price ?? 3480,
        change24h: assets['ETH']?.change24h ?? -1.15,
      },
      {
        symbol: 'NVDA',
        name: 'NVIDIA Corp',
        category: 'EQUITY',
        weight: 0.12,
        currentPrice: assets['NVDA']?.price ?? 119.5,
        change24h: assets['NVDA']?.change24h ?? 3.12,
      },
      {
        symbol: 'AAPL',
        name: 'Apple Inc',
        category: 'EQUITY',
        weight: 0.1,
        currentPrice: assets['AAPL']?.price ?? 224.3,
        change24h: assets['AAPL']?.change24h ?? -0.45,
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft',
        category: 'EQUITY',
        weight: 0.1,
        currentPrice: assets['MSFT']?.price ?? 432.8,
        change24h: assets['MSFT']?.change24h ?? 1.05,
      },
      {
        symbol: 'SOL',
        name: 'Solana',
        category: 'CRYPTO',
        weight: 0.08,
        currentPrice: assets['SOL']?.price ?? 152.8,
        change24h: assets['SOL']?.change24h ?? 5.82,
      },
      {
        symbol: 'GLD',
        name: 'Gold Trust',
        category: 'COMMODITY',
        weight: 0.08,
        currentPrice: assets['GLD']?.price ?? 236.8,
        change24h: assets['GLD']?.change24h ?? 0.65,
      },
      {
        symbol: 'AMZN',
        name: 'Amazon',
        category: 'EQUITY',
        weight: 0.06,
        currentPrice: assets['AMZN']?.price ?? 186.4,
        change24h: assets['AMZN']?.change24h ?? 0.85,
      },
      {
        symbol: 'LINK',
        name: 'Chainlink',
        category: 'INFRASTRUCTURE',
        weight: 0.05,
        currentPrice: assets['LINK']?.price ?? 14.15,
        change24h: assets['LINK']?.change24h ?? 3.4,
      },
      {
        symbol: 'PLTR',
        name: 'Palantir',
        category: 'EQUITY',
        weight: 0.05,
        currentPrice: assets['PLTR']?.price ?? 36.8,
        change24h: assets['PLTR']?.change24h ?? 6.4,
      },
    ];

    return calculateMBX50(constituents);
  },
}));
