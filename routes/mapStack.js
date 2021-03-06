/*
What: This file indicates the stack navigation scheme of the Map portion.
Why: The whole application uses a drawer navigation. Each major portion of the app has its own stack navigation.
*/
import { createStackNavigator } from "react-navigation-stack";
import SearchScreen from "../src/screens/maps/SearchScreen";
import MyMapView from "../src/components/MapView";

const MapStack = createStackNavigator(
  {
    Search: SearchScreen,
    Map: MyMapView,
  },
  {
    initialRouteName: "Search",
    defaultNavigationOptions: {
      title: "Search",
    },
  }
);

export default MapStack;
