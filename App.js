import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/app/store';
import AppNavigator from './src/navigation/AppNavigator';
import { ActivityIndicator } from 'react-native';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<ActivityIndicator/>} persistor={persistor}>
        <AppNavigator/>
      </PersistGate>
    </Provider>
  );
}
