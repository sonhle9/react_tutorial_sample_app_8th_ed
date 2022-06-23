import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API from '../../app/api'
import { RootState } from '../../app/store';

export interface User {
  readonly id: number
  name: string
  admin: boolean
  email: string
}

export interface UserState {
  loggedIn: boolean
  value: User
  status: 'idle' | 'loading' | 'failed'
  error: string
}

const initialState: UserState = {
  loggedIn: false,
  value: {} as User,
  status: 'idle',
  error: ''
};

export const fetchCurrentUser = createAsyncThunk('session/getCurrentUser', async () => {
  const response = await API.get('/sessions')
  return response;
});

export const sessionSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: any) => {
        state.status = 'idle'
        state.loggedIn = true
        state.value = action.payload.user
        state.error = ''
      })
      .addCase(fetchCurrentUser.rejected, (state, action: any) => {
        state.status = 'idle'
        state.loggedIn = false
        state.value = {} as User
        state.error = action.payload
      });
  },
});

export const selectUser = (state: RootState) => state.session;

export default sessionSlice.reducer;
