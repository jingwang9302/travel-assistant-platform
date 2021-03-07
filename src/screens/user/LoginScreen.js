import React, {createRef, useState} from 'react';
import {
    StyleSheet,
    TextInput,
    View,
    Text,
    ScrollView,
    Image,
    Keyboard,
    TouchableOpacity,
    KeyboardAvoidingView, ImageBackground,
} from 'react-native';
import axios from "axios";

import { LOGIN_URL, USER_SERVICE } from '../../config/urls';
import Loader from "../../components/Loader";

const LoginScreen = ({navigation}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const passwordInputRef = createRef();

    const login = () =>{
        setLoading(true);
        console.log('username: '+ username);
        console.log('password: '+ password);
        axios({
            method: 'post',
            url: LOGIN_URL,
            data: {
                grant_type: 'password',
                client_id: 'tap',
                client_secret: '123456',
                username: username,
                password: password
            },
            transformRequest: [function (data) {
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then(function (response) {
                console.log(response);
                const token = response.data.access_token;
                console.log('token is: '+token);
                // store.dispatch(setLogin(true));
                // store.dispatch(setToken(token));
                fetchUserInfo(token);
                // history.push('/product');
                // message.success('Login Successful!');
                setLoading(false);
            })
            .catch(function (error) {
                setLoading(false);

                setErrorMessage(error.message);
                console.log(error);
                // if(error.response.data.message === null){
                //     setErrorMessage('User does not exist');
                // }else{
                //     setErrorMessage(error.response.data.message);
                // }
            });
    }

    const fetchUserInfo = (token) =>{
        axios({
            method: 'get',
            url: USER_SERVICE +'/profile/'+ username,
            headers: {
                'Authorization': 'Bearer '+token
            }
        })
            .then(function (response) {
                console.log(response);
                // store.dispatch(setProfile(response.data));
            })
            .catch(function (error) {
                console.log(error.response);
            });
    }

    return(
        <View style={styles.mainBody}>
            <ImageBackground
                source={require('../../../assets/image/login.jpg') }
                style={styles.image}
            >
                <Loader loading={loading} message='Login...'/>
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{
                        flex: 1,
                        justifyContent: 'center',
                        alignContent: 'center',
                    }}>
                    <View>
                        <KeyboardAvoidingView enabled>
                            <View style={{alignItems: 'center'}}>
                                <Image
                                    source={require('../../../assets/splash.png')}
                                    style={{
                                        width: '50%',
                                        height: 100,
                                        resizeMode: 'contain',
                                        margin: 30,
                                    }}
                                />
                            </View>
                            <View style={styles.SectionStyle}>
                                <TextInput
                                    style={styles.inputStyle}
                                    onChangeText={(text) => setUsername(text)}
                                    placeholder="Email"
                                    placeholderTextColor="#8b9cb5"
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    returnKeyType="next"
                                    onSubmitEditing={() =>
                                        passwordInputRef.current &&
                                        passwordInputRef.current.focus()
                                    }
                                    underlineColorAndroid="#f000"
                                    blurOnSubmit={false}
                                />
                            </View>
                            <View style={styles.SectionStyle}>
                                <TextInput
                                    style={styles.inputStyle}
                                    onChangeText={(text) => setPassword(text)}
                                    placeholder="Password"
                                    placeholderTextColor="#8b9cb5"
                                    keyboardType="default"
                                    ref={passwordInputRef}
                                    onSubmitEditing={Keyboard.dismiss}
                                    blurOnSubmit={false}
                                    secureTextEntry={true}
                                    underlineColorAndroid="#f000"
                                    returnKeyType="next"
                                />
                            </View>
                            {errorMessage !== '' ? (
                                <Text style={styles.errorTextStyle}>
                                    {errorMessage}
                                </Text>
                            ) : null}
                            <TouchableOpacity
                                style={styles.buttonStyle}
                                activeOpacity={0.5}
                                onPress={login}>
                                <Text style={styles.buttonTextStyle}>LOGIN</Text>
                            </TouchableOpacity>
                            <Text
                                style={styles.registerTextStyle}
                                onPress={() => navigation.navigate('Register')}>
                                New Here ? Register
                            </Text>
                        </KeyboardAvoidingView>
                    </View>
                </ScrollView>
            </ImageBackground>
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
    image: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: "center"
    },
    SectionStyle: {
        flexDirection: 'row',
        height: 40,
        marginTop: 20,
        marginLeft: 35,
        marginRight: 35,
        margin: 10,
    },
    buttonStyle: {
        backgroundColor: '#7de24e',
        borderWidth: 0,
        color: '#FFFFFF',
        borderColor: '#7DE24E',
        height: 40,
        alignItems: 'center',
        borderRadius: 10,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 20,
        marginBottom: 25,
    },
    buttonTextStyle: {
        color: '#FFFFFF',
        paddingVertical: 10,
        fontSize: 16,
    },
    inputStyle: {
        flex: 1,
        color: 'white',
        paddingLeft: 15,
        paddingRight: 15,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'white',
    },
    registerTextStyle: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 14,
        alignSelf: 'center',
        padding: 10,
    },
    errorTextStyle: {
        color: 'red',
        textAlign: 'center',
        fontSize: 14,
    },
});

export default LoginScreen;