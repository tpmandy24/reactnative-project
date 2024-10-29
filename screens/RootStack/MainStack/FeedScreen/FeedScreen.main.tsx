import React, { useState, useEffect } from "react";
import { Text, View, FlatList, Image } from "react-native";
import { Appbar, Card } from "react-native-paper";
import firebase from "firebase/app";
import { getFirestore, collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { SocialModel } from "../../../../models/social.js";
import { styles } from "./FeedScreen.styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../MainStackScreen.js";

/* HOW TYPESCRIPT WORKS WITH PROPS:

  Remember the navigation-related props from Project 2? They were called `route` and `navigation`,
  and they were passed into our screen components by React Navigation automatically.  We accessed parameters 
  passed to screens through `route.params` , and navigated to screens using `navigation.navigate(...)` and 
  `navigation.goBack()`. In this project, we explicitly define the types of these props at the top of 
  each screen component.

  Now, whenever we type `navigation.`, our code editor will know exactly what we can do with that object, 
  and it'll suggest `.goBack()` as an option. It'll also tell us when we're trying to do something 
  that isn't supported by React Navigation! */

interface Props {
  navigation: StackNavigationProp<MainStackParamList, "FeedScreen">;
}

export default function FeedScreen({ navigation }: Props) {
  // TODO: Initialize a list of SocialModel objects in state.
  const [socials, setSocials] = useState<SocialModel[]>([]);

  const db = getFirestore();

  useEffect(() => {
    const q = query(collection(db, 'socials'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const socialsList: SocialModel[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data()
  
        const socialDoc: SocialModel = {
          eventDate: data.eventDate,
          eventDescription: data.eventDescription,
          eventImage: data.eventImage,
          eventLocation: data.eventLocation,
          eventName: data.eventName 
        };
  
        socialsList.push(socialDoc);
        console.log(`${doc.id} => `, data);
      });

      setSocials(socialsList);
    });

    return () => unsubscribe(); // Detach listener when component unmounts
  }, []);


  /* TYPESCRIPT HINT: 
    When we call useState(), we can define the type of the state
    variable using something like this:
        const [myList, setMyList] = useState<MyModelType[]>([]); */

  /*
    TODO: In a useEffect hook, start a Firebase observer to listen to the "socials" node in Firestore.
    Read More: https://firebase.google.com/docs/firestore/query-data/listen
  
    Reminders:
      1. Make sure you start a listener that's attached to this node!
      2. The onSnapshot method returns a method. Make sure to return the method
          in your useEffect, so that it's called and the listener is detached when
          this component is killed. 
          Read More: https://firebase.google.com/docs/firestore/query-data/listen#detach_a_listener
      3. You'll probably want to use the .orderBy method to order by a particular key.
      4. It's probably wise to make sure you can create new socials before trying to 
          load socials on this screen.
  */

  const renderItem = ({ item }: { item: SocialModel }) => {
    // TODO: Return a Card corresponding to the social object passed in
    // to this function. On tapping this card, navigate to DetailScreen
    // and pass this social.

    return (
      <Card style={styles.noShadow}
        onPress={() => navigation.navigate('DetailScreen', { social: item })}
      >
        <Card.Title title={item.eventName} subtitle={new Date(item.eventDate).toLocaleString()} />
        <Card.Content>
        <Image style={styles.cardImage} source={{ uri: item.eventImage }} />
        <Text>{item.eventLocation}</Text>
          <Text>{item.eventDescription}</Text>
        </Card.Content>
      </Card>
    );
  };

  const NavigationBar = () => {
    // TODO: Return an AppBar, with a title & a Plus Action Item that goes to the NewSocialScreen.
    return (
      <Appbar.Header>
        <Appbar.Content title="Socials" />
        <Appbar.Action icon="plus" onPress={() => navigation.navigate('NewSocialScreen')} />
      </Appbar.Header>
    );
  };

  return (
    <>
      <NavigationBar />
      <View style={styles.container}>
        <FlatList
          data={socials}
          renderItem={renderItem}
        />
      </View>
    </>
  );
}
