import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, SafeAreaView, View, TouchableHighlight } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { tailwind } from 'tailwind';
import { PrimaryHeader } from '../components/Headers';
import TextField from '../components/TextField';
import Button from '../components/Button';
import UnderlinedLink from '../components/UnderlinedLink';
import DisplayNotif from "../components/DisplayNotif";
import { DisplayTags } from './Shelter';

/**
 * @function Login
 * @module Login
 * @description Login screen
 */
const Login = () => {
  const failedLoginMessage = "Error: Incorrect Username Or Password"
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [failedLogin, setFailedLogin] = useState(false)

  const navigation = useNavigation();

  const saveToken = async (value) => {
    await SecureStore.setItemAsync('token', value);
  };

  const deleteToken = async (key) => {
    await SecureStore.deleteItemAsync(key);
  };

  const submitLogin = async () => {
    try {
      const response = await fetch('http://192.168.2.49:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const data = await response.json();
      console.log(data);
      console.log(username);
      console.log(password);
      if (data.access_token) {
        saveToken(data.access_token);
        navigation.navigate('Home');
      } else setFailedLogin(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    deleteToken('token');
  }, []);

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <SafeAreaView style={styles.view}>
        <View style={styles.header}>
          <PrimaryHeader text="Login" />
        </View>
        <View style={{ alignItems: 'center' }}><DisplayNotif notification={failedLoginMessage} display={failedLogin} color='indianred' /></View>

        <TextField placeholder="Username" onChangeText={(text) => setUsername(text)} />
        <TextField placeholder="Password" secure={true} onChangeText={(text) => setPassword(text)} />
        <View style={styles.loginButton}>
          <Button label="Enter" disabled={false} onClick={submitLogin} />
        </View>
        <View style={styles.underlinedLinks}>
          <TouchableHighlight onPress={() => navigation.navigate('Landing')}>
            <UnderlinedLink text="Don't have an account?" />
          </TouchableHighlight>
          <UnderlinedLink text="Can't log in?" />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  view: {
    ...tailwind('flex flex-col justify-center mx-5 my-10'),
  },
  header: {
    ...tailwind('flex items-center my-10'),
  },
  loginButton: {
    ...tailwind('my-5'),
  },
  underlinedLinks: {
    ...tailwind('flex flex-col items-center'),
  },
});

export default Login;
