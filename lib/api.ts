// lib/api.ts - FastAPI backend communication
import { PredictPayload, PredictionResult } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_FASTAPI_URL || 'https://cardiovascluar-backend.onrender.com';

export async function predictCVD(payload: PredictPayload): Promise<PredictionResult> {
  const response = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Prediction failed' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  
  // The API likely returns probability as 0-1 scale (e.g. 0.82)
  const rawProb = data.probability ?? data.risk_probability ?? data.prediction_probability ?? 0.5;
  // Convert it to 0-100 scale immediately, as both Website and Flutter expect DB values in 0-100
  const probability = rawProb <= 1.0 ? rawProb * 100 : rawProb;
  const prediction = data.prediction ?? data.cardio ?? (probability > 50 ? 1 : 0);
  
  let risk_level: 'low' | 'medium' | 'high';
  
  if (probability < 30) {
    risk_level = 'low';
  } else if (probability < 60) {
    risk_level = 'medium';
  } else {
    risk_level = 'high';
  }

  return {
    prediction,
    probability,
    risk_level: data.risk_level?.toLowerCase() || risk_level,
    message: data.message || getRiskMessage(risk_level),
  };
}

function getRiskMessage(level: 'low' | 'medium' | 'high'): string {
  const messages = {
    low: 'Your cardiovascular health looks great! Keep up your healthy lifestyle.',
    medium: 'You have moderate cardiovascular risk. Consider consulting a healthcare professional.',
    high: 'You have elevated cardiovascular risk. Please consult a healthcare professional immediately.',
  };
  return messages[level];
}

export async function checkAPIHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/health`, { method: 'GET' });
    return response.ok;
  } catch {
    return false;
  }
}
