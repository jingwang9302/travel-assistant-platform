import React, { createRef, useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  ImageBackground,
} from "react-native";
import axios from "axios";
import { useDispatch } from "react-redux";

import { LOGIN_URL, USER_SERVICE } from "../../config/urls";
import Loader from "../../components/Loader";
import { setLogin, setProfile, setToken } from "../../redux/actions/user";
import { Icon, Input } from "react-native-elements";

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const passwordInputRef = createRef();

  const login = () => {
    setErrorMessage("");
    if (!username) {
      setErrorMessage("Please fill Email");
      return;
    }
    if (!password) {
      setErrorMessage("Please fill Password");
      return;
    }

    setLoading(true);

    axios({
      method: "post",
      url: LOGIN_URL,
      data: {
        grant_type: "password",
        client_id: "tap",
        client_secret: "123456",
        username: username,
        password: password,
      },
      transformRequest: [
        function (data) {
          let ret = "";
          for (let it in data) {
            ret +=
              encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
          }
          return ret;
        },
      ],
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then(function (response) {
        const token = response.data.access_token;
        dispatch(setLogin(true));
        dispatch(setToken(token));
        fetchUserInfo(token);
        setLoading(false);
        navigation.goBack();
      })
      .catch(function (error) {
        setLoading(false);
        if (error.response.data.message === null) {
          setErrorMessage(error.message);
        } else {
          if (error.response.data.status === 401) {
            setErrorMessage("Incorrect Email or Password");
          }
        }
      });
  };

  const fetchUserInfo = (token) => {
    axios({
      method: "get",
      url: USER_SERVICE + "/profile/" + username,
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then(function (response) {
        dispatch(setProfile(response.data));
      })
      .catch(function (error) {
        console.log(error.response);
      });
  };

  // Test only!!!!!!!
  const simulateLogin = () => {
    const data = {
      id: 1,
      email: "xiaoning.zhao@sjsu.edu",
      firstName: "Xiaoning",
      lastName: "Zhao",
      address: "123 Earth Ave, Solar, Universe",
      phone: "555-555-5555",
    };
    dispatch(setLogin(true));
    dispatch(setToken("fdafsdfafdafasdf"));
    dispatch(setProfile(data));
    navigation.goBack();
  };

  return (
    <View style={styles.mainBody}>
      <ImageBackground
        source={require("../../../assets/image/login.jpg")}
        style={styles.image}
      >
        <Loader loading={loading} message="Login..." />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <View>
            <KeyboardAvoidingView enabled>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.title}>Welcome</Text>
              </View>
              <View style={styles.SectionStyle}>
                <Input
                  style={styles.inputStyle}
                  label={"Email Address"}
                  labelStyle={{ color: "white" }}
                  onChangeText={(text) => setUsername(text)}
                  placeholder="email@address.com"
                  placeholderTextColor="#8b9cb5"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  onSubmitEditing={() =>
                    passwordInputRef.current && passwordInputRef.current.focus()
                  }
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                  leftIcon={
                    <Icon
                      name="email"
                      size={24}
                      type="material-community"
                      color="white"
                    />
                  }
                />
              </View>
              <View style={styles.SectionStyle}>
                <Input
                  style={styles.inputStyle}
                  label={"Password"}
                  labelStyle={{ color: "white" }}
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
                  leftIcon={
                    <Icon
                      name="lock"
                      size={24}
                      type="material-community"
                      color="white"
                    />
                  }
                />
              </View>
              <View style={styles.SectionStyle}>
                {errorMessage !== "" ? (
                  <Text style={styles.errorTextStyle}>{errorMessage}</Text>
                ) : null}
              </View>
              <View>
                <TouchableOpacity
                  style={styles.buttonStyle}
                  activeOpacity={0.5}
                  onPress={simulateLogin}
                >
                  <Text style={styles.buttonTextStyle}>模拟登录！测试用！</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  style={styles.buttonStyle}
                  activeOpacity={0.5}
                  onPress={login}
                >
                  <Text style={styles.buttonTextStyle}>LOGIN</Text>
                </TouchableOpacity>
              </View>
              <Text
                style={styles.registerTextStyle}
                onPress={() => navigation.navigate("Register")}
              >
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
    justifyContent: "center",
    backgroundColor: "#307ecc",
    alignContent: "center",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  title: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: 30,
    paddingTop: 200,
  },
  SectionStyle: {
    flexDirection: "row",
    height: 40,
    marginTop: 30,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: "#307016",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#307016",
    height: 40,
    alignItems: "center",
    borderRadius: 10,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 30,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: "white",
    paddingLeft: 15,
    paddingRight: 15,
  },
  registerTextStyle: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 15,
    alignSelf: "center",
    padding: 10,
  },
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
  },
});

export default LoginScreen;
