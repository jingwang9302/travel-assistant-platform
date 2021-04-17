import React, { useState, useEffect } from "react";
import { StyleSheet, View, Modal, ActivityIndicator, Text } from "react-native";
import { Button } from "react-native-elements";

const CommentsModal = (props) => {
  const { visible, comments, ...attributes } = props;
  const [modalVisible, setMoalVisible] = useState(visible);
  //   useEffect(() => {
  //     setMoalVisible(visible);
  //   }, []);
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          console.log("close modal");
        }}
      >
        <View style={styles.modalBackground}>
          {comments && comments.length !== 0 ? (
            comments.map((item, index) => {
              <View key={index} style={{ marginBottom: 15 }}>
                <View>
                  <Text>{item.text}</Text>
                </View>

                <View style={{ marginHorizontal: 10 }}>
                  <Text> {item.user}</Text>
                </View>
                <View style={{ marginHorizontal: 5 }}>
                  <Text>{item.date}</Text>
                </View>
              </View>;
            })
          ) : (
            <View>
              <Text> No Comments</Text>
            </View>
          )}
          <View>
            <Text style={{ color: "white" }}>Comment</Text>
          </View>
          <View>
            <Button
              title="Close"
              onPress={() => {
                setMoalVisible(!modalVisible);
                //visible = false;
                console.log("close is clicked, visible is");
                console.log(visible);
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "#00000040",
  },
});

export default CommentsModal;
