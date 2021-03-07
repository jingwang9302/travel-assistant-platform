import React, { useState } from 'react';
import axios from "axios";
import {Button, Text, View} from "react-native";

import { USER_SERVICE } from '../../config/urls';


const RegisterScreen = ({navigation}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");

    const register = (token) =>{
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
        <View>
            <Text>Register Screen</Text>
        </View>

    );
};

export default RegisterScreen;