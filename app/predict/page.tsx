'use client';
// app/predict/page.tsx - Multi-step prediction form
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { usePredictions } from '@/hooks/usePredictions';
import { predictCVD } from '@/lib/api';
import { calculateBMI, getBMICategory } from '@/lib/utils';
import RiskGauge from '@/components/ui/RiskGauge';
import { PredictPayload, PredictionResult } from '@/types';
import toast from 'react-hot-toast';
import { ChevronRight, ChevronLeft, Loader2, Activity, CheckCircle2, Heart, ArrowLeft } from 'lucide-react';

// Step definitions
const STEPS = [
  { id: 1, title: 'Personal Info', description: 'Basic demographics' },
  { id: 2, title: 'Vitals', description: 'Blood pressure & measurements' },
  { id: 3, title: 'Lab Results', description: 'Cholesterol & glucose' },
  { id: 4, title: 'Lifestyle', description: 'Daily habits' },
];

const defaultFormData = {
  age: 45,
  gender: 1,
  height: 170,
  weight: 75,
  ap_hi: 120,
  ap_lo: 80,
  cholesterol: 1,
  gluc: 1,
  smoke: 0,
  alco: 0,
  active: 1,
};

export default function PredictPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { savePrediction } = usePredictions(user?.id);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(defaultFormData);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth');
  }, [authLoading, user, router]);

  function update(field: string, value: number) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    setLoading(true);
    try {
      // Map formData.age to age_years for the backend
      const { age, ...rest } = formData;
      const payload: PredictPayload = { age_years: age, ...rest };
      
      const res = await predictCVD(payload);
      setResult(res);
      setStep(5); // Result step
    } catch (err: any) {
      toast.error(err.message || 'Prediction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!result || !user) return;
    const { age, ...rest } = formData;
    const { error } = await savePrediction({
      user_id: user.id,
      date: new Date().toISOString(),
      probability: result.probability,
      prediction: result.prediction === 1,
      risk_level: result.risk_level,
      advice: result.message,
      age_years: age,
      bmi: bmi,
      bmi_category: getBMICategory(bmi),
      ...rest,
    });
    if (!error) {
      setSaved(true);
      toast.success('Prediction saved to your history!');
    } else {
      toast.error('Failed to save prediction');
    }
  }

  const bmi = calculateBMI(formData.weight, formData.height);

  if (authLoading) return null;

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-jakarta text-3xl font-bold text-on-surface dark:text-white mb-2">CVD Risk Prediction</h1>
          <p className="text-on-surface-variant">
            {step < 5 ? 'Answer the questions below for your personalized cardiovascular risk assessment.' : 'Here are your results:'}
          </p>
        </motion.div>

        {/* Progress bar (steps 1-4) */}
        {step < 5 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              {STEPS.map((s) => (
                <div key={s.id} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    step > s.id ? 'bg-secondary text-white' :
                    step === s.id ? 'bg-primary-gradient text-white shadow-glow' :
                    'bg-surface-container dark:bg-dark-surface text-on-surface-variant'
                  }`}>
                    {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.id}
                  </div>
                  {s.id < STEPS.length && (
                    <div className={`h-1 flex-1 min-w-8 rounded-full transition-all duration-500 ${step > s.id ? 'bg-secondary' : 'bg-surface-container dark:bg-dark-surface'}`} />
                  )}
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface dark:text-white">{STEPS[step - 1]?.title}</p>
              <p className="text-xs text-on-surface-variant">{STEPS[step - 1]?.description}</p>
            </div>
          </motion.div>
        )}

        {/* Form card */}
        <div className="metric-card">
          <AnimatePresence mode="wait">
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <StepPanel key="step1">
                <h2 className="font-jakarta text-xl font-bold text-on-surface dark:text-white mb-6">Personal Information</h2>
                <div className="space-y-5">
                  <SliderField label="Age" value={formData.age} min={18} max={90} unit="years"
                    onChange={v => update('age', v)} helpText={`${formData.age} years old`} />
                  <SelectField label="Biological Sex" value={formData.gender}
                    options={[{ label: '♀ Female', value: 0 }, { label: '♂ Male', value: 1 }]}
                    onChange={v => update('gender', v)} />
                  <SliderField label="Height" value={formData.height} min={120} max={220} unit="cm"
                    onChange={v => update('height', v)} helpText={`${formData.height} cm`} />
                  <SliderField label="Weight" value={formData.weight} min={30} max={200} unit="kg"
                    onChange={v => update('weight', v)}
                    helpText={`${formData.weight} kg • BMI: ${bmi} (${getBMICategory(bmi)})`} />
                </div>
              </StepPanel>
            )}

            {/* Step 2: Vitals */}
            {step === 2 && (
              <StepPanel key="step2">
                <h2 className="font-jakarta text-xl font-bold text-on-surface dark:text-white mb-2">Blood Pressure & Vitals</h2>
                <p className="text-on-surface-variant text-sm mb-6">Enter your most recent blood pressure readings</p>
                <div className="space-y-5">
                  <SliderField label="Systolic Blood Pressure (Ap Hi)" value={formData.ap_hi} min={60} max={230} unit="mmHg"
                    onChange={v => update('ap_hi', v)}
                    helpText={`${formData.ap_hi} mmHg — ${formData.ap_hi < 120 ? '✅ Normal' : formData.ap_hi < 140 ? '⚠️ Elevated' : '🔴 High'}`} />
                  <SliderField label="Diastolic Blood Pressure (Ap Lo)" value={formData.ap_lo} min={40} max={150} unit="mmHg"
                    onChange={v => update('ap_lo', v)}
                    helpText={`${formData.ap_lo} mmHg — ${formData.ap_lo < 80 ? '✅ Normal' : formData.ap_lo < 90 ? '⚠️ Elevated' : '🔴 High'}`} />
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/15">
                    <p className="text-xs text-on-surface-variant">
                      💡 <strong>Tip:</strong> For accurate readings, measure after 5 minutes of rest, sitting comfortably with arm at heart level.
                    </p>
                  </div>
                </div>
              </StepPanel>
            )}

            {/* Step 3: Lab Results */}
            {step === 3 && (
              <StepPanel key="step3">
                <h2 className="font-jakarta text-xl font-bold text-on-surface dark:text-white mb-2">Lab Results</h2>
                <p className="text-on-surface-variant text-sm mb-6">From your most recent blood test</p>
                <div className="space-y-5">
                  <SelectField label="Cholesterol Level" value={formData.cholesterol}
                    options={[
                      { label: '✅ Normal (< 200 mg/dL)', value: 1 },
                      { label: '⚠️ Above Normal (200-239 mg/dL)', value: 2 },
                      { label: '🔴 Well Above Normal (≥ 240 mg/dL)', value: 3 },
                    ]}
                    onChange={v => update('cholesterol', v)} />
                  <SelectField label="Glucose Level" value={formData.gluc}
                    options={[
                      { label: '✅ Normal (< 100 mg/dL)', value: 1 },
                      { label: '⚠️ Above Normal (100-125 mg/dL)', value: 2 },
                      { label: '🔴 Well Above Normal (≥ 126 mg/dL)', value: 3 },
                    ]}
                    onChange={v => update('gluc', v)} />
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-700/30">
                    <p className="text-xs text-amber-800 dark:text-amber-300">
                      ⚠️ If you don't know your exact values, select "Normal" and update after your next blood test.
                    </p>
                  </div>
                </div>
              </StepPanel>
            )}

            {/* Step 4: Lifestyle */}
            {step === 4 && (
              <StepPanel key="step4">
                <h2 className="font-jakarta text-xl font-bold text-on-surface dark:text-white mb-2">Lifestyle Factors</h2>
                <p className="text-on-surface-variant text-sm mb-6">Your daily habits significantly impact cardiovascular risk</p>
                <div className="space-y-4">
                  {[
                    { field: 'smoke', label: 'Do you smoke?', icon: '🚬', desc: 'Current smoker (at least 1 cigarette/day)' },
                    { field: 'alco', label: 'Do you drink alcohol?', icon: '🍷', desc: 'Regular alcohol consumption' },
                    { field: 'active', label: 'Are you physically active?', icon: '🏃', desc: '30+ min of moderate exercise most days' },
                  ].map(({ field, label, icon, desc }) => (
                    <ToggleField key={field} label={label} icon={icon} desc={desc}
                      value={formData[field as keyof typeof formData] as number}
                      onChange={v => update(field, v)} />
                  ))}
                </div>
              </StepPanel>
            )}

            {/* Step 5: Results */}
            {step === 5 && result && (
              <StepPanel key="step5">
                <div className="text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.7 }}>
                    <RiskGauge
                      score={Math.round(result.probability)}
                      level={result.risk_level}
                      size={220}
                      label="Cardiovascular Risk Score"
                    />
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-6 space-y-3">
                    <p className="text-on-surface dark:text-white text-lg font-medium leading-relaxed max-w-sm mx-auto">
                      {result.message}
                    </p>

                    {/* Key factors summary */}
                    <div className="grid grid-cols-2 gap-3 mt-6 text-left">
                      {[
                        { label: 'Age', value: `${formData.age} years` },
                        { label: 'BMI', value: `${bmi} (${getBMICategory(bmi)})` },
                        { label: 'Blood Pressure', value: `${formData.ap_hi}/${formData.ap_lo} mmHg` },
                        { label: 'Cholesterol', value: formData.cholesterol === 1 ? 'Normal' : formData.cholesterol === 2 ? 'Elevated' : 'High' },
                      ].map(({ label, value }) => (
                        <div key={label} className="p-3 rounded-xl bg-surface-container dark:bg-dark-surface">
                          <p className="text-xs text-on-surface-variant mb-0.5">{label}</p>
                          <p className="text-sm font-semibold text-on-surface dark:text-white">{value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                      {!saved ? (
                        <button onClick={handleSave} className="btn-primary flex-1 flex items-center justify-center gap-2">
                          <Heart className="w-4 h-4" />
                          Save to History
                        </button>
                      ) : (
                        <div className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-secondary/10 text-secondary font-medium text-sm">
                          <CheckCircle2 className="w-4 h-4" />
                          Saved Successfully
                        </div>
                      )}
                      <button onClick={() => { setStep(1); setResult(null); setSaved(false); }}
                        className="btn-ghost flex-1 flex items-center justify-center gap-2">
                        <Activity className="w-4 h-4" />
                        New Prediction
                      </button>
                    </div>
                    <button onClick={() => router.push('/dashboard')} className="text-primary text-sm hover:underline">
                      ← View Dashboard
                    </button>
                  </motion.div>
                </div>
              </StepPanel>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          {step < 5 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-outline-variant/15 dark:border-dark-border">
              <button
                onClick={() => setStep(s => Math.max(1, s - 1))}
                disabled={step === 1}
                className="btn-ghost flex items-center gap-2 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>

              {step < 4 ? (
                <button onClick={() => setStep(s => s + 1)} className="btn-primary flex items-center gap-2">
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={loading} className="btn-primary flex items-center gap-2">
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
                  ) : (
                    <><Activity className="w-4 h-4" /> Get My Results</>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

// Helper sub-components
function StepPanel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

function SliderField({ label, value, min, max, unit, onChange, helpText }: any) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-on-surface dark:text-white">{label}</label>
        <span className="text-sm font-bold text-primary">{value} {unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 bg-surface-container dark:bg-dark-surface rounded-full appearance-none cursor-pointer accent-primary"
      />
      <div className="flex justify-between text-xs text-on-surface-variant mt-1">
        <span>{min}</span>
        {helpText && <span className="text-center text-on-surface-variant">{helpText}</span>}
        <span>{max}</span>
      </div>
    </div>
  );
}

function SelectField({ label, value, options, onChange }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-on-surface dark:text-white mb-2">{label}</label>
      <div className="space-y-2">
        {options.map((opt: any) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              value === opt.value
                ? 'bg-primary/10 border-2 border-primary text-primary'
                : 'bg-surface-container dark:bg-dark-surface-container border-2 border-transparent text-on-surface dark:text-white hover:border-outline-variant/40'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ToggleField({ label, icon, desc, value, onChange }: any) {
  return (
    <button
      type="button"
      onClick={() => onChange(value === 1 ? 0 : 1)}
      className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
        value === 1
          ? 'border-primary bg-primary/8 dark:bg-primary/12'
          : 'border-outline-variant/20 dark:border-dark-border bg-surface-container dark:bg-dark-surface-container'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="text-left">
          <p className={`text-sm font-semibold ${value === 1 ? 'text-primary' : 'text-on-surface dark:text-white'}`}>{label}</p>
          <p className="text-xs text-on-surface-variant">{desc}</p>
        </div>
      </div>
      <div className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${value === 1 ? 'bg-primary' : 'bg-outline-variant/30 dark:bg-dark-border'}`}>
        <motion.div
          animate={{ x: value === 1 ? 24 : 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </div>
    </button>
  );
}
