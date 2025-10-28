'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PrakritiQuestion } from './PrakritiQuestion'
import { Progress } from '@/components/ui/progress'

interface Question {
  id: string
  label: string
}

interface PrakritiGroupProps {
  title: string
  questions: Question[]
  scores: Record<string, number>
  onScoresChange: (scores: Record<string, number>) => void
  disabled?: boolean
}

export function PrakritiGroup({ title, questions, scores, onScoresChange, disabled = false }: PrakritiGroupProps) {
  const handleQuestionChange = (questionId: string, value: number) => {
    onScoresChange({
      ...scores,
      [questionId]: value
    })
  }

  const answeredQuestions = Object.values(scores).filter(score => score > 0).length

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="text-sm text-muted-foreground">
            {answeredQuestions} / {questions.length} questions
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Questions answered: {answeredQuestions} / {questions.length}</span>
            <span>{Math.round((answeredQuestions / questions.length) * 100)}%</span>
          </div>
          <Progress value={(answeredQuestions / questions.length) * 100} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {questions.map((question) => (
          <PrakritiQuestion
            key={question.id}
            id={question.id}
            label={question.label}
            value={scores[question.id] || 0}
            onChange={(value) => handleQuestionChange(question.id, value)}
            disabled={disabled}
          />
        ))}
      </CardContent>
    </Card>
  )
}
