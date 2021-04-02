import React from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Card, ListItem, Button, Icon } from "react-native-elements";
import { config } from "../../../config";

const ResultScreen = ({ route, navigation }) => {
  const result = route.params;
  const { address, latitude, longitude, place_id, title, url } = result.result;

  console.log(result);

  return (
    <View>
      <Card>
        <Card.Title>{title}</Card.Title>
        <Card.Divider />
        <Text style={{ marginBottom: 10 }}>{address}</Text>
        {typeof url === "string" && (
          <Card.Image
            source={{
              uri: url,
            }}
          />
        )}

        <Button
          // icon={<Icon name="code" color="#ffffff" />}
          style={styles.buttonStyle}
          title="GO HERE"
          onPress={() => {
            navigation.navigate("Search");
          }}
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 200,
    width: 300,
  },
  buttonStyle: {
    borderRadius: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
  },
});

export default ResultScreen;
