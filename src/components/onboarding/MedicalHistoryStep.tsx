"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "../ui/textarea";

export function MedicalHistoryStep({ onNext, onBack, initialData }: any) {
  const [history, setHistory] = useState(initialData?.medical_history || {
    family_history_diabetes: "",
    hypertension: "",
    thyroid: "",
    allergies: "",
    surgical_history: "",
    gestational_diabetes: "",
    others: ""
  });

  const handleChange = (field: string, value: string) => {
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
          {/* Family History of Diabetes */}
          <div className="space-y-3">
            <Label>Family History of Diabetes</Label>
            <RadioGroup
              value={history.family_history_diabetes}
              onValueChange={(value) => handleChange("family_history_diabetes", value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Yes" id="diabetes_yes" />
                <Label htmlFor="diabetes_yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="No" id="diabetes_no" />
                <Label htmlFor="diabetes_no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Hypertension */}
          <div className="space-y-3">
            <Label>History of Hypertension (High Blood Pressure)</Label>
            <RadioGroup
              value={history.hypertension}
              onValueChange={(value) => handleChange("hypertension", value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Yes" id="hypertension_yes" />
                <Label htmlFor="hypertension_yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="No" id="hypertension_no" />
                <Label htmlFor="hypertension_no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Thyroid */}
          <div className="space-y-3">
            <Label>History of Thyroid Disorders</Label>
            <RadioGroup
              value={history.thyroid}
              onValueChange={(value) => handleChange("thyroid", value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Yes" id="thyroid_yes" />
                <Label htmlFor="thyroid_yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="No" id="thyroid_no" />
                <Label htmlFor="thyroid_no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Allergies */}
          <div className="space-y-3">
            <Label>Any Known Allergies</Label>
            <RadioGroup
              value={history.allergies}
              onValueChange={(value) => handleChange("allergies", value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Yes" id="allergies_yes" />
                <Label htmlFor="allergies_yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="No" id="allergies_no" />
                <Label htmlFor="allergies_no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Surgical History */}
          <div className="space-y-3">
            <Label>Any Surgical History</Label>
            <RadioGroup
              value={history.surgical_history}
              onValueChange={(value) => handleChange("surgical_history", value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Yes" id="surgical_yes" />
                <Label htmlFor="surgical_yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="No" id="surgical_no" />
                <Label htmlFor="surgical_no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Gestational Diabetes */}
          <div className="space-y-3">
            <Label>History of Gestational Diabetes (if applicable)</Label>
            <RadioGroup
              value={history.gestational_diabetes}
              onValueChange={(value) => handleChange("gestational_diabetes", value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Yes" id="gd_yes" />
                <Label htmlFor="gd_yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="No" id="gd_no" />
                <Label htmlFor="gd_no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Others */}
          <div className="space-y-3">
            <Label htmlFor="others">Others (if any)</Label>
            <Textarea
              id="others"
              placeholder="Any additional medical information or comments..."
              value={history.others || ""}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange("others", e.target.value)}
              className="min-h-[80px]"
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
