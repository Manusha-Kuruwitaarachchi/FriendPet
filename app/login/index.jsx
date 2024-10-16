import { View, Text, Image, Pressable, Alert } from 'react-native';
import React, { useCallback } from 'react';
import { useOAuth } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import { useRouter, useSegments } from 'expo-router';
import Colors from '../../constants/Colors';

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const router = useRouter();
  const segments = useSegments();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();
      
      if (createdSessionId) {
        setActive({ session: createdSessionId });
        router.replace('(tabs)/home');
      } else {
        Alert.alert('Login Cancelled', 'You have cancelled the login process.');
        router.replace('login');

      }
    } catch (err) {
      console.error('OAuth error', err);
      console.error('Error details:', JSON.stringify(err, null, 2));
      Alert.alert('Login Error', 'An error occurred during login. Please try again.');
      router.replace('login/index');
    }
  }, [router, startOAuthFlow]);

  return (
    <View style={{ backgroundColor: Colors.WHITE, height: '100%' }}>
      <Image
        source={require('../../assets/images/login.jpg')}
        style={{ width: '100%', height: '70%' }}
      />
      <View style={{ padding: 20, alignItems: 'center' }}>
        <Text style={{ fontFamily: 'outfit-bold', fontSize: 30, textAlign: 'center' }}>
          Ready to make a new friend?
        </Text>
        <Text style={{ fontFamily: 'outfit', fontSize: 18, textAlign: 'center', color: Colors.GRAY }}>
          Let's adopt the pet you like and make their life happy again
        </Text>
        <Pressable
          onPress={onPress}
          style={{
            padding: 14,
            marginTop: 40,
            backgroundColor: Colors.PRIMARY,
            width: '100%',
            borderRadius: 14,
          }}
        >
          <Text style={{ fontFamily: 'outfit-medium', textAlign: 'center', fontSize: 20, color: Colors.BLACK }}>
            Get Started
          </Text>
        </Pressable>
      </View>
    </View>
  );
}