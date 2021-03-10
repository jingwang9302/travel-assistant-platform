import React, {useEffect} from 'react';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";

import MessageStack from './messageStack';
import MapStack from "./mapStack";
import UserStack from "./userStack";
import {Icon} from "react-native-elements";
import {useDispatch, useSelector} from "react-redux";
import {Stomp} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {addNotification} from "../redux/actions/notification";
import {NOTIFICATION_WEBSOCKET_SERVICE} from "../config/urls";


const AppBottomTab = () => {
    const Tab = createBottomTabNavigator();

    const userProfile = useSelector(state => state.user);
    const dispatch = useDispatch();
    const notifications = useSelector(state => state.notification.notifications);
    const unreadCount = notifications.filter(item => item.read === false).length;

    //Create websocket client
    const client = Stomp.over(() => {
        return new SockJS(NOTIFICATION_WEBSOCKET_SERVICE)
    });

    //Start websocket connection
    useEffect(() => {
        if (userProfile.isLogin) {
            client.connect({userId: userProfile.id},
                function (frame) {
                    client.subscribe(
                        '/user/' + userProfile.id + '/msg', (notification) => {
                            dispatch(addNotification(JSON.parse(notification.body)));
                        }
                    );
                }
            )
        }else {
            client.disconnect();
        }
        return ()=> client && client.disconnect();
    }, [userProfile.isLogin]);

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName, iconType;

                    switch (route.name) {
                        case 'User':
                            iconName = 'user';
                            iconType = 'antdesign';
                            break;
                        case 'Map':
                            iconName = 'google-maps';
                            iconType = 'material-community';
                            break;
                        case 'Message':
                            iconName = 'message1';
                            iconType = 'antdesign';
                            break;
                        default:
                            break;
                    }

                    return <Icon name={iconName} type={iconType} size={size} color={color} />;
                },
            })}
            tabBarOptions={{
                activeTintColor: 'tomato',
                inactiveTintColor: 'gray',
            }}>
            <Tab.Screen name="User" component={UserStack} options={unreadCount !== 0?{ tabBarBadge: unreadCount }:{}}/>
            <Tab.Screen name="Map" component={MapStack} />
            <Tab.Screen name="Message" component={MessageStack} />

        </Tab.Navigator>
    );

}

export default AppBottomTab;