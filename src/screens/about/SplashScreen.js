import React, {useState, useEffect} from 'react';
import {ActivityIndicator, View, StyleSheet, ImageBackground, Text} from 'react-native';

const SplashScreen = ({navigation}) => {
    //State for ActivityIndicator animation
    const [animating, setAnimating] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setAnimating(true);
            //Check if user is login. If not then send for Login else send to Home Screen
            // let isLogin = false;
            navigation.replace('Screens');
        }, 2000);
    }, []);

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../../../assets/image/about.jpg') }
                style={{flex: 1, resizeMode: 'cover', justifyContent: "center", alignItems: 'center',}}
            >
                <ActivityIndicator
                    animating={animating}
                    color="#FFFFFF"
                    size="large"
                    style={styles.activityIndicator}
                />
                <Text style={styles.title}>Welcome</Text>
                <Text style={styles.subtitle}>Let's Travel Together</Text>
            </ImageBackground>
        </View>
    );
};

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column"
    },
    activityIndicator: {
        alignItems: 'center',
        height: 80,
    },
    title: {
        color: '#FFFFFF',
        paddingVertical: 10,
        fontSize: 30,
    },
    subtitle: {
        color: '#FFFFFF',
        paddingVertical: 10,
        fontSize: 20,
    },
});