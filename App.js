import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import MapScreen from "./src/screens/MapScreen";

const navigator = createStackNavigator(
  {
    Map: MapScreen,
  },
  {
    initialRouteName: "Map",
    defaultNavigationOptions: {
      title: "Business Search",
    },
  }
);

export default createAppContainer(navigator);
