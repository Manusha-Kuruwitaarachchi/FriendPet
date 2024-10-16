import { View, Text, FlatList, Pressable, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from 'expo-router'
import { collection, doc, getDocs, query, where, deleteDoc } from 'firebase/firestore'  // Import deleteDoc properly
import { db } from '../../config/FirebaseConfig'
import { useUser } from '@clerk/clerk-expo'
import PetListItem from '../../components/Home/PetListItem'
import Colors from '../../constants/Colors'

export default function UserPost() {
    const navigation = useNavigation();
    const { user } = useUser();
    const [loader, setLoader] = useState(false);
    const [userPostList, setUserPostList] = useState([]); 
    
    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'User Post'
        });
        user && GetUserPost();
    }, [user]);

    const GetUserPost = async () => {
        setLoader(true);
        const q = query(collection(db, 'Pets'), where('email', '==', user?.primaryEmailAddress?.emailAddress));
        const querySnapshot = await getDocs(q);

        const posts = [];
        querySnapshot.forEach((doc) => {
            posts.push({ id: doc.id, ...doc.data() });  // Add the document ID to the object
        });
        setUserPostList(posts);
        setLoader(false);
    };

    const onDeletePost = (docId) => {
        Alert.alert(
            'Do you want to delete this post?',
            '', 
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancelled'),
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: () => deletePost(docId)  // Call the deletePost function
                }
            ]
        );
    };

    const deletePost = async (docId) => {
        try {
            await deleteDoc(doc(db, 'Pets', docId));  // Use Firebase deleteDoc function
            GetUserPost();  // Refresh the post list after deletion
        } catch (error) {
            console.error('Error deleting post: ', error);
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text
                style={{
                    fontFamily: 'outfit-medium',
                    fontSize: 30,
                }}
            >
                User Post
            </Text>
            <FlatList
                data={userPostList}
                numColumns={2}
                refreshing={loader}
                onRefresh={GetUserPost}
                renderItem={({ item, index }) => (
                    <View key={index}>
                        <PetListItem pet={item} />
                        <Pressable
                            onPress={() => onDeletePost(item?.id)}  // Ensure item.id is passed
                            style={{
                                backgroundColor: Colors.LIGHT_PRIMARY,
                                borderRadius: 7,
                                padding: 5,
                                marginRight: 10,
                                marginTop: 5,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'outfit',
                                    textAlign: 'center',
                                }}
                            >
                                Delete
                            </Text>
                        </Pressable>
                    </View>
                )}
                keyExtractor={(item) => item.id}  // Use item.id as key
            />

            {userPostList?.length == 0 &&<Text>No Post Found</Text>}
        </View>
    );
}
