import React, {useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import {productImage} from '../../assets';
import {colors} from '../../utils/colors';

const Prodcuct = () => {
  return (
    <View>
      <Text>roduct</Text>
    </View>
  );
};

const DashboardProduct = ({nameImage, textTitle, textContent, navigasi}) => {
  // useEffect(() => {
  //   console.log('name imgae', nameImage);
  // }, []);
  return (
    <TouchableOpacity onPress={navigasi}>
    <View style={styles.container}>
        <View style={{alignItems: 'center', justifyContent: 'center', maxWidth: 175}}>
          <Image source={nameImage} style={styles.image} />
        </View>
        <View style={styles.content}>
          <Text style={styles.textTitle}>{textTitle}</Text>
          <Text style={styles.textContent}>{textContent}</Text>
      </View>
      <View style={{height : 20}}>
        <Text style={styles.button}>Detail Produk</Text>
      </View>
    </View>
    </TouchableOpacity>
  );
};

export {DashboardProduct, Prodcuct};

const styles = StyleSheet.create({
  container: {
    // backgroundColor : 'red',
    width: 170,
    height: 250,
    borderRadius: 10,
    // padding : 10,
    marginVertical: 10,
    borderWidth: 0.2,
    borderColor: colors.disable,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    // elevation: 1,
    paddingBottom: 15,
    maxWidth: 170,
  },
  image: {
    width: 170,
    height: 80,
    resizeMode: 'stretch',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  content: {
    paddingTop: 10,
    paddingHorizontal: 10,
    flex: 3,
  },
  textTitle: {
    color: colors.text.grey,
    fontWeight: 'bold',
    fontSize: 15,
  },
  textContent: {
    marginTop: 10,
    color: colors.text.grey,
    overflow: 'hidden',
  },
  button: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#ff781f',
    fontSize: 15,
  },
});
