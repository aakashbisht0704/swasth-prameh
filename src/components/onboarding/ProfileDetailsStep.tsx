"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function ProfileDetailsStep({ onNext, onBack, initialData }: any) {
  const [fullName, setFullName] = useState(initialData?.full_name || "");
  const [gender, setGender] = useState(initialData?.gender || "");
  const [age, setAge] = useState(initialData?.age || "");
  const [diabetesType, setDiabetesType] = useState(initialData?.diabetes_type || "");
  const [diagnosisDate, setDiagnosisDate] = useState(initialData?.diagnosis_date || "");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onNext({ 
      full_name: fullName, 
      gender, 
      age: parseInt(age), 
      diabetes_type: diabetesType, 
      diagnosis_date: diagnosisDate 
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <input
              id="full_name"
              className="w-full p-2 rounded border border-zinc-700 bg-zinc-900 text-white"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <input
              id="age"
              type="number"
              min="1"
              max="120"
              className="w-full p-2 rounded border border-zinc-700 bg-zinc-900 text-white"
              value={age}
              onChange={e => setAge(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <select
              id="gender"
              className="w-full p-2 rounded border border-zinc-700 bg-zinc-900 text-white"
              value={gender}
              onChange={e => setGender(e.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="diabetes_type">Type of Diabetes</Label>
            <select
              id="diabetes_type"
              className="w-full p-2 rounded border border-zinc-700 bg-zinc-900 text-white"
              value={diabetesType}
              onChange={e => setDiabetesType(e.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="Type 1">Type 1 Diabetes</option>
              <option value="Type 2">Type 2 Diabetes</option>
              <option value="Gestational">Gestational Diabetes</option>
              <option value="Prediabetes">Prediabetes</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="diagnosis_date">Diagnosis Date</Label>
            <input
              id="diagnosis_date"
              type="date"
              className="w-full p-2 rounded border border-zinc-700 bg-zinc-900 text-white"
              value={diagnosisDate}
              onChange={e => setDiagnosisDate(e.target.value)}
              required
            />
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-between mt-6">
        <Button type="button" variant="outline" onClick={onBack}>Back</Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}
