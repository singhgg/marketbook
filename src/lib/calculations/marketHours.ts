/**
 * Market Hours Verification Engine
 * Determines whether specific financial exchanges are currently in regular trading hours.
 */

export interface MarketStatusInfo {
  isOpen: boolean;
  statusText: 'LIVE' | 'MARKET CLOSED' | 'PRE-MARKET' | 'AFTER-HOURS';
  sessionName: string;
  nextOpenTime?: string;
  timezone: string;
}

/**
 * Checks US Equity market hours (NYSE / NASDAQ)
 * Regular trading hours: 9:30 AM to 4:00 PM Eastern Time, Monday through Friday (excluding holidays)
 */
export function getUSEquityMarketStatus(now: Date = new Date()): MarketStatusInfo {
  // Format current time into US Eastern Time
  const etString = now.toLocaleString('en-US', { timeZone: 'America/New_York' });
  const etDate = new Date(etString);

  const dayOfWeek = etDate.getDay(); // 0 = Sunday, 6 = Saturday
  const hours = etDate.getHours();
  const minutes = etDate.getMinutes();
  const timeInMinutes = hours * 60 + minutes;

  // Weekend check
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return {
      isOpen: false,
      statusText: 'MARKET CLOSED',
      sessionName: 'Weekend Closed',
      timezone: 'US/Eastern',
    };
  }

  // Regular Hours: 9:30 AM (570 mins) to 4:00 PM (960 mins)
  const marketOpen = 9 * 60 + 30;
  const marketClose = 16 * 60;

  if (timeInMinutes >= marketOpen && timeInMinutes < marketClose) {
    return {
      isOpen: true,
      statusText: 'LIVE',
      sessionName: 'Regular Trading Hours',
      timezone: 'US/Eastern',
    };
  } else if (timeInMinutes >= 4 * 60 && timeInMinutes < marketOpen) {
    return {
      isOpen: false,
      statusText: 'PRE-MARKET',
      sessionName: 'Pre-Market Session',
      timezone: 'US/Eastern',
    };
  } else {
    return {
      isOpen: false,
      statusText: 'MARKET CLOSED',
      sessionName: 'After-Hours / Closed',
      timezone: 'US/Eastern',
    };
  }
}

/**
 * Checks Asset Market status based on assetType
 */
export function getAssetMarketStatus(assetType: string, now: Date = new Date()): MarketStatusInfo {
  if (assetType === 'CRYPTO' || assetType === 'NFT') {
    return {
      isOpen: true,
      statusText: 'LIVE',
      sessionName: '24/7 Global On-Chain Market',
      timezone: 'UTC',
    };
  }

  // Stocks, ETFs, and Indices follow regular exchange market hours
  return getUSEquityMarketStatus(now);
}
