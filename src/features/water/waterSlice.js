import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dailyGoal: 8, // 8 cups per day
  cups: 0,
  history: [] // Track daily history
};

const waterSlice = createSlice({
  name: 'water',
  initialState,
  reducers: {
    addWater: (state) => {
      // Immer allows us to mutate state directly
      if (state.cups < state.dailyGoal * 2) {
        state.cups += 1;
      }
      console.log('🔄 addWater reducer called. Cups:', state.cups);
    },
    removeWater: (state) => {
      if (state.cups > 0) {
        state.cups -= 1;
      }
      console.log('🔄 removeWater reducer called. Cups:', state.cups);
    },
    setDailyGoal: (state, action) => {
      state.dailyGoal = action.payload;
      console.log('🔄 setDailyGoal reducer called. Goal:', state.dailyGoal);
    },
    resetDaily: (state) => {
      state.cups = 0;
      console.log('🔄 resetDaily reducer called');
    },
    setWaterIntake: (state, action) => {
      state.cups = action.payload;
      console.log('🔄 setWaterIntake reducer called. Cups:', state.cups);
    }
  }
});

export const { addWater, removeWater, setDailyGoal, resetDaily, setWaterIntake } = waterSlice.actions;
export default waterSlice.reducer;
