import './global.css';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppNaviagtion } from './src/navigation/app.navigation.jsx';

const App = () => {
  return (
    <NavigationContainer>
      <AppNaviagtion />
    </NavigationContainer>
  );
};

export default App;
