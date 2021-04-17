// @refresh reset
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import firebaseConfig from '../config/messagingConfig';

import firebase from 'firebase/app';
import 'firebase/firestore';

const SOSTextIdLength = 6;

export function sendSOSToOngoingPlanGroupChat(){
    if (firebase.apps.length === 0){
        firebase.initializeApp(firebaseConfig);
    }

    const db = firebase.firestore();
    const messagesRef = db.collection('messages');
    const currentUserProfile = useSelector(state => state.user);
    const ongoingPlanId = useSelector(state => state.ongoingPlan);

    const userId = currentUserProfile.id;
    const userFirstName = currentUserProfile.firstName;
    //TODO: change SOS text.
    const SOSText = "This is an SOS.";

    messagesRef.add(
        {
            // TODO: for test only.
            _id: getRandomString(SOSTextIdLength),
            chatGroup:2,
            text:SOSText,
            user:{
                _id: userId,
                name: userFirstName,
            },
            createdAt: new Date(),
        }
    ).then( ()=>{
        console.log("SOS sent.");
    });
}

function getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = 'SOS';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}


