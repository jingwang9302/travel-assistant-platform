import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

const MessageHomeScreen = () => {
    const [userScreenName, setUserScreenName] = useState('');
    const userProfile = useSelector(state => state.user);
    const navigation = useNavigation();

    /**
     * Assemble user info to pass onto the Chat screen.
     * !!! For test purpose, _id is generated randomly. !!!
     */
    async function composeUserInfo(){
        const _id = userProfile.isLogin ? userProfile.id : Math.random().toString(20).substring(6);
        const userName = userProfile.isLogin ? userProfile.firstName : userScreenName;
        const user = {_id, userName};
        console.log("current user: " + JSON.stringify(user));
        await AsyncStorage.setItem('user', JSON.stringify(user));
    }

    async function handlePress(){
        if (!userProfile.isLogin) {
            alert("You are chatting anonymously.\n Your user id is randomly generated.");
        }
        await composeUserInfo();
        navigation.navigate('Chat');
    }

    if (userProfile.isLogin) {
        return (
            <TouchableOpacity
                onPress={handlePress}
            >
                <Text style={styles.label}>
                    Press to proceed to chat.
                </Text>
            </TouchableOpacity>
        )
    } 
    else return (
        <View style={styles.container}>
        <Text style={[styles.label, {marginTop: 40}]}>
          Enter your name :
        </Text>
        <TextInput
          placeholder='Type your screen name here.'
          style={styles.textInput}
          onChangeText={(text) => {
            setUserScreenName(text);
          }}
          value={userScreenName}
        />
        <TouchableOpacity
          onPress={handlePress}
        >
          <Text style={styles.label}>
            Next
          </Text>
        </TouchableOpacity>
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
});

export default MessageHomeScreen;