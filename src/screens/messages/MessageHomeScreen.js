import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {Icon, Avatar} from "react-native-elements";
import {Card, Fab} from "native-base";
import firebase from 'firebase/app';
import 'firebase/firestore';
import axios from "axios";
import DialogInput from 'react-native-dialog-input';
import firebaseConfig from '../../config/messagingConfig';
import {GET_ALL_GROUPS_USER_BELONGS_BY_USERID, USER_BASIC_PROFILE_BY_USERID_URL, GCS_URL} from '../../config/urls';

/** As same in 'routes/userStack.js' */
const LOGIN_SCREEN_LITERAL_NAME = 'Login';
/** Literal prompt for guest user */
const ANONYMOUS_USER_LOGIN_PROMPT = 'You need to login to use message function.';

if (firebase.apps.length === 0){
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const messagesRef = db.collection('messages');

// TODO: refresh after new user logs in.
const MessageHomeScreen = () => {
    const userProfile = useSelector(state => state.user);
    /** List of groups that current user is in. */
    const [userGroupList, updateUserGroupList] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
      fetchUserChatGroupInfo();
    }, []);

    /** Call Group Service to fetch a list of groupId/chatId of which current user is in. */
    async function fetchUserChatGroupInfo(){
      if (!userProfile.isLogin) {
        return;
      }

      axios({
        method: 'GET',
        url: GET_ALL_GROUPS_USER_BELONGS_BY_USERID + userProfile.id,
        headers: {
            'Authorization': 'Bearer '+ userProfile.token
        }
      })
        .then(function (response) {
            updateUserGroupList(response.data.data);
        })
        .catch(
          (function (error) {
            console.log(error);
          })
        );
    }

    const renderItem = ({ item }) => (
      <TouchableOpacity key={item.id} onPress={()=> navigation.navigate("Chat", {chatGroup: item._id, chatTitle: item.groupName})}>
        <Card pointerEvents="none" style={styles.chatItem}>
          <View style={{flexDirection:"row", marginLeft:10}}>
            <Avatar source={{uri: GCS_URL + item.groupImage}}/>
            <Text style={styles.chatTitleText}> {item.groupName}</Text>
          </View>
        </Card>
      </TouchableOpacity>
    );

    async function fetchUserNames(userIdArray){
      let groupMemberFirstNames = [];

      userIdArray.forEach(userId => {
        axios({
          method: 'GET',
          url: USER_BASIC_PROFILE_BY_USERID_URL + userId,
          headers: {
              'Authorization': 'Bearer '+ userProfile.token
          }
        })
        .then(function (response) {
            // TODO: process response.
            console.log(response);
        })
        .catch(function (error) {
            console.log("FetchUserName:\n" + error);
        });
      });
    }

    if (userProfile.isLogin) {
        return (
          <View style={{flex: 1}}>
            <FlatList
                data={userGroupList}
                renderItem={renderItem}
                keyExtractor={(item) => item._id.toString()}
            />
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
    },
    chatTitleText:{
      color:'black',
      paddingBottom:5,
      marginLeft: 10
    },
    chatItem:{
      paddingTop:10,
      paddingBottom:10,
      marginBottom:0
    }
});

export default MessageHomeScreen;