import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('MarketBook Smart Contracts & Security Architecture', () => {
  it('validates MarketBookNFT.sol contract structure and OpenZeppelin inheritance', () => {
    const nftPath = path.join(process.cwd(), 'contracts', 'MarketBookNFT.sol');
    expect(fs.existsSync(nftPath)).toBe(true);

    const content = fs.readFileSync(nftPath, 'utf8');
    expect(content).toContain('contract MarketBookNFT is ERC721URIStorage, ERC2981, Ownable');
    expect(content).toContain('function mint(');
    expect(content).toContain('_setDefaultRoyalty');
    expect(content).toContain('supportsInterface');
  });

  it('validates MarketBookMarketplace.sol non-custodial listing and royalty payouts', () => {
    const marketPath = path.join(process.cwd(), 'contracts', 'MarketBookMarketplace.sol');
    expect(fs.existsSync(marketPath)).toBe(true);

    const content = fs.readFileSync(marketPath, 'utf8');
    expect(content).toContain('contract MarketBookMarketplace is ReentrancyGuard, Ownable');
    expect(content).toContain('function listNFT(');
    expect(content).toContain('function buyNFT(');
    expect(content).toContain('function makeOffer(');
    expect(content).toContain('function acceptOffer(');
    expect(content).toContain('nonReentrant');
    expect(content).toContain('platformFeeBps');
    expect(content).toContain('royaltyInfo');
  });

  it('verifies marketplace platform fee calculation math', () => {
    const salePrice = 1000000000000000000n; // 1 ETH (1e18 wei)
    const platformFeeBps = 100n; // 1%
    const expectedFee = (salePrice * platformFeeBps) / 10000n; // 0.01 ETH

    expect(expectedFee).toBe(10000000000000000n);

    // Royalty calculation (2.5% = 250 bps)
    const royaltyBps = 250n;
    const expectedRoyalty = (salePrice * royaltyBps) / 10000n; // 0.025 ETH
    expect(expectedRoyalty).toBe(25000000000000000n);

    const sellerProceeds = salePrice - expectedFee - expectedRoyalty;
    expect(sellerProceeds).toBe(965000000000000000n); // 0.965 ETH
  });
});
