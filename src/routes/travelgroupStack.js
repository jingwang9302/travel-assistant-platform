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
        options={{ title: "Travelgroups" }}
      />
      <Stack.Screen
        name="GroupDetail"
        component={GroupDetailScreen}
        options={{ title: "Group Detail" }}
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
      <Stack.Screen
        name="GroupManage"
        component={GroupManageScreen}
        options={{
          headerRightContainerStyle: { marginRight: 40, marginTop: 20 },
          title: "",
          headerRight: () => (
            <Button
              icon={<Icon name="add" size={17} color="blue" />}
              buttonStyle={{ backgroundColor: "whites", height: 30 }}
              title="Add as Friend"
              titleStyle={{ fontSize: 13, color: "blue" }}
              onPress={() => {
                console.log("add user pressed");
              }}
            />
          ),
        }}
      />
      <Stack.Screen name="PlanList" component={PlanListScreen} />
      <Stack.Screen name="UserBasicInfo" component={UserBasicInfoScreen} />

      {/* <Stack.Screen name="PlanDetail" component={PlanDetailScreen} /> */}
      {/* <Stack.Screen
        name="PlanPublish"
        component={GroupListForPlanPublishScreen}
      />
      <Stack.Screen name="PlanEdit" component={EditPlanScreen} />

      <Stack.Screen
        name="PlanCreate"
        component={CreateNewPlanScreen}
        options={{
          title: "New Plan",
        }}
      />
      <Stack.Screen
        name="PlacePick"
        component={PlacePickScreen}
        options={{
          title: "Add a Place",
        }}
      />
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{ title: "Map" }}
      />

      <Stack.Screen name="Test" component={TestScreen} /> */}
    </Stack.Navigator>
  );
};

export default TravelgroupStack;
