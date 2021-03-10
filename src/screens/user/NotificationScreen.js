import React from 'react';
import {ScrollView, Text} from 'react-native';
import {Icon, ListItem} from "react-native-elements";
import {connect} from "react-redux";
import {setRead} from "../../redux/actions/notification";
import axios from "axios";
import {NOTIFICATION_SERVICE} from "../../config/urls";

const NotificationScreen = ({navigation, notifications, markRead}) => {
    // const data = [
    //     {
    //         id: '1',
    //         title: 'Friend added',
    //         message: 'People added you as friend.',
    //         isRead: false
    //     },
    //     {
    //         id: '2',
    //         title: 'People arrived',
    //         message: 'People arrived at abc.',
    //         isRead: false
    //     },
    //     {
    //         id: '3',
    //         title: 'Group confirm',
    //         message: 'You joined in abc group.',
    //         isRead: true
    //     },
    // ]


    const showNotification = (item) =>{
        alert(item.content);
        sendSetRead(item.id);
    };

    const sendSetRead = (id) =>{
        axios({
            method: 'put',
            url: NOTIFICATION_SERVICE +'/read/'+ id,
            // headers: {
            //     'Authorization': 'Bearer '+token
            // }
        })
            .then(function (response) {
                markRead(id);
            })
            .catch(function (error) {
                console.log(error.response);
            });
    };


    return(
        <ScrollView>
            {
                notifications.map((item, i) => (
                    <ListItem key={i} bottomDivider onPress={()=>{showNotification(item)}}>
                        <Icon
                            name={item.read?'check-circle':'checkbox-blank-circle'}
                            type={'material-community'}
                            color={item.read?'#307016':'red'}
                        />
                        <ListItem.Content>
                            <ListItem.Title>{item.title}</ListItem.Title>
                        </ListItem.Content>
                        <Text>{item.timestamp}</Text>
                        <ListItem.Chevron />
                    </ListItem>
                ))
            }
        </ScrollView>

    );
};

const mapStateToProps = (state) => {
    return {
        notifications: state.notification.notifications
    }
};

const mapDispatchToProps = dispatch => {
    return{
        markRead: id => {dispatch(setRead(id))}
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationScreen);