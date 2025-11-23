import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Redux-Persist Configuration
 * Manages which parts of the Redux state are persisted to device storage
 */
export const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  version: 1,
  // These state slices will be saved to AsyncStorage
  whitelist: ['auth', 'favourites', 'theme', 'water', 'wellness'],
  // These state slices will NOT be saved (fetched fresh each time)
  blacklist: ['exercises', 'fitnessExercises'],
  // Time to wait before persisting to storage (ms)
  timeout: 12000,
};

/**
 * Migration handler for state schema changes across app versions
 * Use this when your Redux state structure changes
 */
export const persistMigrations = {
  // Example: version 0 to version 1 migration
  1: (state) => {
    // Handle any state transformations needed for v1
    return state;
  },
};
