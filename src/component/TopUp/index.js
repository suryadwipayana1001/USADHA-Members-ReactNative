import React from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import {colors} from '../../utils/colors';

const TopUp = ({name, icon, menu, color}) => {
  return (
    <TouchableOpacity onPress={menu}>
      <View style={styles.topUp}>
        <Icon name={icon} style={styles.icon} color={color} />
        <Text style={styles.text}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default TopUp;

const styles = StyleSheet.create({
  topUp: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 25,
  },
  text: {
    marginTop: 2,
    fontSize: 13,
    color: 'black',
  },
});
