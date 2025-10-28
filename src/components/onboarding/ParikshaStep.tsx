"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const parikshaQuestions = [
  { key: 'nadi', label: 'Nadi (Pulse):', options: ['Vata', 'Pitta', 'Kapha'] },
  { key: 'mutra', label: 'Mutra (Urine):', options: ['Normal', 'Abnormal'] },
  { key: 'mala', label: 'Mala (Stool):', options: ['Normal', 'Abnormal'] },
  { key: 'jihwa', label: 'Jihwa (Tongue):', options: ['Clean', 'Coated'] },
  { key: 'shabda', label: 'Shabda (Voice):', options: ['Normal', 'Abnormal'] },
  { key: 'sparsha', label: 'Sparsha (Touch):', options: ['Normal', 'Abnormal'] },
  { key: 'drik', label: 'Drik (Vision):', options: ['Normal', 'Abnormal'] },
  { key: 'akriti', label: 'Akriti (Build):', options: ['Thin', 'Medium', 'Heavy'] },
];

export function ParikshaStep({ onNext, onBack, initialData }: any) {
  const [answers, setAnswers] = useState(() => {
    const a: any = {};
    parikshaQuestions.forEach(q => { a[q.key] = initialData?.[q.key] || ""; });
    return a;
  });

  const handleChange = (key: string, value: string) => {
    setAnswers((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onNext(answers);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Ashtvidha Pariksha</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {parikshaQuestions.map(q => (
            <div key={q.key} className="space-y-2">
              <Label>{q.label}</Label>
              <div className="flex gap-4">
                {q.options.map(opt => (
                  <label key={opt} className="flex items-center gap-1">
                    <input
                      type="radio"
                      name={q.key}
                      value={opt}
                      checked={answers[q.key] === opt}
                      onChange={() => handleChange(q.key, opt)}
                      required
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="flex justify-between mt-6">
        <Button type="button" variant="outline" onClick={onBack}>Back</Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}
