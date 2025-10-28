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
    // Save profile details (first step)
    const { full_name, gender, dob, ...rest } = allData;
    await supabase
      .from('user_profiles')
      .upsert({ user_id: user.id, full_name, gender, dob });
    // Upsert onboarding data - ensure gender is included
    const { error } = await supabase
      .from('onboarding')
      .upsert({ ...rest, gender, user_id: user.id }, { onConflict: 'user_id' });
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