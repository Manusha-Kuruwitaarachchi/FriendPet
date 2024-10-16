import { View, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import Shared from './../Shared/Shared';
import { useUser } from '@clerk/clerk-expo'; // Assuming you're using Clerk for authentication

export default function MarkFav({ pet }) {
    const { user } = useUser(); // Get the authenticated user from Clerk
    const [favList, setFavList] = useState([]);

    // Fetch the user's favorite list on component mount
    useEffect(() => {
        if (user) {
            GetFav();
        }
    }, [user]);

    // Fetch the favorites from Firestore
    const GetFav = async () => {
        const email = user?.emailAddresses?.[0]?.emailAddress;

        if (!email) {
            console.log('No valid email found for the user.');
            return;
        }

        const result = await Shared.GetFavList({ userEmail: email });
        setFavList(result?.favourites || []);
    };

    // Add or remove pet from favorites based on its presence
    const ToggleFav = async () => {
        const email = user?.emailAddresses?.[0]?.emailAddress;
        
        if (!email) {
            console.log('No valid email found for the user.');
            return;
        }

        if (favList.includes(pet.id)) {
            // Pet is already in favorites, remove it
            await Shared.RemoveFromFav({ userEmail: email }, pet.id);
        } else {
            // Pet is not in favorites, add it
            await Shared.AddToFav({ userEmail: email }, pet.id);
        }
        // Refresh the favorites list after update
        GetFav();
    };

    return (
        <View>
            {favList.includes(pet.id) ? (
                <Pressable onPress={ToggleFav}>
                    <Ionicons name="heart" size={30} color="red" />
                </Pressable>
            ) : (
                <Pressable onPress={ToggleFav}>
                    <Ionicons name="heart-outline" size={30} color="black" />
                </Pressable>
            )}
        </View>
    );
}
