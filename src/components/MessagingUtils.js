// @refresh reset
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import firebaseConfig from '../config/messagingConfig';

import firebase from 'firebase/app';
import 'firebase/firestore';

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
    const SOSText = "SOS";

    messagesRef.add(
        {
            chatGroup:ongoingPlanId,
            text:SOSText,
            user:{
                _id: userId,
                name: userFirstName,
            }
        }
    ).then( ()=>{
        console.log("SOS sent.");
    });
}

