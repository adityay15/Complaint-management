import { useSelector } from 'react-redux'

function RiskAssessmentPanel() {
  const { severity, priority, suggested_next_action } = useSelector(
    (state) => state.riskAssessment
  )
  const hasAssessment = severity || priority || suggested_next_action

  return (
    <div className="risk-panel">
      <h3>AI Co-Pilot Risk Assessment</h3>
      {hasAssessment ? (
        <div className="risk-panel__body">
          <div className="risk-panel__row">
            <span className="risk-panel__label">Severity</span>
            <span className={`risk-badge risk-badge--${(severity || '').toLowerCase()}`}>
              {severity}
            </span>
          </div>
          <div className="risk-panel__row">
            <span className="risk-panel__label">Priority</span>
            <span className={`risk-badge risk-badge--${(priority || '').toLowerCase()}`}>
              {priority}
            </span>
          </div>
          <div className="risk-panel__row risk-panel__row--stacked">
            <span className="risk-panel__label">Suggested Next Action</span>
            <p>{suggested_next_action}</p>
          </div>
        </div>
      ) : (
        <p className="risk-panel__empty">
          No assessment yet — this updates automatically as the complaint form
          is filled in.
        </p>
      )}
    </div>
  )
}

export default RiskAssessmentPanel
