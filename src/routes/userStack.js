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
import PostScreen from "../screens/blog/PostScreen";
import PostCreationScreen from "../screens/blog/PostCreationScreen";
import CommentScreen from "../screens/blog/CommentScreen";
import TravelReviewHome from '../screens/travelreview/TravelReviewHome';
import TravelReviewDetails from '../screens/travelreview/TravelReviewDetails';

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
            <Stack.Screen name="Post" component={PostScreen} />
            <Stack.Screen name="PostCreation" component={PostCreationScreen} />
            <Stack.Screen name="Comment" component={CommentScreen} />
            <Stack.Screen name="TravelReviewHome" component={TravelReviewHome} />
            <Stack.Screen name="TravelReviewDetails" component={TravelReviewDetails} />
        </Stack.Navigator>
    );

}

export default UserStack;