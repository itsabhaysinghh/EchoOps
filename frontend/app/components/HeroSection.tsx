'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRightCircle, 
  Zap, 
  LockKeyhole, 
  Fingerprint, 
  Menu, 
  X 
} from 'lucide-react';

// Geometric SVG logo component
export const Logo = () => (
  <svg 
    width="32" 
    height="32" 
    viewBox="0 0 256 256" 
    fill="#192837" 
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path d="M 64 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 L 128 64 L 128 64.5 L 161 32 L 192 0 L 256 0 L 256 64 L 192 128 L 128 128 L 128 192 L 96 223 L 63.5 256 L 0 256 L 0 192 Z M 256 192 L 224 223 L 191.5 256 L 128 256 L 128 192 L 192 128 L 256 128 Z" />
  </svg>
);

// Framer Motion fade-up animation variant
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const
    }
  })
};

const navItems = ["Vault", "Plans", "Install", "News", "Help"];

export default function HeroSection() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}>
      
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 z-0 w-full h-full object-cover"
      >
        <source 
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260606_131516_eca35265-ea66-4fbd-8d52-22aae6e1a503.mp4" 
          type="video/mp4" 
        />
      </video>

      {/* Navbar Container */}
      <header className="relative z-10 w-full max-w-[1280px] mx-auto px-5 sm:px-8 py-4 sm:py-5 flex justify-between items-center">
        
        {/* Left: Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Center: Nav links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium transition-opacity hover:opacity-70"
              style={{ color: 'var(--color-text)' }}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Right: CTA Pill Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className="text-sm font-semibold px-5 py-2.5 rounded-full text-white shadow-md transition-shadow"
            style={{ backgroundColor: '#7342E2' }}
          >
            Start For Free
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className="text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm transition-shadow"
            style={{ backgroundColor: '#F2F2EE', color: 'var(--color-text)' }}
          >
            Sign In
          </motion.button>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
          className="md:hidden p-2 text-[#192837] focus:outline-none"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </header>

      {/* Mobile Menu Slide-in Sheet via AnimatePresence */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Layer 1: Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40"
              style={{
                backgroundColor: 'rgba(25, 40, 55, 0.35)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)'
              }}
            />

            {/* Layer 2: Sheet */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{
                duration: mobileMenuOpen ? 0.45 : 0.35,
                ease: mobileMenuOpen ? ([0.22, 1, 0.36, 1] as const) : ([0.55, 0, 1, 0.45] as const)
              }}
              className="fixed top-0 right-0 z-50 flex flex-col justify-between"
              style={{
                width: 'min(88vw, 360px)',
                height: '100dvh',
                backgroundColor: '#CFC8C5',
                boxShadow: '-12px 0 48px rgba(25,40,55,0.18)'
              }}
            >
              <div>
                {/* Header: Logo + Close Button */}
                <div className="flex items-center justify-between p-6">
                  <Logo />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                    style={{ backgroundColor: 'rgba(25, 40, 55, 0.1)' }}
                  >
                    <X size={20} color="#192837" />
                  </motion.button>
                </div>

                {/* Divider Line */}
                <div 
                  className="h-px"
                  style={{
                    backgroundColor: 'rgba(25, 40, 55, 0.12)',
                    margin: '0 24px'
                  }}
                />

                {/* Staggered Nav Links */}
                <nav className="flex flex-col gap-2 p-6">
                  {navItems.map((item, i) => (
                    <motion.a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      onClick={() => setMobileMenuOpen(false)}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.18 + i * 0.07, duration: 0.4 }}
                      className="py-3 px-4 rounded-xl text-left font-medium transition-colors hover:bg-black/10"
                      style={{ fontSize: '1.1rem', color: '#192837' }}
                    >
                      {item}
                    </motion.a>
                  ))}
                </nav>
              </div>

              {/* Mobile CTA Buttons */}
              <div className="p-6 space-y-3">
                <button
                  className="w-full py-3.5 rounded-full font-semibold text-white shadow-md text-center block"
                  style={{ backgroundColor: '#7342E2', fontSize: '0.95rem' }}
                >
                  Start For Free
                </button>
                <button
                  className="w-full py-3.5 rounded-full font-semibold text-center block shadow-sm"
                  style={{ backgroundColor: '#F2F2EE', color: '#192837', fontSize: '0.95rem' }}
                >
                  Sign In
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Hero Content Section */}
      <main className="relative z-10 w-full max-w-[1280px] mx-auto px-5 sm:px-8 pb-12 pt-[clamp(40px,8vw,72px)] flex flex-col items-center">
        <div className="w-full max-w-[660px] mx-auto flex flex-col items-center text-center">

          {/* Heading <h1> */}
          <motion.h1
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.65rem, 5vw, 3rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              color: 'var(--color-text)',
              textAlign: 'center'
            }}
            className="mb-5 font-bold"
          >
            <span className="inline-block">
              Lock
              <Zap 
                size={24} 
                style={{ 
                  color: '#192837', 
                  display: 'inline', 
                  verticalAlign: 'middle', 
                  position: 'relative', 
                  top: '-2px', 
                  margin: '0 4px' 
                }} 
              />
              Down Your
              <LockKeyhole 
                size={24} 
                style={{ 
                  color: '#192837', 
                  display: 'inline', 
                  verticalAlign: 'middle', 
                  position: 'relative', 
                  top: '-2px', 
                  margin: '0 4px' 
                }} 
              />
              Passwords
            </span>
            <br />
            with Ironclad Security
            <Fingerprint 
              size={24} 
              style={{ 
                color: '#192837', 
                display: 'inline', 
                verticalAlign: 'middle', 
                position: 'relative', 
                top: '-2px', 
                marginLeft: '6px' 
              }} 
            />
          </motion.h1>

          {/* Subtext <p> */}
          <motion.p
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
              color: 'rgba(25, 40, 55, 0.8)',
              maxWidth: '560px',
              lineHeight: 1.65,
              textAlign: 'center'
            }}
            className="mb-8"
          >
            Zero stress, total control. Unbreakable storage, one-tap access, and pro-grade tools for your non-stop world.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <motion.button
              whileHover={{ scale: 1.04, filter: 'brightness(1.1)' }}
              whileTap={{ scale: 0.96 }}
              style={{
                borderRadius: '50px',
                backgroundColor: '#7342E2',
                color: '#FFFFFF',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                padding: '17px 24px',
                minWidth: '210px',
                boxShadow: '0 4px 24px rgba(115, 66, 226, 0.28)'
              }}
              className="flex items-center justify-between gap-8 font-semibold transition-all"
            >
              <span>Get It Free</span>
              <ArrowRightCircle size={20} className="shrink-0" />
            </motion.button>
          </motion.div>

        </div>
      </main>

    </div>
  );
}
