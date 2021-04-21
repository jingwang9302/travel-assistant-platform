import React from 'react';
import {
    View,
    StyleSheet, Alert,
} from 'react-native';
import {Avatar, Badge, Icon, ListItem} from "react-native-elements";
import {useDispatch, useSelector} from "react-redux";
import LoginAlertScreen from "./LoginAlertScreen";
import {setLogout} from "../../redux/actions/user";
import {clearNotifications} from "../../redux/actions/notification";
import {UPLOAD_IMAGE_URL} from "../../config/urls";

const UserScreen = ({navigation}) => {

    const dispatch = useDispatch();
    const userProfile = useSelector(state => state.user);
    const notifications = useSelector(state => state.notification.notifications);
    const unreadCount = notifications.filter(item => item.read === false).length;

    if (!userProfile.isLogin) {
        return (
            <LoginAlertScreen/>
        );
    }

    const list = [
        {
            title: 'Friends',
            icon: 'people',
            iconType: 'Ionicons',
            screen: 'Friend'
        },
        {
            title: 'Favorite Places',
            icon: 'google-maps',
            iconType: 'material-community',
            screen: 'FavoritePlace'
        },
        {
            title: 'Post',
            icon: 'penguin',
            iconType: 'material-community',
            screen: 'Post'
        },
        {
            title: 'Travel Reviews',
            icon: 'calendar',
            iconType: 'material-community',
            screen: 'TravelReviewHome'
        }
    ]

    const logout = () =>{
        Alert.alert(
            'Logout?',
            'Are you sure to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                { text: 'Yes',
                    onPress: () => {
                        dispatch(clearNotifications());
                        dispatch(setLogout());
                    }
                }
            ],
            { cancelable: false }
        );
    }

    return(
        <View>
            <View style={styles.SectionStyle}>
                <ListItem bottomDivider onPress={()=>navigation.navigate('Profile')}>
                    <Avatar
                        rounded
                        title={
                            userProfile.firstName.substr(0,1).toUpperCase()+
                            userProfile.lastName.substr(0,1).toUpperCase()
                        }
                        source={{
                            uri: UPLOAD_IMAGE_URL + userProfile.avatarUrl,
                        }}
                        activeOpacity={0.7}
                        overlayContainerStyle={{backgroundColor: 'grey'}}/>
                    <ListItem.Content>
                        <ListItem.Title>Profile</ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
            </View>
            <View style={styles.SectionStyle}>
                {
                    list.map((item, i) => (
                        <ListItem key={i} bottomDivider onPress={()=>navigation.navigate(item.screen)}>
                            <Icon name={item.icon} type={item.iconType}/>
                            <ListItem.Content>
                                <ListItem.Title>{item.title}</ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Chevron />
                        </ListItem>
                    ))
                }
            </View>
            <View style={styles.SectionStyle}>
                <ListItem bottomDivider onPress={()=>navigation.navigate('Notification')}>
                    <Icon name={'notifications'} type={'Ionicons'}/>
                    <ListItem.Content>
                        <ListItem.Title>Notifications</ListItem.Title>
                    </ListItem.Content>
                    {
                        unreadCount !== 0? (<Badge value={unreadCount} status="error"/>):(<View/>)

                    }
                    <ListItem.Chevron />
                </ListItem>
            </View>
            <View style={styles.SectionStyle}>
                <ListItem bottomDivider onPress={logout}>
                    <Icon name={'logout'} type={'material-community'}/>
                    <ListItem.Content>
                        <ListItem.Title>Logout</ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    SectionStyle: {
        marginTop: 5,
        marginBottom: 10,
        margin: 5,
    },
});

export default UserScreen;
