import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import Shared from '../../Shared/Shared';
import { useUser } from '@clerk/clerk-expo';
import { collection, query, where, getDocs } from 'firebase/firestore'; 
import { db } from '../../config/FirebaseConfig'; 
import PetListItem from '../../components/Home/PetListItem';

export default function Favorite() {
    const { user } = useUser();
    const [favIds, setFavIds] = useState([]);
    const [favPetList, setFavPetList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            GetFavPetIds();
        }
    }, [user]);

    // Get favorite pet IDs
    const GetFavPetIds = async () => {
        setLoading(true); // Start loading before fetching
        const email = user?.emailAddresses?.[0]?.emailAddress;
        if (!email) {
            console.log('No valid email found for the user.');
            setLoading(false); // Stop loading
            return;
        }

        const result = await Shared.GetFavList({ userEmail: email });
        const favoriteIds = result?.favourites || []; // Default to an empty array if no favorites are found
        setFavIds(favoriteIds);

        if (favoriteIds.length > 0) {
            await GetFavPetList(favoriteIds); // Ensure pets are fetched before stopping loading
        }
        setLoading(false); // Stop loading after the data has been fetched
    };

    // Fetch favorite pet details from Firestore
    const GetFavPetList = async (favoriteIds) => {
        setFavPetList([]); // Clear the list before fetching new data
        const q = query(collection(db, 'Pets'), where('id', 'in', favoriteIds));

        try {
            const querySnapshot = await getDocs(q);
            const petList = [];
            querySnapshot.forEach((doc) => {
                petList.push(doc.data());
            });
            setFavPetList(petList);
        } catch (error) {
            console.error('Error fetching favorite pets: ', error);
        }
    };

    return (
        <View style={{
            padding: 20,
            marginTop: 20,
            flex: 1 // Add flex to make sure the view takes up full screen space
        }}>
            <Text style={{
                fontFamily: 'outfit-medium',
                fontSize: 30,
                marginBottom: 20
            }}>Favorites</Text>

            {/* Display loader when loading */}
            {loading && (
                <ActivityIndicator size="large" color="#0000ff" />
            )}

            {/* Show "No Favorite Pets Selected" message when the list is empty */}
            {!loading && favPetList.length === 0 && (
                <Text>No Favorite Pets Selected</Text>
            )}

            {/* Render the favorite pets using FlatList */}
            {!loading && favPetList.length > 0 && (
                <FlatList
                    data={favPetList}
                    numColumns={2}
                    onRefresh={GetFavPetIds}
                    refreshing={loading} 
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{
                      gap: 10
                  }}
                    renderItem={({ item }) => (
                        <View>
                            <PetListItem pet={item} />
                        </View>
                    )}
                />
            )}
        </View>
    );
}
