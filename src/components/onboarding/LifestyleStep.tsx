"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "../ui/textarea";

export function LifestyleStep({ onNext, onBack, initialData }: any) {
  const [lifestyle, setLifestyle] = useState(initialData?.lifestyle || {
    diet_type: "",
    exercise_regularly: "",
    sleep_hours: "",
    stress_level: "",
    water_intake: "",
    smoking: "",
    alcohol: "",
    screen_time: "",
    others: ""
  });

  const handleChange = (field: string, value: string) => {
    setLifestyle((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onNext({ lifestyle });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Dietary Habits */}
      <Card>
        <CardHeader>
          <CardTitle>Dietary Habits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Diet Type</Label>
            <Select value={lifestyle.diet_type} onValueChange={(value: string) => handleChange("diet_type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your diet type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                <SelectItem value="Non-vegetarian">Non-vegetarian</SelectItem>
                <SelectItem value="Vegan">Vegan</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Physical Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Physical Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Do you exercise regularly?</Label>
            <RadioGroup value={lifestyle.exercise_regularly} onValueChange={(value) => handleChange("exercise_regularly", value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Yes" id="exercise_yes" />
                <Label htmlFor="exercise_yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="No" id="exercise_no" />
                <Label htmlFor="exercise_no">No</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Sleep Patterns */}
      <Card>
        <CardHeader>
          <CardTitle>Sleep Patterns</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Average hours of sleep daily</Label>
            <Select value={lifestyle.sleep_hours} onValueChange={(value: string) => handleChange("sleep_hours", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select sleep duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="<5">Less than 5 hours</SelectItem>
                <SelectItem value="5-7">5-7 hours</SelectItem>
                <SelectItem value="7-9">7-9 hours</SelectItem>
                <SelectItem value=">9">More than 9 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stress & Mental Health */}
      <Card>
        <CardHeader>
          <CardTitle>Stress & Mental Health</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Stress Level</Label>
            <Select value={lifestyle.stress_level} onValueChange={(value: string) => handleChange("stress_level", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select stress level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Moderate">Moderate</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Health Habits */}
      <Card>
        <CardHeader>
          <CardTitle>Health Habits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Water Intake</Label>
            <Select value={lifestyle.water_intake} onValueChange={(value: string) => handleChange("water_intake", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select water intake" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="<1L">Less than 1L</SelectItem>
                <SelectItem value="1-2L">1-2L</SelectItem>
                <SelectItem value="2-3L">2-3L</SelectItem>
                <SelectItem value=">3L">More than 3L</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Smoking</Label>
            <RadioGroup value={lifestyle.smoking} onValueChange={(value) => handleChange("smoking", value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Yes" id="smoking_yes" />
                <Label htmlFor="smoking_yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="No" id="smoking_no" />
                <Label htmlFor="smoking_no">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Alcohol Use</Label>
            <RadioGroup value={lifestyle.alcohol} onValueChange={(value) => handleChange("alcohol", value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Yes" id="alcohol_yes" />
                <Label htmlFor="alcohol_yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="No" id="alcohol_no" />
                <Label htmlFor="alcohol_no">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Screen Time</Label>
            <Select value={lifestyle.screen_time} onValueChange={(value: string) => handleChange("screen_time", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select screen time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="<2h">Less than 2h</SelectItem>
                <SelectItem value="2-4h">2-4h</SelectItem>
                <SelectItem value=">4h">More than 4h</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Others */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="others">Others (if any)</Label>
            <Textarea
              id="others"
              placeholder="Any additional lifestyle information or comments..."
              value={lifestyle.others || ""}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange("others", e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button type="button" variant="outline" onClick={onBack}>Back</Button>
        <Button type="submit">Finish</Button>
      </div>
    </form>
  );
}
