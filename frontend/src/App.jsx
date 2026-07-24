import ComplaintForm from './features/complaint/ComplaintForm'
import RiskAssessmentPanel from './features/complaint/RiskAssessmentPanel'
import RootCausePanel from './features/complaint/RootCausePanel'
import ChatPanel from './features/chat/ChatPanel'
import './App.css'

function App() {
  return (
    <div className="app-layout">
      <header className="app-header">
        <h1>Complaint Management</h1>
      </header>

      <main className="app-columns">
        <section className="app-column app-column--form">
          <ComplaintForm />
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
