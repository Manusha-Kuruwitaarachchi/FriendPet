import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from './../config/FirebaseConfig';

// Create or get the user's favorites document
export const GetFavList = async (user) => {
    if (!user || !user.userEmail) return null;

    const docRef = doc(db, 'UserFavPet', user.userEmail); // Create a document with the user's email as ID
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data(); // Return existing data if the document exists
    } else {
        // If the document doesn't exist, create a new one
        await setDoc(docRef, {
            email: user.userEmail,
            favourites: [] // Initialize an empty favorites array
        });
        return { email: user.userEmail, favourites: [] };
    }
};

// Add a pet to the user's favorite list
export const AddToFav = async (user, petId) => {
    if (!user || !user.userEmail) return;

    const docRef = doc(db, 'UserFavPet', user.userEmail);
    try {
        // Update the document by adding the pet to the favorites array
        await updateDoc(docRef, {
            favourites: arrayUnion(petId) // Add the petId to the favorites array
        });
    } catch (e) {
        console.error("Error adding to favorites: ", e);
    }
};

// Remove a pet from the user's favorite list
export const RemoveFromFav = async (user, petId) => {
    if (!user || !user.userEmail) return;

    const docRef = doc(db, 'UserFavPet', user.userEmail);
    try {
        // Update the document by removing the pet from the favorites array
        await updateDoc(docRef, {
            favourites: arrayRemove(petId) // Remove the petId from the favorites array
        });
    } catch (e) {
        console.error("Error removing from favorites: ", e);
    }
};

export default {
    GetFavList,
    AddToFav,
    RemoveFromFav
};
