import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
// import { withNavigation } from "react-navigation";
import Result from "./ResultScreen";

const ResultList = ({ results, navigation }) => {
  if (!results || !results.length) {
    return <Text>loading</Text>;
  }
  return (
    <View style={styles.listContainer}>
      <FlatList
        data={results}
        keyExtractor={(item) => item.place_id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Result", { result: item });
            }}
          >
            <Text>{item.name}</Text>
            {/* <Result result={item} /> */}
          </TouchableOpacity>
        )}
        style={{
          backgroundColor: "white",
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
  listContainer: {
    height: 200,
  },
});

export default ResultList;
