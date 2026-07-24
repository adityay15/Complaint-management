import { useSelector } from 'react-redux'

function RootCausePanel() {
  const rootCause = useSelector((state) => state.rootCause)

  if (!rootCause.root_cause) {
    return (
      <div className="root-cause-panel">
        <h3>Root Cause Analysis</h3>
        <p className="root-cause-panel__empty">No analysis yet</p>
      </div>
    )
  }

  const steps = rootCause.investigation_steps
    .split('\n')
    .filter((step) => step.trim())

  return (
    <div className="root-cause-panel">
      <h3>Root Cause Analysis</h3>
      <div className="root-cause-panel__cause">
        <strong>Likely Root Cause:</strong>
        <p>{rootCause.root_cause}</p>
      </div>
      <div className="root-cause-panel__steps">
        <strong>Investigation Steps:</strong>
        <ol>
          {steps.map((step, idx) => (
            <li key={idx}>{step.replace(/^\d+\.\s*/, '')}</li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export default RootCausePanel
