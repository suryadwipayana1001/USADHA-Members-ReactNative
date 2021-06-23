import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {colors} from '../../utils/colors';
import {useSelector} from 'react-redux';

const TabItem = ({onLongPress, onPress, isFocused, label}) => {
  const cartReducer = useSelector((state) => state.CartReducer);
  const [count, SetCount] = useState(0);
  const [display, setDisplay] = useState('none');

  const IconTab = ({color}) => {
    color = colors.dark;
    if (label === 'Dashboard') {
      return isFocused ? (
        <Icon name="home" color={colors.btn} style={styles.iconTab} />
      ) : (
        <Icon name="home" style={styles.iconTab} color={color} />
      );
    }

    if (label === 'Keranjang') {
      // console.log('halo halo',count)
      return isFocused ? (
        <View>
          <Icon
            name="shopping-basket"
            color={colors.btn}
            style={styles.iconTab}
          />
        </View>
      ) : (
        <View>
          <Icon
            name="shopping-basket"
            color={colors.dark}
            style={styles.iconTab}
          />
          {cartReducer.count !== 0 ?
         
            <View style={styles.icon}>
              <Text style={styles.notif}>{cartReducer.count}</Text>
            </View>
           : 
            <View></View>
          }
        </View>
      );
    }
    if (label === 'Menu') {
      return isFocused ? (
        <Icon name="bars" color={colors.btn} style={styles.iconTab} />
      ) : (
        <Icon name="bars" style={styles.iconTab} color={color} />
      );
    }
    if (label === 'Profile') {
      return isFocused ? (
        <Icon name="user" color={colors.btn} style={styles.iconTab} />
      ) : (
        <Icon name="user" style={styles.iconTab} color={color} />
      );
    }
    if (label === 'Scan') {
      return isFocused ? (
        <View style={styles.borderScan}>
          <Icon name="qrcode" color={colors.btn} style={styles.scan} />
        </View>
      ) : (
        <View style={styles.borderScan}>
          <Icon name="qrcode" style={styles.scan} color={color} />
        </View>
      );
    }
    return <Icon name="home" color={colors.btn} style={styles.iconTab} />;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabItem}>
      <IconTab />
      <Text
        style={{
          color: isFocused ? 'black' : colors.dark,
          bottom: label === 'Scan' ? 15 : 0,
          fontWeight: 'bold',
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default TabItem;

const styles = StyleSheet.create({
  tabItem: {
    // paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconTab: {
    fontSize: 20,
  },
  borderScan: {
    borderWidth: 2,
    alignItems: 'center',
    bottom: 20,
    borderRadius: 50,
    fontWeight : '100',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    borderColor: '#f1f3f8',
  },
  scan: {
    fontSize: 40,
    // bottom : 30,
    textAlign: 'center',
    // alignItems : 'center'
  },
  icon: {
    backgroundColor: '#ea2c62',
    position: 'absolute',
    top: -8,
    right: -10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    width: 20,
    height: 20,
  },
  notif: {
    color: '#ffffff',
  },
});
