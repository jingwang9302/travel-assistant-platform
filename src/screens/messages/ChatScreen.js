// @refresh reset
import React, {useState, useEffect, useCallback, } from 'react';
import {useSelector} from 'react-redux';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {GiftedChat} from 'react-native-gifted-chat';
import firebaseConfig from '../../config/messagingConfig';
import LoginAlertScreen from '../user/LoginAlertScreen';

import firebase from 'firebase/app';
import 'firebase/firestore';

/** As same in 'routes/userStack.js' */
const LOGIN_SCREEN_LITERAL_NAME = 'Login';
/** Literal prompt for guest user */
const ANONYMOUS_USER_LOGIN_PROMPT = 'You need to login to use message function.';

if (firebase.apps.length === 0){
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const messagesRef = db.collection('messages');

const ChatScreen = (props) => {
    const [user, setUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const currentUserProfile = useSelector(state => state.user);
    const navigation = useNavigation();

    useEffect(()=>{
        console.log("chatGroup: " + JSON.stringify(props.route.params.chatGroup));
        readUser();
        const unsubscribe = messagesRef
            .where('chatGroup', '==', props.route.params.chatGroup)
            .onSnapshot((querySnapshot) => {
            const messagesFirestore = querySnapshot
                .docChanges()
                .filter(({ type }) => type === 'added')
                .map(({ doc }) => {
                    const message = doc.data()
                    /**
                     * createdAt is a firebase.firestore.Timestamp instance
                     * Please refer to https://firebase.google.com/docs/reference/js/firebase.firestore.Timestamp
                     */
                    return { ...message, createdAt: message.createdAt.toDate() }
                })
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            appendMessages(messagesFirestore)
        });
        console.log("[ChatScreen::useEffect]Chat screen rendered.");
        return () => unsubscribe();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            console.log("[ChatScreen::useFocusEffect] Chat focused");
            console.log(currentUserProfile);
            if (!currentUserProfile.isLogin) {
                navigation.navigate("Message");
            }
        }, [])
      );

    /**
     * Append newly 'added' messages to previous messages.
     */
    const appendMessages = useCallback(
        (messages) => {
            setMessages((previousMessages) => GiftedChat.append(previousMessages, messages))
        },
        [messages]
    )

    /**
     * Obtain user data. 
     */
    async function readUser(){
        setUser({
            _id: currentUserProfile.id,
            FirstName: currentUserProfile.firstName
        });
    }

    /**
     * Send messages through GiftedChat.
     * Create an array of Promises and execute them.
     * @param {*} messages 
     */
    async function handleSend(messages) {
        const writes = messages.map((m) => {
            m = {...m, chatGroup:props.route.params.chatGroup}
            messagesRef.add(m)
        })
        await Promise.all(writes)
    }

    if (!currentUserProfile.isLogin) {
        return ( <LoginAlertScreen /> );
    } else return (
        <GiftedChat messages={messages} user={user} onSend={handleSend} renderUsernameOnMessage={true}/>
    );
}

export default ChatScreen;