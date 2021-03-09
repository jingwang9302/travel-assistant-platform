import React from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import {Avatar, Badge, Icon, ListItem} from "react-native-elements";
import {useDispatch, useSelector} from "react-redux";
import LoginAlertScreen from "./LoginAlertScreen";
import {setLogout} from "../../redux/actions/user";

const UserScreen = ({navigation}) => {

    const dispatch = useDispatch();
    const userProfile = useSelector(state => state.user);

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
    ]

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
                    <Badge
                        value={2}
                        status="error"
                    />
                    <ListItem.Chevron />
                </ListItem>
            </View>
            <View style={styles.SectionStyle}>
                <ListItem bottomDivider onPress={()=>{dispatch(setLogout())}}>
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