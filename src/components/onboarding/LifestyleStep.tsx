"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export function LifestyleStep({ onNext, onBack, initialData }: any) {
  const [lifestyle, setLifestyle] = useState(initialData?.lifestyle || {
    // Section 1: Dietary Habits
    mealsPerDay: "",
    dietType: "",
    sweetsFrequency: "",
    friedFoodFrequency: "",
    freshFruitsFrequency: "",
    regularMealTimes: "",
    digestiveCapacity: "",
    
    // Section 2: Physical Activity
    exercisesRegularly: "",
    exerciseType: "",
    exerciseFrequency: "",
    hoursSitting: "",
    
    // Section 3: Sleep Patterns
    hoursOfSleep: "",
    feelsRested: "",
    difficultySleeping: "",
    
    // Section 4: Stress & Mental Health
    stressFrequency: "",
    stressManagement: "",
    feelsAnxious: ""
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
      {/* Section 1: Dietary Habits */}
      <Card>
        <CardHeader>
          <CardTitle>Section 1: Dietary Habits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>How many meals do you eat per day?</Label>
            <RadioGroup value={lifestyle.mealsPerDay} onValueChange={(val) => handleChange("mealsPerDay", val)}>
              <div className="flex items-center space-x-2"><RadioGroupItem value="1" id="meals_1" /><Label htmlFor="meals_1">1</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="2" id="meals_2" /><Label htmlFor="meals_2">2</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="3" id="meals_3" /><Label htmlFor="meals_3">3</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="more" id="meals_more" /><Label htmlFor="meals_more">More than 3</Label></div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Do you follow any specific diet?</Label>
            <RadioGroup value={lifestyle.dietType} onValueChange={(val) => handleChange("dietType", val)}>
              <div className="flex items-center space-x-2"><RadioGroupItem value="vegetarian" id="diet_veg" /><Label htmlFor="diet_veg">Vegetarian</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="non-vegetarian" id="diet_nonveg" /><Label htmlFor="diet_nonveg">Non-vegetarian</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="vegan" id="diet_vegan" /><Label htmlFor="diet_vegan">Vegan</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="other" id="diet_other" /><Label htmlFor="diet_other">Other</Label></div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Sweets/sugar-rich foods consumption</Label>
            <RadioGroup value={lifestyle.sweetsFrequency} onValueChange={(val) => handleChange("sweetsFrequency", val)}>
              <div className="flex items-center space-x-2"><RadioGroupItem value="daily" id="sweets_daily" /><Label htmlFor="sweets_daily">Daily</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="weekly" id="sweets_weekly" /><Label htmlFor="sweets_weekly">Weekly</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="occasionally" id="sweets_occasionally" /><Label htmlFor="sweets_occasionally">Occasionally</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="rarely" id="sweets_rarely" /><Label htmlFor="sweets_rarely">Rarely</Label></div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Fried/junk food consumption</Label>
            <RadioGroup value={lifestyle.friedFoodFrequency} onValueChange={(val) => handleChange("friedFoodFrequency", val)}>
              <div className="flex items-center space-x-2"><RadioGroupItem value="daily" id="fried_daily" /><Label htmlFor="fried_daily">Daily</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="weekly" id="fried_weekly" /><Label htmlFor="fried_weekly">Weekly</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="occasionally" id="fried_occasionally" /><Label htmlFor="fried_occasionally">Occasionally</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="rarely" id="fried_rarely" /><Label htmlFor="fried_rarely">Rarely</Label></div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Fresh fruits & vegetables consumption</Label>
            <RadioGroup value={lifestyle.freshFruitsFrequency} onValueChange={(val) => handleChange("freshFruitsFrequency", val)}>
              <div className="flex items-center space-x-2"><RadioGroupItem value="daily" id="fruits_daily" /><Label htmlFor="fruits_daily">Daily</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="weekly" id="fruits_weekly" /><Label htmlFor="fruits_weekly">Weekly</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="occasionally" id="fruits_occasionally" /><Label htmlFor="fruits_occasionally">Occasionally</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="rarely" id="fruits_rarely" /><Label htmlFor="fruits_rarely">Rarely</Label></div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Do you eat meals at regular times?</Label>
            <RadioGroup value={lifestyle.regularMealTimes} onValueChange={(val) => handleChange("regularMealTimes", val)}>
              <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="regular_yes" /><Label htmlFor="regular_yes">Yes</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="regular_no" /><Label htmlFor="regular_no">No</Label></div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>How is your digestive capacity/fire?</Label>
            <RadioGroup value={lifestyle.digestiveCapacity} onValueChange={(val) => handleChange("digestiveCapacity", val)}>
              <div className="flex items-center space-x-2"><RadioGroupItem value="mild" id="digest_mild" /><Label htmlFor="digest_mild">Mild</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="medium" id="digest_medium" /><Label htmlFor="digest_medium">Medium</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="strong" id="digest_strong" /><Label htmlFor="digest_strong">Strong</Label></div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Physical Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Section 2: Physical Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Do you exercise regularly?</Label>
            <RadioGroup value={lifestyle.exercisesRegularly} onValueChange={(val) => handleChange("exercisesRegularly", val)}>
              <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="exercise_yes" /><Label htmlFor="exercise_yes">Yes</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="exercise_no" /><Label htmlFor="exercise_no">No</Label></div>
            </RadioGroup>
          </div>

          {lifestyle.exercisesRegularly === "yes" && (
            <>
              <div className="space-y-2">
                <Label>What type of exercise?</Label>
                <Input
                  placeholder="Walking, Yoga, Gym, Sports, etc."
                  value={lifestyle.exerciseType || ""}
                  onChange={(e) => handleChange("exerciseType", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>How often do you exercise?</Label>
                <RadioGroup value={lifestyle.exerciseFrequency} onValueChange={(val) => handleChange("exerciseFrequency", val)}>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="daily" id="freq_daily" /><Label htmlFor="freq_daily">Daily</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="3-5_times" id="freq_3-5" /><Label htmlFor="freq_3-5">3-5 times/week</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="rarely" id="freq_rarely" /><Label htmlFor="freq_rarely">Rarely</Label></div>
                </RadioGroup>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label>Hours per day spent sitting/being inactive?</Label>
            <RadioGroup value={lifestyle.hoursSitting} onValueChange={(val) => handleChange("hoursSitting", val)}>
              <div className="flex items-center space-x-2"><RadioGroupItem value="<4" id="sit_<4" /><Label htmlFor="sit_<4">Less than 4 hrs</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="4-6" id="sit_4-6" /><Label htmlFor="sit_4-6">4-6 hrs</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="6-8" id="sit_6-8" /><Label htmlFor="sit_6-8">6-8 hrs</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value=">8" id="sit_>8" /><Label htmlFor="sit_>8">More than 8 hrs</Label></div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Sleep Patterns */}
      <Card>
        <CardHeader>
          <CardTitle>Section 3: Sleep Patterns</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Average hours of sleep daily</Label>
            <RadioGroup value={lifestyle.hoursOfSleep} onValueChange={(val) => handleChange("hoursOfSleep", val)}>
              <div className="flex items-center space-x-2"><RadioGroupItem value="<5" id="sleep_<5" /><Label htmlFor="sleep_<5">Less than 5 hrs</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="5-7" id="sleep_5-7" /><Label htmlFor="sleep_5-7">5-7 hrs</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="7-9" id="sleep_7-9" /><Label htmlFor="sleep_7-9">7-9 hrs</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value=">9" id="sleep_>9" /><Label htmlFor="sleep_>9">More than 9 hrs</Label></div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Do you feel rested after waking up?</Label>
            <RadioGroup value={lifestyle.feelsRested} onValueChange={(val) => handleChange("feelsRested", val)}>
              <div className="flex items-center space-x-2"><RadioGroupItem value="always" id="rested_always" /><Label htmlFor="rested_always">Always</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="sometimes" id="rested_sometimes" /><Label htmlFor="rested_sometimes">Sometimes</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="rarely" id="rested_rarely" /><Label htmlFor="rested_rarely">Rarely</Label></div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Difficulty falling or staying asleep?</Label>
            <RadioGroup value={lifestyle.difficultySleeping} onValueChange={(val) => handleChange("difficultySleeping", val)}>
              <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="sleep_diff_yes" /><Label htmlFor="sleep_diff_yes">Yes</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="sleep_diff_no" /><Label htmlFor="sleep_diff_no">No</Label></div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Stress & Mental Health */}
      <Card>
        <CardHeader>
          <CardTitle>Section 4: Stress & Mental Health</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>How often do you feel stressed?</Label>
            <RadioGroup value={lifestyle.stressFrequency} onValueChange={(val) => handleChange("stressFrequency", val)}>
              <div className="flex items-center space-x-2"><RadioGroupItem value="always" id="stress_always" /><Label htmlFor="stress_always">Always</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="often" id="stress_often" /><Label htmlFor="stress_often">Often</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="sometimes" id="stress_sometimes" /><Label htmlFor="stress_sometimes">Sometimes</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="rarely" id="stress_rarely" /><Label htmlFor="stress_rarely">Rarely</Label></div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>How do you manage stress?</Label>
            <Input
              placeholder="Meditation, Exercise, Talking, etc."
              value={lifestyle.stressManagement || ""}
              onChange={(e) => handleChange("stressManagement", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Do you often feel anxious, irritable, or low?</Label>
            <RadioGroup value={lifestyle.feelsAnxious} onValueChange={(val) => handleChange("feelsAnxious", val)}>
              <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="anxious_yes" /><Label htmlFor="anxious_yes">Yes</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="anxious_no" /><Label htmlFor="anxious_no">No</Label></div>
            </RadioGroup>
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
