import { configureStore } from '@reduxjs/toolkit'
import complaintFormReducer from '../features/complaint/complaintFormSlice'
import riskAssessmentReducer from '../features/complaint/riskAssessmentSlice'

export const store = configureStore({
  reducer: {
    complaintForm: complaintFormReducer,
    riskAssessment: riskAssessmentReducer,
  },
})
