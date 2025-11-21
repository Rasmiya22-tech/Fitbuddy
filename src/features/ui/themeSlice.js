import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'theme',
  initialState: { darkMode: false },
  reducers: {
    toggleTheme: (s) => { s.darkMode = !s.darkMode; },
    setDark: (s, a) => { s.darkMode = !!a.payload; }
  }
});

export const { toggleTheme, setDark } = slice.actions;
export default slice.reducer;
