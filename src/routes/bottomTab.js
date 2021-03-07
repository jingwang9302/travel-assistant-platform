import React from 'react';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";

import MessageStack from './messageStack';
import MapStack from "./mapStack";
import UserStack from "./userStack";
import {Icon} from "react-native-elements";


const AppBottomTab = () => {
    const Tab = createBottomTabNavigator();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName, iconType;

                    if (route.name === 'User') {
                        iconName = 'user';
                        iconType = 'antdesign';

                    } else if (route.name === 'Map') {
                        iconName = 'google-maps';
                        iconType = 'material-community';
                    } else if (route.name === 'Message') {
                        iconName = 'message1';
                        iconType = 'antdesign';
                    }

                    return <Icon name={iconName} type={iconType} size={size} color={color} />;
                },
            })}
            tabBarOptions={{
                activeTintColor: 'tomato',
                inactiveTintColor: 'gray',
            }}>
            <Tab.Screen name="User" component={UserStack} />
            <Tab.Screen name="Map" component={MapStack} />
            <Tab.Screen name="Message" component={MessageStack} />
        </Tab.Navigator>
    );

}

export default AppBottomTab;