import { OnboardingStepper } from './OnboardingStepper';
import { ProfileDetailsStep } from './ProfileDetailsStep';
import { PrakritiMultiStepForm } from './prakriti/PrakritiMultiStepForm';
import { MedicalHistoryStep } from './MedicalHistoryStep';
import { ReportUploadStep } from './ReportUploadStep';
import { ParikshaStep } from './ParikshaStep';
import { LifestyleStep } from './LifestyleStep';

export const onboardingSteps = [
  { label: 'Profile', Component: ProfileDetailsStep },
  { label: 'Prakriti', Component: PrakritiMultiStepForm },
  { label: 'Medical History', Component: MedicalHistoryStep },
  { label: 'Reports', Component: ReportUploadStep },
  { label: 'Pariksha', Component: ParikshaStep },
  { label: 'Lifestyle', Component: LifestyleStep },
];

export { OnboardingStepper };
