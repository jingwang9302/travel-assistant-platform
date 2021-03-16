import React, {useState} from 'react';
import {Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import Post from "../../components/Post";
import Comment from "../../components/Comment";
import {Icon} from "react-native-elements";
import {useSelector} from "react-redux";
import axios from "axios";
import {BLOG_SERVICE} from "../../config/urls";

const CommentScreen = ({route, navigation}) => {

    const {postId} = route.params;
    const [id, setId] = useState(postId);
    const [inputHeight, setInputHeight] = useState(30);
    const [commentContent, setCommentContent] = useState('');
    const userProfile = useSelector(state => state.user);


    const sendComment = () =>{
        if(commentContent===''){
            alert('Say something');
            return;
        }
        axios({
            method: 'post',
            url: BLOG_SERVICE +'/comment',
            headers: {
                'Authorization': 'Bearer '+ userProfile.token
            },
            data: {
                content: commentContent,
                postId: postId,
                authorId: userProfile.id
            },
        })
            .then(function (response) {
                setId(0);
                setId(postId);
                setCommentContent('');
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
                <Post postId={id} />
                <Comment postId={id} />
            </ScrollView>
            <View style={{padding:5, backgroundColor:'#abb1b5', flexDirection:'row', justifyContent:'space-evenly', alignItems:'center'}}>
                <Icon name='comment-text-outline' size={24} type = 'material-community' color='white'/>
                <TextInput
                    style={{
                        backgroundColor: 'white',
                        height: inputHeight,
                        width: 300,
                        fontSize: 15,
                    }}
                    multiline={true} onFocus={()=>setInputHeight(100)} onBlur={()=>setInputHeight(30)}
                    onChangeText={(test)=>setCommentContent(test)}
                    defaultValue={commentContent}
                />
                <TouchableOpacity
                    style={styles.buttonStyle}
                    activeOpacity={0.5}
                >
                    <Text style={styles.buttonTextStyle} onPress={()=>{sendComment(); setInputHeight(30); Keyboard.dismiss()}}>Say</Text>
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
    buttonStyle: {
        backgroundColor: '#3181ab',
        borderWidth: 0,
        color: '#FFFFFF',
        borderColor: '#3181ab',
        alignItems: 'center',
        borderRadius: 10,
    },
    buttonTextStyle: {
        color: '#FFFFFF',
        padding: 5,
        fontSize: 15,
    },
});

export default CommentScreen;