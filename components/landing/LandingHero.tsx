'use client';
// components/landing/LandingHero.tsx
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Shield, Zap, Activity } from 'lucide-react';
import ParticleCanvas from './ParticleCanvas';

export default function LandingHero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 animated-gradient-bg" />

      {/* Particle system */}
      <div className="absolute inset-0">
        <ParticleCanvas />
      </div>

      {/* Geometric accent shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full border border-white/10"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-40 -left-20 w-80 h-80 rounded-full border border-white/8"
        />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 section-wrapper py-32 pt-40">
        <div className="max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 mb-8"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/90 text-sm font-medium">AI-Powered Cardiovascular Analysis</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-jakarta text-5xl md:text-7xl font-bold text-white leading-tight mb-6"
          >
            Know Your Heart.
            <br />
            <span className="text-cyan-300">Before It's Too Late.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-white/75 text-xl md:text-2xl leading-relaxed max-w-2xl mb-10"
          >
            CardioGuard uses clinical-grade AI to predict your cardiovascular disease risk.
            Get personalized insights in minutes, not months.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <Link
              href="/auth?mode=signup"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-primary font-bold text-lg hover:bg-white/95 transition-all shadow-ambient-lg hover:shadow-glow-lg hover:-translate-y-0.5"
            >
              Start Free Assessment
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/auth"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-white/30 text-white font-semibold text-lg hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              Sign In
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap gap-6"
          >
            {[
              { icon: Shield, text: 'HIPAA Compliant' },
              { icon: Zap, text: 'Results in < 10 Seconds' },
              { icon: Activity, text: 'Clinical-Grade AI' },
              { icon: Heart, text: '95%+ Accuracy' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-white/70">
                <Icon className="w-4 h-4 text-cyan-300" />
                <span className="text-sm font-medium">{text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Floating stats cards */}
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 space-y-4"
        >
          {[
            { label: 'Predictions Made', value: '50K+', change: '+12%', positive: true },
            { label: 'Avg Risk Reduction', value: '34%', change: 'vs baseline', positive: true },
            { label: 'Clinical Accuracy', value: '95.2%', change: 'validated', positive: true },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
              className="bg-white/15 backdrop-blur-lg border border-white/20 rounded-2xl p-4 w-52 shadow-ambient"
            >
              <p className="text-white/60 text-xs font-medium mb-1">{card.label}</p>
              <p className="text-white text-2xl font-bold font-jakarta">{card.value}</p>
              <span className={`text-xs font-medium ${card.positive ? 'text-emerald-300' : 'text-red-300'}`}>
                {card.change}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 80L48 69.3C96 58.7 192 37.3 288 32C384 26.7 480 37.3 576 48C672 58.7 768 69.3 864 64C960 58.7 1056 37.3 1152 32C1248 26.7 1344 37.3 1392 42.7L1440 48V80H0Z"
            className="fill-background dark:fill-dark-background" />
        </svg>
      </div>
    </section>
  );
}
