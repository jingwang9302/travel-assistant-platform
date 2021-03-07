/*
What: This file indicates the stack navigation scheme of the Messages portion.
Why: The whole application uses a drawer navigation. Each major portion of the app has its own stack navigation.
*/
import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import MessageHomeScreen from "../screens/messages/MessageHomeScreen";

const MessageStack = () => {
  const Stack = createStackNavigator();

  return (
      <Stack.Navigator initialRouteName="Message">
        <Stack.Screen name="Message" component={MessageHomeScreen} />
      </Stack.Navigator>
  );

}

export default MessageStack;