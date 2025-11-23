import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import { persistConfig } from './persist';
import authReducer from '../features/auth/authSlice';
import exercisesReducer from '../features/exercises/exercisesSlice';
import favouritesReducer from '../features/favourites/favouritesSlice';
import themeReducer from '../features/ui/themeSlice';
import fitnessExercisesReducer from '../features/exercises/fitnessExercisesSlice';
import waterReducer from '../features/water/waterSlice';
import wellnessReducer from '../features/wellness/wellnessSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  exercises: exercisesReducer,
  favourites: favouritesReducer,
  theme: themeReducer,
  fitnessExercises: fitnessExercisesReducer,
  water: waterReducer,
  wellness: wellnessReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefault => getDefault({ serializableCheck: false }),
});

export const persistor = persistStore(store);
