import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import {colors} from '../../utils/colors';

const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.textHeader}>Usadha Bhakti</Text>
      <TouchableOpacity>
        <Icon name="bell" style={styles.bell} />
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.default,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  textHeader: {
    fontSize: 20,
    color: '#39311d',
    fontWeight: 'bold',
  },
  bell: {
    fontSize: 20,
    color: 'white',
  },
});
