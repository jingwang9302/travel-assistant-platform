import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import {Icon} from "react-native-elements";
import {Card, Fab} from "native-base";
import firebase from 'firebase/app';
import 'firebase/firestore';
import axios from "axios";
import DialogInput from 'react-native-dialog-input';
import firebaseConfig from '../../config/messagingConfig';
import {GROUP_SERVICE, USER_SERVICE} from '../../config/urls';

//TODO: REPLACE WITH CORRECT URL
/** The URL to fetch chat group information */
const USER_GROUP_URL = '';
/** The URL to create new chat group. PAYLOAD: list of verified user emails. RESPONSE: chat group Id. */
const CREATE_NEW_CHAT_GROUP_URL = '';
/** The URL to verify if ONE user exists. */
const VERIFY_USER_URL = '';

/** As same in 'routes/userStack.js' */
const LOGIN_SCREEN_LITERAL_NAME = 'Login';
/** Literal prompt for guest user */
const ANONYMOUS_USER_LOGIN_PROMPT = 'You need to login to use message function.';

if (firebase.apps.length === 0){
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const messagesRef = db.collection('messages');

const sampleUserGroupListData = [
  {
    id: 1,
    members: ["Jason", "Luke", "Smith"] 
  },
  {
    id: 2,
    members: ["Mary", "Mike", "Jesse"]
  }
];

const MessageHomeScreen = () => {
    const [showDialog, setShowDialog] = useState(false);
    const userProfile = useSelector(state => state.user);
    const navigation = useNavigation();
  
    /** This list contains a list of groupId/chatId of which the current user is a member. */
    const userGroupChatList = [];

    /** Call Group Service to fetch a list of groupId/chatId of which current user is in. */
    async function fetchUserChatGroupInfo(){
      if (!userProfile.isLogin) {
        return;
      }

      axios({
        method: 'post',
        url: GROUP_SERVICE + USER_GROUP_URL + '/' + userProfile.id,
        headers: {
            'Authorization': 'Bearer '+ userProfile.token
        },
        data: {
            title: title,
            content: content,
            authorId: userProfile.id,
            privacy: privacy
        }
      })
        .then(function (response) {
            // TODO: fill userGroupChatList
        })
        .catch(function (error) {
            if(error.response.data.message === null){
                console.log(error.message);
            }else {
                console.log(error.response.data.message);
            }
        });
    }

    async function composeUserInfo(){
        const _id = userProfile.id;
        const name = userProfile.firstName;
        const user = {_id, name};
        console.log("[MessageHomeScreen::composeUserInfo]current user: " + JSON.stringify(user));
        await AsyncStorage.setItem('user', JSON.stringify(user));
    }

    // TODO: adjust information displayed on each card. (e.g. what type of information should be there?)
    const renderItem = ({ item }) => (
      <TouchableOpacity key={item.id} onPress={()=> navigation.navigate("Chat", {chatGroup: item.id, members:item.members.join(", ")})}>
        <Card pointerEvents="none">
          <Text>{item.id}</Text>
          <Text>{item.members.join(", ")}</Text>
        </Card>
      </TouchableOpacity>
    );

    // TODO: re-confirm process.
    /**
     * Create new chat steps:
     * 1. Verify if contact(s) exist in system from User Service --> verifyUserEmail()
     *    If any contact is not found, display an alert --> displayUserNotFoundAlert()
     * 2. Create new chat group and obtain a chatGroup Id from Group service. --> createNewChatGroup()
     * 3. Obtain user first names from User Service.  --> fetchUserNames()
     * 4. Navigate to chat screen. --> directToNewChatScreen()
     * @param {*} userInputText: original user input text, delimited by comma. 
     */
    async function createNewChat (userInputText){
      // TODO: process user original input.
      const userEmailArray = [];
      const areUsersAllValid = await verifyUserEmail(userEmailArray);
      if (areUsersAllValid) {
        const newChatGroupId = await createNewChatGroup(userEmailArray);
        const userNamesArray = await fetchUserNames(userEmailArray);
        directToNewChatScreen(newChatGroupId, userNamesArray);
      }else{
        displayUserNotFoundAlert();
      }
    };

    async function verifyUserEmail(userEmailArray){
      console.log("Verifying user " + userEmailArray);
      // TODO: process multiple verfications (e.g. for new group chat. rather than one-to-one chat.)
      axios({
        // TODO: 'POST' or 'GET'?
        method: 'post',
        url: USER_SERVICE + VERIFY_USER_URL + '/' + userEmail,
        headers: {
            'Authorization': 'Bearer '+ userProfile.token
        },
        data: {
          // TODO: verify field name with existing API - User Service. 
          email : userEmailArray
        }
      })
        .then(function (response) {
            // TODO: process response.
            console.log(JSON.stringify(response));
        })
        .catch(function (error) {
            if(error.response.data.message === null){
                console.log(error.message);
            }else {
                console.log(error.response.data.message);
            }
        });
    }

    async function createNewChatGroup(userEmailArray){
      console.log("Creating new chat group: " + userEmailArray);
      axios({
        method: 'post',
        url: GROUP_SERVICE + CREATE_NEW_CHAT_GROUP_URL,
        headers: {
            'Authorization': 'Bearer '+ userProfile.token
        },
        data: {
          // TODO: verify field name with existing API - Group Service. 
          emails: userEmailArray
        }
      })
        .then(function (response) {
            // TODO: process response.
            console.log(JSON.stringify(response));
        })
        .catch(function (error) {
            if(error.response.data.message === null){
                console.log(error.message);
            }else {
                console.log(error.response.data.message);
            }
        });
    }


    async function fetchUserNames(userEmailArray){
      console.log("Fetching user names: " + userEmailArray);
      axios({
        method: 'get',
        url: GROUP_SERVICE + CREATE_NEW_CHAT_GROUP_URL,
        headers: {
            'Authorization': 'Bearer '+ userProfile.token
        },
        data: {
          // TODO: verify field name with existing API - Group Service. 
          emails: userEmailArray
        }
      })
        .then(function (response) {
            // TODO: process response.
            console.log(JSON.stringify(response));
        })
        .catch(function (error) {
            if(error.response.data.message === null){
                console.log(error.message);
            }else {
                console.log(error.response.data.message);
            }
        });
    }

    const displayUserNotFoundAlert = (userEmail)=>{
      Alert.alert(
        "Oops",
        "Some user(s) is(are) not found.\n Please verify.",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          }
        ]
      );
    }

    /**
     * 
     * @param {*} id : chatGroup id
     * @param {*} members : an array containing first names of chat members.
     */
    const directToNewChatScreen = (id, members) => {
      navigation.navigate("Chat", {chatGroup: id, members: members.join(", ")});
    }

    if (userProfile.isLogin) {
        return (
          <View style={{flex: 1}}>
            <FlatList
                data={sampleUserGroupListData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />

            <Fab
              direction="up"
              containerStyle={{ }}
              style={{ backgroundColor: '#96c8e9' }}
              position="bottomRight"
              onPress={()=> setShowDialog(true)}>
              <Icon name="plus" type={'antdesign'}/>
            </Fab>

            <DialogInput isDialogVisible={showDialog}
              title={"Start new chat"}
              message={"Please enter contacts"}
              hintInput ={"aaa@bbb.com"}
              submitInput={ (inputText) => {createNewChat(inputText)} }
              closeDialog={ () => {setShowDialog(false)}}>
            </DialogInput>
          </View>
        )
    } 
    else return (
        <View style={styles.container}>
        <Text style={[styles.label, {marginTop: 40}]}>
          {ANONYMOUS_USER_LOGIN_PROMPT}
        </Text>
        <Button
          title={LOGIN_SCREEN_LITERAL_NAME}
          onPress={()=> navigation.navigate(LOGIN_SCREEN_LITERAL_NAME)}
          style={styles.loginButton}
        />
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    label: {
      fontSize: 20,
      marginLeft: 15,
    },
    textInput: {
      height: 40,
      marginLeft: 15,
    },
    loginButton:{
      marginTop:40,
    }
});

export default MessageHomeScreen;