import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { doc, getDoc, addDoc, collection, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { GiftedChat } from 'react-native-gifted-chat';
import { format } from 'date-fns';

export default function ChatScreen() {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const { user } = useUser();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    console.log('Chat ID:', params?.id);
    GetUserDetails();
    const unsubscribe = onSnapshot(
      collection(db, 'Chat', params?.id, 'Messages'),
      (snapshot) => {
        const messagesData = snapshot.docs.map((doc) => {
          const data = doc.data();
          const createdAt = data.createdAt instanceof Timestamp
            ? data.createdAt.toDate()
            : new Date();
          return {
            _id: doc.id,
            ...data,
            createdAt,
          };
        });
        setMessages(messagesData.sort((a, b) => b.createdAt - a.createdAt));
      }
    );
    return () => unsubscribe();
  }, [params?.id]);

  const GetUserDetails = async () => {
    try {
      const docRef = doc(db, 'Chat', params?.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const results = docSnap.data();
        const otherUser = results?.users.find(
          (item) => item.email !== user?.primaryEmailAddress?.emailAddress
        );
        navigation.setOptions({
          headerTitle: otherUser?.name || 'Chat',
        });
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const onSend = async (newMessages = []) => {
    const newMessage = {
      ...newMessages[0],
      createdAt: serverTimestamp(),
    };
    try {
      await addDoc(collection(db, 'Chat', params?.id, 'Messages'), newMessage);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        showUserAvatar={true}
        user={{
          _id: user?.primaryEmailAddress?.emailAddress,
          name: user?.fullName,
          avatar: user?.imageUrl,
        }}
        dateFormat="MMMM D, YYYY"
        timeFormat="h:mm A"
        renderTime={(props) => {
          return (
            <View>
              <Text style={styles.timeText}>
                {format(props.currentMessage.createdAt, 'h:mm a')}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  timeText: {
    color: 'white',
    fontSize: 10,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
  },
});