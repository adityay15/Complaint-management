import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { extractComplaint, parseDocument } from '../../api/extractApi'
import { fieldsUpdated } from '../complaint/complaintFormSlice'
import { riskAssessmentUpdated } from '../complaint/riskAssessmentSlice'
import { rootCauseUpdated } from '../complaint/rootCauseSlice'
import { completenessUpdated } from '../complaint/completenessSlice'
import { summaryUpdated } from '../complaint/summarySlice'

function summarizeUpdate(extractedFields) {
  const changedKeys = Object.keys(extractedFields)
  if (changedKeys.length === 0) {
    return "I didn't find any new details to update in the form."
  }
  return `Updated: ${changedKeys.join(', ')}`
}

function ChatPanel() {
  const dispatch = useDispatch()
  const formState = useSelector((state) => state.complaintForm)

  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [isSending, setIsSending] = useState(false)
  const fileInputRef = useRef(null)

  const addMessage = (role, text) => {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role, text }])
  }

  const runExtraction = async (userMessageText) => {
    setIsSending(true)
    try {
      const result = await extractComplaint({
        currentForm: formState,
        userMessage: userMessageText,
      })

      dispatch(fieldsUpdated(result.extracted_fields))
      dispatch(riskAssessmentUpdated(result.risk_assessment))
      dispatch(rootCauseUpdated(result.root_cause_recommendation))
      dispatch(completenessUpdated(result.completeness))
      dispatch(summaryUpdated(result.summary))
      addMessage('assistant', summarizeUpdate(result.extracted_fields))
    } catch (error) {
      addMessage('assistant', `Something went wrong: ${error.message}`)
    } finally {
      setIsSending(false)
    }
  }

  const handleSend = async () => {
    const text = draft.trim()
    if (!text || isSending) return

    addMessage('user', text)
    setDraft('')
    await runExtraction(text)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    event.target.value = ''
    if (!file || isSending) return

    addMessage('user', `📄 Uploaded: ${file.name}`)
    setIsSending(true)

    try {
      const { extracted_text } = await parseDocument(file)
      if (!extracted_text.trim()) {
        addMessage(
          'assistant',
          "Couldn't find any readable text in that file — try a different one or describe the complaint as a message instead."
        )
        setIsSending(false)
        return
      }
      await runExtraction(extracted_text)
    } catch (error) {
      addMessage('assistant', `Couldn't read that file: ${error.message}`)
      setIsSending(false)
    }
  }

  return (
    <div className="chat-panel">
      <h2>AI Co-Pilot Chat</h2>
      <p className="chat-panel__hint">
        Describe a complaint, send a follow-up correction, or upload a
        PDF/Word/email — the form and risk assessment update automatically.
      </p>

      <div className="chat-panel__messages">
        {messages.length === 0 && (
          <p className="chat-panel__empty">No messages yet.</p>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-message chat-message--${message.role}`}
          >
            {message.text}
          </div>
        ))}
        {isSending && (
          <div className="chat-message chat-message--assistant chat-message--pending">
            Thinking...
          </div>
        )}
      </div>

      <div className="chat-panel__input">
        <input
          type="file"
          accept=".pdf,.docx,.eml,.txt"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <button
          type="button"
          className="chat-panel__attach"
          onClick={() => fileInputRef.current.click()}
          disabled={isSending}
          title="Upload a PDF, Word document, or email"
        >
          📎
        </button>
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Customer reported batch B12345 of Paracetamol 500mg is discolored..."
          rows={3}
          disabled={isSending}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={isSending || !draft.trim()}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default ChatPanel
