/*
What: This file indicates the stack navigation scheme of the Map portion.
Why: The whole application uses a drawer navigation. Each major portion of the app has its own stack navigation.
*/
import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";

import SearchScreen from "../screens/maps/SearchScreen";

const MapStack = () => {
    const Stack = createStackNavigator();

    return (
        <Stack.Navigator initialRouteName="Search">
            <Stack.Screen name="Search" component={SearchScreen} />
        </Stack.Navigator>
    );

}

export default MapStack;
