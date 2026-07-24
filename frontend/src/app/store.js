import { configureStore } from '@reduxjs/toolkit'
import complaintFormReducer from '../features/complaint/complaintFormSlice'
import riskAssessmentReducer from '../features/complaint/riskAssessmentSlice'
import rootCauseReducer from '../features/complaint/rootCauseSlice'
import completenessReducer from '../features/complaint/completenessSlice'

export const store = configureStore({
  reducer: {
    complaintForm: complaintFormReducer,
    riskAssessment: riskAssessmentReducer,
    rootCause: rootCauseReducer,
    completeness: completenessReducer,
  },
})
