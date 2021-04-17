import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {connect, useDispatch} from "react-redux";
import {Avatar, Card, Icon, Input, Overlay} from "react-native-elements";
import LoginAlertScreen from "./LoginAlertScreen";
import axios from "axios";
import {UPLOAD_IMAGE_URL, USER_SERVICE} from "../../config/urls";
import {setAvatar, setProfile} from "../../redux/actions/user";
import * as ImagePicker from "expo-image-picker";

const ProfileScreen = ({userProfile}) => {

    if (!userProfile.isLogin) {
        return (
            <LoginAlertScreen/>
        );
    }

    const dispatch = useDispatch();
    const [visible, setVisible] = useState(false);
    const [avatarVisible, setAvatarVisible] = useState(false);
    const [firstName, setFirstName] = useState(userProfile.firstName);
    const [lastName, setLastName] = useState(userProfile.lastName);
    const [address, setAddress] = useState(userProfile.address);
    const [phone, setPhone] = useState(userProfile.phone);
    const [errorMessage, setErrorMessage] = useState('');
    const [avatarImage, setAvatarImage] = useState(null);

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    const toggleAvatarOverlay = () => {
        setAvatarVisible(!avatarVisible);
    };

    const saveProfile = () =>{
        if (!firstName) {
            setErrorMessage('Please fill First Name');
            return;
        }
        if (!lastName) {
            setErrorMessage('Please fill Last Name');
            return;
        }

        axios({
            method: 'put',
            url: USER_SERVICE +'/profile',
            headers: {
                'Authorization': 'Bearer '+ userProfile.token
            },
            data: {
                id: userProfile.id,
                password:'0',
                email: userProfile.email,
                firstName: firstName,
                lastName: lastName,
                address: address,
                phone: phone
            },
        })
            .then(function (response) {
                if(response.status === 200){
                    setVisible(false);
                    setErrorMessage('');
                    dispatch(setProfile(response.data));
                }
            })
            .catch(function (error) {
                if(error.response.data.message === null){
                    setErrorMessage(error.message);
                }else{
                    setErrorMessage(error.response.data.message);
                }
            });

    }

    const saveAvatar = () =>{
        if (avatarImage===null) {
            alert('Please select an image');
            return;
        }

        const fileName = avatarImage.split('/').pop();

        let formData = new FormData();
        let imageFile = {uri: avatarImage, type: 'application/octet-stream', name: fileName};
        formData.append('image', imageFile);

        fetch(USER_SERVICE +'/profile/avatar/'+userProfile.id, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer '+ userProfile.token,
                'Content-Type' : 'multipart/form-data',
            },
            body: formData,
        })
            .then((response) => {
                return response.json();
            })
            .then((data)=>{
                if(data.status === 500){
                    alert(data.message);
                }else{
                    dispatch(setAvatar(data.avatarUrl));
                    setAvatarVisible(false);
                }
            })
            .catch((error)=> {
                console.log('err: ' + error);
            });
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [3, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setAvatarImage(result.uri);
        }
    };

    const takePhoto = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [3, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setAvatarImage(result.uri);
        }
    };

    return(
        <View style={styles.mainBody}>
            <Card containerStyle={styles.card}>
                <View style={styles.cardTitleStyle}>
                    <View style={{alignItems: 'center', flexDirections: 'column',}}>
                        <Avatar
                            size="large"
                            rounded
                            title={
                                userProfile.firstName.substr(0,1).toUpperCase()+
                                userProfile.lastName.substr(0,1).toUpperCase()
                            }
                            source={{
                                uri: UPLOAD_IMAGE_URL + userProfile.avatarUrl,
                            }}
                            onPress={()=>{setAvatarVisible(true)}}
                            activeOpacity={0.7}
                            overlayContainerStyle={{backgroundColor: 'grey'}}>
                            <Avatar.Accessory size={20}/>
                        </Avatar>
                        <Text style={{fontSize: 20, fontWeight:'bold'}}>{userProfile.firstName+' '+userProfile.lastName}</Text>
                    </View>
                </View>
                <Card.Divider/>
                <View style={{flexDirections: 'column', paddingLeft:30, paddingRight:30}}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Icon name='email' type = 'material-community' color='black'/>
                        <Text style={styles.cardTextStyle}>
                            {userProfile.email}
                        </Text>
                    </View>
                    <View style={{flexDirection:'row' , alignItems:'center'}}>
                        <Icon name='home-city' type = 'material-community' color='black'/>
                        <Text style={styles.cardTextStyle}>
                            {userProfile.address}
                        </Text>
                    </View>
                    <View style={{flexDirection:'row' , alignItems:'center'}}>
                        <Icon name='phone' type = 'material-community' color='black'/>
                        <Text style={styles.cardTextStyle}>
                            {userProfile.phone}
                        </Text>
                    </View>
                </View>
            </Card>

            <TouchableOpacity
                style={styles.logoutButtonStyle}
                activeOpacity={0.5}
                onPress={()=>{setVisible(true)}}>
                <Text style={styles.buttonTextStyle}>Edit Profile</Text>
            </TouchableOpacity>

            <Overlay overlayStyle={styles.OverlayStyle} isVisible={visible} onBackdropPress={toggleOverlay}>
                <View style={{width:300, margin:10}}>
                    <ScrollView >
                        <Input
                            label={'Email'}
                            style={styles.inputStyle}
                            defaultValue={userProfile.email}
                            disabled={true}
                            leftIcon={
                                <Icon name='email' size={24} type = 'material-community' color='grey'/>
                            }
                        />
                        <Input
                            label={'First Name'}
                            style={styles.inputStyle}
                            defaultValue={firstName}
                            onChangeText={(text) => setFirstName(text)}
                            leftIcon={
                                <Icon name='account' size={24} type = 'material-community' color='grey'/>
                            }
                        />
                        <Input
                            label={'Last Name'}
                            style={styles.inputStyle}
                            defaultValue={lastName}
                            onChangeText={(text) => setLastName(text)}
                            leftIcon={
                                <Icon name='account' size={24} type = 'material-community' color='grey'/>
                            }
                        />
                        <Input
                            label={'Address'}
                            style={styles.inputStyle}
                            defaultValue={address}
                            onChangeText={(text) => setAddress(text)}
                            leftIcon={
                                <Icon name='home-city' size={24} type = 'material-community' color='grey'/>
                            }
                        />
                        <Input
                            label={'Phone'}
                            style={styles.inputStyle}
                            defaultValue={phone}
                            onChangeText={(text) => setPhone(text)}
                            leftIcon={
                                <Icon name='phone' size={24} type = 'material-community' color='grey'/>
                            }
                        />
                        <View>
                            {errorMessage !== '' ? (
                                <Text style={styles.errorTextStyle}>
                                    {errorMessage}
                                </Text>
                            ) : null}
                        </View>
                        <TouchableOpacity
                            style={styles.buttonStyle}
                            activeOpacity={0.5}
                            onPress={()=>{saveProfile()}}>
                            <Text style={styles.buttonTextStyle}>SAVE</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </Overlay>

            <Overlay overlayStyle={styles.OverlayStyle} isVisible={avatarVisible} onBackdropPress={toggleAvatarOverlay}>
                <View style={{width:300, margin:10}}>
                    <Text style={styles.label}>Upload Image</Text>
                    <View style={{ alignItems:'center', justifyContent:'center' }} >
                        {avatarImage && <Avatar rounded size={'xlarge'} source={{ uri: avatarImage }}/>}
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'space-evenly', marginTop:10}}>
                        <TouchableOpacity
                            style={styles.imageButtonStyle}
                            activeOpacity={0.5}
                            onPress={()=>{pickImage()}}
                        >
                            <Text style={styles.imageButtonTextStyle}>From Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.imageButtonStyle}
                            activeOpacity={0.5}
                            onPress={()=>{takePhoto()}}
                        >
                            <Text style={styles.imageButtonTextStyle}>From Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.imageButtonStyle}
                            activeOpacity={0.5}
                            onPress={()=>{setAvatarImage(null)}}
                        >
                            <Text style={styles.imageButtonTextStyle}>Clear Image</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity
                            style={styles.buttonStyle}
                            activeOpacity={0.5}
                            onPress={()=>{saveAvatar()}}
                        >
                            <Text style={styles.buttonTextStyle}>SAVE</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Overlay>
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
        marginBottom: 10,
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
    OverlayStyle: {
        justifyContent: 'center',
        alignContent: 'center',
    },
    inputStyle: {
        paddingLeft: 15,
        paddingRight: 15,
    },
    errorTextStyle: {
        color: 'red',
        textAlign: 'center',
        fontSize: 14,
    },
    label:{
        color: '#3181ab',
            fontSize:16,
            fontWeight:'bold',
            marginRight:10,
    },
    imageButtonStyle: {
        backgroundColor: '#3181ab',
        borderWidth: 0,
        color: '#FFFFFF',
        borderColor: '#3181ab',
        alignItems: 'center',
        borderRadius: 10,
    },
    imageButtonTextStyle: {
        color: '#FFFFFF',
        padding: 5,
        fontSize: 15,
    },
});

const mapStateToProps = (state) => {
    return {
        userProfile: state.user
    }
}

export default connect(mapStateToProps)(ProfileScreen);