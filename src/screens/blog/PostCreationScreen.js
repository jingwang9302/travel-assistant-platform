import React, {useEffect, useState} from 'react';
import {
    View,
    Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator,
} from 'react-native';
import {Card, Icon, Image, Input} from "react-native-elements";
import {useSelector} from "react-redux";
import {Picker, Textarea} from "native-base"
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import {BLOG_SERVICE} from "../../config/urls";

const PostCreationScreen = ({navigation}) => {

    const userProfile = useSelector(state => state.user);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [privacy, setPrivacy] = useState('public');
    const [image, setImage] = useState(null);

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

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        // console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    const takePhoto = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        // console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    const post = () => {

        if (!title) {
            alert('Please fill title');
            return;
        }
        if (!content) {
            alert('Please fill content');
            return;
        }
        if (!privacy) {
            alert('Please select privacy');
            return;
        }

        axios({
            method: 'post',
            url: BLOG_SERVICE +'/post',
            headers: {
                'Authorization': 'Bearer '+ userProfile.token
            },
            data: {
                title: title,
                content: content,
                authorId: userProfile.id,
                privacy: privacy
            }
        })
            .then(function (response) {
                const postId = response.data.id;
                if(tags !== ''){
                    saveTags(postId);
                }
                if(image !== null){
                    uploadImage(postId)
                }
                navigation.navigate('Post');
            })
            .catch(function (error) {
                if(error.response.data.message === null){
                    console.log(error.message);
                }else {
                    console.log(error.response.data.message);
                }
            });
    }

    const uploadImage = (postId) =>{

        const fileName = image.split('/').pop();

        let formData = new FormData();
        let imageFile = {uri: image, type: 'application/octet-stream', name: fileName};
        formData.append('image', imageFile);

        fetch(BLOG_SERVICE +'/image/'+userProfile.id+'/'+postId, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer '+ userProfile.token,
                'Content-Type' : 'multipart/form-data',
            },
            body: formData,
        })
            .then((response) => {

            })
            .catch((error)=> {
                console.log('err: ' + error);
            });

    }

    const saveTags = (postId) =>{
        const splitTags = tags.split(',');
        let data = [];
        splitTags.map((tag, index)=>{
            data.push(
                {
                    postId: postId,
                    tag: tag.trim()
                }
            )
        })

        axios({
            method: 'post',
            url: BLOG_SERVICE +'/tag',
            headers: {
                'Authorization': 'Bearer '+ userProfile.token
            },
            data: data
        })
            .then(function (response) {

            })
            .catch(function (error) {
                if(error.response.data.message === null){
                    console.log(error.message);
                }else {
                    console.log(error.response.data.message);
                }
            });

    }

    return(
        <View style={styles.mainBody}>
            <ScrollView>
                <Card>
                    <Text style={styles.label}>Title</Text>
                    <Input
                        placeholder={'Title'}
                        onChangeText={(text => setTitle(text))}
                    />
                    <Text style={styles.label}>Content</Text>
                    <Textarea
                        rowSpan={5}
                        bordered
                        placeholder="Content"
                        onChangeText={text => setContent(text)}
                        style={{marginBottom:10}}
                    />
                    <View style={{flexDirection:'column'}}>
                        <Text style={styles.label}>Tags: (Separated by comma)</Text>
                        <Input
                            leftIcon={
                                <Icon name={'tag'} type={'material-community'} size={16} color='grey' />}
                            onChangeText={text => setTags(text)}
                        />
                    </View>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Text style={styles.label}>Privacy:</Text>
                        <Picker
                            itemTextStyle={{fontSize:20}}
                            mode="dropdown"
                            iosHeader="Select Privacy"
                            selectedValue={privacy}
                            onValueChange={(value)=>setPrivacy(value)}
                        >
                            <Picker.Item label="Public" value="public" />
                            <Picker.Item label="Friends" value="friends" />
                            <Picker.Item label="Private" value="private" />
                        </Picker>
                    </View>
                </Card>

                <Card>
                    <Text style={styles.label}>Upload Image</Text>
                    <View style={{ justifyContent:'center' }} >
                        {image && <Image source={{ uri: image }} style={{ resizeMode:'center', height: 200, margin:5 }} PlaceholderContent={<ActivityIndicator />}/>}
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
                            onPress={()=>{setImage(null)}}
                        >
                            <Text style={styles.imageButtonTextStyle}>Clear Image</Text>
                        </TouchableOpacity>
                    </View>
                </Card>

            </ScrollView>

            <View>
                <TouchableOpacity
                    style={styles.buttonStyle}
                    activeOpacity={0.5}
                    onPress={()=>{post()}}
                >
                    <Text style={styles.buttonTextStyle}>POST</Text>
                </TouchableOpacity>
            </View>

        </View>

    );
};

const styles = StyleSheet.create({
    mainBody: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
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
        marginTop: 10,
        marginBottom: 10,
    },
    buttonTextStyle: {
        color: '#FFFFFF',
        paddingVertical: 10,
        fontSize: 16,
    },
});


export default PostCreationScreen;