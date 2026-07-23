import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { saveComplaint } from '../../api/extractApi'
import { formReset } from './complaintFormSlice'
import { riskReset } from './riskAssessmentSlice'

const FIELD_GROUPS = [
  {
    title: 'Origin & Customer Details',
    fields: [
      { key: 'complaint_source', label: 'Complaint Source' },
      { key: 'customer_name', label: 'Customer Name' },
    ],
  },
  {
    title: 'Product & Batch Identification',
    fields: [
      { key: 'product_name', label: 'Product Name' },
      { key: 'product_strength_grade', label: 'Product Strength/Grade' },
      { key: 'batch_lot_number', label: 'Batch/Lot Number' },
      { key: 'manufacturing_date', label: 'Manufacturing Date' },
      { key: 'expiry_date', label: 'Expiry Date' },
      { key: 'quantity_affected', label: 'Quantity Affected' },
    ],
  },
  {
    title: 'Complaint Details',
    fields: [
      { key: 'complaint_type', label: 'Complaint Type' },
      { key: 'complaint_date', label: 'Complaint Date' },
      {
        key: 'detailed_complaint_description',
        label: 'Detailed Complaint Description',
        multiline: true,
      },
    ],
  },
]

function ComplaintForm() {
  const dispatch = useDispatch()
  const formState = useSelector((state) => state.complaintForm)
  const riskState = useSelector((state) => state.riskAssessment)

  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null)

  const isFormEmpty = Object.values(formState).every((value) => !value)

  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus(null)
    try {
      const saved = await saveComplaint({
        ...formState,
        initial_severity: riskState.severity,
        priority: riskState.priority,
      })
      setSaveStatus({ type: 'success', message: `Saved as Complaint #${saved.id}` })
    } catch (error) {
      setSaveStatus({ type: 'error', message: error.message })
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    dispatch(formReset())
    dispatch(riskReset())
    setSaveStatus(null)
  }

  return (
    <div className="complaint-form">
      <h2>Log Customer Complaint</h2>
      <p className="complaint-form__hint">
        This form is filled and updated by the AI assistant — describe the
        complaint in the chat panel to get started.
      </p>

      {FIELD_GROUPS.map((group) => (
        <fieldset key={group.title} className="complaint-form__group">
          <legend>{group.title}</legend>
          {group.fields.map((field) => (
            <label key={field.key} className="complaint-form__field">
              <span>{field.label}</span>
              {field.multiline ? (
                <textarea
                  value={formState[field.key] ?? ''}
                  readOnly
                  rows={3}
                />
              ) : (
                <input
                  type="text"
                  value={formState[field.key] ?? ''}
                  readOnly
                />
              )}
            </label>
          ))}
        </fieldset>
      ))}

      {saveStatus && (
        <p className={`complaint-form__status complaint-form__status--${saveStatus.type}`}>
          {saveStatus.message}
        </p>
      )}

      <div className="complaint-form__actions">
        <button type="button" className="complaint-form__reset" onClick={handleReset}>
          Reset Form
        </button>
        <button
          type="button"
          className="complaint-form__save"
          onClick={handleSave}
          disabled={isSaving || isFormEmpty}
        >
          {isSaving ? 'Saving...' : 'Save Complaint'}
        </button>
      </div>
    </div>
  )
}

export default ComplaintForm
