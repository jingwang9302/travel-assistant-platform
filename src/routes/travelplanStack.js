import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { StackActions } from "@react-navigation/routers";
import { Icon, Button } from "react-native-elements";

import PlanDetailScreen from "../screens/travelplan/PlanDetailScreen";
import CreateNewPlanScreen from "../screens/travelplan/CreateNewPlanScreen";
import PlacePickScreen from "../screens/travelplan/PlacePickScreen";
import MapScreen from "../screens/travelplan/MapScreen";
import EditPlanScreen from "../screens/travelplan/EditPlanScreen";
import GroupListForPlanPublishScreen from "../screens/travelgroup/GroupListForPlanPublishScreen";
import TestScreen from "../screens/travelplan/test";
import PlanListUserCreatedScreen from "../screens/travelplan/PlanListUserCreatedScreen";
import PlanListUserInScreen from "../screens/travelplan/PlanListUserInScreen";
import GroupManageScreen from "../screens/travelgroup/GroupManageScreen";
import NavigationScreen from "../screens/maps/NavigationScreen";

const TravelplanStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator initialRouteName="PlanListUserIn">
      <Stack.Screen
        name="PlanListUserCreated"
        component={PlanListUserCreatedScreen}
        options={{ title: "Plans Created" }}
      />
      <Stack.Screen
        name="PlanListUserIn"
        component={PlanListUserInScreen}
        options={{ title: "Plans Unfinished" }}
      />

      <Stack.Screen
        name="PlanDetail"
        component={PlanDetailScreen}
        options={{ title: "Plan Detail" }}
      />
      <Stack.Screen
        name="PlanPublish"
        component={GroupListForPlanPublishScreen}
        options={{ title: "Publish Plan" }}
      />
      <Stack.Screen
        name="PlanEdit"
        component={EditPlanScreen}
        options={{ title: "Edit Plan" }}
      />
      <Stack.Screen
        name="PlanCreate"
        component={CreateNewPlanScreen}
        options={{ title: "New Plan" }}
      />
      <Stack.Screen
        name="PlacePick"
        component={PlacePickScreen}
        options={{ title: "Add a Place" }}
      />
      <Stack.Screen
        name="MapForPlacePick"
        component={MapScreen}
        options={{ title: "Map" }}
      />

      <Stack.Screen
        name="GroupManage"
        component={GroupManageScreen}
        options={{ title: "Manage Group" }}
      />
    </Stack.Navigator>
  );
};

export default TravelplanStack;
