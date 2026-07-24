import { createSlice } from '@reduxjs/toolkit'

const initialCompletenessState = {
  is_complete: false,
  missing_critical: [],
  missing_recommended: [],
}

const completenessSlice = createSlice({
  name: 'completeness',
  initialState: initialCompletenessState,
  reducers: {
    completenessUpdated: (state, action) => {
      return { ...state, ...action.payload }
    },
    completenessReset: () => initialCompletenessState,
  },
})

export const { completenessUpdated, completenessReset } = completenessSlice.actions
export default completenessSlice.reducer
