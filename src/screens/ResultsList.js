import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { withNavigation } from "react-navigation";
import useResults from "../hooks/useResults";

const ResultList = ({ results, navigation }) => {
  const [getSearchResultApi, resultList, errorMessage] = useResults();
  if (!results.length) {
    return null;
  }
  return (
    <View>
      <FlatList
        data={resultList}
        keyExtractor={(item) => item.place_id}
        renderItem={({ item }) => <Text>{item.name}</Text>}
        style={{
          backgroundColor: "grey",
          width: "80%",
          margin: 60,
          padding: 5,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
  },
});

export default withNavigation(ResultList);
