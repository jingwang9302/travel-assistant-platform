import React from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Badge, Icon, ListItem } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import LoginAlertScreen from "./LoginAlertScreen";
<<<<<<< HEAD
import { setLogout } from "../../redux/actions/user";
=======
import {setLogout} from "../../redux/actions/user";
import {clearNotifications} from "../../redux/actions/notification";
import {UPLOAD_IMAGE_URL} from "../../config/urls";
>>>>>>> 428ffa77c845ced0f1bf9b52f65c3ac48d0867cd

import { clearTravelgroup } from "../../redux/actions/travelgroupAction";

<<<<<<< HEAD
const UserScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.user);
=======
    const dispatch = useDispatch();
    const userProfile = useSelector(state => state.user);
    const notifications = useSelector(state => state.notification.notifications);
    const unreadCount = notifications.filter(item => item.read === false).length;
>>>>>>> 428ffa77c845ced0f1bf9b52f65c3ac48d0867cd

  if (!userProfile.isLogin) {
    return <LoginAlertScreen />;
  }

<<<<<<< HEAD
  const list = [
    {
      title: "Friends",
      icon: "people",
      iconType: "Ionicons",
      screen: "Friend",
    },
    {
      title: "Favorite Places",
      icon: "google-maps",
      iconType: "material-community",
      screen: "FavoritePlace",
    },
  ];
=======
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
    ]

    const logout = () =>{
        dispatch(clearNotifications());
        dispatch(setLogout());
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
>>>>>>> 428ffa77c845ced0f1bf9b52f65c3ac48d0867cd

  return (
    <View>
      <View style={styles.SectionStyle}>
        <ListItem bottomDivider onPress={() => navigation.navigate("Profile")}>
          <Avatar
            rounded
            title={
              userProfile.firstName.substr(0, 1).toUpperCase() +
              userProfile.lastName.substr(0, 1).toUpperCase()
            }
            activeOpacity={0.7}
            overlayContainerStyle={{ backgroundColor: "grey" }}
          />
          <ListItem.Content>
            <ListItem.Title>Profile</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </View>
      <View style={styles.SectionStyle}>
        {list.map((item, i) => (
          <ListItem
            key={i}
            bottomDivider
            onPress={() => navigation.navigate(item.screen)}
          >
            <Icon name={item.icon} type={item.iconType} />
            <ListItem.Content>
              <ListItem.Title>{item.title}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        ))}
      </View>
      <View style={styles.SectionStyle}>
        <ListItem
          bottomDivider
          onPress={() => navigation.navigate("Notification")}
        >
          <Icon name={"notifications"} type={"Ionicons"} />
          <ListItem.Content>
            <ListItem.Title>Notifications</ListItem.Title>
          </ListItem.Content>
          <Badge value={2} status="error" />
          <ListItem.Chevron />
        </ListItem>
      </View>
      <View style={styles.SectionStyle}>
        <ListItem
          bottomDivider
          onPress={() => {
            dispatch(setLogout());
            dispatch(clearTravelgroup());
          }}
        >
          <Icon name={"logout"} type={"material-community"} />
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
