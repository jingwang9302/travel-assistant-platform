/*
What: This is the drawer navigator of the entire application. 
      Every major portion of the application has its own wrapper. 
*/
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer } from 'react-navigation';
import MapStack from './mapStack';
import MessageStack from './messageStack';

const RootDrawerNavigator = createDrawerNavigator({
    Map:{
        screen:MapStack,
    },
    Messages:{
        screen: MessageStack,
    }
});

export default createAppContainer(RootDrawerNavigator);