import React, {createRef, useState} from 'react';
import axios from "axios";
import {
    StyleSheet,
    Keyboard,
    KeyboardAvoidingView,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import { USER_SERVICE } from '../../config/urls';
import Loader from "../../components/Loader";
import {Icon, Input} from "react-native-elements";


const RegisterScreen = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');

    const emailInputRef = createRef();
    const passwordInputRef = createRef();
    const passwordConfirmInputRef = createRef();
    const firstNameInputRef = createRef();
    const lastNameInputRef = createRef();
    const addressInputRef = createRef();
    const phoneInputRef = createRef();

    const [isRegistrationSuccess, setRegistrationSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const register = () =>{
        setErrorMessage('');
        if (!email) {
            setErrorMessage('Please fill Email');
            return;
        }
        if (!password) {
            setErrorMessage('Please fill Password');
            return;
        }
        if (password !== passwordConfirm) {
            setErrorMessage('Passwords not match');
            return;
        }
        if (!firstName) {
            setErrorMessage('Please fill First Name');
            return;
        }
        if (!lastName) {
            setErrorMessage('Please fill Last Name');
            return;
        }

        setLoading(true);
        axios({
            method: 'post',
            url: USER_SERVICE +'/registration',
            data: {
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName,
                address: address,
                phone: phone
            },
        })
            .then(function (response) {
                setLoading(false);
                console.log(response.status);
                if(response.status === 200){
                    setRegistrationSuccess(true);
                }
            })
            .catch(function (error) {
                setLoading(false);

                if(error.response.data.message === null){
                    setErrorMessage(error.message);
                }else{
                    setErrorMessage(error.response.data.message);
                }
            });
    }

    if (isRegistrationSuccess) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#307ecc',
                    justifyContent: 'center',
                }}>
                <Icon name={'checkbox-marked-circle'} type={'material-community'} size={200} color={'#7DE24E'}
                      style={{
                    alignSelf: 'center'
                }}/>
                <Text style={styles.successTextStyle}>
                    Registration Successful
                </Text>
                <TouchableOpacity
                    style={styles.buttonStyle}
                    activeOpacity={0.5}
                    onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.buttonTextStyle}>Login Now</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={{flex: 1, backgroundColor: '#307ecc'}}>
            <Loader loading={loading} message='Registering...'/>
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    justifyContent: 'center',
                    alignContent: 'center',
                }}>
                <View style={{alignItems: 'center'}}>
                    <Text style={styles.title}>Register</Text>
                </View>
                <KeyboardAvoidingView enabled>
                    <View style={styles.SectionStyle}>
                        <Input
                            style={styles.inputStyle}
                            onChangeText={(email) => setEmail(email)}
                            underlineColorAndroid="#f000"
                            placeholder="Email Address"
                            placeholderTextColor="#8b9cb5"
                            keyboardType="email-address"
                            ref={emailInputRef}
                            returnKeyType="next"
                            onSubmitEditing={() =>
                                passwordInputRef.current &&
                                passwordInputRef.current.focus()
                            }
                            blurOnSubmit={false}
                            leftIcon={
                                <Icon name='email' size={24} type = 'material-community' color='white'/>
                            }
                        />
                    </View>
                    <View style={styles.SectionStyle}>
                        <Input
                            style={styles.inputStyle}
                            onChangeText={(password) =>
                                setPassword(password)
                            }
                            underlineColorAndroid="#f000"
                            placeholder="Password"
                            placeholderTextColor="#8b9cb5"
                            ref={passwordInputRef}
                            returnKeyType="next"
                            secureTextEntry={true}
                            onSubmitEditing={() =>
                                passwordConfirmInputRef.current &&
                                passwordConfirmInputRef.current.focus()
                            }
                            blurOnSubmit={false}
                            leftIcon={
                                <Icon name='lock' size={24} type = 'material-community' color='white'/>
                            }
                        />
                    </View>
                    <View style={styles.SectionStyle}>
                        <Input
                            style={styles.inputStyle}
                            onChangeText={(password) =>
                                setPasswordConfirm(password)
                            }
                            underlineColorAndroid="#f000"
                            placeholder="Password Again"
                            placeholderTextColor="#8b9cb5"
                            ref={passwordConfirmInputRef}
                            returnKeyType="next"
                            secureTextEntry={true}
                            onSubmitEditing={() =>
                                firstNameInputRef.current &&
                                firstNameInputRef.current.focus()
                            }
                            blurOnSubmit={false}
                            leftIcon={
                                <Icon name='lock-check' size={24} type = 'material-community' color='white'/>
                            }
                        />
                    </View>
                    <View style={styles.SectionStyle}>
                        <Input
                            style={styles.inputStyle}
                            onChangeText={(firstName) =>
                                setFirstName(firstName)
                            }
                            underlineColorAndroid="#f000"
                            placeholder="First Name"
                            placeholderTextColor="#8b9cb5"
                            autoCapitalize="sentences"
                            ref={firstNameInputRef}
                            returnKeyType="next"
                            onSubmitEditing={() =>
                                lastNameInputRef.current &&
                                lastNameInputRef.current.focus()
                            }
                            blurOnSubmit={false}
                            leftIcon={
                                <Icon name='account' size={24} type = 'material-community' color='white'/>
                            }
                        />
                    </View>
                    <View style={styles.SectionStyle}>
                        <Input
                            style={styles.inputStyle}
                            onChangeText={(lastName) =>
                                setLastName(lastName)
                            }
                            underlineColorAndroid="#f000"
                            placeholder="Last Name"
                            placeholderTextColor="#8b9cb5"
                            autoCapitalize="sentences"
                            ref={lastNameInputRef}
                            returnKeyType="next"
                            onSubmitEditing={() =>
                                addressInputRef.current &&
                                addressInputRef.current.focus()
                            }
                            blurOnSubmit={false}
                            leftIcon={
                                <Icon name='account' size={24} type = 'material-community' color='white'/>
                            }
                        />
                    </View>
                    <View style={styles.SectionStyle}>
                        <Input
                            style={styles.inputStyle}
                            onChangeText={(address) =>
                                setAddress(address)
                            }
                            underlineColorAndroid="#f000"
                            placeholder="Address"
                            placeholderTextColor="#8b9cb5"
                            autoCapitalize="sentences"
                            ref={addressInputRef}
                            returnKeyType="next"
                            onSubmitEditing={() =>
                                phoneInputRef.current &&
                                phoneInputRef.current.focus()
                            }
                            blurOnSubmit={false}
                            leftIcon={
                                <Icon name='home-city' size={24} type = 'material-community' color='white'/>
                            }
                        />
                    </View>
                    <View style={styles.SectionStyle}>
                        <Input
                            style={styles.inputStyle}
                            onChangeText={(phone) =>
                                setPhone(phone)
                            }
                            underlineColorAndroid="#f000"
                            placeholder="Phone Number"
                            placeholderTextColor="#8b9cb5"
                            autoCapitalize="sentences"
                            ref={phoneInputRef}
                            returnKeyType="next"
                            onSubmitEditing={Keyboard.dismiss}
                            blurOnSubmit={false}
                            leftIcon={
                                <Icon name='phone' size={24} type = 'material-community' color='white'/>
                            }
                        />
                    </View>
                    <View style={styles.SectionStyle}>
                        {errorMessage !== '' ? (
                            <Text style={styles.errorTextStyle}>
                                {errorMessage}
                            </Text>
                        ) : null}
                    </View>
                    <TouchableOpacity
                        style={styles.buttonStyle}
                        activeOpacity={0.5}
                        onPress={register}>
                        <Text style={styles.buttonTextStyle}>REGISTER</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>

        );
};

const styles = StyleSheet.create({
    title: {
        color: '#FFFFFF',
        fontSize: 25,
        paddingTop: 15,
    },
    SectionStyle: {
        flexDirection: 'row',
        height: 40,
        marginTop: 5,
        marginLeft: 35,
        marginRight: 35,
        margin: 5,
    },
    buttonStyle: {
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
        marginBottom: 20,
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
    },
    errorTextStyle: {
        color: 'red',
        textAlign: 'center',
        fontSize: 14,
    },
    successTextStyle: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        padding: 30,
    },
});

export default RegisterScreen;