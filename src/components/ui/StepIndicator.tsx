import { Check } from 'lucide-react'

interface StepIndicatorProps {
  totalSteps: number
  currentStep: number
}

export default function StepIndicator({ totalSteps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1
        const isCompleted = stepNumber < currentStep
        const isActive = stepNumber === currentStep

        return (
          <div key={index} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                isCompleted
                  ? 'bg-[#2D4A3E] text-white'
                  : isActive
                  ? 'bg-[#C9A84C] text-[#1A1C14]'
                  : 'border-2 border-[#E8E0D0] text-[#5C6355]'
              }`}
            >
              {isCompleted ? <Check className="w-4 h-4" /> : stepNumber}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`w-12 h-0.5 mx-2 ${
                  isCompleted ? 'bg-[#2D4A3E]' : 'bg-[#E8E0D0]'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}