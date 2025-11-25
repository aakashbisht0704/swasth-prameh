import { OnboardingStepper } from './OnboardingStepper';
import { ProfileDetailsStep } from './ProfileDetailsStep';
import { PrakritiMultiStepForm } from './prakriti/PrakritiMultiStepForm';
import { InvestigationWizard } from './InvestigationWizard';
import { MedicalHistoryStep } from './MedicalHistoryStep';
import { ReportUploadStep } from './ReportUploadStep';
import { ParikshaStep } from './ParikshaStep';
import { LifestyleStep } from './LifestyleStep';

export const onboardingSteps = [
  { label: 'Profile', Component: ProfileDetailsStep },
  { label: 'Prakriti', Component: PrakritiMultiStepForm },
  { label: 'Investigation', Component: InvestigationWizard },
  { label: 'Medical History', Component: MedicalHistoryStep },
  { label: 'Reports', Component: ReportUploadStep },
  { label: 'Pariksha', Component: ParikshaStep },
  { label: 'Lifestyle', Component: LifestyleStep },
];

export { OnboardingStepper };
