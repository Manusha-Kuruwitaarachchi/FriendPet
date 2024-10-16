import { View, Text, Image, TextInput, StyleSheet, ScrollView, TouchableOpacity, Pressable, ToastAndroid, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import Colors from '../../constants/Colors';
import { Picker } from '@react-native-picker/picker';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore'; // Import setDoc
import { db, storage } from './../../config/FirebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, uploadBytes, ref } from 'firebase/storage';
import { useUser } from '@clerk/clerk-expo';

export default function AddNewPet({ pet }) {
    const navigation = useNavigation();
    const [formData, setFormData] = useState({
        category: '',
        sex: ''
    });
    const [gender, setGender] = useState('');
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedcategory] = useState('');
    const [image, setImage] = useState();
    const [loader, setLoader] = useState(false);
    const { user } = useUser();
    const router = useRouter();
    
    useEffect(() => {
        navigation.setOptions({
            headerTitle: '',
        });
        GetCategories();
    }, []);

    const GetCategories = async () => {
        const snapshot = await getDocs(collection(db, 'Category'));
        const categories = snapshot.docs.map(doc => doc.data());
        setCategoryList(categories);
    };

    const imagePicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleInputChange = (fieldName, fieldValue) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: fieldValue
        }));
    };

    const onSubmit = async () => {
        if (!formData.name || !formData.category || !formData.breed || !formData.age || 
            !formData.sex || !formData.weight || !formData.address || !formData.about || !image) {
            ToastAndroid.show("All details are required", ToastAndroid.SHORT);
            return;
        }

        // Check if category and gender are selected
        if (!selectedCategory) {
            ToastAndroid.show("Please select a category", ToastAndroid.SHORT);
            return;
        }

        if (!gender) {
            ToastAndroid.show("Please select a gender", ToastAndroid.SHORT);
            return;
        }

        await UploadImage(); // Proceed with image upload if validation passes
    };

    const UploadImage = async () => {
        setLoader(true); 
        const resp = await fetch(image); 
        const blobImage = await resp.blob(); 
        const storageRef = ref(storage, 'PetAdopt/' + Date.now() + '.jpg'); 

        try {
            const snapshot = await uploadBytes(storageRef, blobImage); 
            const downloadUrl = await getDownloadURL(snapshot.ref); 
            setFormData((prev) => ({
                ...prev,
                imageUrl: downloadUrl, 
            }));
            await SaveFormData(downloadUrl); 
        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            setLoader(false); 
        }
    };

    const SaveFormData = async (imageUrl) => {
        const docId = Date.now().toString(); 
        try {
            await setDoc(doc(db, 'Pets', docId), {
                ...formData,
                imageUrl: imageUrl,
                userName: user?.fullName,
                email: user?.primaryEmailAddress?.emailAddress,
                userImage: user?.imageUrl,
                id: docId,
            });
            ToastAndroid.show('Pet added successfully!', ToastAndroid.SHORT);
            router.replace('/(tabs)/home'); 
        } catch (error) {
            console.error('Error saving pet:', error);
            ToastAndroid.show('Failed to add pet.', ToastAndroid.SHORT);
        }
    };

    return (
        <ScrollView style={{ padding: 20 }}>
            <Text style={{ fontFamily: 'outfit-medium', fontSize: 20, textAlign:'center' }}>Add New Pet For Adoption</Text>

            <Pressable onPress={imagePicker} style={{ justifyContent: 'center', alignItems: 'center' }}>
                {!image ? <Image
                    source={require('./../../assets/images/placeholder.png')}
                    style={{
                        width: 100,
                        height: 100,
                        marginTop:10
                        
                    }}
                /> :
                    <Image source={{ uri: image }}
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: 15,
                        }}
                    />}
            </Pressable>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Pet Name * </Text>
                <TextInput placeholder='Pet Name' style={styles.input}
                    onChangeText={(value) => handleInputChange('name', value)} />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Pet Category * </Text>
                <Picker
                    selectedValue={selectedCategory}
                    style={styles.input}
                    onValueChange={(itemValue, itemIndex) => {
                        setSelectedcategory(itemValue);
                        handleInputChange('category', itemValue);
                    }}>
                    <Picker.Item label="Select a category" value="" />
                    {categoryList.map((category, index) => (
                        <Picker.Item key={index} label={category.name} value={category.name} />
                    ))}
                </Picker>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Breed * </Text>
                <TextInput placeholder='Pet Breed' style={styles.input}
                    onChangeText={(value) => handleInputChange('breed', value)} />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Age * </Text>
                <TextInput placeholder='Age' style={styles.input}
                    keyboardType='numeric'
                    onChangeText={(value) => handleInputChange('age', value)} />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Gender * </Text>
                <Picker
                    selectedValue={gender}
                    style={styles.input}
                    onValueChange={(itemValue, itemIndex) => {
                        setGender(itemValue);
                        handleInputChange('sex', itemValue);
                    }}>
                    <Picker.Item label="Select a gender" value="" />
                    <Picker.Item label="Male" value="Male" />
                    <Picker.Item label="Female" value="Female" />
                </Picker>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Weight * </Text>
                <TextInput placeholder='Eg:- 25kg ' style={styles.input}
                    keyboardType='numeric'
                    onChangeText={(value) => handleInputChange('weight', value)} />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Address * </Text>
                <TextInput placeholder='Address' style={styles.input}
                    onChangeText={(value) => handleInputChange('address', value)} />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>About * </Text>
                <TextInput
                    numberOfLines={5}
                    multiline={true}
                    placeholder="Tell us about your pet"
                    style={styles.input}
                    onChangeText={(value) => handleInputChange('about', value)} />
            </View>

            <TouchableOpacity style={styles.button} disabled={loader} onPress={onSubmit}>
                {loader ? <ActivityIndicator size={'large'} color='White'/> :
                    <Text style={{ fontFamily: 'outfit-medium', textAlign: 'center' }}>Submit</Text>}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        marginVertical: 5,
    },
    label: {
        marginVertical: 5,
        fontFamily: 'outfit'
    },
    input: {
        padding: 10,
        backgroundColor: Colors.WHITE,
        borderRadius: 7,
        fontFamily: 'outfit'
    },
    button: {
        padding: 15,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 10,
        marginVertical: 10,
        marginBottom: 50
    }
});
