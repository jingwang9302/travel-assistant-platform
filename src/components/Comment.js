import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {Avatar, Card, ListItem} from "react-native-elements";
import axios from "axios";
import {BLOG_SERVICE, UPLOAD_IMAGE_URL} from "../config/urls";
import {useSelector} from "react-redux";

const Comment = (props) => {
    const {postId, ...attributes} = props;

    const userProfile = useSelector(state => state.user);

    const [comments, setComments] = useState([{id:0, content:"", authorId:0, creationTime:"", authorFirstName:"", authorLastName:"", authorAvatarUrl:""}]);

    useEffect(() => {
        if(postId!==0){
            getComments();
        }
    },[postId]);

    const getComments = () =>{
        axios({
            method: 'get',
            url: BLOG_SERVICE +'/comment/'+ postId,
            headers: {
                'Authorization': 'Bearer '+ userProfile.token
            }
        })
            .then(function (response) {
                setComments(response.data);
            })
            .catch(function (error) {
                if(error.response.data.message === null){
                    console.log(error.message);
                }else {
                    console.log(error.response.data.message);
                }
            });
    }

    return (
        <View>
            <Card>
                {
                    comments.map((comment, i) => (

                        <ListItem key={i} bottomDivider>
                            <Avatar
                                rounded
                                title={
                                    comment.authorFirstName.substr(0,1).toUpperCase()+
                                    comment.authorLastName.substr(0,1).toUpperCase()
                                }
                                source={{
                                    uri: UPLOAD_IMAGE_URL + comment.authorAvatarUrl,
                                }}
                                activeOpacity={0.7}
                                overlayContainerStyle={{backgroundColor: 'grey'}}/>
                            <ListItem.Content>
                                <ListItem.Title style={{fontSize:12}}>{comment.authorFirstName + ' ' + comment.authorLastName}</ListItem.Title>
                                <Text style={{fontSize:18}}>{comment.content}</Text>
                            </ListItem.Content>
                            <Text>{comment.creationTime}</Text>
                        </ListItem>
                    ))
                }
            </Card>
        </View>
    );
};

export default Comment;