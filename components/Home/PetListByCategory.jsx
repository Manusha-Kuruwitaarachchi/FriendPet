import { View, Text,FlatList,ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import Category from './Category';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import PetListItem from './PetListItem';
import Colors from '../../constants/Colors';

export default function PetListByCategory() {
  const [petList, setPetList] = useState([]);
  const [loader,setLoader]= useState(false);

  useEffect(() => {
    GetPetList('Birds');
  }, []);

  const GetPetList = async (category) => {
    setLoader(true);
    setPetList([]);
    const q = query(collection(db, 'Pets'), where('category', '==', category));
    const querySnapshot = await getDocs(q);

    const pets = [];
    querySnapshot.forEach((doc) => {
      pets.push(doc.data());
    });
    setPetList(pets);
    setLoader(false)
  };

  return (
      <View>
        <Category category={(value) => GetPetList(value)} />

      {loader && petList.length === 0 ? (
        <ActivityIndicator size="large" color={Colors.PRIMARY} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={petList}
          horizontal={true}
          refreshing={loader}
          onRefresh={()=>GetPetList('Birds')}
          renderItem={({ item, index }) => (
            <PetListItem pet={item} />)}
            style={{
              marginTop: 10}}
              />
            )}
          </View>
        );
      }
      