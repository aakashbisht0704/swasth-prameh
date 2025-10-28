"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

export function MedicalHistoryStep({ onNext, onBack, initialData }: any) {
  const [history, setHistory] = useState(initialData?.medical_history || {
    familyHistory: { diabetes: false, other: "" },
    pastHistory: "",
    surgicalHistory: "",
    allergies: "",
    occupationalHistory: "",
    chiefComplaint: "",
    menstrualHistory: "",
    gestationalDiabetes: false
  });

  const handleChange = (field: string, value: any) => {
    setHistory((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onNext({ medical_history: history });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Medical History</CardTitle>
          <p className="text-sm text-muted-foreground">Please provide your medical information</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Family History */}
          <div className="space-y-3">
            <Label>Family History of Diabetes</Label>
            <RadioGroup
              value={history.familyHistory?.diabetes ? "yes" : history.familyHistory?.diabetes === false ? "no" : ""}
              onValueChange={(value) => handleChange("familyHistory", { ...history.familyHistory, diabetes: value === "yes" })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="diabetes_yes" />
                <Label htmlFor="diabetes_yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="diabetes_no" />
                <Label htmlFor="diabetes_no">No</Label>
              </div>
            </RadioGroup>
            <Input
              placeholder="Other family medical history (optional)"
              value={history.familyHistory?.other || ""}
              onChange={(e) => handleChange("familyHistory", { ...history.familyHistory, other: e.target.value })}
            />
          </div>

          {/* Past Medical History */}
          <div className="space-y-2">
            <Label htmlFor="pastHistory">Past Medical History</Label>
            <textarea
              id="pastHistory"
              className="w-full min-h-[80px] p-2 rounded-md border border-input bg-background"
              placeholder="e.g., Hypertension, Thyroid, etc."
              value={history.pastHistory || ""}
              onChange={(e) => handleChange("pastHistory", e.target.value)}
            />
          </div>

          {/* Surgical History */}
          <div className="space-y-2">
            <Label htmlFor="surgicalHistory">Surgical History</Label>
            <textarea
              id="surgicalHistory"
              className="w-full min-h-[80px] p-2 rounded-md border border-input bg-background"
              placeholder="Any surgeries or procedures"
              value={history.surgicalHistory || ""}
              onChange={(e) => handleChange("surgicalHistory", e.target.value)}
            />
          </div>

          {/* Allergies */}
          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies (if any)</Label>
            <Input
              id="allergies"
              placeholder="List any allergies"
              value={history.allergies || ""}
              onChange={(e) => handleChange("allergies", e.target.value)}
            />
          </div>

          {/* Occupational History */}
          <div className="space-y-2">
            <Label htmlFor="occupationalHistory">Occupational History</Label>
            <Input
              id="occupationalHistory"
              placeholder="Your occupation"
              value={history.occupationalHistory || ""}
              onChange={(e) => handleChange("occupationalHistory", e.target.value)}
            />
          </div>

          {/* Chief Complaint */}
          <div className="space-y-2">
            <Label htmlFor="chiefComplaint">Chief Complaint</Label>
            <textarea
              id="chiefComplaint"
              className="w-full min-h-[80px] p-2 rounded-md border border-input bg-background"
              placeholder="Main reason for seeking Ayurvedic care"
              value={history.chiefComplaint || ""}
              onChange={(e) => handleChange("chiefComplaint", e.target.value)}
              required
            />
          </div>

          {/* Menstrual History */}
          <div className="space-y-2">
            <Label htmlFor="menstrualHistory">Menstrual History (if applicable)</Label>
            <textarea
              id="menstrualHistory"
              className="w-full min-h-[80px] p-2 rounded-md border border-input bg-background"
              placeholder="Cycle regularity, any disorders, etc."
              value={history.menstrualHistory || ""}
              onChange={(e) => handleChange("menstrualHistory", e.target.value)}
            />
          </div>

          {/* Gestational Diabetes */}
          <div className="space-y-3">
            <Label>History of Gestational Diabetes</Label>
            <RadioGroup
              value={history.gestationalDiabetes ? "yes" : history.gestationalDiabetes === false ? "no" : ""}
              onValueChange={(value) => handleChange("gestationalDiabetes", value === "yes")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="gd_yes" />
                <Label htmlFor="gd_yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="gd_no" />
                <Label htmlFor="gd_no">No</Label>
              </div>
            </RadioGroup>
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
