/* eslint-disable react/jsx-no-bind */
import { useIsFocused } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SecureStore from "expo-secure-store";
import jwt_decode from "jwt-decode";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { tailwind } from "tailwind";

import BackButton from "../components/BackButton";
import QuotationBlock from "../components/QuotationBlock";
import ScreenHeader from "../components/ScreenHeader";
import Spinner from "../components/Spinner";
import icons from "../constants/icons";
import apiHandler from "../util/APIHandler";

/**
 *
 * @function MainProfile
 * @module MainProfile
 * @description Full page of to display profile
 */
function MainProfile({ route, navigation }) {
  const isFocused = useIsFocused();

  const [name, setName] = useState("");
  const [story, setStory] = useState("");
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  async function getProfileIdFromToken() {
    const token = await SecureStore.getItemAsync("token");
    const decoded = await jwt_decode(token);
    return decoded.id;
  }

  const refresh = () => {
    setLoading(true);
    getProfileIdFromToken()
      .then((id) => {
        apiHandler
          .getProfile(id)
          .then((response) => response.json()) // handles parsing
          .then((responseJSON) => {
            // handles setting
            setName(responseJSON.name);
            setStory(responseJSON.story);
            setBalance(responseJSON.balance);
          })
          .catch((error) => {
            console.error(error);
            alert(`Promise rejected: ${error}`);
          });
      })
      .then(() => setLoading(false));
  };
  useEffect(() => {
    refresh();
  }, [isFocused]);

  useEffect(() => {
    refresh();
  }, []);

  return loading ? (
    <Spinner />
  ) : (
    <ScrollView>
      <ScreenHeader
        leftNode={<BackButton />}
        headerText="My Profile"
        rightNode={<Image source={icons.settings} style={styles.tabIcon} />}
        rightContainerStyle={styles.editIconContainer}
        handleOnPressRightNode={() => {
          navigation.navigate("Settings");
        }}
      />
      <View style={styles.profileBlockContainer}>
        <View style={styles.profilePictureContainer}>
          <Image
            // eslint-disable-next-line global-require
            source={require("../assets/rickroll.jpg")}
            style={styles.profilePicture}
          />
        </View>
        <View style={styles.profileInfoContainer}>
          <Text style={styles.usernameText}>{name}</Text>
          <Text style={styles.balanceText}>Balance: ${balance}</Text>
        </View>
      </View>
      <View style={styles.horizontalRuler} />
      <Text style={styles.storySectionTitle}>About me</Text>
      <QuotationBlock
        text={story}
        fontSize={16}
        style={styles.quotationBlock}
      />
    </ScrollView>
  );
}
MainProfile.propTypes = {
  route: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  balanceText: {
    fontSize: 18,
  },
  editIcon: {
    fontSize: 30,
  },
  editIconContainer: {
    alignItems: "center",
    // backgroundColor: "#abc",
    flex: 1,
    height: 40,
    justifyContent: "center",
    marginLeft: -10,
    paddingRight: 10,
  },
  horizontalRuler: {
    ...tailwind("border-gray-400"),
    borderBottomWidth: 1,
  },
  profileBlockContainer: {
    // backgroundColor: "#a73",
    flexDirection: "row",
  },
  profileInfoContainer: {
    // backgroundColor: "#c80",
    flexDirection: "column",
    flex: 1,
    paddingVertical: 10,
  },
  profilePicture: {
    height: 100,
    resizeMode: "stretch",
    width: 100,
  },
  profilePictureContainer: {
    borderRadius: 50,
    height: 100,
    margin: 10,
    overflow: "hidden",
    width: 100,
  },
  quotationBlock: {
    marginHorizontal: 22,
  },
  storySectionTitle: {
    fontSize: 28,
    marginLeft: 20,
    marginTop: 10,
  },
  submitButtonView: {
    ...tailwind("mx-4 my-2"),
  },
  tabIcon: {
    height: 30,
    width: 30,
  },
  usernameText: {
    fontSize: 32,
    // fontWeight: "bold",
  },
});

export default MainProfile;
