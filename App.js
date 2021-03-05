import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import SearchScreen from "./src/screens/SearchScreen";
import MyMapView from "./src/components/Map";
import ResultScreen from "./src/screens/ResultScreen";
import ResultList from "./src/screens/ResultsList";

const navigator = createStackNavigator(
  {
    Search: SearchScreen,
    Map: MyMapView,
    Result: ResultScreen,
    ResultList: ResultList,
  },
  {
    initialRouteName: "Search",
    defaultNavigationOptions: {
      title: "Search",
    },
  }
);

export default createAppContainer(navigator);
