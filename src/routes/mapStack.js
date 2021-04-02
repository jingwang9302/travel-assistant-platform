/*
What: This file indicates the stack navigation scheme of the Map portion.
Why: The whole application uses a drawer navigation. Each major portion of the app has its own stack navigation.
*/
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import SearchScreen from "../screens/maps/SearchScreen";
import ResultScreen from "../screens/maps/ResultScreen";
import ResultList from "../screens/maps/ResultsList";
import NavigationScreen from "../screens/maps/NavigationScreen";

const MapStack = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Search">
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Result" component={ResultScreen} />
      <Stack.Screen name="ResultList" component={ResultList} />
      <Stack.Screen name="Navigation" component={NavigationScreen} />
    </Stack.Navigator>
  );
};

export default MapStack;
