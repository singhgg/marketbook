# MARKETBOOK

> **Trade. Collect. Own.**  
> A full-stack cross-market financial platform and research terminal integrating Crypto, Equities, ETFs, Indices, IPOs, NFTs, and On-Chain Intelligence.

---

## 1. Overview & Vision

Traditional financial tools fragment market information: traders check one terminal for equities, another dashboard for crypto, an explorer for blockchain transactions, and an NFT marketplace for digital collectibles.

**MARKETBOOK** unifies all these asset classes into one cohesive, institutional-grade research terminal built with a distinctive **warm editorial financial aesthetic** (`#F6F1E8` parchment base, warm ivory, `#191B1D` ink, and deliberate asset-class accent colors).

Crucially, MARKETBOOK operates on a strict **workflow sequence**:
```
DISCOVER ASSET 
    ↓
SEE REAL MARKET DATA 
    ↓
PRICE UPDATES AUTOMATICALLY (LIVE)
    ↓
WHAT CHANGED? 
    ↓
POSSIBLE DRIVERS 
    ↓
ANOMALY DETECTION 
    ↓
MARKET REGIME (RISK-ON / RISK-OFF) 
    ↓
IMPACT GRAPH 
    ↓
CORRELATION LAB 
    ↓
THESIS BUILDER 
    ↓
SCENARIO LAB (HYPOTHETICAL STRESS TESTING) 
    ↓
WATCHLIST & ALERTS 
    ↓
PORTFOLIO REAL-TIME RECALCULATION
```

---

## 2. Real-Time Architecture

MARKETBOOK implements an uncompromising **true real-time architecture**:
- **Direct Binance WebSocket Integration**: The frontend connects directly to public Binance ticker feeds (`wss://stream.binance.com:9443/ws/...`) for low-latency live ticks (BTC, ETH, SOL, BNB, AVAX, LINK, NEAR) without requiring external API keys or exposing sensitive rate limits.
- **Server-Sent Events (SSE)**: The `/api/market/stream` endpoint continuously pushes macro ticks, alerts, and regime signals to connected clients.
- **Centralized State Management (Zustand)**: Granular subscriptions ensure that incoming price updates flash and re-render only the affected UI components (tickers, tables, charts, and portfolios) without triggering wasteful whole-page refreshes.
- **Honest Connection & Freshness Indicators**:
  - `● LIVE (Updated Xs ago)`: Real-time provider data stream actively ticking.
  - `● MARKET CLOSED`: Exchange hours enforced for US equities outside 9:30 AM - 4:00 PM ET.
  - `● DEMO DATA`: Explicitly communicated if fallback is active. Never masquerades demo data as live.

---

## 3. Product Features & Modules

### Cross-Market Universe
- **Crypto Terminal** (`/markets/crypto`): Rank, Symbol, Live Price, 24H, 7D, 30D, 24H Volume, Market Cap, Circulating Supply, and interactive 7-day sparklines.
- **Equities Universe** (`/markets/stocks`): Real-time ticker feeds, sector/industry filtering, 52-week ranges, P/E ratios, and strict NYSE/NASDAQ session verification.
- **ETFs & Baskets** (`/markets/etfs`): Track broad index proxies, spot trusts (IBIT, GLD), expense ratios, and AUM.
- **Global Indices** (`/markets/indices`): S&P 500, NASDAQ 100, NIFTY 50, SENSEX, Nikkei 225, DAX 40, and the proprietary MBX-50.
- **IPO Calendar** (`/ipos`): Pipeline tracking upcoming, filed, recently priced, and listed public debuts.
- **Universal Asset Page** (`/asset/[symbol]`): Dynamic interactive charts with 1D/7D/1M/1Y timeframes, volume overlays, key metrics, and diagnostic signals.
- **Universal Search**: Global shortcut (`/` or `Cmd/Ctrl + K`) querying across crypto, equities, ETFs, IPOs, NFTs, collections, and Ethereum wallet addresses (`0x...`).

### Market Intelligence Suite
- **&ldquo;What Changed?&rdquo;** (`/intelligence`): Systematic breakdown of market displacements: *What Changed? &rarr; Possible Drivers &rarr; Observed Signals &rarr; Why It May Matter*.
- **Market Regime Classifier** (`/intelligence/regime`): Quantitative multi-factor detection determining whether the macro state is **RISK-ON**, **RISK-OFF**, **NEUTRAL**, or **HIGH VOLATILITY**.
- **Anomaly Engine** (`/intelligence/anomalies`): Statistical z-score outlier detection identifying volume spikes (>2.2&times; average), 2-sigma volatility breaches, and price/volume divergences.
- **MBX-50 Composite** (`/indices/mbx-50`): Proprietary 50-asset weighted benchmark with live attribution of top performance contributors and detractors.
- **Impact Graph** (`/intelligence/impact`): Interactive SVG network mapping rolling relationships and correlation edge strengths.
- **Correlation Lab** (`/compare`): Heatmapped Pearson correlation matrix across 1D, 1W, 1M, 3M, 1Y horizons.

### Personal Research Workspace & Execution
- **Thesis Builder** (`/thesis`): Hypotheses formulation with supporting/contradicting evidence and lifecycle statuses (`OPEN`, `SUPPORTED`, `WEAKENING`, `INVALIDATED`).
- **Scenario Lab** (`/portfolio/scenarios`): Hypothetical stress testing under Bull (+25%/+35%), Bear (-22%/-28%), Base (+5%/+6%), or custom asset shocks.
- **Live Portfolio Tracker** (`/portfolio`): Mark-to-market total valuation, 24H P&L, unrealized gain/loss, and asset allocation recalculating on live tick arrival.
- **Multi-Watchlist Workspace** (`/watchlist`): Dedicated thematic watchlists with custom research notes and live prices.
- **Real-Time Alert Engine** (`/alerts`): Autonomous condition rules evaluated continuously against incoming tick streams.
- **Cross-Market Heatmap** (`/heatmap`): Visual tiles color-coded in deep emerald, muted green, warm neutral, and deep crimson.

### Web3, NFTs & Smart Contracts
- **NFT Marketplace** (`/nfts` & `/nfts/[contract]/[tokenId]`): Curated digital artifacts, trait rarities, and non-custodial buy/offer actions.
- **Collections Ranking** (`/collections` & `/collections/[slug]`): Floor price tracking, 24H volume, and owner statistics.
- **5-Step Minting Studio** (`/create`): Artwork upload, metadata configuration, trait definitions, preview, and cryptographic transaction lifecycle (`Preparing` &rarr; `Waiting for Signature` &rarr; `Submitted` &rarr; `Confirming` &rarr; `Confirmed`).
- **On-Chain Activity Stream** (`/activity`): Public ledger monitoring of `SALE`, `LISTING`, `OFFER`, `TRANSFER`, and `MINT` events with Etherscan transaction hashes.
- **Smart Contracts** (`contracts/`):
  - `MarketBookNFT.sol`: OpenZeppelin ERC-721 + ERC-2981 royalty standard.
  - `MarketBookMarketplace.sol`: Reentrancy-guarded non-custodial marketplace with atomic buying, offers, platform fees, and royalty distribution.
- **Sign-In with Ethereum (SIWE)**: Cryptographic EIP-4361 authentication via `/api/auth/nonce` and `/api/auth/verify`.

---

## 4. Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Zustand 4.5
- **Styling**: Vanilla CSS Modules & Custom Design System (Warm Editorial Palette)
- **Database**: Prisma ORM with SQLite (local development) / PostgreSQL (production)
- **Real-Time Layer**: Native WebSocket client (Binance Stream) + Server-Sent Events (SSE)
- **Smart Contracts**: Solidity 0.8.20, OpenZeppelin Contracts (ERC-721, ERC-2981, ReentrancyGuard)
- **Testing**: Vitest 2.1 automated unit and integration suite

---

## 5. Getting Started Locally

### Prerequisites
- Node.js 18.x or 20.x+
- npm 9.x+ or yarn

### Installation
```bash
# 1. Clone repository
git clone https://github.com/your-org/marketbook.git
cd marketbook

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env

# 4. Initialize and seed database
npx prisma generate
npx prisma db push
npx ts-node prisma/seed.ts

# 5. Run automated test suite
npm run test

# 6. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Contract Intelligence

> **"Don’t just trust the badge. Inspect what is actually deployed."**

A contract being verified on Etherscan or block explorers is useful, but verification alone is **not** a complete security guarantee. Contracts can be upgradeable proxies, depend on unverified composable contracts, or contain privileged administrative backdoors.

MarketBook’s **Contract Intelligence** (`/contract-intelligence`) addresses this gap by analyzing both **Verified Source Code** and **Deployed Runtime Bytecode**:

- **Tri-View Code Inspection**:
  - **VERIFIED SOURCE**: Compiler version, optimization flags, multi-file Solidity viewer, and compiler bytecode matching.
  - **DEPLOYED BYTECODE**: Raw bytecode hex, SHA-256 hash, and full EVM opcode disassembler table with Program Counter (PC) offsets.
  - **DECOMPILED LOGIC**: EVM reconstructed control-flow pseudo-code with explicit disclaimers: *"Decompiled from deployed bytecode. This is an approximation of contract logic and is NOT the original source code."*
- **Proxy Detection & Storage Resolution**:
  - Detects EIP-1967 implementation, admin, and beacon slots.
  - Detects EIP-1167 Minimal Proxy (Clone) bytecode patterns and custom proxy patterns (e.g. FiatToken).
  - Automatically queries and disassembles the underlying implementation contract.
- **Evidence-Based Technical Risk Signals**:
  - Evaluates indicators across `INFO`, `LOW`, `MEDIUM`, and `HIGH` severities (e.g. `UPGRADE_AUTHORITY_DETECTED`, `EXTERNAL_DELEGATECALL_DETECTED`, `SELFDESTRUCT_DETECTED`, `PRIVILEGED_OWNER_DETECTED`, `PAUSE_CONTROL_DETECTED`).
  - Every flag includes: **What We Found**, **Why It Matters**, and **Evidence**.
- **Privileged Permissions Matrix**:
  - Detects real on-chain addresses for Owner, Admin, Upgrade Authority, Mint Authority, and Pause Authority. Never guesses addresses—explicitly outputs `NOT DETERMINED` if undetectable.
- **On-Chain Activity**:
  - Displays real, verified transactions fetched from public nodes and Blockscout APIs with method names, values, and timestamps.

> **Disclaimer**: *MarketBook Contract Intelligence provides automated technical analysis based on publicly available blockchain data. It is not a professional smart-contract security audit and cannot guarantee contract safety or absence of vulnerabilities.*

---

## 6. Verification & Automated Testing

MarketBook features unit and integration test coverage for all core calculations:
```bash
npm run test
```
Tests verify:
- MBX-50 weighted index calculations and contributor/detractor attribution.
- Market Regime multi-factor classification criteria.
- Anomaly Engine statistical outlier conditions.
- Pearson cross-asset correlation matrix math.
- Scenario Lab portfolio shock projections.
- Real-time portfolio mark-to-market P&L recalculations.
- Market hours enforcement for equities vs 24/7 crypto.
- Smart contract structure and marketplace fee/royalty distribution logic.

---

## 7. Deployment Configuration

MarketBook is ready for zero-friction cloud deployment:
- **Next.js Web Application**: Deploy directly to **Vercel** (`vercel deploy`).
- **Database**: Set `DATABASE_URL` to a PostgreSQL instance on **Neon**, **Supabase**, or **Railway**.
- **IPFS Storage**: Supply `PINATA_API_KEY` and `PINATA_API_SECRET` for production IPFS pinning.
- **Smart Contracts**: Deploy `contracts/MarketBookNFT.sol` and `contracts/MarketBookMarketplace.sol` using Hardhat or Foundry to Ethereum Sepolia / Mainnet and update `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS` and `NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS`.

---

## 8. License & Disclaimers

&copy; MarketBook Inc. All rights reserved.  
*Disclaimer: MarketBook is an analytical and research platform. Data and calculations are provided for educational and personal research purposes only and should never be construed as investment, tax, or financial advice. Correlation does not imply causation.*
