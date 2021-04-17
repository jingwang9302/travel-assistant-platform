import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Icon, Badge } from "react-native-elements";
import { PLAN_BASE_URL, GCS_URL } from "../../config/urls";

const PlanItem = (props) => {
  // pass travelplan object as parameter
  let TouchableCmp = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  return (
    <View style={{ ...styles.product, ...styles.card }}>
      {props.loading ? (
        <ActivityIndicator size="large" color="black" />
      ) : (
        <View style={styles.touchable}>
          <TouchableCmp onPress={props.onSelect} useForeground>
            <View>
              <View style={styles.imageContainer}>
                <Image
                  style={styles.image}
                  source={{
                    uri: GCS_URL + props.imageUrl,
                  }}
                  //source={require("../../screens/travelplan/images/planimage.jpeg")}
                />
              </View>
              <View
                style={{
                  alignItems: "center",
                  height: "30%",
                  justifyContent: "center",
                }}
              >
                <Text style={styles.title}>{props.name}</Text>
                <Text style={{ fontSize: 17 }}>{props.description}</Text>
                <Text style={{ fontSize: 15, marginTop: 3 }}>
                  Start Time: {props.estimatedStartDate}{" "}
                </Text>
              </View>
              <View
                style={{
                  marginHorizontal: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  height: "10%",
                }}
              >
                <View>
                  <Icon name="thumbs-up-outline" type="ionicon" />
                  {props.likes === 0 ? null : (
                    <Badge
                      value={props.likes}
                      status="success"
                      containerStyle={{
                        position: "absolute",
                        bottom: 5,
                        left: 25,
                      }}
                    />
                  )}
                </View>

                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  {props.status}
                </Text>
                <View>
                  <Icon name="thumbs-down-outline" type="ionicon" />
                  {props.dislikes === 0 ? null : (
                    <Badge
                      value={props.dislikes}
                      status="warning"
                      containerStyle={{
                        position: "absolute",
                        bottom: 5,
                        right: 25,
                      }}
                    />
                  )}
                </View>
              </View>
              <View>{props.children}</View>
            </View>
          </TouchableCmp>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "white",
  },

  product: {
    height: 300,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  touchable: {
    borderRadius: 10,
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: "60%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  details: {
    alignItems: "center",
    height: "17%",
    padding: 10,
  },
  title: {
    fontSize: 20,
    marginVertical: 2,
  },
  price: {
    fontSize: 14,
    color: "#888",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "23%",
    paddingHorizontal: 20,
  },
});

export default PlanItem;
