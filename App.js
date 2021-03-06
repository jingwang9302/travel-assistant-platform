// import { createAppContainer } from "react-navigation";
// import { createStackNavigator } from "react-navigation-stack";

// import SearchScreen from "./src/screens/SearchScreen";
// import MyMapView from "./src/components/MapView";

// const navigator = createStackNavigator(
//   {
//     Search: SearchScreen,
//     Map: MyMapView,
//   },
//   {
//     initialRouteName: "Search",
//     defaultNavigationOptions: {
//       title: "Search",
//     },
//   }
// );

// export default createAppContainer(navigator);
import React from 'react';
import GlobalDrawerNavigator from './routes/drawer';

export default function App(){
  return <GlobalDrawerNavigator/>
}
