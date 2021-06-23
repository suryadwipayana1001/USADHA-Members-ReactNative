import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import { Header, Icon } from "react-native-elements";
import {login_image} from '../../assets';
import {colors} from '../../utils/colors';
import Axios from 'axios';
import { Alert } from 'react-native';
import { Releoder } from '../../component';
import Config from 'react-native-config';

const Reset = ({navigation}) => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const resetAction = () => {
    setIsLoading(true)
    Axios.post(Config.API_RESET, {email : email},{
          headers : {
              'Accept' : 'application/json'
          }
      })
      .then((res) => {
        console.log(res.data.message)
        alert(res.data.message)
        navigation.navigate('Login')
        setIsLoading(false)
      }).catch((error) => {
        setIsLoading(false)
        var mes = JSON.parse(error.request._response);
        alert("Reset Gagal")
        console.log(error)
      })
  }

  
  if (isLoading) {
    return  (
      <Releoder/>
    )
  }

  return (
    <View style={styles.container}>
      <Header
          containerStyle={{height:140, paddingHorizontal : 15, alignItems : 'center', justifyContent : 'center', borderBottomColor : colors.default}}
          backgroundColor={colors.default}
          placement="left"
          leftComponent={{ text: 'Usadha Bhakti', style: { color: '#fff', fontWeight : 'bold', fontSize : 20 } }}
          rightComponent={{ text: 'Reset', style: { color: '#fff', fontSize : 20 } }}
        />
      <View style={styles.body}>
        {/* <Text style={styles.image}>image</Text> */}
        <View style={styles.boxImage}>
          <Image source={login_image} style={styles.image} />
        </View>
        <Text style={styles.textWelcome}>Reset !</Text>
        <Text style={styles.textUsername}>Email</Text>
        <TextInput style={styles.inputUsername} 
          onChangeText={(value)=> setEmail(value)}
          keyboardType= 'email-address'
        />
        <TouchableOpacity style={styles.borderLogin} 
          onPress={() => Alert.alert(
            'Peringatan',
            `Reset Password ? `,
            [
                {
                    text : 'Tidak',
                    onPress : () => console.log('tidak')
                },
                {
                    text : 'Ya',
                    onPress : () => resetAction()
                }
            ]
        )}>
          <Text style={styles.textBtnLogin}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Reset;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.default,
    // padding : 20
  },
  header: {
    marginHorizontal: 20,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems : 'center',
    height: 140,
  },
  icon: {
    color: 'black',
  },
  textLogin: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  body: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    paddingHorizontal: 20,
    // top : -10,
    height : '100%',
    // alignItems : 'center'
    marginTop : '20%'
  },
  boxImage: {
    alignItems: 'center',
    top: -40,
  },
  image: {
    // backgroundColor : 'red',
    width: 80,
    height: 80,
    borderRadius: 50,
    resizeMode: 'cover',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  textWelcome: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  textUsername: {
    justifyContent: 'flex-start',
    color: colors.dark,
    marginTop: 10,
  },
  inputUsername: {
    borderBottomWidth: 1,
    marginTop: -10,
    color: colors.dark,
    borderBottomColor: colors.default,
    marginBottom: 20,
    fontSize: 15,
  },
  borderLogin: {
    borderWidth: 1,
    alignItems: 'center',
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: colors.btn,
    borderColor: colors.btn,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    marginTop: 15,
  },
  textBtnLogin: {
    color: '#ffffff',
    fontSize: 18,
  },
});
