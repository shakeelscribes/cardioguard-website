'use client';
// components/layout/Navbar.tsx
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Moon, Sun, Heart, User, LogOut, Menu, X, Activity } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, profile, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLanding = pathname === '/';

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/predict', label: 'Predict' },
    { href: '/history', label: 'History' },
    { href: '/statistics', label: 'Statistics' },
  ];

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'backdrop-blur-lg border-b',
        isLanding
          ? 'bg-transparent border-white/10'
          : 'bg-white/85 dark:bg-dark-surface/85 border-outline-variant/20 dark:border-dark-border shadow-ambient'
      )}
    >
      <div className="section-wrapper">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-primary-gradient flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-jakarta font-bold text-lg gradient-text">CardioGuard</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                  pathname === link.href
                    ? 'text-primary bg-primary/10'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container dark:hover:bg-dark-surface-container'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container dark:hover:bg-dark-surface-container transition-all"
              aria-label="Toggle theme"
            >
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </motion.div>
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container dark:hover:bg-dark-surface-container transition-all"
                >
                  <User className="w-4 h-4" />
                  <span>{profile?.name?.split(' ')[0] || 'Profile'}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-on-surface-variant hover:text-tertiary hover:bg-tertiary/10 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
                <Link href="/predict" className="btn-primary text-sm px-4 py-2 hidden md:flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Predict Now
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/auth" className="btn-ghost text-sm px-4 py-2">Sign In</Link>
                <Link href="/auth?mode=signup" className="btn-primary text-sm px-4 py-2">Get Started</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-all"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{ height: mobileOpen ? 'auto' : 0, opacity: mobileOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="md:hidden overflow-hidden bg-white/95 dark:bg-dark-surface/95 backdrop-blur-lg border-t border-outline-variant/20 dark:border-dark-border"
      >
        <div className="section-wrapper py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'px-4 py-3 rounded-xl text-sm font-medium transition-all',
                pathname === link.href
                  ? 'text-primary bg-primary/10'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container dark:hover:bg-dark-surface-container'
              )}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link href="/profile" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container dark:hover:bg-dark-surface-container transition-all">
                Profile
              </Link>
              <button onClick={() => { handleSignOut(); setMobileOpen(false); }} className="px-4 py-3 rounded-xl text-sm font-medium text-tertiary text-left hover:bg-tertiary/10 transition-all">
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link href="/auth" onClick={() => setMobileOpen(false)} className="btn-ghost text-sm flex-1 text-center">Sign In</Link>
              <Link href="/auth?mode=signup" onClick={() => setMobileOpen(false)} className="btn-primary text-sm flex-1 text-center">Get Started</Link>
            </div>
          )}
        </div>
      </motion.div>
    </motion.header>
  );
}
