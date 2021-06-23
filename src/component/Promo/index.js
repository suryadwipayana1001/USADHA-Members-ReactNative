import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

const Promo = ({sourceimage}) => {
  return (
    <TouchableOpacity>
      <View>
        <Image source={sourceimage} style={styles.image} />
      </View>
    </TouchableOpacity>
  );
};

export default Promo;

const styles = StyleSheet.create({
  image: {
    width: 338,
    height: 130,
    // resizeMode: 'stretch',
    marginTop: 20,
    borderRadius: 20,
    marginRight: 20,
    position: 'relative',
  },
});
