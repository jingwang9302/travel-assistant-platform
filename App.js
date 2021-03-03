import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import SearchScreen from "./src/screens/SearchScreen";
import MyMapView from "./src/components/Map";
import ResultScreen from "./src/screens/ResultScreen";

const navigator = createStackNavigator(
  {
    Search: SearchScreen,
    Map: MyMapView,
    Result: ResultScreen,
  },
  {
    initialRouteName: "Search",
    defaultNavigationOptions: {
      title: "Search",
    },
  }
);

export default createAppContainer(navigator);
