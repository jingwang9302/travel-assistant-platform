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

const UserStack = () => {
    const Stack = createStackNavigator();

    return (
        <Stack.Navigator initialRouteName="Profile">
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Friend" component={FriendScreen} />
            <Stack.Screen name="FavoritePlace" component={FavoritePlaceScreen} />
        </Stack.Navigator>
    );

}

export default UserStack;