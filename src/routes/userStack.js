/*
What: This file indicates the stack navigation scheme of the Messages portion.
Why: The whole application uses a drawer navigation. Each major portion of the app has its own stack navigation.
*/
import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import LoginScreen from "../screens/user/LoginScreen";
import RegisterScreen from "../screens/user/RegisterScreen";
import ProfileScreen from "../screens/user/ProfileScreen";
import FriendScreen from "../screens/user/FriendScreen";
import FavoritePlaceScreen from "../screens/user/FavoritePlaceScreen";
import UserScreen from "../screens/user/UserScreen";
import NotificationScreen from "../screens/user/NotificationScreen";

const UserStack = () => {
    const Stack = createStackNavigator();

    return (
        <Stack.Navigator initialRouteName="User">
            <Stack.Screen name="User" component={UserScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Friend" component={FriendScreen} />
            <Stack.Screen name="FavoritePlace" component={FavoritePlaceScreen} />
            <Stack.Screen name="Notification" component={NotificationScreen} />
        </Stack.Navigator>
    );

}

export default UserStack;