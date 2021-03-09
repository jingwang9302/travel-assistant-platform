import React from 'react';
import {
    View,
} from 'react-native';
import {Icon, ListItem} from "react-native-elements";

const NotificationScreen = ({navigation}) => {
    const data = [
        {
            id: '1',
            title: 'Friend added',
            message: 'People added you as friend.',
            isRead: false
        },
        {
            id: '2',
            title: 'People arrived',
            message: 'People arrived at abc.',
            isRead: false
        },
        {
            id: '3',
            title: 'Group confirm',
            message: 'You joined in abc group.',
            isRead: true
        },
    ]

    return(
        <View>
            {
                data.map((item, i) => (
                    <ListItem key={i} bottomDivider onPress={()=>alert(item.message)}>
                        <Icon
                            name={item.isRead?'check-circle':'checkbox-blank-circle'}
                            type={'material-community'}
                            color={item.isRead?'blue':'red'}
                        />
                        <ListItem.Content>
                            <ListItem.Title>{item.title}</ListItem.Title>
                        </ListItem.Content>
                        <ListItem.Chevron />
                    </ListItem>
                ))
            }
        </View>

    );
};

export default NotificationScreen;