import React from 'react';
import {NavigationContainer} from "@react-navigation/native";
import AppDrawer from "./routes/drawer";

export default function App(){
  return(
    <NavigationContainer>
      <AppDrawer/>
    </NavigationContainer>
  )
}
