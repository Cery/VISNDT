'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: '首页' },
  { href: '/products', label: '产品' },
  { href: '/categories', label: '分类' },
  { href: '/solutions', label: '解决方案' },
  { href: '/knowledge', label: '知识中心' },
  { href: '/business', label: '商务合作' },
  { href: '/about', label: '关于我们' },
];

export default function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-industrial-sm">
      <div className="w-full">
        <div className="max-w-[1200px] mx-auto flex h-[4.5rem] items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xl font-bold font-mono tracking-tight">
              <span className="text-foreground">VIS</span>
              <span className="bg-gradient-to-r from-primary to-industrial-cyan bg-clip-text text-transparent">NDT</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'text-primary bg-primary/5'
                      : 'text-muted-foreground hover:text-foreground hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
            >
              登录
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium bg-gradient-to-r from-primary to-industrial-cyan text-white px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity shadow-industrial-sm"
            >
              注册
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="切换菜单"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white/95 backdrop-blur-sm">
          <nav className="max-w-[1200px] mx-auto px-6 py-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/5 text-primary'
                      : 'text-muted-foreground hover:bg-slate-50 hover:text-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="border-t pt-4 mt-3 flex gap-3">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center text-sm font-medium text-muted-foreground hover:text-foreground py-2.5 rounded-lg border transition-colors"
              >
                登录
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center text-sm font-medium bg-gradient-to-r from-primary to-industrial-cyan text-white py-2.5 rounded-lg hover:opacity-90 transition-opacity"
              >
                注册
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}