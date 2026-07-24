import ComplaintForm from './features/complaint/ComplaintForm'
import RiskAssessmentPanel from './features/complaint/RiskAssessmentPanel'
import RootCausePanel from './features/complaint/RootCausePanel'
import SummaryPanel from './features/complaint/SummaryPanel'
import ChatPanel from './features/chat/ChatPanel'
import './App.css'

function App() {
  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="app-header__mark">✚</div>
        <div className="app-header__titles">
          <h1>Complaint Management</h1>
          <span className="app-header__tag">AI-Powered Intake · Pharma QA</span>
        </div>
        <span className="app-header__beta">BETA</span>
      </header>

      <main className="app-columns">
        <section className="app-column app-column--form">
          <ComplaintForm />
          <SummaryPanel />
          <RiskAssessmentPanel />
          <RootCausePanel />
        </section>

        <section className="app-column app-column--chat">
          <ChatPanel />
        </section>
      </main>
    </div>
  )
}

export default App
