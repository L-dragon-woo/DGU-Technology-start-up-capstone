'use client'

import { CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProcessStep {
  title: string
  description: string
}

interface ProcessStepperProps {
  steps: ProcessStep[]
  currentStep: number
  className?: string
}

export function ProcessStepper({ steps, currentStep, className }: ProcessStepperProps) {
  return (
    <ol className={cn('grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3', className)}>
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const isCurrent = stepNumber === currentStep
        const isDone = stepNumber < currentStep

        return (
          <li
            key={step.title}
            className={cn(
              'rounded-lg border bg-card p-4 shadow-ct-soft transition',
              isCurrent
                ? 'border-primary bg-primary/5 shadow-ct-card ring-1 ring-primary/20'
                : isDone
                  ? 'border-success/30 bg-success-subtle'
                  : 'border-border bg-muted/40',
            )}
            aria-current={isCurrent ? 'step' : undefined}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-pill text-[16px] font-bold shadow-ct-soft',
                  isCurrent
                    ? 'bg-primary text-primary-foreground'
                    : isDone
                      ? 'bg-success text-success-foreground'
                      : 'bg-background text-muted-foreground ring-1 ring-border',
                )}
              >
                {isDone ? <CheckCircle className="h-5 w-5" /> : stepNumber}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-kr-pretty text-[15px] font-bold text-foreground">{step.title}</p>
                <p className="text-kr-pretty mt-1 text-[15px] leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
