// @refresh reset
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
// import { Alert } from 'react-native';
import firebaseConfig from '../config/messagingConfig';
import axios from "axios";

import firebase from 'firebase/app';
import 'firebase/firestore';
import { GET_A_SINGLE_PLAN_BY_ID } from '../config/urls';


const SOSTextIdLength = 6;
const SOSText = "This is an SOS message.";

export const sendSOSToOngoingPlanGroupChat = async (currentUserProfile, ongoingPlan) => {
    travelGroup = '';
    if (firebase.apps.length === 0){
        firebase.initializeApp(firebaseConfig);
    }

    const db = firebase.firestore();
    const messagesRef = db.collection('messages');

    const userId = currentUserProfile.id;
    const userFirstName = currentUserProfile.firstName;

    axios({
        method: 'get',
        url: GET_A_SINGLE_PLAN_BY_ID + ongoingPlan,
        headers: {
            'Authorization': 'Bearer '+ currentUserProfile.token
        }
        })
        .then(function (response) {
            console.log("Fetched travelGroup is: " + response.data.data.travelGroup);
            travelGroup = response.data.data.travelGroup;

            messagesRef.add(
                {
                    _id: getRandomString(SOSTextIdLength),
                    chatGroup:travelGroup,
                    text:SOSText,
                    user:{
                        _id: userId,
                        name: userFirstName,
                    },
                    createdAt: new Date(),
                }
            ).then(()=>{
                console.log("SOS sent.");
            });
                })
                .catch((error) => {
                    console.log(error);
                    Alert.alert(error);
                }
            );
}

function getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = 'SOS';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}


