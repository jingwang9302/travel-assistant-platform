import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Avatar, Badge, Card, Icon} from "react-native-elements";
import axios from "axios";
import {BLOG_SERVICE, UPLOAD_IMAGE_URL, USER_SERVICE} from "../config/urls";
import {useSelector} from "react-redux";
import { useNavigation } from '@react-navigation/native';

const Post = (props) => {
    const navigation = useNavigation();
    const {postId, ...attributes} = props;

    const userProfile = useSelector(state => state.user);

    const [post, setPost] = useState({id:0, title:"", content:"", authorId:0});
    const [author, setAuthor] = useState({id:0, firstName:"", lastName:""});
    const [authorAvatar, setAuthorAvatar] = useState("");
    const [commentCount, setCommentCount] = useState(0);
    const [likesCount, setLikesCount] = useState(0);
    const [imagesUrl, setImagesUrl] = useState([{imageUrl:""}]);
    const [isLikes, setIsLikes] = useState(false);
    const [tags, setTags] = useState([{tag:""}]);

    useEffect(() => {
        if(postId!==0){
            getPost();
        }
    },[postId]);

    const getPost = () =>{
        axios({
            method: 'get',
            url: BLOG_SERVICE +'/post/'+ postId,
            headers: {
                'Authorization': 'Bearer '+ userProfile.token
            }
        })
            .then(function (response) {
                setPost(response.data);
                getAuthor(response.data.authorId);
                getAuthorAvatar(response.data.authorId);
                getCommentCount(response.data.id);
                getLikesCount(response.data.id);
                checkLikes(response.data.id);
                getImages(response.data.id);
                getTags(response.data.id);
            })
            .catch(function (error) {
                if(error.response.data.message === null){
                    console.log(error.message);
                }else {
                    console.log(error.response.data.message);
                }
            });
    }



    const getAuthor = (authorId) =>{
        axios({
            method: 'get',
            url: USER_SERVICE +'/profile/basic/'+ authorId,
            headers: {
                'Authorization': 'Bearer '+ userProfile.token
            }
        })
            .then(function (response) {
                setAuthor(response.data);
            })
            .catch(function (error) {
                if(error.response.data.message === null){
                    console.log(error.message);
                }else {
                    console.log(error.response.data.message);
                }
            });
    }

    const getAuthorAvatar = (authorId) =>{
        axios({
            method: 'get',
            url: USER_SERVICE +'/profile/avatar/'+ authorId,
            headers: {
                'Authorization': 'Bearer '+ userProfile.token
            }
        })
            .then(function (response) {
                setAuthorAvatar(response.data.avatarUrl);
            })
            .catch(function (error) {
                if(error.response.data.message === null){
                    console.log(error.message);
                }else {
                    console.log(error.response.data.message);
                }
            });
    }

    const getCommentCount = (postId) =>{
        axios({
            method: 'get',
            url: BLOG_SERVICE +'/comment/count/'+ postId,
            headers: {
                'Authorization': 'Bearer '+ userProfile.token
            }
        })
            .then(function (response) {
                setCommentCount(response.data);
            })
            .catch(function (error) {
                if(error.response.data.message === null){
                    console.log(error.message);
                }else {
                    console.log(error.response.data.message);
                }
            });
    }

    const checkLikes = (postId) => {
        axios({
            method: 'get',
            url: BLOG_SERVICE +'/likes/'+userProfile.id+'/has/'+ postId,
            headers: {
                'Authorization': 'Bearer '+ userProfile.token
            }
        })
            .then(function (response) {
                setIsLikes(response.data);
            })
            .catch(function (error) {
                if(error.response.data.message === null){
                    console.log(error.message);
                }else {
                    console.log(error.response.data.message);
                }
            });
    }

    const getLikesCount = (postId) =>{
        axios({
            method: 'get',
            url: BLOG_SERVICE +'/likes/count/'+ postId,
            headers: {
                'Authorization': 'Bearer '+ userProfile.token
            }
        })
            .then(function (response) {
                setLikesCount(response.data);
            })
            .catch(function (error) {
                if(error.response.data.message === null){
                    console.log(error.message);
                }else {
                    console.log(error.response.data.message);
                }
            });
    }

    const toggleLikes = () =>{
        if(isLikes){
            axios({
                method: 'delete',
                url: BLOG_SERVICE +'/likes',
                headers: {
                    'Authorization': 'Bearer '+ userProfile.token
                },
                data: {
                    userId: userProfile.id,
                    postId: post.id,
                },
            })
                .then(function (response) {
                    setIsLikes(false);
                    setLikesCount(likesCount-1);
                })
                .catch(function (error) {
                    if(error.response.data.message === null){
                        console.log(error.message);
                    }else {
                        console.log(error.response.data.message);
                    }
                });
        }else{
            axios({
                method: 'post',
                url: BLOG_SERVICE +'/likes',
                headers: {
                    'Authorization': 'Bearer '+ userProfile.token
                },
                data: {
                    userId: userProfile.id,
                    postId: post.id,
                },
            })
                .then(function (response) {
                    setIsLikes(true);
                    setLikesCount(likesCount+1);
                })
                .catch(function (error) {
                    if(error.response.data.message === null){
                        console.log(error.message);
                    }else {
                        console.log(error.response.data.message);
                    }
                });
        }
    }

    const getImages = (postId) =>{
        axios({
            method: 'get',
            url: BLOG_SERVICE +'/image/'+ postId,
            headers: {
                'Authorization': 'Bearer '+ userProfile.token
            }
        })
            .then(function (response) {
                setImagesUrl(response.data);
            })
            .catch(function (error) {
                if(error.response.data.message === null){
                    console.log(error.message);
                }else {
                    console.log(error.response.data.message);
                }
            });
    }

    const getTags = (postId) =>{
        axios({
            method: 'get',
            url: BLOG_SERVICE +'/tag/'+ postId,
            headers: {
                'Authorization': 'Bearer '+ userProfile.token
            }
        })
            .then(function (response) {
                setTags(response.data);
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
                <View style={{alignItems: 'center', flexDirection: 'row', marginBottom:5, justifyContent:'space-between'}}>
                    <View style={{alignItems: 'center', flexDirection: 'row'}}>
                        <Avatar
                            size="small"
                            rounded
                            title={
                                author.firstName.substr(0,1).toUpperCase()+
                                author.lastName.substr(0,1).toUpperCase()
                            }
                            source={{
                                uri: UPLOAD_IMAGE_URL + authorAvatar,
                            }}
                            activeOpacity={0.7}
                            overlayContainerStyle={{backgroundColor: 'grey'}}/>
                        <Text style={{fontSize: 15, marginLeft:5}}>{author.firstName+' '+author.lastName}</Text>
                    </View>

                    <View style={{justifyContent:'flex-end'}}>
                        <Text style={{fontSize: 15}}>
                            {post.creationTime}
                        </Text>
                    </View>
                </View>

                <Card.Divider/>
                <View style={{marginBottom: 10, alignItems: 'center'}}>
                    <Text style={{fontSize: 23, fontWeight:'bold'}}>
                        {post.title}
                    </Text>
                </View>
                {imagesUrl.length!==0? <Card.Image source={{uri: UPLOAD_IMAGE_URL+imagesUrl[0].imageUrl}}/>: <View/>}
                <View style={{marginTop: 10, alignItems: 'flex-start'}}>
                    <Text style={{fontSize: 15}}>
                        {post.content}
                    </Text>
                </View>

                <View style={{marginTop: 10, alignItems: 'flex-start', flexDirection: 'row'}}>
                    {
                        tags.map((tag, index)=>{
                            return (<Badge key={index} value={tag.tag} badgeStyle={{marginRight:5}}/>)
                            }
                        )
                    }

                </View>

                <View style={{alignItems: 'center', flexDirection: 'row', justifyContent:'flex-end',marginTop:10}}>
                    <Icon name={'comment'} type={'material-community'} color={'#5f91c1'} onPress={()=>{navigation.navigate('Comment', {postId: postId})}}/>
                    <Text style={{fontSize: 15, marginRight:10}}>
                        {commentCount}
                    </Text>
                    {isLikes?
                        (<Icon name={'cards-heart'} type={'material-community'} color={'#c15f86'} onPress={()=>{toggleLikes()}}/>)
                        :(<Icon name={'heart-outline'} type={'material-community'} color={'#c15f86'} onPress={()=>{toggleLikes()}}/>)
                    }
                    <Text style={{fontSize: 15}}>
                        {likesCount}
                    </Text>
                </View>
            </Card>
        </View>
    );
};

export default Post;

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040',
    },
    activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        height: 100,
        width: 100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    activityIndicator: {
        alignItems: 'center',
        height: 80,
    },
});