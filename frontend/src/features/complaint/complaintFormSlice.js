import { createSlice } from '@reduxjs/toolkit'

export const initialFormState = {
  complaint_source: '',
  customer_name: '',
  product_name: '',
  product_strength_grade: '',
  batch_lot_number: '',
  manufacturing_date: '',
  expiry_date: '',
  quantity_affected: '',
  complaint_type: '',
  complaint_date: '',
  detailed_complaint_description: '',
}

const complaintFormSlice = createSlice({
  name: 'complaintForm',
  initialState: initialFormState,
  reducers: {
    fieldsUpdated: (state, action) => {
      return { ...state, ...action.payload }
    },
    formReset: () => initialFormState,
  },
})

export const { fieldsUpdated, formReset } = complaintFormSlice.actions
export default complaintFormSlice.reducer
