import { View, Text, FlatList, Image,StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './../../config/FirebaseConfig';
import Colors from '../../constants/Colors';

export default function Category({category}) {

    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory,setSelectedcategory] =useState(['Birds']);
    useEffect(() => {
        GetCategories();
    }, []);

    const GetCategories = async () => {
        const snapshot = await getDocs(collection(db, 'Category'));
        const categories = snapshot.docs.map(doc => doc.data());
        setCategoryList(categories);
    }

    return (
        <View style={{ marginTop: 20 }}>
            <Text style={{
                fontFamily: 'outfit-medium',
                fontSize: 20
            }}>Category</Text>

            <FlatList
                data={categoryList}
                numColumns={4}
                keyExtractor={(item, index) => index.toString()} 
                renderItem={({ item }) => (

                    <TouchableOpacity 
                    onPress={()=>{setSelectedcategory(item.name);
                        category(item.name)
                    }}
                    style={{
                        flex: 1,
                    }}>

                    <View style={[styles.container,
                        selectedCategory == item.name && styles.selectedCategoryContainer
                    ]}>
                        <Image
                            source={{ uri: item?.id}}  
                            style={{
                                width: 40,
                                height: 40
                            }}
                            resizeMode="cover"  
                            />
                    </View>

                    <Text 
                    style={{
                        textAlign: "center",
                        fontFamily: 'outfit',
                    }}>
                        {item?.name}
                    </Text>

                </TouchableOpacity>
                )}
            />
        </View>
    );
}
const styles = StyleSheet.create({
  container:{
    backgroundColor:Colors.LIGHT_PRIMARY,
    padding:16,
    alignItems:'center',
    borderRadius:16,
    borderWidth:1,
    borderColor:Colors.PRIMARY,
    margin:5
  },
  selectedCategoryContainer:{
    backgroundColor:Colors.SECONDARY,
    borderColor:Colors.SECONDARY
  }

})

