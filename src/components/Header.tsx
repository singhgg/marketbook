'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Wallet, ChevronDown, Activity, Sparkles, BookOpen, Layers } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { SearchModal } from './SearchModal';
import { WalletModal } from './WalletModal';

export function Header() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Keyboard shortcut listener for '/' and 'Cmd/Ctrl + K'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { href: '/', label: 'Overview' },
    { href: '/markets/crypto', label: 'Crypto' },
    { href: '/markets/stocks', label: 'Stocks' },
    { href: '/markets/etfs', label: 'ETFs' },
    { href: '/markets/indices', label: 'Indices' },
    { href: '/ipos', label: 'IPOs' },
    { href: '/indices/mbx-50', label: 'MBX-50' },
    { href: '/intelligence', label: 'Intelligence' },
    { href: '/heatmap', label: 'Heatmap' },
    { href: '/compare', label: 'Compare' },
    { href: '/thesis', label: 'Thesis' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/nfts', label: 'NFTs' },
    { href: '/contract-intelligence', label: 'Contract Intel' },
  ];

  return (
    <>
      <header
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-primary)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: '1600px',
            margin: '0 auto',
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          {/* Brand Logo & Tagline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '18px',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  color: 'var(--ink-primary)',
                }}
              >
                MARKETBOOK
              </span>
              <span
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-tertiary)',
                  fontWeight: 600,
                }}
              >
                Trade. Collect. Own.
              </span>
            </Link>

            <StatusBadge />
          </div>

          {/* Search Trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-primary)',
              borderRadius: '4px',
              color: 'var(--ink-secondary)',
              fontSize: '12px',
              minWidth: '240px',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Search size={14} color="var(--ink-tertiary)" />
              <span>Search assets, IPOs, NFTs, 0x...</span>
            </div>
            <kbd
              style={{
                fontSize: '10px',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                padding: '1px 5px',
                borderRadius: '3px',
                color: 'var(--ink-tertiary)',
              }}
            >
              ⌘K
            </kbd>
          </button>

          {/* Action Tools & Wallet */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link
              href="/watchlist"
              style={{
                fontSize: '12px',
                fontWeight: 600,
                padding: '6px 12px',
                borderRadius: '4px',
                backgroundColor: pathname === '/watchlist' ? 'var(--bg-surface)' : 'transparent',
                border: pathname === '/watchlist' ? '1px solid var(--border-primary)' : '1px solid transparent',
              }}
            >
              Watchlist
            </Link>

            <Link
              href="/alerts"
              style={{
                fontSize: '12px',
                fontWeight: 600,
                padding: '6px 12px',
                borderRadius: '4px',
                backgroundColor: pathname === '/alerts' ? 'var(--bg-surface)' : 'transparent',
                border: pathname === '/alerts' ? '1px solid var(--border-primary)' : '1px solid transparent',
              }}
            >
              Alerts
            </Link>

            <Link
              href="/create"
              style={{
                fontSize: '12px',
                fontWeight: 600,
                padding: '6px 12px',
                borderRadius: '4px',
                backgroundColor: 'rgba(192, 38, 211, 0.08)',
                color: 'var(--accent-nft)',
                border: '1px solid rgba(192, 38, 211, 0.25)',
              }}
            >
              + Mint NFT
            </Link>

            <button
              onClick={() => setWalletOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                backgroundColor: walletAddress ? 'var(--bg-surface)' : 'var(--ink-primary)',
                color: walletAddress ? 'var(--ink-primary)' : 'var(--bg-base)',
                border: walletAddress ? '1px solid var(--border-primary)' : 'none',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <Wallet size={14} />
              {walletAddress ? (
                <span className="num-mono">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              ) : (
                <span>Connect Wallet</span>
              )}
            </button>
          </div>
        </div>

        {/* Horizontal Navigation Menu */}
        <nav
          style={{
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-secondary)',
            padding: '0 20px',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
          }}
        >
          <div
            style={{
              maxWidth: '1600px',
              margin: '0 auto',
              display: 'flex',
              gap: '2px',
            }}
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: '8px 14px',
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--ink-primary)' : 'var(--ink-secondary)',
                    borderBottom: isActive ? '2px solid var(--accent-mbx50)' : '2px solid transparent',
                    textDecoration: 'none',
                    transition: 'color 0.15s ease',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Universal Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Wallet Connection Modal */}
      <WalletModal
        isOpen={walletOpen}
        onClose={() => setWalletOpen(false)}
        walletAddress={walletAddress}
        onConnect={(addr) => {
          setWalletAddress(addr);
          setWalletOpen(false);
        }}
        onDisconnect={() => setWalletAddress(null)}
      />
    </>
  );
}
