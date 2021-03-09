import React from 'react';
import {
    View,
    Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import {Icon} from "react-native-elements";
import { useNavigation } from '@react-navigation/native';

const LoginAlertScreen = () => {
    const navigation = useNavigation();

    return (
        <View
            style={styles.mainBody}>
            <Icon name={'login'} type={'material-community'} size={200} color={'white'}
                  style={{alignSelf: 'center'}}/>
            <Text style={styles.loginTextStyle}>
                Not Login?
            </Text>
            <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={() => navigation.navigate('Login')}>
                <Text style={styles.buttonTextStyle}>Please Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    mainBody: {
        flex: 1,
        backgroundColor: '#307ecc',
        justifyContent: 'center',
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

export default LoginAlertScreen;
