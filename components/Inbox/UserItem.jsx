import { View, Text, Image, Dimensions } from 'react-native';
import React from 'react';
import Colors from '../../constants/Colors';
import { Link } from 'expo-router';

const { width } = Dimensions.get('window');

export default function UserItem({ userInfor }) {
  return (
    <Link href={'/chat?id=' + userInfor.docId}>
      <View style={{
        marginBottom: 20, // Increased gap between chats
      }}>
        <View
          style={{
            width: width, // Full width of the screen
            backgroundColor: '#f0f0f0', // Light gray background
            paddingVertical: 15, // Vertical padding for height
            paddingHorizontal: 20, // Horizontal padding for content alignment
          }}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 15,
          }}>
            <Image
              source={{ uri: userInfor?.imageUrl }}
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                borderWidth: 2,
                borderColor: Colors.GRAY,
              }}
            />
            <Text
              style={{
                fontFamily: 'outfit',
                fontSize: 18,
                fontWeight: '600',
                color: Colors.DARK_GRAY,
              }}
            >
              {userInfor?.name}
            </Text>
          </View>
        </View>
        <View
          style={{
            borderWidth: 1.5,
            borderColor: Colors.GRAY,
            opacity: 0.5,
          }}
        />
      </View>
    </Link>
  );
}