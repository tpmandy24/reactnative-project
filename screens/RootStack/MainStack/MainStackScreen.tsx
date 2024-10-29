import React from "react";
import { Button } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./HomeScreen/HomeScreen.main";
import FeedScreen from "./FeedScreen/FeedScreen.main";
import DetailScreen from "./DetailScreen/DetailScreen.main";
import NewSocialScreen from "../NewSocialScreen/NewSocialScreen.main";
import ConfirmationScreen from "./ConfirmationScreen/ConfirmationScreen.main";
import { SocialModel } from "../../../models/social";

export type MainStackParamList = {
  HomeScreen: undefined;
  FeedScreen: undefined;
  DetailScreen: { social: SocialModel };
  NewSocialScreen: undefined;
  ConfirmationScreen: undefined;
};

const MainStack = createStackNavigator<MainStackParamList>();

export function MainStackScreen() {
  return (
    // See docs on stack navigator, what can we add as a prop into MainStack.Navigator to make sure that the HomeScreen is the initial route?
    // https://reactnavigation.org/docs/2.x/stack-navigator/
    // Set the initial route to HomeScreen
    <MainStack.Navigator initialRouteName="HomeScreen">
      {/* Home screen setup */}
      <MainStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      {/* Feed screen setup with a home button */}
      <MainStack.Screen
        name="FeedScreen"
        component={FeedScreen}
        options={({ navigation }) => ({
          title: "Socials",
          headerLeft: () => (
            <Button
              title="Home"
              onPress={() => navigation.navigate('HomeScreen')}
            />
          ),
          headerTitle: "All Socials",
        })}
      />
      {/* Detail screen setup */}
      <MainStack.Screen
        name="DetailScreen"
        options={{ headerShown: false }}
        component={DetailScreen}
      />
      {/* New social screen setup */}
      <MainStack.Screen
        name="NewSocialScreen"
        options={{ headerShown: false }}
        component={NewSocialScreen}
      />
      {/* Confirmation screen setup */}
      <MainStack.Screen
        name="ConfirmationScreen"
        options={{ headerShown: false }}
        component={ConfirmationScreen}
      />
    </MainStack.Navigator>
  );
}
