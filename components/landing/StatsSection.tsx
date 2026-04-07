'use client';
// components/landing/StatsSection.tsx
import ScrollReveal, { StaggerContainer, StaggerItem } from '@/components/ui/ScrollReveal';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { TrendingUp, Users, Award, Clock } from 'lucide-react';

const stats = [
  { icon: Users, value: 50000, suffix: '+', label: 'Health Assessments', desc: 'Completed by real users' },
  { icon: Award, value: 95, suffix: '%', label: 'Model Accuracy', desc: 'Clinically validated' },
  { icon: TrendingUp, value: 34, suffix: '%', label: 'Risk Reduction', desc: 'Average improvement' },
  { icon: Clock, value: 10, suffix: 's', label: 'Prediction Speed', desc: 'Lightning fast results' },
];

export default function StatsSection() {
  return (
    <section className="py-24 bg-surface-container-lowest dark:bg-dark-surface">
      <div className="section-wrapper">
        <ScrollReveal>
          <p className="text-center text-on-surface-variant text-sm font-semibold uppercase tracking-widest mb-12">
            Trusted by thousands worldwide
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
          {stats.map(({ icon: Icon, value, suffix, label, desc }) => (
            <StaggerItem key={label}>
              <div className="metric-card group text-center">
                <div className="w-12 h-12 rounded-2xl bg-primary-gradient-soft flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-4xl font-bold font-jakarta gradient-text mb-1">
                  <AnimatedCounter end={value} suffix={suffix} />
                </div>
                <p className="font-semibold text-on-surface text-sm mb-1">{label}</p>
                <p className="text-on-surface-variant text-xs">{desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
