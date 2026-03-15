import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import PeriodScreen from './src/screens/PeriodScreen';
import StatsScreen from './src/screens/StatsScreen';

const Tab = createBottomTabNavigator();

const BG     = '#0E0E10';
const SURFACE = '#17171A';
const BORDER  = '#2A2A32';
const ACCENT  = '#C8F135';
const MUTED   = '#6B6B80';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor={BG} />
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarStyle: {
                backgroundColor: SURFACE,
                borderTopColor: BORDER,
                borderTopWidth: 1,
                height: 62,
                paddingBottom: 8,
                paddingTop: 6,
              },
              tabBarActiveTintColor: ACCENT,
              tabBarInactiveTintColor: MUTED,
              tabBarLabelStyle: {
                fontSize: 11,
                fontWeight: '600',
              },
              tabBarIcon: ({ color, size, focused }) => {
                let iconName: React.ComponentProps<typeof Ionicons>['name'] = 'home';
                if (route.name === 'Início')    iconName = focused ? 'home'             : 'home-outline';
                if (route.name === 'Metas')     iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
                if (route.name === 'Progresso') iconName = focused ? 'bar-chart'        : 'bar-chart-outline';
                return <Ionicons name={iconName} size={size} color={color} />;
              },
            })}
          >
            <Tab.Screen name="Início"    component={HomeScreen} />
            <Tab.Screen name="Metas"     component={PeriodScreen} />
            <Tab.Screen name="Progresso" component={StatsScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
