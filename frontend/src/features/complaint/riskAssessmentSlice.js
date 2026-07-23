import { createSlice } from '@reduxjs/toolkit'

export const initialRiskState = {
  severity: null,
  priority: null,
  suggested_next_action: null,
}

const riskAssessmentSlice = createSlice({
  name: 'riskAssessment',
  initialState: initialRiskState,
  reducers: {
    riskAssessmentUpdated: (state, action) => {
      return { ...action.payload }
    },
    riskReset: () => initialRiskState,
  },
})

export const { riskAssessmentUpdated, riskReset } = riskAssessmentSlice.actions
export default riskAssessmentSlice.reducer
