/*
What: This file indicates the stack navigation scheme of the Messages portion.
Why: The whole application uses a drawer navigation. Each major portion of the app has its own stack navigation.
*/
import { createStackNavigator } from "react-navigation-stack";
import MessageHomeScreen from "../src/screens/messages/MessageHomeScreen";

const MessageStack = createStackNavigator(
  {
    Messages: MessageHomeScreen
  },
  {
    initialRouteName: "Messages",
    defaultNavigationOptions: {
      title: "Messages",
    },
  }
);

export default MessageStack;