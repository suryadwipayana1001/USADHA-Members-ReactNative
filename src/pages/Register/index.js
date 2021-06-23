import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Image, Alert} from 'react-native';
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import {login_image, productImage2} from '../../assets';
import {colors} from '../../utils/colors';
import CheckBox from '@react-native-community/checkbox';
import {useDispatch} from 'react-redux';
import Axios from 'axios';
import { token_api } from '../../redux';
import Releoder from '../../component/Releoder';
import { Header } from "react-native-elements";
import Config from 'react-native-config';

const Input = ({title, ...rest}) => {
  return (
    <View>
      <Text style={styles.textUsername}>{title}</Text>
      <TextInput style={styles.inputUsername} {...rest} />
    </View>
  );
};

// insert tgl register
const dateRegister = () => {
  var todayTime = new Date();
  var month = todayTime.getMonth() + 1;
  var day = todayTime.getDate();
  var year = todayTime.getFullYear();

  return year + "-" + month + "-" + day;
}

const Register = ({navigation, btnAktif}) => {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  //data
  const [form, setForm] = useState({
    register: dateRegister(),
    password: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    type: 'member',
    status: 'active',
  });
  const [display, setDisplay] = useState('flex');
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false)

  const onInputChange = (input, value) => {
    setForm({
      ...form,
      [input]: value,
    });
  };

  const tampil = () => {
    console.log(form);
  };

  var btnAktif = {
    borderWidth: 1,
    alignItems: 'center',
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: colors.default,
    borderColor: colors.default,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    // marginTop :  15
  };

  var btnDisabled = {
    borderWidth: 1,
    alignItems: 'center',
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: colors.disable,
    borderColor: colors.disable,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    // marginTop :  15
  };

  const sendData = () => {
    setIsLoading(true)
    if (toggleCheckBox) {
      if (form.password === form.confirmPassword) {
        Axios.post(Config.API_REGISTER, form,
          {
            headers : {
              'Accept' : 'application/json'
            }
          }
        )
        .then((res) => {
          if(res.data.success){
            Axios.post(Config.API_LOGIN, {email : form.email, password : form.password},
            {
                headers : {
                    'Accept' : 'application/json'
                }
            }).then((res) => {
              if(res.data.success){
                Alert.alert('Terimakasih Sudah Register');
                // console.log(res)
                dispatch(token_api(res.data.token.token))
                dispatch({type: 'SET_DATA_USER', value: res.data.user});
                navigation.navigate('MainApp');
              }
            })
            .catch((err)=> {
              console.log(err)
              setIsLoading(false)
              alert('register gagal mohon coba kembali')
            })
          }else{
            alert('data yang ada masukan ada salah')
          }
          setIsLoading(false)
        }).catch((error) => {
          var mes = JSON.parse(error.request._response);
          alert(mes.message)
          setIsLoading(false)
        })
      } else {
        Alert.alert('password anda tidak sama');
        setIsLoading(false)
      }
    } else {
      Alert.alert('Mohon setujui ketentuan syarat kami');
      setIsLoading(false)
    }
  };

  if (isLoading) {
    return  (
      <Releoder/>
    )
  }

  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
      <Header
          containerStyle={{height:140, paddingHorizontal : 15, alignItems : 'center', justifyContent : 'center', borderBottomColor : colors.btn}}
          backgroundColor={colors.btn}
          placement="left"
          leftComponent={{ text: 'Usadha Bhakti', style: { color: '#fff', fontWeight : 'bold', fontSize : 20 } }}
          rightComponent={{ text: 'Register', style: { color: '#fff', fontSize : 20 } }}
        />
        <View style={styles.body}>
          {/* <Text style={styles.image}>image</Text> */}
          <View style={styles.boxImage}>
            <Image source={login_image} style={styles.image} />
          </View>
          <Text style={styles.textWelcome}>Welcome !</Text>
          <ScrollView>
            <Input
              title="Password"
              secureTextEntry={true}
              value={form.password}
              onChangeText={(value) => onInputChange('password', value)}
              onFocus={() => setDisplay('none')}
              onBlur={() => setDisplay('flex')}
            />
            <Input
              title="Confirm Password"
              secureTextEntry={true}
              value={form.confirmPassword}
              onChangeText={(value) => onInputChange('confirmPassword', value)}
              onFocus={() => setDisplay('none')}
              onBlur={() => setDisplay('flex')}
            />
            <Input
              title="Name"
              value={form.name}
              onChangeText={(value) => onInputChange('name', value)}
              onFocus={() => setDisplay('none')}
              onBlur={() => setDisplay('flex')}
            />
            <Input
              title="Phone Number"
              keyboardType="numeric"
              value={form.phone}
              onChangeText={(value) => onInputChange('phone', value)}
              onFocus={() => setDisplay('none')}
              onBlur={() => setDisplay('flex')}
            />
            <Input
              title="Email"
              keyboardType="email-address"
              value={form.email}
              onChangeText={(value) => onInputChange('email', value)}
              onFocus={() => setDisplay('none')}
              onBlur={() => setDisplay('flex')}
            />
            <Input
              title="Adrres  "
              multiline={true}
              // numberOfLines={4}
              value={form.address}
              onChangeText={(value) => onInputChange('address', value)}
              onFocus={() => setDisplay('none')}
              onBlur={() => setDisplay('flex')}
            />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <CheckBox
                disabled={false}
                value={toggleCheckBox}
                onValueChange={(value) => setToggleCheckBox(value)}
              />
              <Text>Setuju dengan Syarat dan Ketentuan Kami </Text>
            </View>
          </ScrollView>
        </View>
      </View>

      <View style={{display: display}}>
        <View
          style={{
            backgroundColor: '#ffffff',
            height: 100,
            paddingHorizontal: 20,
          }}>
          <TouchableOpacity
            style={!toggleCheckBox ? btnDisabled : btnAktif}
            onPress={sendData}>
            <Text style={styles.textBtnLogin}>Sign Up</Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              justifyContent: 'center',
            }}>
            <Text style={styles.textDont}>have an account ? </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Login');
                // console.log(form)
              }}>
              <Text style={styles.textSignUP}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff781f',
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
    color: 'white',
  },
  textLogin: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  body: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    paddingHorizontal: 20,
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
    backgroundColor: '#ff781f',
    borderColor: '#ff781f',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    // marginTop :  15
  },
  textBtnLogin: {
    color: '#ffffff',
    fontSize: 18,
  },
  textDont: {
    color: colors.dark,
  },
  textSignUP: {
    color: colors.default,
    textDecorationLine: 'underline',
  },
});
