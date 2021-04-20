import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { StackActions } from "@react-navigation/routers";
import { Icon, Button } from "react-native-elements";

import CreateNewGroupScreen from "../screens/travelgroup/CreateNewGroupScreen";
import GroupListScreen from "../screens/travelgroup/GroupListScreen";
import GroupDetailScreen from "../screens/travelgroup/GroupDetailScreen";
import GroupManageScreen from "../screens/travelgroup/GroupManageScreen";
import PlanListScreen from "../screens/travelplan/PlanListScreen";
import PlanDetailScreen from "../screens/travelplan/PlanDetailScreen";
import CreateNewPlanScreen from "../screens/travelplan/CreateNewPlanScreen";
import EditGroupScreen from "../screens/travelgroup/EditGroupScreen";
import PlacePickScreen from "../screens/travelplan/PlacePickScreen";
import MapScreen from "../screens/travelplan/MapScreen";
import EditPlanScreen from "../screens/travelplan/EditPlanScreen";
import GroupListForPlanPublishScreen from "../screens/travelgroup/GroupListForPlanPublishScreen";
import TestScreen from "../screens/travelplan/test";
import SearchUserScreen from "../screens/travelgroup/SearchUserScreen";
import UserBasicInfoScreen from "../screens/travelgroup/UserBasicInfoScreen";

const TravelgroupStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator initialRouteName="GroupList">
      <Stack.Screen
        name="GroupList"
        component={GroupListScreen}
        options={{ title: "Travel Groups" }}
      />
      <Stack.Screen
        name="GroupDetail"
        component={GroupDetailScreen}
        options={{ title: "Group Info" }}
      />
      <Stack.Screen name="UserSearch" component={SearchUserScreen} />

      <Stack.Screen
        name="GroupEdit"
        component={EditGroupScreen}
        options={{ title: "Edit Group" }}
      />
      <Stack.Screen
        name="GroupCreate"
        component={CreateNewGroupScreen}
        options={{ title: "New Group" }}
      />
      <Stack.Screen name="GroupManage" component={GroupManageScreen} />
      <Stack.Screen
        name="PlanList"
        component={PlanListScreen}
        options={{ title: "Group Travels" }}
      />
      <Stack.Screen name="UserBasicInfo" component={UserBasicInfoScreen} />
    </Stack.Navigator>
  );
};

export default TravelgroupStack;
