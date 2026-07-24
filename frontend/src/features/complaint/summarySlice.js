import { createSlice } from '@reduxjs/toolkit'

const initialSummaryState = {
  summary: null,
}

const summarySlice = createSlice({
  name: 'summary',
  initialState: initialSummaryState,
  reducers: {
    summaryUpdated: (state, action) => {
      return { ...state, ...action.payload }
    },
    summaryReset: () => initialSummaryState,
  },
})

export const { summaryUpdated, summaryReset } = summarySlice.actions
export default summarySlice.reducer
