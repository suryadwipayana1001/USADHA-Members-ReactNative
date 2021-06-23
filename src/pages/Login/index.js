import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import { Header, Icon } from "react-native-elements";
import {login_image} from '../../assets';
import {colors} from '../../utils/colors';
import CheckBox from '@react-native-community/checkbox';
import {useDispatch,useSelector} from 'react-redux';
import Axios from 'axios';
import {useIsFocused} from '@react-navigation/native';
import { token_api } from '../../redux/action';
import Releoder from '../../component/Releoder';
import OneSignal from 'react-native-onesignal'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from "react-native-config";


const Login = ({navigation}) => {
  const [toggleCheckBox, setToggleCheckBox] = useState(true);
  const [users, setUsers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [login, setLogin] = useState({
    email: '',
    password: null,
    id_onesignal : ''
  });
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [TokenApiOneSignal, setTokenApiOneSignal] = useState()
  const [counter_login, set_counter_login] = useState(0)
  const userReducer = useSelector((state) => state.UserReducer);
  // const [isLoading, setIsLoading] = useState(true);
  const TOKEN = useSelector((state) => state.TokenApi);

  useEffect(()=> {
    notif();
    getLoginBlock();
    // setTokenApiOneSignal(OneSignal.getDeviceState());
  }, [])

  const notif = async () => {
    try{
      OneSignal.setAppId("25a467b9-b720-4e57-8ca6-21eda8faf5f5");
      OneSignal.setLogLevel(6, 0);
      OneSignal.setRequiresUserPrivacyConsent(false);
      // dispatch(token_api_one_signal(device['userId']))
      const device = await OneSignal.getDeviceState()
      setTokenApiOneSignal(device['userId'])
      // console.log(device['userId']);
    } catch(e){
      console.log(e);
    }
  }

  const onInputChange = (input, value) => {
    setLogin({
      ...login,
      id_onesignal : TokenApiOneSignal,
      [input]: value,
    });
  };

  const userLogin = () => {
    // setLoading(true)
    Axios.post(Config.API_LOGIN, login,
    {
        headers : {
            'Accept' : 'application/json'
        }
    }).then((res) => {
        dispatch(token_api(res.data.token.token))
        dispatch({type: 'SET_DATA_USER', value: res.data.user});
        console.log('data login', res.data)
        // Alert.alert('Login Success');
        loginBlock('0')
        set_counter_login('0')
        if(Config.OTP == 1){
          navigation.navigate('OTP', {phone:res.data.user.phone})
        }else{
          storeDataToken(res.data.token.token)
          storeDataUser( res.data.user)
          navigation.replace('MainApp');
        }
      setIsLoading(false)
    })
    .catch((err)=> {
      var count = parseInt(counter_login) + 1
      loginBlock(count.toString())
      set_counter_login(count)
      var mes = JSON.parse(err.request._response);
      alert(mes.message)
      console.log(mes)
      if(parseInt(count) >= 3){
        Axios.post(Config.API_USER_BLOCK, {email : login.email},{
          headers : {
              'Accept' : 'application/json'
          }
      })
        .then((res) => {
          loginBlock('0')
          set_counter_login('0')
        })
      }
      setIsLoading(false)
    })
  };
  
  //   // logic salah input password 3 x 
  const loginBlock = async (value) => {
    try {
     var coba =  await AsyncStorage.setItem('@LoginBlock', value)  
    //  console.log('Login block ' + coba) 
    } catch (e) {
      console.log('Counter not Save ')
    }
  }

  const getLoginBlock = async () => {
    try {
      const value = await AsyncStorage.getItem('@LoginBlock')
      if(value == null){
        set_counter_login('0')
      }else{
        set_counter_login(value)
      }
    } catch(e) {
      alert('error reading value')
    }
  }


  
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
          rightComponent={{ text: 'Login', style: { color: '#fff', fontSize : 20 } }}
        />
      <View style={styles.body}>
        {/* <Text style={styles.image}>image</Text> */}
        <View style={styles.boxImage}>
          <Image source={login_image} style={styles.image} />
        </View>
        <Text style={styles.textWelcome}>Welcome !</Text>
        <Text style={styles.textUsername}>Email</Text>
        <TextInput
          style={styles.inputUsername}
          // keyboardType="number-pad"
          // placeholder="Email"
          value = {login.email}
          onChangeText={(value) => onInputChange('email', value)}
        />
        <Text style={styles.textUsername}>Password</Text>
        <TextInput
          style={styles.inputUsername}
          secureTextEntry={toggleCheckBox}
          onChangeText={(value) => onInputChange('password', value)}
        />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <CheckBox
            disabled={false}
            value={toggleCheckBox}
            onValueChange={(value) => setToggleCheckBox(value)}
          />
          <Text>Hide Password</Text>
        </View>
        <TouchableOpacity style={styles.borderLogin}  onPress={() => {setIsLoading(true); userLogin()}}>
          <Text style={styles.textBtnLogin}>LOGIN</Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 60,
            justifyContent: 'center',
          }}>
          <Text style={styles.textDont}>don't have an account ? </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Register');
              // alert(counter_login)
            }}>
            <Text style={styles.textSignUP}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 5,
            justifyContent: 'center',
          }}>
          <Text style={styles.textDont}>forgot your password ? </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Reset');
              // console.log(Config.API_URL)
            }}>
            <Text style={styles.textSignUP}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;

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
  textDont: {
    color: colors.dark,
  },
  textSignUP: {
    color: '#ec524b',
    textDecorationLine: 'underline',
  },
});
