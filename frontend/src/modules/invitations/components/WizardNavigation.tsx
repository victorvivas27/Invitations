export function WizardNavigation({
  step,
  onPrevious,
  onNext,
  onSubmit,
  submitting,
}: {
  step: number
  onPrevious: () => void
  onNext: () => void
  onSubmit: () => void
  submitting: boolean
}) {
  return (
    <div className="wizard-navigation">
      <p className="wizard-navigation-progress" aria-live="polite">
        <strong>Sección {step} de 7</strong>
      </p>
      {step > 1 && (
        <button
          type="button"
          className="wizard-previous"
          onClick={onPrevious}
          disabled={submitting}
        >
          Anterior
        </button>
      )}
      {step < 7 ? (
        <button type="button" className="wizard-next" onClick={onNext}>
          Siguiente
        </button>
      ) : (
        <button
          type="button"
          className="wizard-next"
          disabled={submitting}
          onClick={onSubmit}
        >
          {submitting ? 'Creando invitación...' : 'Crear invitación'}
        </button>
      )}
    </div>
  )
}
