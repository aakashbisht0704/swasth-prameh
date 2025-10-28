"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const questions = [
  {
    key: "prakriti_vata",
    label: "Do you often feel dry skin, anxiety, or irregular appetite?",
    options: ["Never", "Sometimes", "Often"],
  },
  {
    key: "prakriti_pitta",
    label: "Do you experience strong hunger, irritability, or feel hot easily?",
    options: ["Never", "Sometimes", "Often"],
  },
  {
    key: "prakriti_kapha",
    label: "Do you feel lethargic, gain weight easily, or have oily skin?",
    options: ["Never", "Sometimes", "Often"],
  },
];

export function PrakritiStep({ onNext, onBack, initialData }: any) {
  const [answers, setAnswers] = useState(() => {
    const a: any = {};
    questions.forEach(q => { a[q.key] = initialData?.[q.key] || ""; });
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
          <CardTitle>Prakriti Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {questions.map(q => (
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
