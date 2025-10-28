'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PrakritiQuestion } from './PrakritiQuestion'
import { PrakritiSummaryCard } from './PrakritiSummaryCard'
import { toast } from 'react-hot-toast'
import { Progress } from '@/components/ui/progress'

interface PrakritiMultiStepFormProps {
  onNext: (data: any) => void
  onBack: () => void
  initialData?: any
}

// Comprehensive Prakriti questions for each dosha
const prakritiQuestions = {
  vata: [
    { id: 'vata_q1', label: 'I have a thin, light build and find it difficult to gain weight' },
    { id: 'vata_q2', label: 'My skin is dry and tends to crack, especially in winter' },
    { id: 'vata_q3', label: 'I learn quickly but forget easily' },
    { id: 'vata_q4', label: 'I tend to be energetic and enthusiastic when I start new projects' },
    { id: 'vata_q5', label: 'I have irregular eating and sleeping habits' },
    { id: 'vata_q6', label: 'I prefer warm, humid weather over cold, dry weather' },
    { id: 'vata_q7', label: 'I speak quickly and tend to interrupt others' },
    { id: 'vata_q8', label: 'I am creative and artistic' },
    { id: 'vata_q9', label: 'I have variable energy levels throughout the day' },
    { id: 'vata_q10', label: 'I tend to worry and feel anxious easily' },
    { id: 'vata_q11', label: 'I have cold hands and feet' },
    { id: 'vata_q12', label: 'I prefer warm foods and drinks' }
  ],
  pitta: [
    { id: 'pitta_q1', label: 'I have a medium build and maintain my weight easily' },
    { id: 'pitta_q2', label: 'My skin is sensitive and tends to get sunburned easily' },
    { id: 'pitta_q3', label: 'I have a sharp memory and good concentration' },
    { id: 'pitta_q4', label: 'I am ambitious and competitive by nature' },
    { id: 'pitta_q5', label: 'I have regular eating and sleeping habits' },
    { id: 'pitta_q6', label: 'I prefer cool weather and cannot tolerate heat well' },
    { id: 'pitta_q7', label: 'I speak clearly and articulately' },
    { id: 'pitta_q8', label: 'I am organized and detail-oriented' },
    { id: 'pitta_q9', label: 'I have steady, consistent energy levels' },
    { id: 'pitta_q10', label: 'I can be irritable when hungry' },
    { id: 'pitta_q11', label: 'I have warm hands and feet' },
    { id: 'pitta_q12', label: 'I prefer cool foods and drinks' }
  ],
  kapha: [
    { id: 'kapha_q1', label: 'I have a solid, heavy build and gain weight easily' },
    { id: 'kapha_q2', label: 'My skin is thick, smooth, and tends to be oily' },
    { id: 'kapha_q3', label: 'I learn slowly but retain information well' },
    { id: 'kapha_q4', label: 'I am calm and steady in my approach to life' },
    { id: 'kapha_q5', label: 'I have regular eating and sleeping habits' },
    { id: 'kapha_q6', label: 'I prefer warm, dry weather over cool, damp weather' },
    { id: 'kapha_q7', label: 'I speak slowly and thoughtfully' },
    { id: 'kapha_q8', label: 'I am loyal and supportive of others' },
    { id: 'kapha_q9', label: 'I have steady, consistent energy but need motivation to start' },
    { id: 'kapha_q10', label: 'I rarely get angry and am slow to react' },
    { id: 'kapha_q11', label: 'I have cool hands and feet' },
    { id: 'kapha_q12', label: 'I prefer warm, spicy foods' }
  ]
}

interface PrakritiScores {
  vata: Record<string, number>
  pitta: Record<string, number>
  kapha: Record<string, number>
}

interface PrakritiTotals {
  vata_total: number
  pitta_total: number
  kapha_total: number
}

interface PrakritiSummary {
  dominant: string
  mixed?: string[]
  explanation: string
}

// Create steps with 4 questions each, mixing doshas for variety
const createSteps = () => {
  const steps = []
  const allQuestions = [
    ...prakritiQuestions.vata.map(q => ({ ...q, dosha: 'vata' })),
    ...prakritiQuestions.pitta.map(q => ({ ...q, dosha: 'pitta' })),
    ...prakritiQuestions.kapha.map(q => ({ ...q, dosha: 'kapha' }))
  ]
  
  // Shuffle questions for variety
  const shuffledQuestions = [...allQuestions].sort(() => Math.random() - 0.5)
  
  // Create steps with 4 questions each
  for (let i = 0; i < shuffledQuestions.length; i += 4) {
    steps.push(shuffledQuestions.slice(i, i + 4))
  }
  
  return steps
}

export function PrakritiMultiStepForm({ onNext, onBack, initialData }: PrakritiMultiStepFormProps) {
  const [scores, setScores] = useState<PrakritiScores>({
    vata: {},
    pitta: {},
    kapha: {}
  })
  
  const [currentStep, setCurrentStep] = useState(0)
  const [steps] = useState(createSteps())
  const [showSummary, setShowSummary] = useState(false)
  const [calculatedResults, setCalculatedResults] = useState<{
    totals: PrakritiTotals
    summary: PrakritiSummary
  } | null>(null)

  useEffect(() => {
    if (initialData?.prakriti_scores) {
      setScores(initialData.prakriti_scores)
    }
  }, [initialData])

  const handleQuestionChange = (questionId: string, dosha: string, value: number) => {
    setScores(prev => ({
      ...prev,
      [dosha]: {
        ...prev[dosha as keyof PrakritiScores],
        [questionId]: value
      }
    }))
  }

  const isCurrentStepComplete = () => {
    const currentStepQuestions = steps[currentStep]
    return currentStepQuestions.every(q => (scores[q.dosha as keyof PrakritiScores][q.id] || 0) > 0)
  }

  const isAllStepsComplete = () => {
    const allQuestions = steps.flat()
    return allQuestions.every(q => (scores[q.dosha as keyof PrakritiScores][q.id] || 0) > 0)
  }

  const calculatePrakriti = () => {
    // Calculate totals
    const totals: PrakritiTotals = {
      vata_total: Object.values(scores.vata).reduce((sum, score) => sum + score, 0),
      pitta_total: Object.values(scores.pitta).reduce((sum, score) => sum + score, 0),
      kapha_total: Object.values(scores.kapha).reduce((sum, score) => sum + score, 0)
    }

    // Determine dominant prakriti
    const { vata_total, pitta_total, kapha_total } = totals
    const maxScore = Math.max(vata_total, pitta_total, kapha_total)
    const minScore = Math.min(vata_total, pitta_total, kapha_total)
    const difference = maxScore - minScore
    const totalPossibleScore = 12 * 6 // 12 questions per dosha, max 6 points each
    const percentageDifference = (difference / totalPossibleScore) * 100

    let dominant: string
    let mixed: string[] = []
    let explanation: string

    if (percentageDifference < 5) {
      // Balanced
      dominant = 'Balanced'
      explanation = 'You have a balanced constitution with all three doshas in harmony. This is rare and indicates excellent health potential.'
    } else if (percentageDifference < 10) {
      // Mixed constitution
      const doshas = []
      if (vata_total >= pitta_total && vata_total >= kapha_total) doshas.push('Vata')
      if (pitta_total >= vata_total && pitta_total >= kapha_total) doshas.push('Pitta')
      if (kapha_total >= vata_total && kapha_total >= pitta_total) doshas.push('Kapha')
      
      dominant = 'Mixed'
      mixed = doshas
      explanation = `You have a mixed constitution with ${doshas.join('-')} predominance. This creates a unique blend of characteristics.`
    } else {
      // Single dominant dosha
      if (vata_total === maxScore) {
        dominant = 'Vata'
        explanation = 'You have a Vata-dominant constitution. You tend to be creative, energetic, and adaptable, but may experience anxiety and irregularity.'
      } else if (pitta_total === maxScore) {
        dominant = 'Pitta'
        explanation = 'You have a Pitta-dominant constitution. You are driven, focused, and intelligent, but may be prone to anger and perfectionism.'
      } else {
        dominant = 'Kapha'
        explanation = 'You have a Kapha-dominant constitution. You are stable, loyal, and compassionate, but may struggle with inertia and weight gain.'
      }
    }

    const summary: PrakritiSummary = {
      dominant,
      mixed: mixed.length > 0 ? mixed : undefined,
      explanation
    }

    setCalculatedResults({ totals, summary })
    setShowSummary(true)
  }

  const handleNext = () => {
    if (!calculatedResults) {
      toast.error('Please calculate your Prakriti first')
      return
    }

    const prakritiData = {
      prakriti_scores: scores,
      prakriti_totals: calculatedResults.totals,
      prakriti_summary: calculatedResults.summary
    }

    onNext(prakritiData)
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      calculatePrakriti()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const totalQuestions = steps.flat().length
  const answeredQuestions = Object.values(scores).flatMap(Object.values).filter(score => score > 0).length
  const progressPercentage = (answeredQuestions / totalQuestions) * 100

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Prakriti Assessment</CardTitle>
          <div className="text-sm text-muted-foreground mb-4">
            Rate each statement from 0 (not at all) to 6 (completely) based on how well it describes you.
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>Overall progress: {answeredQuestions} / {totalQuestions}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="text-center text-sm text-muted-foreground">
              {isAllStepsComplete() ? 'Assessment complete! Click Next to see results.' : 'Complete all questions in this step to continue.'}
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Step {currentStep + 1} of {steps.length}</CardTitle>
          <div className="text-sm text-muted-foreground">
            Answer these 4 questions to continue your assessment.
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {steps[currentStep]?.map((question) => (
            <PrakritiQuestion
              key={question.id}
              id={question.id}
              label={question.label}
              value={scores[question.dosha as keyof PrakritiScores][question.id] || 0}
              onChange={(value) => handleQuestionChange(question.id, question.dosha, value)}
            />
          ))}
        </CardContent>
      </Card>

      {showSummary && calculatedResults && (
        <PrakritiSummaryCard
          totals={calculatedResults.totals}
          summary={calculatedResults.summary}
        />
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Previous Step
        </Button>
        
        <div className="flex gap-2">
          {currentStep > 0 && (
            <Button variant="outline" onClick={prevStep}>
              Previous
            </Button>
          )}
          
          {currentStep < steps.length - 1 ? (
            <Button
              onClick={nextStep}
              disabled={!isCurrentStepComplete()}
            >
              Next Step
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              disabled={!isCurrentStepComplete()}
              variant="secondary"
            >
              Calculate Prakriti
            </Button>
          )}
          
          {showSummary && calculatedResults && (
            <Button onClick={handleNext}>
              Continue
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
