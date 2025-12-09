import React from "react";
import { Check } from "lucide-react";
import { cn } from "./utils";

export function Stepper({ steps, currentStep, completedSteps = [] }) {
  return (
    <div className="w-full px-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = completedSteps.includes(stepNumber);
          const isCurrent = currentStep === stepNumber;
          const isUpcoming = !isCompleted && currentStep < stepNumber;

          return (
            <React.Fragment key={step.id}>
              {/* Step Item */}
              <div className="flex flex-col items-center flex-1 relative p-1">
                {/* Circle with shadow and hover effect */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 relative z-10",
                    isCompleted && currentStep > stepNumber && "bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50",
                    isCompleted && currentStep <= stepNumber && "bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50",
                    isCurrent && !isCompleted && "bg-white border-2 border-blue-600 shadow-lg shadow-blue-300/50 scale-105",
                    isCurrent && isCompleted && "bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50 border-2 border-blue-700 scale-105",
                    isUpcoming && "bg-gray-100 border-2 border-gray-300"
                  )}
                >
                  {isCompleted && currentStep > stepNumber ? (
                    <Check className="w-5 h-5 text-white" strokeWidth={3} />
                  ) : (
                    <span 
                      className={cn(
                        "font-bold text-base leading-none",
                        (isCurrent && !isCompleted) && "text-blue-600",
                        (isCompleted || (isCurrent && isCompleted)) && "text-white",
                        isUpcoming && "text-gray-400"
                      )}
                    >
                      {stepNumber}
                    </span>
                  )}
                </div>

                {/* Label */}
                <div className="mt-3 text-center px-1">
                  <p
                    className={cn(
                      "text-xs font-semibold transition-colors duration-300",
                      isCompleted && "text-blue-600",
                      isCurrent && "text-blue-700",
                      isUpcoming && "text-gray-400"
                    )}
                  >
                    {step.title}
                  </p>
                </div>
              </div>

              {/* Connector Line with gradient */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-4 -mt-12 relative z-0">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      currentStep > stepNumber 
                        ? "bg-gradient-to-r from-blue-500 to-blue-600" 
                        : "bg-gray-200"
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

