import React, {useState, useEffect} from 'react';
import { ScrollView } from 'react-native';
import {useSelector} from 'react-redux';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button, Alert } from 'react-native';
import { ListItem } from "react-native-elements";
import {GET_FINISHED_TRAVEL_PLANS_BY_USER_ID} from '../../config/urls';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";

const TravelReviewHome = ({navigation}) => {
    const userProfile = useSelector(state => state.user);
    const userId = userProfile.id;

    /** TODO: sample travel reocords */
    const [travelRecords, updateTravelRecords] = useState([]);
    
    useEffect(() => {
        fetchTravelRecords();
    }, []);


    /** send request to Service */
    async function fetchTravelRecords(){
        axios({
            method: 'get',
            url: GET_FINISHED_TRAVEL_PLANS_BY_USER_ID + userProfile.id,
            headers: {
                'Authorization': 'Bearer '+ userProfile.token
            }
          })
            .then(function (response) {
                // TODO: fill travelRecords
                // console.log(response.data);
                updateTravelRecords(response.data.data);
                // console.log(travelRecords.length);
            })
            .catch((error) => {
                console.log(error);
                Alert.alert("Failed! Fetching completed trips error.");
      });
    }




    return (
        <View style={{flex:1}}>
            <ScrollView>
                <Text style={styles.greetingText}> Hello {userProfile.firstName},</Text>
                <Text style={styles.greetingText}> You have completed {travelRecords.length} trip(s)</Text>
                <View style={styles.tripItem}>
                    {
                        travelRecords.map((item, i) => (
                            <ListItem key={i} bottomDivider onPress={()=>navigation.navigate("TravelReviewDetails")}>
                                <ListItem.Content>
                                    <ListItem.Title>{item.planName}</ListItem.Title>
                                </ListItem.Content>
                                <ListItem.Chevron />
                            </ListItem>
                        ))
                    }
                </View>
            </ScrollView>
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