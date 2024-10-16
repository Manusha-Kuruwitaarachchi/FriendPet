import { View, Text, Image } from 'react-native'
import React from 'react'
import Colors from '../../../constants/Colors'
import Ionicons from '@expo/vector-icons/Ionicons';
export default function OwnerInfo({pet}) {
  return (
    <View
    style={{
        paddingHorizontal:20,
        marginHorizontal:20,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        gap:20,
        borderWidth:1,
        borderRadius:15,
        padding: 10,
        backgroundColor:Colors.WHITE,
        justifyContent: 'space-between',
        borderColor:Colors.PRIMARY
        
    }}>
    <View
        style={{
            display: 'flex',
            flexDirection: 'row',
            gap:20,
          }}>
      <Image source={{uri:pet.userImage}}
      style={{
          width: 90,
          height: 90,
          borderRadius: 99
        }}/>
      <View>
        <Text
        style={{
            fontFamily: 'outfit-medium',
            fontSize: 18,
            marginTop:15,
        }}>{pet?.userName}</Text>
        <Text
        style={{
            fontFamily: 'outfit',
            color:Colors.GRAY,
        }}>Pet Owner</Text>
      </View>
        </View>
      <Ionicons name="send-sharp" size={25} color={Colors.PRIMARY} style={{
        marginBottom: 15
      }}/>

    </View>
  )
}