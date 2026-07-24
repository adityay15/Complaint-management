import { createSlice } from '@reduxjs/toolkit'

const initialRootCauseState = {
  root_cause: null,
  investigation_steps: null,
}

const rootCauseSlice = createSlice({
  name: 'rootCause',
  initialState: initialRootCauseState,
  reducers: {
    rootCauseUpdated: (state, action) => {
      return { ...state, ...action.payload }
    },
    rootCauseReset: () => initialRootCauseState,
  },
})

export const { rootCauseUpdated, rootCauseReset } = rootCauseSlice.actions
export default rootCauseSlice.reducer
