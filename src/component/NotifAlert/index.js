import React from 'react'
import { StyleSheet, Text, View, Image} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../../utils/colors';
import { Rupiah } from '../../helper/Rupiah';
import {logo} from '../../assets';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const NotifAlert = ({navigation, route}) => {
      
      const dateRegister = () => {
            var todayTime = new Date();
            var month = todayTime.getMonth() + 1;
            var day = todayTime.getDate();
            var year = todayTime.getFullYear();
            var hour = todayTime.getHours();
            var minute = todayTime.getMinutes();
            return year + "-" + month + "-" + day + " " + hour +":"+ minute;
      }
      return (
            <SafeAreaView style={styles.container}>
                  <View style={{flexDirection : 'row', justifyContent : 'center'}}>
                       <View style={{flex : 2}}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                              <Icon name = 'times' size = {20} />
                        </TouchableOpacity>
                       </View>
                       <View style={{flex : 2, alignItems :'center', justifyContent : 'center'}}>
                              <Text style={styles.title}>USADHA BAKTHI</Text>
                       </View>
                       <View style={{flex : 2}}>
                       </View>
                  </View>
                  <View style={{alignItems : 'center'}}>
                        <Image source={logo} style={{marginTop : 60, height : 100, width : 100, borderRadius :100}}/>
                        <Text style={{fontSize : 20, marginTop : 70, textAlign : 'center', color : 'green'}}>{route.params.notif}</Text>
                        <Text style={{marginTop : 30, fontSize : 15, color : '#000'}}>{dateRegister()}</Text>
                        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Dashboard')}>
                              <Text style={{color : '#ffffff', fontSize: 15, fontWeight : 'bold'}}>Kembali</Text>
                        </TouchableOpacity>
                  </View>

            </SafeAreaView>
      )
}

export default NotifAlert

const styles = StyleSheet.create({
      container : {
            flex : 1,
            backgroundColor : '#ffffff',
            padding : 20,
            alignItems : 'center',
      },
      title : {
            textAlign : 'center',
            fontSize : 20,
            fontWeight : 'bold'
      }, 
      btn : {
            borderWidth : 1,
            padding : 10,
            width : 340,
            borderRadius : 10,
            alignItems : 'center',
            justifyContent : 'center',
            marginTop : 40,
            borderColor : colors.btn,
            backgroundColor : colors.btn
      }
})
