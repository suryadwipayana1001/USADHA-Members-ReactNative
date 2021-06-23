import React from 'react'
import { StyleSheet, Text, View, ImageBackground, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import {background} from './../../assets';


const Releoder = () => {
      return (
            <SafeAreaView style={styles.container}>
                  <ImageBackground source={background} style={styles.image}>
                        <ActivityIndicator size="large" color="rgb(31, 58, 147)" />
                  </ImageBackground>
            </SafeAreaView>
            )
}

export default Releoder

const styles = StyleSheet.create({
      container: {
        flex: 1,
        flexDirection: "column"
      },
      image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
        alignItems : 'center',
      //   backgroundColor:'transparent',
        opacity: 0.68
      },
      text: {
        color: "white",
        fontSize: 42,
        fontWeight: "bold",
        textAlign: "center",
        backgroundColor: "#000000a0"
      }
});
