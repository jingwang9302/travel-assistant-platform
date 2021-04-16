import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { sendSOSToOngoingPlanGroupChat } from '../../components/MessagingUtils';


const TravelReviewDetails = () => {

    /** TODO: display travel details. */
    return (
        <View>
            <Text>Hello</Text>
            <Button
            onPress={() => sendSOSToOngoingPlanGroupChat()}
            title="Send SOS"
            />
        </View>
    );
}

export default TravelReviewDetails;