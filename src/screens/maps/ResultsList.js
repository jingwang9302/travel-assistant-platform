import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ListItem, Icon, Card } from "react-native-elements";
import Result from "./ResultScreen";
const ResultList = ({ results }) => {
  const navigation = useNavigation();

  if (!results || !results.length) {
    return <Text>loading</Text>;
  }
  return (
    // <View>
    //   {list.map((item, i) => (
    //     <ListItem key={i} bottomDivider>
    //       <Icon name={item.icon} />
    //       <ListItem.Content>
    //         <ListItem.Title>{item.title}</ListItem.Title>
    //       </ListItem.Content>
    //       <ListItem.Chevron />
    //     </ListItem>
    //   ))}
    // </View>
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
    height: 300,
    bottom: 0,
  },
});

export default ResultList;
