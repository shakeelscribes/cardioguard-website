'use client';
// components/landing/FeaturesSection.tsx
import { motion } from 'framer-motion';
import ScrollReveal, { StaggerContainer, StaggerItem } from '@/components/ui/ScrollReveal';
import { Brain, Activity, ShieldCheck, BarChart3, Smartphone, Lock } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Clinical AI Engine',
    description: 'Trained on 70,000+ patient records using gradient boosting and neural networks, validated against clinical benchmarks.',
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: Activity,
    title: 'Real-Time Risk Scoring',
    description: 'Submit your health metrics and receive a personalized cardiovascular risk score with detailed analysis in under 10 seconds.',
    color: 'from-cyan-500 to-teal-600',
    bg: 'bg-cyan-50 dark:bg-cyan-900/20',
  },
  {
    icon: BarChart3,
    title: 'Trend Analytics',
    description: 'Track how your risk changes over time with interactive charts. Identify patterns and measure the impact of lifestyle changes.',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
  },
  {
    icon: ShieldCheck,
    title: 'Evidence-Based Insights',
    description: 'Every recommendation is grounded in peer-reviewed cardiology research and WHO guidelines for cardiovascular health.',
    color: 'from-emerald-500 to-green-600',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    icon: Smartphone,
    title: 'Cross-Platform Sync',
    description: 'Seamlessly sync your data with the CardioGuard mobile app. Your health data follows you everywhere.',
    color: 'from-orange-500 to-amber-600',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
  },
  {
    icon: Lock,
    title: 'Privacy-First Design',
    description: 'Your health data is encrypted end-to-end. We never sell or share your data with third parties. Ever.',
    color: 'from-rose-500 to-red-600',
    bg: 'bg-rose-50 dark:bg-rose-900/20',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-background dark:bg-dark-background" id="features">
      <div className="section-wrapper">
        {/* Section header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <ScrollReveal>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              Everything You Need
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="font-jakarta text-4xl md:text-5xl font-bold text-on-surface dark:text-white mb-4">
              Built for Your{' '}
              <span className="gradient-text">Heart Health</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-on-surface-variant text-lg leading-relaxed">
              A complete cardiovascular health platform — from AI prediction to long-term trend tracking and personalized guidance.
            </p>
          </ScrollReveal>
        </div>

        {/* Features grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.08}>
          {features.map(({ icon: Icon, title, description, color, bg }) => (
            <StaggerItem key={title}>
              <motion.div
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className={`
                  rounded-2xl p-6 border border-outline-variant/15 dark:border-dark-border
                  bg-white dark:bg-dark-surface shadow-card hover:shadow-ambient-md
                  transition-shadow duration-300 group cursor-default
                `}
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 shadow-ambient group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="font-jakarta font-bold text-lg text-on-surface dark:text-white mb-3">
                  {title}
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  {description}
                </p>

                {/* Bottom gradient accent */}
                <div className={`mt-5 h-0.5 rounded-full bg-gradient-to-r ${color} opacity-30 group-hover:opacity-80 transition-opacity duration-300`} />
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
