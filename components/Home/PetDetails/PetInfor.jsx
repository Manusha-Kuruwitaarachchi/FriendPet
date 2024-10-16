import { View, Text, Image, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../../constants/Colors';
import MarkFav from '../../MarkFav';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../config/FirebaseConfig';

export default function PetInfor({ userEmail, pet: initialPet }) {
  const [pet, setPet] = useState(initialPet);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchUpdatedPetData = async () => {
      if (initialPet?.id) {
        try {
          const petDoc = await getDoc(doc(db, 'Pets', initialPet.id));
          if (petDoc.exists()) {
            const updatedPet = { id: petDoc.id, ...petDoc.data() };
            setPet(updatedPet);
          } else {
            console.log('No such pet document!');
          }
        } catch (error) {
          console.error('Error fetching updated pet data:', error);
        }
      }
    };

    fetchUpdatedPetData();
  }, [initialPet?.id]);

  const encodeImageUrl = (url) => {
    if (!url) return '';
    // Replace the unencoded forward slash with %2F in the path segment of the URL
    const [baseUrl, query] = url.split('?');
    const encodedBaseUrl = baseUrl.replace('/PetAdopt/', '/PetAdopt%2F');
    return `${encodedBaseUrl}?${query}`;
  };

  useEffect(() => {
    const loadImage = async () => {
      if (pet?.imageUrl) {
        const encodedUrl = encodeImageUrl(pet.imageUrl);
        console.log('Attempting to load image from URL:', encodedUrl);
        try {
          await Image.prefetch(encodedUrl);
          console.log('Image prefetch successful');
          setImageLoading(false);
          setImageError(false);
        } catch (error) {
          console.error('Image prefetch failed:', error);
          if (retryCount < 3) {
            console.log(`Retrying image load (attempt ${retryCount + 1})`);
            setRetryCount(prev => prev + 1);
          } else {
            setImageError(true);
            setImageLoading(false);
          }
        }
      } else {
        console.log('No image URL provided');
        setImageError(true);
        setImageLoading(false);
      }
    };

    loadImage();
  }, [pet?.imageUrl, retryCount]);

  if (!pet) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
        <Text style={{ fontFamily: 'outfit', fontSize: 18, marginTop: 10 }}>
          Loading pet information...
        </Text>
      </View>
    );
  }

  const imageUrl = encodeImageUrl(pet?.imageUrl);

  return (
    <View>
      <View style={{ width: '100%', height: 400 }}>
        {imageLoading && (
          <ActivityIndicator 
            size="large" 
            color={Colors.PRIMARY} 
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
        )}
        {!imageError && imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'cover',
            }}
            onLoad={() => {
              console.log('Image loaded successfully');
              setImageLoading(false);
            }}
            onError={(error) => {
              console.error('Image load error:', error.nativeEvent.error);
              if (retryCount < 3) {
                console.log(`Retrying image load (attempt ${retryCount + 1})`);
                setRetryCount(prev => prev + 1);
              } else {
                setImageError(true);
                setImageLoading(false);
              }
            }}
          />
        )}
        {imageError && (
          <View style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.GRAY
          }}>
            <Text style={{ fontFamily: 'outfit', fontSize: 16, color: Colors.WHITE, textAlign: 'center' }}>
              Failed to load image after multiple attempts
            </Text>
          </View>
        )}
      </View>
      <View
        style={{
          padding: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View>
          <Text style={{ fontFamily: 'outfit-bold', fontSize: 27 }}>
            {pet?.name}
          </Text>
          <Text style={{ fontFamily: 'outfit', fontSize: 16, color: Colors.GRAY }}>
            {pet?.address}
          </Text>
        </View>
        <MarkFav pet={pet} userEmail={userEmail} />
      </View>
    </View>
  );
}