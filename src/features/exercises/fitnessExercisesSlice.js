import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import FitnessService from './FitnessService';

export const searchExercises = createAsyncThunk(
  'fitnessExercises/search',
  async (filters = {}) => {
    return await FitnessService.searchExercises(filters);
  }
);

export const getExercisesByMuscle = createAsyncThunk(
  'fitnessExercises/getByMuscle',
  async (muscle = 'biceps') => {
    return await FitnessService.getExercisesByMuscle(muscle);
  }
);

const slice = createSlice({
  name: 'fitnessExercises',
  initialState: { 
    items: [], 
    status: 'idle', 
    error: null,
    filters: { name: '', type: '', muscle: '', difficulty: '' }
  },
  reducers: {
    setFilters: (s, a) => { 
      s.filters = { ...s.filters, ...a.payload };
    },
    clearFilters: (s) => {
      s.filters = { name: '', type: '', muscle: '', difficulty: '' };
    }
  },
  extraReducers: builder => {
    builder
      .addCase(searchExercises.pending, s => { s.status = 'loading'; s.error = null; })
      .addCase(searchExercises.fulfilled, (s, a) => { s.items = a.payload; s.status = 'succeeded'; s.error = null; })
      .addCase(searchExercises.rejected, (s, a) => { s.status = 'failed'; s.error = a.error?.message; })
      .addCase(getExercisesByMuscle.pending, s => { s.status = 'loading'; s.error = null; })
      .addCase(getExercisesByMuscle.fulfilled, (s, a) => { s.items = a.payload; s.status = 'succeeded'; s.error = null; })
      .addCase(getExercisesByMuscle.rejected, (s, a) => { s.status = 'failed'; s.error = a.error?.message; });
  }
});

export const { setFilters, clearFilters } = slice.actions;
export default slice.reducer;
    