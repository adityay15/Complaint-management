const API_BASE_URL = 'http://127.0.0.1:8000'

export async function extractComplaint({ currentForm, userMessage }) {
  const response = await fetch(`${API_BASE_URL}/extract`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      current_form: currentForm,
      user_message: userMessage,
    }),
  })

  if (!response.ok) {
    throw new Error(`Extraction request failed (${response.status})`)
  }

  return response.json()
}

export async function parseDocument(file) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE_URL}/parse-document`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Document parsing failed (${response.status})`)
  }

  return response.json()
}

export async function saveComplaint(payload) {
  const response = await fetch(`${API_BASE_URL}/complaints`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Save failed (${response.status})`)
  }

  return response.json()
}
