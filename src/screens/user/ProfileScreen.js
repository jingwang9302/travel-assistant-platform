import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {connect, useDispatch} from "react-redux";
import {Avatar, Card, Icon} from "react-native-elements";
import {setLogout} from "../../redux/actions/user";
import LoginAlertScreen from "./LoginAlertScreen";

const ProfileScreen = ({navigation, userProfile}) => {

    const dispatch = useDispatch();

    if (!userProfile.isLogin) {
        return (
            <LoginAlertScreen/>
        );
    }

    return(
        <View style={styles.mainBody}>
            <Card containerStyle={styles.card}>
                <Card.Title style={styles.cardTitleStyle}>
                    <View style={{alignItems: 'center', flexDirections: 'column', }}>
                        <Avatar
                            size="large"
                            rounded
                            title={
                                userProfile.firstName.substr(0,1).toUpperCase()+
                                userProfile.lastName.substr(0,1).toUpperCase()
                            }
                            activeOpacity={0.7}
                            overlayContainerStyle={{backgroundColor: 'grey'}}/>
                        <Text style={{fontSize: 20}}>{userProfile.firstName+' '+userProfile.lastName}</Text>
                    </View>
                </Card.Title>
                <Card.Divider/>
                <View style={{flexDirections: 'column', }}>
                    <Text style={styles.cardTextStyle}>
                        <Icon name='email' type = 'material-community' color='black'/>  {userProfile.email}
                    </Text>
                    <Text style={styles.cardTextStyle}>
                        <Icon name='home-city' type = 'material-community' color='black'/>  {userProfile.address}
                    </Text>
                    <Text style={styles.cardTextStyle}>
                        <Icon name='phone' type = 'material-community' color='black'/>  {userProfile.phone}
                    </Text>
                </View>
            </Card>

            <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={() => navigation.navigate('Friend')}
                >
                <Text style={styles.buttonTextStyle}>Friends</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={() => navigation.navigate('FavoritePlace')}
            >
                <Text style={styles.buttonTextStyle}>Favorite Places</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.logoutButtonStyle}
                activeOpacity={0.5}
                onPress={()=>{dispatch(setLogout())}}>
                <Text style={styles.buttonTextStyle}>Logout</Text>
            </TouchableOpacity>
        </View>

    );
};

const styles = StyleSheet.create({
    mainBody: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#307ecc',
        alignContent: 'center',
    },
    card: {
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 10,
    },
    cardTitleStyle: {
        color: 'black',
        fontSize: 25,
        alignContent: 'center',
    },
    cardTextStyle: {
        color: 'black',
        fontSize: 15,
        margin: 5,
        paddingLeft: 20,
    },
    buttonStyle: {
        backgroundColor: '#223f53',
        borderWidth: 0,
        color: '#FFFFFF',
        borderColor: '#223f53',
        height: 40,
        alignItems: 'center',
        borderRadius: 10,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 10,
        marginBottom: 0,
    },
    logoutButtonStyle: {
        backgroundColor: '#307016',
        borderWidth: 0,
        color: '#FFFFFF',
        borderColor: '#307016',
        height: 40,
        alignItems: 'center',
        borderRadius: 10,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 20,
        marginBottom: 5,
    },
    buttonTextStyle: {
        color: '#FFFFFF',
        paddingVertical: 10,
        fontSize: 16,
    },
    loginTextStyle: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        padding: 30,
    },
});

const mapStateToProps = (state) => {
    return {
        userProfile: state.user
    }
}

export default connect(mapStateToProps)(ProfileScreen);