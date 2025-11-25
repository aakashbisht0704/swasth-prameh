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
    
    // Extract profile fields and investigation
    const { 
      full_name, 
      gender, 
      dob, 
      investigation,
      avatar_url, // Remove from onboarding data
      email, // Remove from onboarding data
      phone, // Remove from onboarding data
      role, // Remove from onboarding data
      ...onboardingFields 
    } = allData;
    
    // Save profile details (use id, not user_id)
    await supabase
      .from('user_profiles')
      .upsert({ 
        id: user.id, 
        full_name, 
        gender, 
        dob,
        email: user.email || null
      }, { onConflict: 'id' });
    
    // Prepare onboarding data - only include valid onboarding fields
    const onboardingData: any = { 
      user_id: user.id,
      gender, // Keep gender in onboarding for compatibility
      investigation: investigation || null,
      // Include only valid onboarding fields
      prakriti_scores: onboardingFields.prakriti_scores || null,
      prakriti_totals: onboardingFields.prakriti_totals || null,
      prakriti_summary: onboardingFields.prakriti_summary || null,
      lifestyle: onboardingFields.lifestyle || null,
      medical_history: onboardingFields.medical_history || null,
      report_url: onboardingFields.report_url || null,
      // Include other valid onboarding fields if they exist
      ...(onboardingFields.age && { age: onboardingFields.age }),
      ...(onboardingFields.diabetes_type && { diabetes_type: onboardingFields.diabetes_type }),
      ...(onboardingFields.diagnosis_date && { diagnosis_date: onboardingFields.diagnosis_date }),
      ...(onboardingFields.current_medications && { current_medications: onboardingFields.current_medications }),
      ...(onboardingFields.ayurvedic_experience !== undefined && { ayurvedic_experience: onboardingFields.ayurvedic_experience }),
      // Pariksha fields
      ...(onboardingFields.nadi && { nadi: onboardingFields.nadi }),
      ...(onboardingFields.mutra && { mutra: onboardingFields.mutra }),
      ...(onboardingFields.mala && { mala: onboardingFields.mala }),
      ...(onboardingFields.jihwa && { jihwa: onboardingFields.jihwa }),
      ...(onboardingFields.shabda && { shabda: onboardingFields.shabda }),
      ...(onboardingFields.sparsha && { sparsha: onboardingFields.sparsha }),
      ...(onboardingFields.drik && { drik: onboardingFields.drik }),
      ...(onboardingFields.akriti && { akriti: onboardingFields.akriti }),
    };
    
    // Upsert onboarding data
    const { error } = await supabase
      .from('onboarding')
      .upsert(onboardingData, { onConflict: 'user_id' });
    
    if (!error) {
      router.push('/dashboard');
    } else {
      console.error('Onboarding save error:', error);
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