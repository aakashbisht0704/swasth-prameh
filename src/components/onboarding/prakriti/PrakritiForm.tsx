'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PrakritiGroup } from './PrakritiGroup'
import { PrakritiSummaryCard } from './PrakritiSummaryCard'
import { toast } from 'react-hot-toast'

interface PrakritiFormProps {
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

export function PrakritiForm({ onNext, onBack, initialData }: PrakritiFormProps) {
  const [scores, setScores] = useState<PrakritiScores>({
    vata: {},
    pitta: {},
    kapha: {}
  })
  
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

  const handleScoresChange = (dosha: keyof PrakritiScores, newScores: Record<string, number>) => {
    setScores(prev => ({
      ...prev,
      [dosha]: newScores
    }))
  }

  const calculatePrakriti = () => {
    // Calculate totals
    const totals: PrakritiTotals = {
      vata_total: Object.values(scores.vata).reduce((sum, score) => sum + score, 0),
      pitta_total: Object.values(scores.pitta).reduce((sum, score) => sum + score, 0),
      kapha_total: Object.values(scores.kapha).reduce((sum, score) => sum + score, 0)
    }

    // Determine dominant prakriti with mixed dosha support
    const { vata_total, pitta_total, kapha_total } = totals
    const scores = [
      { dosha: 'Vata', score: vata_total },
      { dosha: 'Pitta', score: pitta_total },
      { dosha: 'Kapha', score: kapha_total }
    ]
    
    // Sort by score descending
    const sortedScores = [...scores].sort((a, b) => b.score - a.score)
    const maxScore = sortedScores[0].score
    const secondScore = sortedScores[1].score
    const minScore = sortedScores[2].score

    // Check if doshas are close (within 10 points)
    const scoreThreshold = 10
    const isClose = (score1: number, score2: number) => Math.abs(score1 - score2) <= scoreThreshold

    let dominant: string
    let mixed: string[] = []
    let explanation: string

    // Determine constitution type
    if (maxScore === minScore || (isClose(maxScore, secondScore) && isClose(maxScore, minScore))) {
      // All three balanced - Tridoshic
      dominant = 'Tridoshic'
      mixed = ['Vata', 'Pitta', 'Kapha']
      explanation = 'You have a Tridoshic constitution with all three doshas balanced. This is rare and indicates excellent health potential, though you may need to maintain balance carefully.'
    } else if (isClose(maxScore, secondScore)) {
      // Two doshas close - Dual constitution
      mixed = [sortedScores[0].dosha, sortedScores[1].dosha]
      dominant = mixed.join('-')
      explanation = `You have a ${dominant} constitution. This mixed constitution creates a unique blend of characteristics from both doshas. You'll need personalized care that addresses both.`
    } else {
      // Single dominant dosha
      dominant = sortedScores[0].dosha
      if (dominant === 'Vata') {
        explanation = 'You have a Vata-dominant constitution. You tend to be creative, energetic, and adaptable, but may experience anxiety and irregularity. Focus on grounding, routine, and warm, nourishing foods.'
      } else if (dominant === 'Pitta') {
        explanation = 'You have a Pitta-dominant constitution. You are driven, focused, and intelligent, but may be prone to anger and perfectionism. Focus on cooling practices, moderation, and stress management.'
      } else {
        explanation = 'You have a Kapha-dominant constitution. You are stable, loyal, and compassionate, but may struggle with inertia and weight gain. Focus on regular exercise, warm foods, and stimulation.'
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

  const isComplete = () => {
    const vataComplete = prakritiQuestions.vata.every(q => scores.vata[q.id] > 0)
    const pittaComplete = prakritiQuestions.pitta.every(q => scores.pitta[q.id] > 0)
    const kaphaComplete = prakritiQuestions.kapha.every(q => scores.kapha[q.id] > 0)
    return vataComplete && pittaComplete && kaphaComplete
  }

  const totalAnswered = Object.values(scores).flatMap(Object.values).filter(score => score > 0).length
  const totalQuestions = Object.values(prakritiQuestions).flatMap(q => q).length

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Prakriti Assessment</CardTitle>
          <div className="text-sm text-muted-foreground">
            Rate each statement from 0 (not at all) to 6 (completely) based on how well it describes you.
            Complete all questions to calculate your Prakriti.
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span>Progress: {totalAnswered} / {totalQuestions}</span>
            <span className={isComplete() ? 'text-green-600' : 'text-orange-600'}>
              {isComplete() ? 'Complete ✓' : 'Incomplete'}
            </span>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6">
        <PrakritiGroup
          title="Vata Dosha"
          questions={prakritiQuestions.vata}
          scores={scores.vata}
          onScoresChange={(newScores) => handleScoresChange('vata', newScores)}
        />

        <PrakritiGroup
          title="Pitta Dosha"
          questions={prakritiQuestions.pitta}
          scores={scores.pitta}
          onScoresChange={(newScores) => handleScoresChange('pitta', newScores)}
        />

        <PrakritiGroup
          title="Kapha Dosha"
          questions={prakritiQuestions.kapha}
          scores={scores.kapha}
          onScoresChange={(newScores) => handleScoresChange('kapha', newScores)}
        />
      </div>

      {showSummary && calculatedResults && (
        <PrakritiSummaryCard
          totals={calculatedResults.totals}
          summary={calculatedResults.summary}
        />
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        
        <div className="flex gap-2">
          <Button
            onClick={calculatePrakriti}
            disabled={!isComplete()}
            variant="secondary"
          >
            Calculate Prakriti
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!showSummary || !calculatedResults}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
