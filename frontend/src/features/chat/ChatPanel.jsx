import { useEffect, useRef, useState } from 'react'
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
  const [dragActive, setDragActive] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef(null)

  // Animate a simulated progress bar while the AI is working. Real % isn't
  // available from an LLM call, so we climb smoothly toward ~90% and let the
  // completed response snap it to done.
  useEffect(() => {
    if (!isSending) {
      setProgress(0)
      return
    }
    setProgress(10)
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? prev : prev + Math.random() * 12))
    }, 400)
    return () => clearInterval(interval)
  }, [isSending])

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

  const processFile = async (file) => {
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

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    event.target.value = ''
    processFile(file)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    if (!isSending) setDragActive(true)
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    setDragActive(false)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setDragActive(false)
    if (isSending) return
    const file = event.dataTransfer.files[0]
    processFile(file)
  }

  return (
    <div
      className={`chat-panel${dragActive ? ' chat-panel--drag' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {dragActive && (
        <div className="chat-panel__overlay">
          <div className="chat-panel__overlay-inner">
            <span className="chat-panel__overlay-icon">⬇</span>
            <p>Drop your document to extract</p>
          </div>
        </div>
      )}

      <div className="chat-panel__head">
        <h2>AI Complaint Intake Assistant</h2>
        <span className="chat-panel__beta">BETA</span>
      </div>
      <p className="chat-panel__hint">
        Describe a complaint, send a follow-up correction, or upload a
        document — the form and risk assessment update automatically.
      </p>

      <div className="chat-panel__messages">
        {messages.length === 0 && !isSending && (
          <>
            <button
              type="button"
              className="chat-dropzone"
              onClick={() => fileInputRef.current.click()}
            >
              <span className="chat-dropzone__icon">☁</span>
              <span className="chat-dropzone__title">
                Drag &amp; drop a complaint document
              </span>
              <span className="chat-dropzone__hint">or click to browse</span>
              <span className="chat-dropzone__formats">
                Supported: PDF, DOCX, TXT, EML · Max 10MB
              </span>
            </button>
            <p className="chat-dropzone__or">
              — or type the complaint below to get started —
            </p>
          </>
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
          <div className="chat-progress">
            <div className="chat-progress__header">
              <span>Extraction in progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="chat-progress__track">
              <div
                className="chat-progress__bar"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="chat-progress__status">
              Analyzing content and extracting key details…
            </p>
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
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Customer reported batch B12345 of Paracetamol 500mg is discolored..."
          rows={4}
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
