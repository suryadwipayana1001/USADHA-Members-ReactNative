import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {ButtonCustom, Header, HeaderComponent, SubMenu} from '../../component';
import Axios from 'axios';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../utils/colors';
import { Alert } from 'react-native';
import Config from 'react-native-config';

const Menu = ({navigation}) => {
  const TOKEN = useSelector((state) => state.TokenApi);

  const logout = () => {
    Axios.get(Config.API_LOGOUT,   {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Accept' : 'application/json' 
      }
    })
      .then((res) => {
        clearAll();
        console.log(res.data.message)
        navigation.replace('Splash')
      })
      .catch((e) => {
        console.log(e)
      })
  }


  const clearAll = async () => {
    try {
      await AsyncStorage.clear()
    } catch(e) {
      console.log(e)
    }
  
    console.log('Done.')
  }

  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
        <HeaderComponent/>
        <ScrollView>
          <View style={styles.menu}>
            <Text style={styles.titleMenu}>Pendaftaran Mitra / Downline</Text>
            <SubMenu
              titleMenu="Pendaftaran Downline / Mitra Langsung"
              icon="user-plus"
              style={styles.subMenu}
              navigasi={() => navigation.navigate('Jaringan')}
            />
            {/* <SubMenu titleMenu="Pendaftaran" icon="user-plus" style ={styles.subMenu} /> */}
          </View>
          {/* <View style={styles.line} /> */}
          <View style={styles.menu}>
            <Text style={styles.titleMenu}>Mitra Langsung / Downline</Text>
            <SubMenu 
              titleMenu="Mitra Langsung / Downline" 
              icon="users" 
              navigasi={() => navigation.navigate('Downline')}
            />
          </View>
          <View style={styles.menu}>
            <Text style={styles.titleMenu}>Withdraw</Text>
            <SubMenu 
              titleMenu="Withdraw" 
              icon="500px" 
              navigasi={() => navigation.navigate('WithDraw')}
            />
          </View>
          <View style={styles.menu}>
            <Text style={styles.titleMenu}>Info Bank</Text>
            <SubMenu 
              titleMenu="Info Bank" 
              icon="credit-card" 
              navigasi={() => navigation.navigate('Bank')}
            />
          </View>
        </ScrollView>
      </View>
      <View style={{height:80, alignItems:'center'}}>
          <ButtonCustom
            name = 'Logout'
            color = {colors.btn}
            width = '90%'
            func = {() => Alert.alert(
                  'Peringatan',
                  `Logout ? `,
                  [
                        {
                              text : 'Tidak',
                              onPress : () => console.log('tidak')
                        },
                        {
                              text : 'Ya',
                              onPress : () => {logout()}
                        }
                  ]
            )}
          />
      </View>
    </View>
  );
};

export default Menu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    height: 'auto',
  },
  menu: {
    padding: 20,
  },
  titleMenu: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  line: {
    borderWidth: 5,
    borderColor: '#e8e8e8',
  },
  subMenu: {
    paddingVertical: 20,
  },
  textBtnLogOut: {
    color: '#ffffff',
    fontSize: 18,
  },
  buttonTopUp: {
    borderWidth: 1,
    borderRadius: 10,
    height : 45,
    backgroundColor: '#ff781f',
    borderColor: '#ff781f',
    paddingHorizontal: 100,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    justifyContent : 'center',
    width : 350,
    alignItems : 'center'
  },
});
