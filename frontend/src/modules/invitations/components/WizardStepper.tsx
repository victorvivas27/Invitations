const steps = [
  'Información básica',
  'Homenaje',
  'Fecha',
  'Lugar',
  'Mensaje',
  'Resumen',
]

export function WizardStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="wizard-progress">
      <div className="wizard-progress-copy">
        <strong>
          Paso {currentStep} de {steps.length}
        </strong>
        <span>{steps[currentStep - 1]}</span>
      </div>
      <ol aria-label="Progreso de creación">
        {steps.map((label, index) => {
          const number = index + 1
          return (
            <li
              key={label}
              className={
                number === currentStep
                  ? 'is-current'
                  : number < currentStep
                    ? 'is-complete'
                    : ''
              }
              aria-current={number === currentStep ? 'step' : undefined}
            >
              <span>{number < currentStep ? '✓' : number}</span>
              <small>{label}</small>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
