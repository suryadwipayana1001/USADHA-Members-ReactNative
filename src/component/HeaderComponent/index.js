import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Header, Icon } from "react-native-elements";
import { colors } from '../../utils/colors';

const Notif = (notif, navigasi = null) => {
      return (
            <TouchableOpacity onPress={navigasi} >
                  <Icon name= 'mail-outline' color = '#ffffff' size ={30} />
                  {notif <=0 ? 
                        null : 
                  <View
                        style={{
                              bottom : '50%',
                              left : '50%',
                              padding : 2,
                              backgroundColor : 'red',
                              alignItems : 'center',
                              justifyContent : 'center',
                              position : 'absolute',
                              // borderWidth : 1,
                              borderRadius : 50,
                              height : 20,
                              width : 20
                        }}
                  >
                        <Text style={{color : '#ffffff', fontSize : 10, fontWeight : 'bold'}}>{notif}</Text>
                  </View>
                  }
            </TouchableOpacity>
      )
}

const HeaderComponent = (props) => {
      return (
            <Header
                  placement="left"
                  containerStyle={{marginBottom:-1}}
                  backgroundColor ={colors.default}
                  leftComponent={{ text: 'Usadha Bhakti', style: { color: '#fff',paddingLeft:10, fontWeight:'bold', fontSize:20 } }}
                  // rightComponent={{ icon: 'mail-outline', color: '#fff', text : 'asas' }}
                  rightComponent={props.boll ? Notif(props.notif, props.navigasi) : null}
            />
      )
}

export default HeaderComponent

const styles = StyleSheet.create({})
