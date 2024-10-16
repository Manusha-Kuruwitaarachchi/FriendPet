import { View, Text, Image, FlatList, TouchableOpacity, Alert } from 'react-native';
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useUser } from '@clerk/clerk-expo';
import Colors from '../../constants/Colors';
import { useRouter } from 'expo-router';
export default function Profile() {
 const Menu=[
  {
   id:1,
   name:'Add New Pet',
   icon:'add-circle',
   path:'/add-new-pet'
  },
  {
   id:2,
   name:'Favorites',
   icon:'heart',
   path:'/(tabs)/favorite'
  },
  {
    id:5,
    name:'My post',
    icon:'bookmark',
    path:'/user-post'
   },
  {
   id:3,
   name:'Inbox',
   icon:'chatbubble',
   path:'/(tabs)/inbox'
  },
  {
    id:4,
    name:'Logout',
    icon:'exit',
    path:'login'
  }
 ]

 const {user}=useUser();
 const router=useRouter();

 const{signOut}=useAuth();
 const onPressMenu = (menu) => {
  if (menu.name === 'Logout') {
    // Show a confirmation dialog for logout
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Logout cancelled"),
          style: "cancel"
        },
        { 
          text: "Yes", 
          onPress: async () => {
            await signOut();  // Sign out the user
            router.replace('login');  // Navigate to the login page
          } 
        }
      ]
    );
    return;
  
  }

  // Navigate to the selected menu path
  router.push(menu.path);
};


 return (
  <View
  style={{
    padding: 20,
    marginTop: 20
  }}>
    <Text
    style={{
      fontFamily: 'outfit-medium',
      fontSize: 30
    }}>Profile</Text>
    <View style={{
      display:'flex',
      alignItems: 'center',
      marginVertical: 25
    }}>
      <Image source={{uri:user?.imageUrl}}     
       style={{
        width: 80,
        height: 80,
        borderRadius: 99,
        gap: 10
      }}/>
      <Text
      style={{
        fontFamily: 'outfit-bold',
        fontSize: 30,
        gap: 10

      }}>{user?.fullName}</Text>

      <Text
      style={{
        fontFamily: 'outfit',
        fontSize: 20,
        color: Colors.GRAY
      }}>{user?.primaryEmailAddress?.emailAddress}</Text>
    </View>
    <FlatList
      data={Menu}
      keyExtractor={item => item.id.toString()}  // Ensure you have a unique key
      renderItem={({ item, index }) => (
        <TouchableOpacity 
        onPress={()=>onPressMenu(item)}
        key={item.id.toString()}
        style={{
          marginVertical: 10,
          display:'flex',
          flexDirection: 'row',
          alignItems:'center',
          gap: 10,
          backgroundColor:Colors.WHITE,
          padding:10,
          borderRadius:10
        }}>
          <Ionicons name={item.icon} size={30}
           color={Colors.PRIMARY} 
           style={{
            padding:10,
            backgroundColor:Colors.LIGHT_PRIMARY,
            borderRadius:10
           }}
          />
        <Text 
        style={{
          fontFamily: 'outfit',
          fontSize: 20
        }}>{item.name}</Text>
        </TouchableOpacity>
      )}
    />
  </View>
 )
}