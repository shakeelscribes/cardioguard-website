'use client';
// components/landing/CTASection.tsx
import Link from 'next/link';
import { motion } from 'framer-motion';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { ArrowRight, Heart } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-24 bg-surface-container-low dark:bg-dark-surface-container overflow-hidden">
      <div className="section-wrapper">
        <ScrollReveal>
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 animated-gradient-bg" />

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

            {/* Content */}
            <div className="relative z-10 py-16 px-8 md:px-16 text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-6"
              >
                <Heart className="w-8 h-8 text-white fill-white" />
              </motion.div>

              <h2 className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
                Your Heart Can't Wait.
              </h2>
              <p className="text-white/75 text-xl max-w-xl mx-auto mb-10">
                Join thousands who have taken control of their cardiovascular health. Assessment is free. Results are life-changing.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth?mode=signup"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-primary font-bold text-lg hover:bg-white/95 transition-all shadow-ambient-lg hover:-translate-y-0.5"
                >
                  Start Free Today
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/#how-it-works"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-2xl border border-white/30 text-white font-semibold text-lg hover:bg-white/10 transition-all"
                >
                  Learn More
                </Link>
              </div>

              <p className="text-white/50 text-sm mt-8">
                No credit card required · HIPAA compliant · Cancel anytime
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
