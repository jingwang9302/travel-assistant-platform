import React, {useState}from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MessageHomeScreen = () => {
    const [userScreenName, setUserScreenName] = useState('');
    
    const navigation = useNavigation();

    return (
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
          onPress={() => {
            alert("Going to chat screen. \n User: " + userScreenName);
            navigation.navigate('Chat', {
                name: userScreenName
            });
          }}
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