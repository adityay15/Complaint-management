import { useSelector } from 'react-redux'

function SummaryPanel() {
  const summary = useSelector((state) => state.summary)

  if (!summary.summary) {
    return (
      <div className="summary-panel">
        <h3>Complaint Summary</h3>
        <p className="summary-panel__empty">No summary yet</p>
      </div>
    )
  }

  return (
    <div className="summary-panel">
      <h3>Complaint Summary</h3>
      <p className="summary-panel__text">{summary.summary}</p>
    </div>
  )
}

export default SummaryPanel
