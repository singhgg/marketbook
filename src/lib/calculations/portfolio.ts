/**
 * Portfolio Analytics & Real-Time Valuation Engine
 * Recalculates total values, P&L, and category exposures dynamically as market prices stream in.
 */

export interface PortfolioHoldingInput {
  id: string;
  assetId: string;
  symbol: string;
  name: string;
  assetType: 'CRYPTO' | 'STOCK' | 'ETF' | 'NFT';
  quantity: number;
  averageCost: number;
  currentPrice: number;
  change24h: number;
}

export interface ComputedHolding {
  id: string;
  symbol: string;
  name: string;
  assetType: 'CRYPTO' | 'STOCK' | 'ETF' | 'NFT';
  quantity: number;
  averageCost: number;
  currentPrice: number;
  change24h: number;
  totalCost: number;
  currentValue: number;
  unrealizedPnL: number;
  unrealizedPnLPct: number;
  weightPct: number;
}

export interface PortfolioValuation {
  totalValue: number;
  totalCost: number;
  unrealizedPnL: number;
  unrealizedPnLPct: number;
  change24hValue: number;
  change24hPct: number;
  cryptoValue: number;
  stockValue: number;
  etfValue: number;
  nftValue: number;
  holdings: ComputedHolding[];
}

export function computePortfolioValuation(holdings: PortfolioHoldingInput[]): PortfolioValuation {
  let totalValue = 0;
  let totalCost = 0;
  let change24hValue = 0;
  let cryptoValue = 0;
  let stockValue = 0;
  let etfValue = 0;
  let nftValue = 0;

  // First pass to calculate totals
  const initialComputed = holdings.map((h) => {
    const cost = h.quantity * h.averageCost;
    const value = h.quantity * h.currentPrice;
    const pnl = value - cost;
    const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;
    const dayDollarChange = value * (h.change24h / 100);

    totalValue += value;
    totalCost += cost;
    change24hValue += dayDollarChange;

    if (h.assetType === 'CRYPTO') cryptoValue += value;
    else if (h.assetType === 'STOCK') stockValue += value;
    else if (h.assetType === 'ETF') etfValue += value;
    else if (h.assetType === 'NFT') nftValue += value;

    return {
      id: h.id,
      symbol: h.symbol,
      name: h.name,
      assetType: h.assetType,
      quantity: h.quantity,
      averageCost: h.averageCost,
      currentPrice: h.currentPrice,
      change24h: h.change24h,
      totalCost: Number(cost.toFixed(2)),
      currentValue: Number(value.toFixed(2)),
      unrealizedPnL: Number(pnl.toFixed(2)),
      unrealizedPnLPct: Number(pnlPct.toFixed(2)),
      weightPct: 0,
    };
  });

  // Second pass to calculate weights
  const finalHoldings: ComputedHolding[] = initialComputed.map((h) => ({
    ...h,
    weightPct: totalValue > 0 ? Number(((h.currentValue / totalValue) * 100).toFixed(1)) : 0,
  }));

  const unrealizedPnL = totalValue - totalCost;
  const unrealizedPnLPct = totalCost > 0 ? (unrealizedPnL / totalCost) * 100 : 0;
  const change24hPct = totalValue > 0 ? (change24hValue / totalValue) * 100 : 0;

  return {
    totalValue: Number(totalValue.toFixed(2)),
    totalCost: Number(totalCost.toFixed(2)),
    unrealizedPnL: Number(unrealizedPnL.toFixed(2)),
    unrealizedPnLPct: Number(unrealizedPnLPct.toFixed(2)),
    change24hValue: Number(change24hValue.toFixed(2)),
    change24hPct: Number(change24hPct.toFixed(2)),
    cryptoValue: Number(cryptoValue.toFixed(2)),
    stockValue: Number(stockValue.toFixed(2)),
    etfValue: Number(etfValue.toFixed(2)),
    nftValue: Number(nftValue.toFixed(2)),
    holdings: finalHoldings.sort((a, b) => b.currentValue - a.currentValue),
  };
}
