/*
What: This file indicates the stack navigation scheme of the Messages portion.
Why: The whole application uses a drawer navigation. Each major portion of the app has its own stack navigation.
*/
import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import MessageHomeScreen from "../screens/messages/MessageHomeScreen";
import GroupDetailScreen from "../screens/travelgroup/GroupDetailScreen";
import PlanListScreen from "../screens/travelplan/PlanListScreen";
import ChatScreen from "../screens/messages/ChatScreen";
import {Button} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MessageStack = () => {
  const Stack = createStackNavigator();
  const navigation = useNavigation();

  return (
    
      <Stack.Navigator initialRouteName="Message">
        <Stack.Screen name="Message" component={MessageHomeScreen} />
        <Stack.Screen name="Chat" 
                      component={ChatScreen} 
                      options={({ route }) => 
                          ({ title: route.params.chatTitle, headerRight: ()=>(<Button title="Group info" onPress={()=> navigation.navigate("Group", { screen: "GroupDetail", params: {groupId: route.params.chatGroup}})}/>)})}
        />
      </Stack.Navigator>
  );
}

export default MessageStack;