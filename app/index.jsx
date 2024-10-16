import { Redirect } from "expo-router";
import { View } from "react-native";
import { useUser, useAuth } from "@clerk/clerk-expo";
export default function Index() {

  const { isSignedIn } = useAuth();
  return (
    <View style={{ flex: 1 }}>
      {isSignedIn ? (
        <Redirect href="/(tabs)/home" />
      ) : (
        <Redirect href="/(tabs)/home" />
      )}
    </View>
  );
}
