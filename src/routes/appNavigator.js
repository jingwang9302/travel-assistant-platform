/*
What: This is the navigator of the entire application.
      Every major portion of the application has its own wrapper.
*/
import React from 'react';
import {createDrawerNavigator} from "@react-navigation/drawer";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";

import SplashScreen from "../screens/about/SplashScreen";
import AppDrawer from "./drawer";
import AppBottomTab from "./bottomTab";

const AppNavigator = () => {
    const Stack = createStackNavigator();

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash">
                <Stack.Screen name="Splash" component={SplashScreen} options={{headerShown: false}} />
                <Stack.Screen name="Screens" component={AppBottomTab} options={{headerShown: false}} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigator;