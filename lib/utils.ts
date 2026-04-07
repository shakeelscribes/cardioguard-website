// lib/utils.ts - Utility functions
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { RiskLevel } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRiskColor(level: RiskLevel): string {
  const colors = {
    low: 'text-secondary',
    medium: 'text-orange-500',
    high: 'text-tertiary',
  };
  return colors[level] || colors.medium;
}

export function getRiskBgColor(level: RiskLevel): string {
  const colors = {
    low: 'bg-secondary-container text-secondary-on-container',
    medium: 'bg-orange-100 text-orange-700',
    high: 'bg-tertiary-container text-tertiary-on-container',
  };
  return colors[level] || colors.medium;
}

export function getRiskGradient(level: RiskLevel): string {
  const gradients = {
    low: 'from-green-500 to-emerald-600',
    medium: 'from-orange-400 to-amber-500',
    high: 'from-red-500 to-rose-700',
  };
  return gradients[level] || gradients.medium;
}

export function calculateBMI(weight: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return parseFloat((weight / (heightM * heightM)).toFixed(1));
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return 'Unknown Date';
  // Normalize string if Supabase dropped the UTC Z timezone marker
  const normalizedStr = dateStr.endsWith('Z') || dateStr.includes('+') ? dateStr : `${dateStr}Z`;
  return new Date(normalizedStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateStr?: string): string {
  if (!dateStr) return 'Unknown Date';
  // Normalize string if Supabase dropped the UTC Z timezone marker
  const normalizedStr = dateStr.endsWith('Z') || dateStr.includes('+') ? dateStr : `${dateStr}Z`;
  return new Date(normalizedStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getRiskLabel(level: RiskLevel): string {
  const labels = {
    low: 'Low Risk',
    medium: 'Moderate Risk',
    high: 'High Risk',
  };
  return labels[level] || 'Unknown';
}

export function getRiskEmoji(level: RiskLevel): string {
  const emojis = {
    low: '💚',
    medium: '🟡',
    high: '🔴',
  };
  return emojis[level] || '❓';
}

export function ageFromDOB(dob: string): number {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function clampNumber(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}
