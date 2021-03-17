import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    FlatList, RefreshControl, Text, View,
} from 'react-native';
import axios from "axios";
import {BLOG_SERVICE} from "../../config/urls";
import {useSelector} from "react-redux";
import Post from "../../components/Post";
import {Icon} from "react-native-elements";
import {Fab} from "native-base";

const PAGE_SIZE = 5;

const PostScreen = ({navigation}) => {

    const userProfile = useSelector(state => state.user);

    const [posts, setPosts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isPageEnd, setIsPageEnd] = useState(false);

    useEffect(() => {
        getUserPosts(0);
    },[]);


    const getUserPosts = (page) => {
        setLoading(true);
        axios({
            method: 'get',
            url: BLOG_SERVICE +'/post/all/'+ userProfile.id +'/page/'+ page + '/size/' + PAGE_SIZE ,
            headers: {
                'Authorization': 'Bearer '+ userProfile.token
            }
        })
            .then(function (response) {

                if(response.data.length === 0){
                    setIsPageEnd(true);
                }else{
                    setPosts(posts.concat(response.data));
                }
                setLoading(false);
            })
            .catch(function (error) {
                if(error.response.data.message === null){
                    console.log(error.message);
                }else {
                    console.log(error.response.data.message);
                }
                setLoading(false);
            });
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setPosts([{id:0}]);
        getUserPosts(0);
        setPageNumber(1);
        setIsPageEnd(false);
        setRefreshing(false)
    }, []);

    const renderItem = ({ item }) => (
        <Post postId={item.id} />
    );

    const renderFooter = () => {
        if (isPageEnd){
            return (
                <View style={{alignItems:'center'}}>
                    <Text style={{fontSize:15}}>No more data. 别撸啦</Text>
                </View>
            )
        }
        if (!loading) return null;
        return (
            <View style={{alignItems:'center'}}>
                <ActivityIndicator
                    style={{ color: '#000000' }}
                />
            </View>
        );
    };

    const handleLoadMore = () => {
        if (!loading && !isPageEnd) {
            setPageNumber(pageNumber+1);
            getUserPosts(pageNumber);
        }
    };


    return(
        <View style={{flex: 1}}>
            <FlatList
                data={posts}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                ListFooterComponent={renderFooter}
                onEndReachedThreshold={0.01}
                onEndReached={()=>handleLoadMore()}
            />

            {/*<ScrollView>*/}
            {/*    {*/}
            {/*        posts.map((post, i) => (*/}
            {/*            <Post key={i} postId={post.id} />*/}
            {/*        ))*/}
            {/*    }*/}
            {/*</ScrollView>*/}
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