import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from '../features/auth/LoginScreen';
import RegisterScreen from '../features/auth/RegisterScreen';
import HomeScreen from '../features/exercises/HomeScreen';
import DetailsScreen from '../features/exercises/DetailsScreen';
import FavouritesScreen from '../features/favourites/FavouritesScreen';
import { useSelector } from 'react-redux';
import ProfileScreen from '../features/auth/ProfileScreen';
import { Feather } from '@expo/vector-icons';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import HeaderRight from './HeaderRight';
import ExercisesListScreen from '../features/exercises/ExercisesListScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const username = useSelector(s => s.auth.username);

  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: true,
      headerRight: () => <HeaderRight username={username} />,
      headerTitleAlign: 'left',
      headerTintColor: '#944545',
      tabBarIcon:({color,size})=>{
        let icon='home';
        if(route.name==='Exercises') icon='zap';
        if(route.name==='Favourites') icon='star';
        if(route.name==='Profile') icon='user';
        return <Feather name={icon} color={color} size={size}/>;
      }
    })}>
        <Tab.Screen name="Home" component={HomeScreen} options={{title: 'Home'}}/>
        <Tab.Screen name="Exercises" component={ExercisesListScreen} options={{title: 'Exercises'}}/>
        <Tab.Screen name="Favourites" component={FavouritesScreen} options={{title: 'Favourites'}}/>
        <Tab.Screen name="Profile" component={ProfileScreen} options={{title: 'Profile'}}/>
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const token = useSelector(s=>s.auth.token);
  const isDark = useSelector(s=>s.theme.darkMode);
  const navTheme = isDark ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator>
        {!token ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}}/>
            <Stack.Screen name="Register" component={RegisterScreen}/>
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} options={{headerShown:false}}/>
            <Stack.Screen name="Details" component={DetailsScreen}/>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
