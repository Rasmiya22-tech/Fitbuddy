import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ExercisesService from './ExercisesService';

export const fetchExercises = createAsyncThunk('exercises/fetch', async () => {
  return await ExercisesService.getExercises();
});

const slice = createSlice({
  name: 'exercises',
  initialState: { items: [], status: 'idle', error: null },
  extraReducers: builder => {
    builder
      .addCase(fetchExercises.pending, s => { s.status='loading'; s.error=null; })
      .addCase(fetchExercises.fulfilled, (s,a)=>{ s.items=a.payload; s.status='succeeded'; s.error=null; })
      .addCase(fetchExercises.rejected, (s,a)=>{ s.status='failed'; s.error=a.error.message; });
  }
});

export default slice.reducer;
           