"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export interface StepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialData?: any;
}

interface StepConfig {
  label: string;
  Component: React.ComponentType<StepProps>;
}

export function OnboardingStepper({ steps, initialStep = 0, onComplete, initialData = {} }: {
  steps: StepConfig[];
  initialStep?: number;
  onComplete: (allData: any) => void;
  initialData?: any;
}) {
  const [step, setStep] = useState(initialStep);
  const [allData, setAllData] = useState(initialData);

  const handleNext = (data: any) => {
    const newData = { ...allData, ...data };
    setAllData(newData);
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(newData);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const StepComponent = steps[step].Component;

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        {steps.map((s, i) => (
          <div key={s.label} className={`flex-1 text-center ${i === step ? 'font-bold text-primary' : 'text-zinc-400'}`}>{s.label}</div>
        ))}
      </div>
      <StepComponent onNext={handleNext} onBack={handleBack} initialData={allData} />
    </div>
  );
}
