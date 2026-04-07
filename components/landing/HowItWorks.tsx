'use client';
// components/landing/HowItWorks.tsx
import ScrollReveal, { StaggerContainer, StaggerItem } from '@/components/ui/ScrollReveal';
import { UserPlus, ClipboardList, Cpu, TrendingUp } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: UserPlus,
    title: 'Create Your Profile',
    description: 'Sign up in seconds with your email. No credit card required. Your account is secured and private.',
  },
  {
    step: '02',
    icon: ClipboardList,
    title: 'Enter Health Metrics',
    description: 'Input key health markers including blood pressure, cholesterol, BMI, lifestyle factors, and more.',
  },
  {
    step: '03',
    icon: Cpu,
    title: 'AI Analyzes Your Data',
    description: 'Our clinical AI model processes your data against thousands of validated cardiovascular risk patterns.',
  },
  {
    step: '04',
    icon: TrendingUp,
    title: 'Get Personalized Insights',
    description: 'Receive your risk score, health tips, and track improvements over time with visual analytics.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-surface-container-low dark:bg-dark-surface-container" id="how-it-works">
      <div className="section-wrapper">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <ScrollReveal>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              How It Works
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="font-jakarta text-4xl md:text-5xl font-bold text-on-surface dark:text-white mb-4">
              Simple, <span className="gradient-text">Powerful</span>, Effective
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-on-surface-variant text-lg">
              From signup to your personalized risk assessment in under 5 minutes.
            </p>
          </ScrollReveal>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-8 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-8" staggerDelay={0.12}>
            {steps.map(({ step, icon: Icon, title, description }, index) => (
              <StaggerItem key={step}>
                <div className="relative flex flex-col items-center text-center group">
                  {/* Step indicator */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary-gradient flex items-center justify-center shadow-glow group-hover:scale-110 transition-all duration-300 group-hover:shadow-glow-lg">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white dark:bg-dark-surface border-2 border-primary flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{index + 1}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="font-jakarta font-bold text-lg text-on-surface dark:text-white mb-3">
                    {title}
                  </h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed max-w-xs">
                    {description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
