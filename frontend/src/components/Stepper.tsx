import {Step, StepLabel, Stepper} from "@mui/material";

const steps = ["Personalise card", "Edit", "Review"];

export type CreationStage = "input" | "edit"  | "preview" | "publish"

function stepToNumber(step: CreationStage): number {
    switch (step) {
        case "input":
            return 0;
        case "edit":
            return 1
        case "preview":
            return 2;
        case "publish":
            return 3;
        default:
            return 0;
    }
}

interface StepperProps {
    activeStep: CreationStage;
}

export const CardStepper = ({activeStep}: StepperProps) => {
    return (
        <Stepper alternativeLabel activeStep={stepToNumber(activeStep)}>
            {steps.map((label, index) => (
              <Step key={label}>
                  <StepLabel>
                      {label}
                  </StepLabel>
              </Step>
            ))}
      </Stepper>
    )
}