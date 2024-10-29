import React, { useState } from "react";
import { Platform, View, Image } from "react-native";
import { Appbar, TextInput, Snackbar, Button } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from "expo-image-picker";
import { styles } from "./NewSocialScreen.styles";
import { getApp, initializeApp } from "firebase/app";
import { collection, doc, getFirestore, addDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { uuid } from "../../../Utils";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../RootStackScreen";

// Make sure Firebase is initialized
const firebaseConfig = {
  apiKey: "AIzaSyCvISyoLyO6wTZFcGGLoZNsyGxD3SN_Fyw",
  authDomain: "proj2-7aafa.firebaseapp.com",
  projectId: "proj2-7aafa",
  storageBucket: "proj2-7aafa.appspot.com",
  messagingSenderId:"606003251668",
  appId: "1:606003251668:web:fa7c4422ce3119f76aee41",
  measurementId: "G-9RKXJG88L1"
};
// Initialize Firebase only if it hasn't been initialized yet
if (!getApp.length) {
  initializeApp(firebaseConfig);
}

interface Props {
  navigation: StackNavigationProp<RootStackParamList, "NewSocialScreen">;
}

export default function NewSocialScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDismissSnackbar = () => setSnackbarVisible(false);
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("Image picker result:", result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const saveEvent = async () => {
    setLoading(true);
    console.log("Attempting to save event...");

    if (!name || !description || !date || !image) {
      console.log("Validation failed: Missing fields");
      setSnackbarVisible(true);
      setLoading(false);
      return;
    }

    try {
      console.log("hello")
      const response = await fetch(image);
      console.log("response", response)
      const blob = await response.blob();
      console.log("blob", blob)
      const storage = getStorage(getApp());
      console.log("storage", storage)
      const storageRef = ref(storage, uuid() + ".jpg");
      const result = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(result.ref);
      console.log("downloadURL", downloadURL)

      const db = getFirestore();
      const socialDoc = {
        eventName: name,
        eventDate: date.getTime(),
        eventLocation: location,
        eventDescription: description,
        eventImage: downloadURL,
      };

      const responseDoc = await addDoc(collection(db, "socials"), socialDoc);
      console.log("responseDoc", responseDoc);
      console.log("Event created successfully:", socialDoc);
      navigation.navigate("ConfirmationScreen");
    } catch (error) {
      console.error("Error while writing social:", error);
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const Bar = () => (
    <Appbar.Header>
      <Appbar.Action onPress={navigation.goBack} icon="close" />
      <Appbar.Content title="Create New Social Event" />
    </Appbar.Header>
  );

  return (
    <>
      <Bar />
      <View style={{ ...styles.container, padding: 20 }}>
        <TextInput label="Event Name" value={name} onChangeText={setName} />
        <TextInput label="Description" value={description} onChangeText={setDescription} multiline />
        <TextInput label="Location" value={location} onChangeText={setLocation} />
        <Button onPress={showDatePicker}>{date ? date.toDateString() : "Pick a date"}</Button>
        <DateTimePickerModal isVisible={isDatePickerVisible} mode="datetime" onConfirm={handleConfirm} onCancel={hideDatePicker} />
        <Button onPress={pickImage}>{image ? "Change Image" : "Pick an Image"}</Button>
        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        <Button onPress={saveEvent} loading={loading}>Create Event</Button>
        <Snackbar visible={snackbarVisible} onDismiss={handleDismissSnackbar} duration={3000}>Please fill out all the fields</Snackbar>
      </View>
    </>
  );
}
