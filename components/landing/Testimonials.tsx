'use client';
// components/landing/Testimonials.tsx
import { motion } from 'framer-motion';
import ScrollReveal, { StaggerContainer, StaggerItem } from '@/components/ui/ScrollReveal';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Dr. Sarah Chen',
    role: 'Cardiologist, Boston Medical',
    avatar: 'SC',
    rating: 5,
    text: "CardioGuard's AI model aligns remarkably well with our clinical assessment tools. It's become a trusted pre-screening resource I recommend to patients for between-visit monitoring.",
    color: 'from-blue-500 to-indigo-600',
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Patient, 54 years old',
    avatar: 'MR',
    rating: 5,
    text: 'After using CardioGuard for 3 months, I discovered my risk was "high." This motivated me to make real changes. My doctor was impressed — my numbers improved by 28% in just one quarter.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    name: 'Amira Patel',
    role: 'Health & Wellness Coach',
    avatar: 'AP',
    rating: 5,
    text: "I use CardioGuard with all my clients as a baseline assessment. The trend tracking feature is exceptional — clients can see concrete evidence of their lifestyle improvements.",
    color: 'from-violet-500 to-purple-600',
  },
  {
    name: 'James Wilson',
    role: 'Type 2 Diabetic, 62 years old',
    avatar: 'JW',
    rating: 5,
    text: "Managing diabetes and heart health simultaneously is complex. CardioGuard helps me understand how my choices impact my cardiovascular risk day by day. Invaluable tool.",
    color: 'from-orange-500 to-rose-600',
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-background dark:bg-dark-background" id="testimonials">
      <div className="section-wrapper">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <ScrollReveal>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              Real Stories
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="font-jakarta text-4xl md:text-5xl font-bold text-on-surface dark:text-white mb-4">
              Trusted by <span className="gradient-text">Real People</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-on-surface-variant text-lg">
              From cardiologists to everyday users — see what CardioGuard has done for them.
            </p>
          </ScrollReveal>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6" staggerDelay={0.1}>
          {testimonials.map(({ name, role, avatar, rating, text, color }) => (
            <StaggerItem key={name}>
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.25 }}
                className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-card hover:shadow-ambient-md transition-all border border-outline-variant/10 dark:border-dark-border"
              >
                {/* Quote icon */}
                <Quote className="w-8 h-8 text-primary/20 mb-4" />

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-on-surface dark:text-white/90 text-sm leading-relaxed mb-6 italic">
                  "{text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white text-xs font-bold">{avatar}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-on-surface dark:text-white text-sm">{name}</p>
                    <p className="text-on-surface-variant text-xs">{role}</p>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
