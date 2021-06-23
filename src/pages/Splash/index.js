import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, Image, View, ActivityIndicator, ImageBackground, TouchableOpacity} from 'react-native';
import {colors} from '../../utils/colors';
import {background} from './../../assets';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import { token_api } from '../../redux/action';
import { SafeAreaView } from 'react-native-safe-area-context';

const Splash = ({navigation}) => {
  const [dataToken, setDataToken] = useState('')
  const [dataUser, setDataUser] = useState({})
  const dispatch = useDispatch();


  useEffect(() => {
    getDataToken()
    getDataUser()
  }, [navigation]);

  useEffect(() => {
    dispatch(token_api(dataToken))
    dispatch({type : 'SET_DATA_USER', value:dataUser}); 
    // console.log('user data',dataUser)
    if(dataToken != '' && dataUser != {}){
      navigation.replace('MainApp')
    }else{
      navigation.replace('Login')
    }
  }, [dataUser])

const getDataToken = async () => {
  try {
    const value = await AsyncStorage.getItem('@LocalToken')
    if(value !== null) {
      setDataToken(value);
    }
  } catch(e) {
    // error reading value
  }
}


const getDataUser = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@LocalUser')
    setDataUser(JSON.parse(jsonValue))
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {
    // error reading value
  }
}

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={background} style={styles.image}>
        <ActivityIndicator size="large" color="blue" />
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems:'center'
  },
  text: {
    color: "white",
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000a0"
  }
});
