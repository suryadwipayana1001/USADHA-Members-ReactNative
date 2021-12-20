import { useIsFocused } from '@react-navigation/native';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Config from 'react-native-config';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { ButtonCustom, Header2, Releoder } from '../../component';
import { Input } from '../../component/Input';
import { colors } from '../../utils/colors';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

var colorbtn = colors.disable
const Jaringan = ({ navigation }) => {
  const TOKEN = useSelector((state) => state.TokenApi);
  const userReducer = useSelector((state) => state.UserReducer);
  const [loading, setLoading] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const isFocused = useIsFocused()
  const [member, setMember] = useState([]);
  const dateRegister = () => {
    var todayTime = new Date();
    var month = todayTime.getMonth() + 1;
    var day = todayTime.getDate();
    var year = todayTime.getFullYear();
    return year + "-" + month + "-" + day;
  }

  const [form, setForm] = useState({
    register: dateRegister(),
    password: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    ref_id: userReducer.id,
    sponsor_id: userReducer.id,
    package_id: '',
    agents_id: '',
    agent: null,
    weight: 0
  })

  const onInputChange = (input, value) => {
    setForm({
      ...form,
      [input]: value,
    });
  };


  if (form.address != '' && form.name != '' && form.phone != '' && confirm != '' && form.password != '' && form.email != '') {
    colorbtn = colors.btn
  }

  useEffect(() => {
    if (isFocused) {
      Promise.all([getMember()]).then(res => {
      }).catch(e => {
        setLoading(false)
      })
    }
  }, [isFocused])


  const getMember = () => {
    // setUserSelect(null)
    setLoading(true)
    Axios.get(Config.API_MEMBER_TREE + '?ref_id=' + userReducer.id, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Accept': 'application/json'
      }
    })
      .then((result) => {
        // console.log('data point api', result.data)
        let data1 = [];
        result.data.data.map((data, index) => {
          data1[index] = {
            label: data.name + ' - ' + data.code,
            value: data.id,
            icon: () => <Icon name="user" size={18} color="#900" />,
          };
        });
        setMember(data1);
        console.log('data point api', data1)
        setLoading(false);
      }).catch((error) => {
        console.log('error' + error);
        setLoading(false);
      });
  }

  if (loading) {
    return (
      <Releoder />
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header2 title='Downline' btn={() => navigation.goBack()} />
      <ScrollView>
        <View style={styles.form}>
          <View style={{ marginBottom: 70 }}>
            <Text style={styles.textTitle}>Pendaftaran Downline</Text>
            {/* <View style={styles.login}>
                    <Text style={styles.textLogin}> ayo buruan gabung </Text>
                  </View> */}
            <DropDownPicker
              placeholder='Select Referal/Sponsor'
              searchable={true}
              searchablePlaceholder="Search referal"
              searchablePlaceholderTextColor="gray"
              seachableStyle={{}}
              dropDownMaxHeight='85%'
              searchableError={() => <Text>Not Found</Text>}
              items={
                member
              }
              defaultValue=''
              containerStyle={{ height: 60 }}
              style={{
                borderBottomWidth: 1,
                borderBottomColor: colors.disable,
                fontSize: 15,
              }}
              itemStyle={{
                justifyContent: 'flex-start',
              }}

              dropDownStyle={{ backgroundColor: '#fafafa' }}
              onChangeItem={(item) => onInputChange('ref_id', item.value)}
            />

            <Input
              placeholder='Password'
              title="Password"
              secureTextEntry={true}
              value={form.password}
              onChangeText={(value) => onInputChange('password', value)}
            />
            <Input
              placeholder='Confirm Password'
              title="Confirm Password"
              secureTextEntry={true}
              value={form.confirmPassword}
              onChangeText={(value) => setConfirm(value)}
            />
            <Input
              placeholder='Name'
              title="Name"
              value={form.name}
              onChangeText={(value) => onInputChange('name', value)}
            />
            <Input
              placeholder='Phone Number'
              title="Phone Number"
              keyboardType="numeric"
              value={form.phone}
              onChangeText={(value) => onInputChange('phone', value)}
            />
            <Input
              placeholder='Email'
              title="Email"
              keyboardType="email-address"
              value={form.email}
              onChangeText={(value) => onInputChange('email', value)}
            />
            <Input
              placeholder='Address'
              title="Adrres"
              multiline={true}
              // numberOfLines={4}
              value={form.address}
              onChangeText={(value) => onInputChange('address', value)}
            />
            <View style={{ marginTop: 20, alignItems: 'center', justifyContent: 'center' }}>
              {form.address != '' && form.name != '' && form.phone != '' && confirm != '' && form.password != '' && form.email != '' ?
                form.password == confirm ? (
                  <ButtonCustom
                    name='Selanjutnya'
                    width='100%'
                    color={colors.btn}
                    func={() => navigation.navigate('Package', {dataForm: form, dataType : 'Jaringan'})}
                  />
                ) : (
                  <ButtonCustom
                    name='Selanjutnya'
                    width='100%'
                    color={colors.btn}
                    func={() => alert('Password tidak sama')}
                  />
                )
                : (
                  <ButtonCustom
                    name='Selanjutnya'
                    width='100%'
                    color={colors.disable}
                    func={() => alert('Mohon lengkapi data anda')}
                  />
                )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView  >
  );
};

export default Jaringan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'column',
    backgroundColor: '#ffffff',
    paddingBottom: 10,
  },
  form: {
    paddingHorizontal: 30,
    marginTop: 25,
  },
  textTitle: {
    textAlign: 'center',
    fontSize: 25,
    marginBottom: 10,
  },
  login: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'center',
  },
  textLogin: {
    letterSpacing: 2,
    color: colors.dark,
  },
  textMasuk: {
    color: colors.default,
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  titlelabel: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  selectPicker: {
    marginVertical: 10,
  },
  pickerBorder: {
    borderBottomWidth: 1,
    borderColor: colors.default,
    marginVertical: 20,
  },
  containerPicker: {
    marginHorizontal: 30,
  },
  textBank: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  textInput: {
    borderBottomWidth: 1,
    paddingVertical: 15,
    borderColor: colors.default,
  },
  containerInput: {
    marginBottom: 20,
  },
  titlelabel: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  box: {
    marginBottom: 10
  },
  agen: {
    padding: 20,
    marginBottom: 10,
    borderWidth: 3,
    // borderColor : colors.disable,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 0,
  },
  pilihPaket: {
    marginBottom: 5
  },
  borderLogin: {
    borderWidth: 1,
    alignItems: 'center',
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: colors.btn,
    borderColor: colors.btn,
    shadowColor: '#000',
  },
  borderLogin1: {
    borderWidth: 1,
    alignItems: 'center',
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: colors.btn,
    borderColor: colors.btn,
    shadowColor: '#000',
  },
  textBtnLogin: {
    color: '#ffffff',
    fontSize: 18,
  },
  header: {
    backgroundColor: colors.default,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  textHeader: {
    fontSize: 20,
    color: '#39311d',
    fontWeight: 'bold',
    marginLeft: 20,
    color: '#ffffff'
  },
  bell: {
    fontSize: 20,
    color: 'white',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
