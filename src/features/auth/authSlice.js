import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AuthService from './AuthService';

export const login = createAsyncThunk('auth/login', async (cred) => {
  const res = await AuthService.login(cred);
  return res; // {token, username}
});

export const register = createAsyncThunk('auth/register', async (cred) => {
  const res = await AuthService.register(cred);
  return res;
});

const slice = createSlice({
  name: 'auth',
  initialState: { token: null, username: null, profilePic: null, status: 'idle', error: null },
  reducers: {
    // Keep username/profilePic persisted locally so edits survive logout/login cycles.
    // Only clear the token on logout so user must re-authenticate but their profile fields remain locally available.
    logout: (state) => { state.token = null; state.status = 'idle'; state.error = null; },
    updateProfile: (state, action) => {
      const { username, profilePic } = action.payload || {};
      if (typeof username !== 'undefined') state.username = username;
      if (typeof profilePic !== 'undefined') state.profilePic = profilePic;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, s => { s.status = 'loading'; s.error = null; })
      .addCase(login.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.token = a.payload.token;
        s.username = a.payload.username;
      })
      .addCase(login.rejected, (s,a) => { s.status = 'failed'; s.error = a.error?.message; })
      .addCase(register.pending, s => { s.status = 'loading'; s.error = null; })
      .addCase(register.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.token = a.payload.token;
        s.username = a.payload.username;
      })
      .addCase(register.rejected, (s,a) => { s.status = 'failed'; s.error = a.error?.message; });
  }
});

export const { logout, updateProfile } = slice.actions;
export default slice.reducer;
