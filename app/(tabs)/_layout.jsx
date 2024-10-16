import React from 'react'
import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Colors from '../../constants/Colors';
export default function TabLayout() {
  return (
    <Tabs
    screenOptions={{
      tabBarActiveTintColor:Colors.PRIMARY
    }}
    >
        <Tabs.Screen name='home'
        options={{
          title:'Home',
          headerShown:false,
          tabBarIcon: ({color}) => <Ionicons name="home" size={24} color={color} />
        }}/>
        <Tabs.Screen name='favorite'
        options={{
        title:'Favorites',
        headerShown:false,
        tabBarIcon: ({color}) => <MaterialIcons name="favorite" size={24} color={color}/>
        }}
        />
        <Tabs.Screen name='inbox'
        options={{
          title:'Inbox',
          headerShown:false,
          tabBarIcon: ({color}) => <FontAwesome name="inbox" size={24} color={color} /> 
        }}
        />
        <Tabs.Screen name='profile'
        options={{
          title:'Profile',
          headerShown:false,
          tabBarIcon: ({color}) => <Ionicons name="people-sharp" size={24} color={color} />
        }}/>
    </Tabs>
  )
}