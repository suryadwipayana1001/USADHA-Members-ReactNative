import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import { colors } from '../../utils/colors'
import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

const Otp = ({navigation, route}) => {

      const [phone, setPhone] = useState(route.params.phone);
      // const [otp, setOtp] = useState(0);
      const [code, setCode] = useState('');
      const [codeOTP, setCodeOTP] = useState('');
      const userReducer = useSelector((state) => state.UserReducer);
      // const [isLoading, setIsLoading] = useState(true);
      const TOKEN = useSelector((state) => state.TokenApi);
      // const isFocused = useIsFocused();

      String.prototype.replaceAt = function(index, replacement) {
            return this.substr(0, index) + replacement + this.substr(index + replacement.length);
      }

      const verifyOtp = () => {
            // console.log(route.params.phone)
            // console.log(code)
            console.log(codeOTP)
            if(code === codeOTP){
                  storeDataToken(TOKEN)
                  storeDataUser(userReducer)
                  navigation.replace('MainApp');
            }else{
                  alert('OTP SALAH')
            }
      }

      useEffect(() => {
            var digits = '0123456789'; 
            let OTP = ''; 
            for (let i = 0; i <=4; i++ ) { 
                  OTP += digits[Math.floor(Math.random() * 10)]; 
            } 
            setCodeOTP(OTP) 
      }, [])

      useEffect(() => {
            //  send otp
            if(codeOTP !== ''){
                  Axios.post(`https://api.nusasms.com/api/v3/sendsms/plain?user=usadhabhakti_api&password=@Wighnam_221&SMSText=${codeOTP}&GSM=${phone.replace(0, "62")}&otp=Y&output=json`) 
                  .then((res) => {
                        alert('Otp Send via SMS')
                        console.log(codeOTP)
                  }).catch((err)=>{
                        console.log('gagal')
                  })
            }
      }, [codeOTP])


        const storeDataToken = async (value) => {
            try {
              await AsyncStorage.setItem('@LocalToken', value)
            } catch (e) {
              console.log('TOken not Save ')
            }
          }
        
          
          const storeDataUser = async (value) => {
            try {
              const jsonValue = JSON.stringify(value)
              await AsyncStorage.setItem('@LocalUser', jsonValue)
            } catch (e) {
              console.log('Token not Save')
            }
          }

      return (
            <View style={styles.container}>
                  <Text style={styles.img}>OTP</Text>
                  <Text style={styles.txtVerification}>Verification</Text>
                  <Text style={styles.txtSms}>You will get a OTP via <Text style={{fontWeight : 'bold', color : 'black'}}>SMS</Text></Text>
                  <TextInput 
                        placeholder='Enter OTP' 
                        style={styles.inputOtp} 
                        defaultValue= ''
                        secureTextEntry={true} 
                        maxLength={5}
                        onChangeText ={(value) => {setCode(value)}}
                        >
                              
                  </TextInput>
                  <TouchableOpacity style={styles.btn} onPress={() => {verifyOtp()}}>
                        <Text style={styles.txtBtn}>Verify</Text>
                  </TouchableOpacity>
                  {/* <Text style={styles.info}>Mohon tunggu...</Text> */}
                  {/* <TouchableOpacity style={styles.btnInfo}>
                        <Text style={{color:'#ffffff'}}>Send OTP again</Text>
                  </TouchableOpacity> */}
            </View>
      )
}

export default Otp

const styles = StyleSheet.create({
      container: {
            flex : 1,
            backgroundColor: '#ffffff',
            alignItems: 'center',
            justifyContent:'center',
            padding : 50
      },
      img:{
            borderWidth : 1,
            padding:30,
            borderRadius : 100
      },
      txtVerification : {
            marginTop : 20,
            fontSize : 20,
            fontWeight : 'bold'
      },
      txtSms : {
            letterSpacing : 1,
            marginTop : 10,
            color : colors.disable
      },
      inputOtp : {
            textAlign : 'center',
            borderWidth : 1,
            marginTop : 100,
            width : '100%',
            fontSize : 25,
            fontWeight : 'bold',
            borderColor : colors.disable,
            borderRadius : 10
      },
      btn : {
            borderWidth :1,
            marginTop : 20,
            borderRadius : 10,
            paddingVertical : 10,   
            backgroundColor : colors.default,
            borderColor : colors.default,
            shadowColor: '#000',
            shadowOffset: {
                  width: 0,
                  height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            elevation: 5,
            // paddingHorizontal : 130
      },
      txtBtn : {
            // padding : 150  
            marginHorizontal : 95,
            width : 100,
            fontSize : 25,
            textAlign : 'center',
            color : '#ffffff'
      },
      info:{
            color:colors.dark,
            marginTop:10
      },
      btnInfo : {
            marginTop : 10,
            borderWidth : 1,
            borderColor:colors.disable,
            padding:2,
            backgroundColor : '#16c79a',
            borderRadius : 5
      }

})
