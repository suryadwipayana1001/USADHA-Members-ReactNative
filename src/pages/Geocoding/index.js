import React, {useState, useEffect} from 'react';
import { Text,View,SafeAreaView,StyleSheet,Button } from 'react-native';
import Geocoder from 'react-native-geocoding';

const Geocoding=()=>{
    Geocoder.init("AIzaSyBxJpfNfWPonmRTm-TktgyaNEVyQxpBHd0");
    useEffect(() => {
        Geocoder.from("Colosseum")
		.then(json => {
			var location = json.results[0].geometry.location;
			console.log(location);
		})
		.catch(error => console.warn(error));
    })
    return(
        <SafeAreaView style={styles.container}>
           
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
container : {
    flex :1,
    backgroundColor : '#f4f4f4',
  },
})
export default Geocoding
