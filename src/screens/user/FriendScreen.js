import React, {useEffect, useState} from 'react';
import {
    ScrollView, StyleSheet, View, Button, Alert, Text, TouchableOpacity,
} from 'react-native';
import {Avatar, Icon, Input, ListItem, Overlay} from "react-native-elements";
import {Fab} from 'native-base'
import axios from "axios";
import {UPLOAD_IMAGE_URL, USER_SERVICE} from "../../config/urls";
import {useSelector} from "react-redux";

const FriendScreen = ({navigation}) => {

    const userProfile = useSelector(state => state.user);
    const [friends, setFriends] = useState([]);
    const [visible, setVisible] = useState(false);
    const [friendEmail, setFriendEmail] = useState('');

    useEffect(() => {
        getFriend();
    },[]);

    const getFriend = () =>{
        axios({
            method: 'get',
            url: USER_SERVICE +'/friends/'+ userProfile.id,
            headers: {
                'Authorization': 'Bearer '+ userProfile.token
            }
        })
            .then(function (response) {
                setFriends(response.data);
            })
            .catch(function (error) {
                console.log(error.response);
            });
    };

    const addFriend = () =>{
        if (!friendEmail) {
            alert('Please fill Email');
            return;
        }else{
            axios({
                method: 'post',
                url: USER_SERVICE +'/friends/'+ userProfile.id +'/'+friendEmail,
                headers: {
                    'Authorization': 'Bearer '+ userProfile.token
                }
            })
                .then(function (response) {
                    getFriend();
                    setVisible(false);
                })
                .catch(function (error) {
                    if(error.response.data.message === null){
                        alert(error.message);
                    }else{
                        alert(error.response.data.message);
                    }
                });
        }

    }

    const deleteFriend = (friend)=>{

        Alert.alert(
            'Delete Friend?',
            'Are you sure to delete '+friend.firstName+' '+friend.lastName+'?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                { text: 'Yes',
                    onPress: () => {

                        axios({
                            method: 'delete',
                            url: USER_SERVICE +'/friends/'+ userProfile.id +'/'+friend.email,
                            headers: {
                                'Authorization': 'Bearer '+ userProfile.token
                            }
                        })
                            .then(function (response) {
                                getFriend();
                            })
                            .catch(function (error) {
                                console.log(error.response);
                            });
                    }
                }
            ],
            { cancelable: false }
        );

    }

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    return(
        <View style={{flex: 1}}>
            <ScrollView >

                {
                    friends.map((item, i) => (

                        <ListItem key={i} bottomDivider>
                            <Avatar
                                rounded
                                title={
                                    item.firstName.substr(0,1).toUpperCase()+
                                    item.lastName.substr(0,1).toUpperCase()
                                }
                                source={{
                                    uri: UPLOAD_IMAGE_URL + item.avatarUrl,
                                }}
                                activeOpacity={0.7}
                                overlayContainerStyle={{backgroundColor: 'grey'}}/>
                            <ListItem.Content>
                                <ListItem.Title>{item.firstName + ' ' + item.lastName}</ListItem.Title>
                            </ListItem.Content>
                            <Icon name="minus" type={'antdesign'} onPress={()=>{deleteFriend(item)}}/>
                        </ListItem>
                    ))
                }
            </ScrollView>
            <View>
                <Fab
                    direction="up"
                    containerStyle={{ }}
                    style={{ backgroundColor: '#96c8e9' }}
                    position="bottomRight"
                    onPress={() => setVisible(true)}>
                    <Icon name="plus" type={'antdesign'}/>
                </Fab>
                <Overlay overlayStyle={styles.OverlayStyle} isVisible={visible} onBackdropPress={toggleOverlay}>
                    <View>
                        <Text style={styles.OverlayTitle}>Please Enter Friend's Email</Text>
                        <Input
                            style={styles.inputStyle}
                            onChangeText={(email) => setFriendEmail(email)}
                            placeholder="Email"
                            keyboardType="email-address"
                            blurOnSubmit={false}
                            leftIcon={
                                <Icon name='email' size={24} type = 'material-community' color='grey'/>
                            }
                        />
                        <TouchableOpacity
                            style={styles.buttonStyle}
                            activeOpacity={0.5}
                            onPress={()=>{addFriend()}}>
                            <Text style={styles.buttonTextStyle}>ADD</Text>
                        </TouchableOpacity>
                    </View>
                </Overlay>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: '#165470',
        borderWidth: 0,
        color: '#FFFFFF',
        borderColor: '#165470',
        height: 40,
        alignItems: 'center',
    },
    buttonTextStyle: {
        color: '#FFFFFF',
        paddingVertical: 10,
        fontSize: 16,
    },
    errorTextStyle: {
        color: 'red',
        textAlign: 'center',
        fontSize: 14,
    },
    SectionStyle: {
        marginTop: 5,
        marginBottom: 10,
        margin: 5,
    },
    inputStyle: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
    },
    OverlayStyle: {
        paddingVertical: 30,
        paddingHorizontal: 30,
        justifyContent: 'center',
        alignContent: 'center',
    },
    OverlayTitle: {
        color: '#000000',
        paddingVertical: 10,
        fontSize: 20,
    },
});


export default FriendScreen;