/*
What: This is the drawer navigator of the entire application. 
      Every major portion of the application has its own wrapper. 
*/
import React from 'react';
import {createDrawerNavigator} from "@react-navigation/drawer";

import MessageStack from './messageStack';
import MapStack from "./mapStack";

const AppDrawer = () => {
    const Drawer = createDrawerNavigator();

    return (
        <Drawer.Navigator initialRouteName="Map">
            <Drawer.Screen name="Map" component={MapStack} />
            <Drawer.Screen name="Message" component={MessageStack} />
        </Drawer.Navigator>
    );

}

export default AppDrawer;