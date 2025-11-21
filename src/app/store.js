import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from '../features/auth/authSlice';
import exercisesReducer from '../features/exercises/exercisesSlice';
import favouritesReducer from '../features/favourites/favouritesSlice';
import themeReducer from '../features/ui/themeSlice';
import fitnessExercisesReducer from '../features/exercises/fitnessExercisesSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  exercises: exercisesReducer,
  favourites: favouritesReducer,
  theme: themeReducer,
  fitnessExercises: fitnessExercisesReducer
});

const persistConfig = {
  key: 'root', 
  storage: AsyncStorage,
  whitelist: ['auth', 'favourites', 'theme']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefault => getDefault({ serializableCheck: false }),
});

export const persistor = persistStore(store);
