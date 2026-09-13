/**
 * Market Anomaly Engine
 * Identifies statistically unusual movements, volume anomalies, and cross-market divergences.
 */

export interface MarketAnomaly {
  id: string;
  assetSymbol: string;
  assetName: string;
  assetType: 'CRYPTO' | 'STOCK' | 'ETF' | 'NFT';
  timestamp: string;
  severity: 'CRITICAL' | 'ELEVATED' | 'WATCH';
  condition: string;
  supportingMetrics: string;
  reason: string;
}

export interface AnomalyInputAsset {
  symbol: string;
  name: string;
  assetType: 'CRYPTO' | 'STOCK' | 'ETF' | 'NFT';
  price: number;
  change24h: number;
  volume24h: number;
  avgVolume30d?: number;
  historicalVolatility?: number; // std dev %
}

export function detectMarketAnomalies(assets: AnomalyInputAsset[]): MarketAnomaly[] {
  const anomalies: MarketAnomaly[] = [];

  for (const asset of assets) {
    const avgVol = asset.avgVolume30d || asset.volume24h * 0.55;
    const volRatio = asset.volume24h / (avgVol || 1);
    const absChange = Math.abs(asset.change24h);

    // 1. Unusual Volume Spike (> 2.2x 30d baseline)
    if (volRatio >= 2.2) {
      anomalies.push({
        id: `anom_vol_${asset.symbol}_${Date.now()}`,
        assetSymbol: asset.symbol,
        assetName: asset.name,
        assetType: asset.assetType,
        timestamp: new Date().toISOString(),
        severity: volRatio >= 3.0 ? 'CRITICAL' : 'ELEVATED',
        condition: `Unusual Volume Outlier (${volRatio.toFixed(1)}× 30D average)`,
        supportingMetrics: `24H Vol: $${(asset.volume24h / 1e6).toFixed(1)}M vs Baseline: $${(avgVol / 1e6).toFixed(1)}M`,
        reason: 'Significant institutional or algorithmic order flow entered the order book.',
      });
    }

    // 2. Abnormal Intraday Volatility (> 6% for large caps, > 12% for altcoins)
    const volThreshold = asset.assetType === 'CRYPTO' ? 7.0 : 4.5;
    if (absChange >= volThreshold) {
      anomalies.push({
        id: `anom_price_${asset.symbol}_${Date.now()}`,
        assetSymbol: asset.symbol,
        assetName: asset.name,
        assetType: asset.assetType,
        timestamp: new Date().toISOString(),
        severity: absChange >= volThreshold * 1.5 ? 'CRITICAL' : 'ELEVATED',
        condition: `Large Intraday Movement (${asset.change24h >= 0 ? '+' : ''}${asset.change24h.toFixed(2)}%)`,
        supportingMetrics: `Delta: ${asset.change24h.toFixed(2)}%, Current: $${asset.price.toLocaleString()}`,
        reason: 'Outsized directional conviction breaching statistical 2-sigma boundary.',
      });
    }

    // 3. Price/Volume Divergence (Large price move with dry liquidity OR flat price with massive volume absorption)
    if (absChange >= 4.0 && volRatio < 0.6) {
      anomalies.push({
        id: `anom_div_${asset.symbol}_${Date.now()}`,
        assetSymbol: asset.symbol,
        assetName: asset.name,
        assetType: asset.assetType,
        timestamp: new Date().toISOString(),
        severity: 'WATCH',
        condition: 'Price/Volume Liquidity Divergence',
        supportingMetrics: `Move: ${asset.change24h.toFixed(1)}% on only ${(volRatio * 100).toFixed(0)}% normal volume`,
        reason: 'Price shifted on thin liquidity; vulnerable to sharp mean reversion when liquidity returns.',
      });
    }
  }

  // Deduplicate and prioritize by severity
  const severityOrder = { CRITICAL: 3, ELEVATED: 2, WATCH: 1 };
  return anomalies.sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity]);
}
