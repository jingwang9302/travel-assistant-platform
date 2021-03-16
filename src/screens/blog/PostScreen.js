import React, {useEffect, useState} from 'react';
import {
    ScrollView,
    View,
} from 'react-native';
import axios from "axios";
import {BLOG_SERVICE} from "../../config/urls";
import {useSelector} from "react-redux";
import Post from "../../components/Post";
import {Icon} from "react-native-elements";
import {Fab} from "native-base";

const PostScreen = ({navigation}) => {

    const userProfile = useSelector(state => state.user);

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        getUserPosts();
    });


    const getUserPosts = () => {
        axios({
            method: 'get',
            url: BLOG_SERVICE +'/post/user/'+ userProfile.id,
            headers: {
                'Authorization': 'Bearer '+ userProfile.token
            }
        })
            .then(function (response) {
                setPosts(response.data);
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
        <View style={{flex: 1}}>
            <ScrollView>
                {
                    posts.map((post, i) => (
                        <Post key={i} postId={post.id} />
                    ))
                }
            </ScrollView>
            <View>
                <Fab
                    direction="up"
                    containerStyle={{ }}
                    style={{ backgroundColor: '#96c8e9' }}
                    position="bottomRight"
                    onPress={() => navigation.navigate('PostCreation')}>
                    <Icon name="plus" type={'antdesign'}/>
                </Fab>
            </View>
        </View>

    );
};

export default PostScreen;