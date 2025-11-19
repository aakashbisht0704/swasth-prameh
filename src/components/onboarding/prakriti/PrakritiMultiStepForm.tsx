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
  
  // Remove duplicates by question ID to ensure each question appears only once
  const uniqueQuestions = Array.from(
    new Map(allQuestions.map(q => [q.id, q])).values()
  )
  
  // Shuffle questions for variety
  const shuffledQuestions = [...uniqueQuestions].sort(() => Math.random() - 0.5)
  
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
    } else {
      // Initialize all questions to 0 if no initial data
      // This ensures 0 is a valid default answer
      const allQuestions = steps.flat()
      setScores(prev => {
        const updated = { ...prev }
        let changed = false

        allQuestions.forEach(q => {
          const dosha = q.dosha as keyof PrakritiScores
          if (updated[dosha][q.id] === undefined || updated[dosha][q.id] === null) {
            updated[dosha] = {
              ...updated[dosha],
              [q.id]: 0
            }
            changed = true
          }
        })

        return changed ? updated : prev
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData])

  // Initialize unanswered questions in current step to 0 when step changes
  useEffect(() => {
    if (currentStep >= 0 && currentStep < steps.length) {
      const currentStepQuestions = steps[currentStep] || []
      const needsInitialization = currentStepQuestions.some(q => {
        const value = scores[q.dosha as keyof PrakritiScores][q.id]
        return value === undefined || value === null
      })

      if (needsInitialization) {
        setScores(prev => {
          const updated = { ...prev }
          let changed = false

          currentStepQuestions.forEach(q => {
            const dosha = q.dosha as keyof PrakritiScores
            if (updated[dosha][q.id] === undefined || updated[dosha][q.id] === null) {
              updated[dosha] = {
                ...updated[dosha],
                [q.id]: 0
              }
              changed = true
            }
          })

          return changed ? updated : prev
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep])

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
    // Check if all questions have been answered (value is defined, 0 is valid)
    // Accept 0 as a valid answer - it means "not at all"
    return currentStepQuestions.every(q => {
      const value = scores[q.dosha as keyof PrakritiScores][q.id]
      // Value is valid if it's a number (including 0) and not undefined/null
      return typeof value === 'number' && value >= 0 && value <= 6
    })
  }

  const isAllStepsComplete = () => {
    const allQuestions = steps.flat()
    // Check if all questions have been answered (value is defined, 0 is valid)
    // Accept 0 as a valid answer - it means "not at all"
    return allQuestions.every(q => {
      const value = scores[q.dosha as keyof PrakritiScores][q.id]
      // Value is valid if it's a number (including 0) and not undefined/null
      return typeof value === 'number' && value >= 0 && value <= 6
    })
  }

  const calculatePrakriti = () => {
    // Calculate totals - only count defined values (0 is valid)
    const totals: PrakritiTotals = {
      vata_total: Object.values(scores.vata)
        .filter(score => score !== undefined && score !== null)
        .reduce((sum, score) => sum + (score || 0), 0),
      pitta_total: Object.values(scores.pitta)
        .filter(score => score !== undefined && score !== null)
        .reduce((sum, score) => sum + (score || 0), 0),
      kapha_total: Object.values(scores.kapha)
        .filter(score => score !== undefined && score !== null)
        .reduce((sum, score) => sum + (score || 0), 0)
    }

    // Determine dominant prakriti
    const { vata_total, pitta_total, kapha_total } = totals
    const maxScore = Math.max(vata_total, pitta_total, kapha_total)
    const minScore = Math.min(vata_total, pitta_total, kapha_total)
    const difference = maxScore - minScore
    const totalScore = vata_total + pitta_total + kapha_total
    const percentageDifference = totalScore > 0 ? (difference / totalScore) * 100 : 0

    let dominant: string
    let mixed: string[] = []
    let explanation: string

    // Determine which dosha(s) have the highest score
    const doshaScores = [
      { name: 'Vata', score: vata_total },
      { name: 'Pitta', score: pitta_total },
      { name: 'Kapha', score: kapha_total }
    ].sort((a, b) => b.score - a.score)

    if (percentageDifference < 5 || doshaScores[0].score === doshaScores[1].score) {
      // Balanced or tied
      dominant = 'Balanced'
      explanation = 'You have a balanced constitution with all three doshas in harmony. This is rare and indicates excellent health potential.'
    } else if (percentageDifference < 15) {
      // Mixed constitution - top two doshas are close
      const topDoshas = doshaScores
        .filter(d => Math.abs(d.score - doshaScores[0].score) <= (maxScore * 0.15))
        .map(d => d.name)
      
      dominant = 'Mixed'
      mixed = topDoshas
      explanation = `You have a mixed constitution with ${topDoshas.join('-')} predominance. This creates a unique blend of characteristics.`
    } else {
      // Single dominant dosha
      dominant = doshaScores[0].name
      if (dominant === 'Vata') {
        explanation = 'You have a Vata-dominant constitution. You tend to be creative, energetic, and adaptable, but may experience anxiety and irregularity.'
      } else if (dominant === 'Pitta') {
        explanation = 'You have a Pitta-dominant constitution. You are driven, focused, and intelligent, but may be prone to anger and perfectionism.'
      } else {
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
  const answeredQuestions = Object.values(scores).flatMap(Object.values).filter(score => score !== undefined && score !== null).length
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
          {steps[currentStep]?.map((question) => {
            const currentValue = scores[question.dosha as keyof PrakritiScores][question.id]
            // Use the current value, or 0 if undefined (should be initialized by useEffect)
            const displayValue = currentValue !== undefined && currentValue !== null ? currentValue : 0
            
            return (
              <PrakritiQuestion
                key={question.id}
                id={question.id}
                label={question.label}
                value={displayValue}
                onChange={(value) => {
                  // Always update the state, even if value is 0
                  // This ensures 0 is saved as a valid answer
                  handleQuestionChange(question.id, question.dosha, value)
                }}
              />
            )
          })}
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
