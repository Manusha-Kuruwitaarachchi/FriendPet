import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React, { useEffect } from 'react';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import PetInfor from '../../components/Home/PetDetails/PetInfor';
import PetSubInfo from '../../components/Home/PetDetails/PetSubInfo';
import AboutPet from '../../components/Home/PetDetails/AboutPet';
import OwnerInfo from '../../components/Home/PetDetails/OwnerInfo';
import Colors from '../../constants/Colors';
import { useUser } from '@clerk/clerk-expo';
import { getDoc, setDoc, where, query, collection, getDocs, doc } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';

export default function PetDetails() {

  const pet = useLocalSearchParams();
  const navigation = useNavigation();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerTransparent: true
    });
  }, []);

  const InitiateChat = async () => {
    try {
      const userEmail = user?.primaryEmailAddress?.emailAddress;
      const petOwnerEmail = pet?.email;

      // Check if the current user is the pet owner
      if (userEmail === petOwnerEmail) {
        Alert.alert("Can't Adopt", "This pet was published by you");
        return;
      }

      const docId1 = userEmail + '_' + petOwnerEmail;
      const docId2 = petOwnerEmail + '_' + userEmail;

      // Query Firestore for an existing chat document
      const q = query(collection(db, 'Chat'), where('id', 'in', [docId1, docId2]));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // If chat exists, navigate to it
        console.log('Chat already exists, navigating to chat:', querySnapshot.docs[0].id);
        router.push({
          pathname: '/chat',
          params: { id: querySnapshot.docs[0].id },
        });
        return;
      }

      // If no chat exists, create a new document
      console.log('Creating new chat with ID:', docId1);
      await setDoc(doc(db, 'Chat', docId1), {
        id: docId1,
        users: [
          {
            email: user?.primaryEmailAddress?.emailAddress,
            imageUrl: user?.imageUrl,
            name: user?.fullName,
          },
          {
            email: pet?.email,
            imageUrl: pet?.userImage,
            name: pet?.userName,
          },
        ],
        userIds:[user?.primaryEmailAddress?.emailAddress, pet?.email]
      });

      // Navigate to the new chat
      router.push({
        pathname: '/chat',
        params: { id: docId1 },
      });
    } catch (error) {
      console.error('Error initiating chat:', error);
    }
  };

  return (
    <View>
      <ScrollView>
        {/* pet info */}
        <PetInfor pet={pet} />
        {/* pet Properties */}
        <PetSubInfo pet={pet} />
        {/* about */}
        <AboutPet pet={pet} />
        {/* owner details */}
        <OwnerInfo pet={pet} />
        <View
          style={{
            height: 70
          }}></View>
      </ScrollView>
      {/* button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          onPress={InitiateChat}
          style={styles.adoptButton}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'outfit-medium',
              fontSize: 20
            }}>Adopt Me</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  adoptButton: {
    padding: 15,
    backgroundColor: Colors.PRIMARY
  },
  bottomContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0
  }
});
