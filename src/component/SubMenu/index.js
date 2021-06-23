import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';

const SubMenu = ({navigasi, titleMenu, icon, color}) => {
  return (
    <View>
      <TouchableOpacity onPress={navigasi}>
        <View style={styles.container}>
          <View style={styles.boxIcon}>
            <Icon name={icon} style={styles.icon} color={color} />
            <Text style={styles.titleMenu}>{titleMenu}</Text>
          </View>
          <Text style={styles.panah}></Text>
        </View>
      </TouchableOpacity>
      <View style={styles.line} />
    </View>
  );
};

export default SubMenu;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop : 10
  },
  boxIcon: {
    // flex:1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 30,
    marginRight: 20,
    // color: '#1f3c88',
  },
  titleMenu: {
    fontSize: 16,
  },
  line: {
    marginTop: 10,
    borderColor: '#e8e8e8',
    borderWidth: 1,
  },
  panah: {
    //   fontWeight : 'bold',
    color: '#1f3c88',
    fontSize: 25,
  },
});
