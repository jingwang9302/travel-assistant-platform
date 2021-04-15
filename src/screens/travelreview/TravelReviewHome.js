import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button, Alert } from 'react-native';
import { ListItem } from "react-native-elements";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from "axios";

const TRAVEL_REVIEW_SERVICE_URL = '';
const FETCH_ALL_RECORDS_URL = '';

const TravelReviewHome = ({navigation}) => {
    const userProfile = useSelector(state => state.user);
    const userId = userProfile.id;

    /** TODO: sample travel reocords */
    const travelRecords = [
        {
          title: "Seattle road trip",
          Date: "2016-3-12"
        },
        {
          title: "NYC spring break",
          Date: "2012-2-12"
        },
        {
          title: "Florida Disney",
          Date: "2009-8-12"
        }
    ];


    /** send request to Service */
    async function fetchTravelRecords(){
        axios({
            method: 'get',
            url: TRAVEL_REVIEW_SERVICE_URL + FETCH_ALL_RECORDS_URL + '/' + userProfile.id,
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
                // TODO: fill travelRecords
            })
            .catch(function (error) {
                if(error.response.data.message === null){
                    console.log(error.message);
                }else {
                    console.log(error.response.data.message);
                }
            });
    }


    return (
        <View>
            <Text style={styles.greetingText}> Hello {userProfile.firstName},</Text>
            <Text style={styles.greetingText}> You have completed {travelRecords.length} trip(s)</Text>
            <View style={styles.tripItem}>
                {
                    travelRecords.map((item, i) => (
                        <ListItem key={i} bottomDivider onPress={()=>navigation.navigate("TravelReviewDetails")}>
                            <ListItem.Content>
                                <ListItem.Title>{item.title}</ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Chevron />
                        </ListItem>
                    ))
                }
            </View>
        </View>
        
    );
}

const styles = StyleSheet.create({
    greetingText:{
      fontWeight:'bold',
      marginTop:10,
      marginBottom:10,
    },
    tripTitleText:{
      color:'red',
      paddingBottom:5,
    },
    tripItem:{
      paddingTop:10,
      paddingBottom:10,
      marginBottom:0
    }
});

export default TravelReviewHome;