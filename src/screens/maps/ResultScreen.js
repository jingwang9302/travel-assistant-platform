import React from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";
import { config } from "../../../config";

const ResultScreen = ({ route, navigation }) => {
  const result = route.params;
  console.log(result);
  const photoReference =
    result && result.photos && result.photos[0].photo_reference;
  const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${config.PLACES_API_KEY}`;
  return (
    <View>
      <Text>{result.name}</Text>
      <Text>{result.rating}</Text>
      {typeof photoUrl === "string" && (
        <Image
          source={{
            uri: photoUrl,
          }}
          style={styles.image}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 200,
    width: 300,
  },
});

export default ResultScreen;
