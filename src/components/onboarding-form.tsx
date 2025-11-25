"use client";

import { useEffect, useState } from "react";
import { onboardingSteps, OnboardingStepper } from "@/components/onboarding";
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { OnboardingSkeleton } from '@/components/skeletons/OnboardingSkeleton';

export function OnboardingForm() {
  const [initialData, setInitialData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Fetch onboarding and profile data for the current user
    (async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }
      // Fetch onboarding
      const { data: onboarding } = await supabase
        .from('onboarding')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      // Fetch profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      setInitialData({ ...profile, ...onboarding });
      setLoading(false);
    })();
  }, [router]);

  const handleComplete = async (allData: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    // Extract investigation data if present
    const { full_name, gender, dob, investigation, ...rest } = allData;
    
    // Save profile details (first step)
    await supabase
      .from('user_profiles')
      .upsert({ user_id: user.id, full_name, gender, dob });
    
    // Prepare onboarding data
    const onboardingData: any = { ...rest, gender, user_id: user.id };
    
    // If investigation data exists, include it
    if (investigation) {
      onboardingData.investigation = investigation;
    }
    
    // Upsert onboarding data
    const { error } = await supabase
      .from('onboarding')
      .upsert(onboardingData, { onConflict: 'user_id' });
    
    if (!error) {
      router.push('/dashboard');
    } else {
      alert('Failed to save onboarding: ' + error.message);
    }
  };

  if (loading) return <OnboardingSkeleton />;

  return (
    <OnboardingStepper
      steps={onboardingSteps}
      onComplete={handleComplete}
      initialData={initialData}
    />
  );
}