'use client';
// components/ui/RiskGauge.tsx - Animated circular risk gauge
import { motion } from 'framer-motion';
import { RiskLevel } from '@/types';

interface RiskGaugeProps {
  score: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
  showLabel?: boolean;
  level?: RiskLevel;
}

const RISK_COLORS: Record<RiskLevel, { stroke: string; bg: string; text: string }> = {
  low: { stroke: '#1b6d24', bg: '#a0f399', text: 'text-secondary' },
  medium: { stroke: '#f57c00', bg: '#ffd599', text: 'text-orange-600' },
  high: { stroke: '#b7181f', bg: '#ffdad6', text: 'text-tertiary' },
};

export default function RiskGauge({
  score,
  size = 200,
  strokeWidth = 16,
  label = 'Risk Score',
  showLabel = true,
  level,
}: RiskGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI; // half circle
  const progress = Math.min(Math.max(score, 0), 100);
  const offset = circumference - (progress / 100) * circumference;

  const riskLevel: RiskLevel = 
    (level?.toLowerCase() as RiskLevel) || 
    (score < 30 ? 'low' : score < 60 ? 'medium' : 'high');
  const colors = RISK_COLORS[riskLevel];

  const riskLabels = { low: 'Low Risk', medium: 'Moderate Risk', high: 'High Risk' };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size / 2 + strokeWidth }}>
        <svg
          width={size}
          height={size / 2 + strokeWidth}
          viewBox={`0 0 ${size} ${size / 2 + strokeWidth}`}
        >
          {/* Background track */}
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            fill="none"
            className="gauge-track"
            strokeWidth={strokeWidth}
          />
          {/* Animated fill */}
          <motion.path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
          />
        </svg>

        {/* Center score */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center"
          style={{ bottom: strokeWidth / 2 }}
        >
          <motion.span
            className={`text-4xl font-bold font-jakarta ${colors.text}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {Math.round(progress)}
          </motion.span>
          <span className="text-xs text-on-surface-variant font-medium">/ 100</span>
        </div>
      </div>

      {showLabel && (
        <div className="flex flex-col items-center gap-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className={`chip-${riskLevel} text-sm font-semibold`}
          >
            {riskLabels[riskLevel]}
          </motion.div>
          <p className="text-xs text-on-surface-variant">{label}</p>
        </div>
      )}
    </div>
  );
}
