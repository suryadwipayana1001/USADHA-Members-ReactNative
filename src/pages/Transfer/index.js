import React, {useState, useEffect} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View, Modal, TouchableHighlight} from 'react-native';
import {colors} from '../../utils/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';
import Axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import {Rupiah} from '../../helper/Rupiah';
import {ButtonCustom, Header2, Releoder} from '../../component';
import {useIsFocused} from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Config from 'react-native-config';


const Transfer = ({navigation, route}) => {
  const data1 = [
    {
      label: '---',
      value: '---',
      icon: () => <Icon name="user" size={18} color="#900" />,
    },
  ];
  const [isLoading, setIsLoading] = useState(true);
  const [point, setPoint] = useState(0);
  const [member, setMember] = useState([]);
  const userReducer = useSelector((state) => state.UserReducer);
  const TOKEN = useSelector((state) => state.TokenApi);
  const [userTujuan, setUserTujuan] = useState(null);
  const [nominalTransfer, setNominalTransfer] = useState(0);
  const [phone, setPhone] = useState(null)
  const [userSelect, setUserSelect] =  useState(null)
  const isFocused = useIsFocused();
  const [code, setCode] = useState('');
  let isMounted = true
  const [modalVisible, setModalVisible] = useState(false);
  const [codeOTP, setCodeOTP] = useState('');

  useEffect(() => {
      // selectScanMember()
      // setUserSelect(null)
      isMounted = true
      setPhone(null)
      getPoint();
      getMember();
      if(route.params){
        setPhone(route.params.dataScan)
      }
  }, [])

  const dateRegister = () => {
    var todayTime = new Date();
    var month = todayTime.getMonth() + 1;
    var day = todayTime.getDate();
    var year = todayTime.getFullYear();
    return year + "-" + month + "-" + day;
  }
  

    const selectScanMember = () => {
        // setIsLoading(true)
      if(route.params){
          if(route.params.dataScan){
              Axios.post(Config.API_MEMBER_SHOW, {phone : route.params.dataScan},
              {
                headers: {
                  Authorization: `Bearer ${TOKEN}`,
                  'Accept' : 'application/json' ,
                  'content-type': 'application/json'
                }
              }
            ).then((result) => {
              setUserSelect(result.data.data.id)
              setUserTujuan(result.data.data.id)
              setIsLoading(false)
              console.log('id',result.data.data.id)
            }).catch((e) => {
              console.log(e)
              navigation.navigate('MenuScan');
            }) 
          } 
      }else{
        setIsLoading(false)
      }

      return () => { isMounted = false };
    };

  const getPoint = () => {
    Axios.get(Config.API_POINT +`${userReducer.id}`, {
      headers : {
        Authorization: `Bearer ${TOKEN}`,
        'Accept' : 'application/json' 
      }
    })
    .then((result) => {
      // console.log('data point api', result.data)
      setPoint(parseInt(result.data.data[0].balance_points))
      // if(phone ===null){
      //   // console.log('jalan')
      //   setIsLoading(false)
      // }
    });
  }

  const getMember = () => {
    // setUserSelect(null)
    // setIsLoading(true)
    Axios.get(Config.API_MEMBER , {
      headers : {
        Authorization: `Bearer ${TOKEN}`,
        'Accept' : 'application/json' 
      }
    })
    .then((result) => {
      // console.log('data point api', result.data)
      result.data.data.map((data, index) => {
        data1[index] = {
          label: data.name + ' - ' + data.code,
          value: data.id,
          icon: () => <Icon name="user" size={18} color="#900" />,
        };
      });
      setMember(data1);
      selectScanMember()
    });
  } 

  const Transfer = () => {
    setIsLoading(true)
    if(nominalTransfer > 0 && userTujuan !== null){
      var data = {
        register : dateRegister(),
        amount : nominalTransfer,
        from : userReducer.id,
        to : userTujuan
      }
      Axios.post(Config.API_TRANSFER, data,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Accept' : 'application/json' ,
          'content-type': 'application/json'
        }
      }
      ).then((result) => {
        console.log('transefer',result.data)
        // alert('tansfer sukses')
        navigation.navigate('NotifAlert', {notif: 'Transaksi Sukses'})
        setNominalTransfer(0)
        setModalVisible(false)
        setIsLoading(false)
      }).catch((e) => {
        alert('tansfer gagal, jika tetap hubungi admin')
        console.log(e)
        setIsLoading(false)
      })
      console.log(data)
      setIsLoading(false)
    }
  }

  const generateCodeOTP = () => {
    setModalVisible(true)
    var digits = '0123456789'; 
    let OTP = ''; 
    for (let i = 0; i < 5; i++ ) { 
          OTP += digits[Math.floor(Math.random() * 10)]; 
    } 
    setCodeOTP(OTP) 
  }

  useEffect(() => {
    //  send otp
    if(codeOTP !== ''){
          Axios.post(Config.API_NUSA_SMS + `&SMSText=${codeOTP}&GSM=${userReducer.phone.replace(0, "62")}&otp=Y&output=json`) 
          .then((res) => {
                alert('Otp Send via SMS')
                console.log(res)
          }).catch((err)=>{
                console.log('gagal')
          })
    }
  }, [codeOTP])

  const verifyOtp = () => {
    // console.log(route.params.phone)
    // console.log(code)
    console.log(codeOTP)
    if(code === codeOTP){
        Transfer()
    }else{
          alert('OTP SALAH')
    }
  } 

  if (isLoading) {
    return  (
      <Releoder/>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* modal */}
      <Modal 
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
             <TouchableOpacity onPress={() => {setModalVisible(!modalVisible)}}>
              <Icon name='times' size={20}/>
             </TouchableOpacity>
              <View style={{alignItems : 'center'}}>
                <Text style={{fontSize : 20, fontWeight : 'bold'}}>Code OTP</Text>
                <TextInput 
                  placeholder= '****'
                  keyboardType='number-pad'
                  secureTextEntry={true}
                  maxLength ={5}
                  style={{borderWidth : 1, width : '100%', marginTop : 30, borderRadius : 10, borderColor : colors.disable, textAlign : 'center', fontSize : 30}}
                  onChangeText ={(value) => setCode(value)}
                />
                <TouchableHighlight
                  style={{ marginTop : 50, borderWidth : 1, padding : 10, width : '100%', alignItems:'center', justifyContent : 'center', borderRadius : 10, borderColor : colors.btn, backgroundColor : colors.btn}}
                  onPress={() => {
                    verifyOtp()
                  }}
                >
                  <Text style={{color : '#ffffff', fontWeight : 'bold'}}>Submit</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
      </Modal>
      {/* modal */}

      <View style={{alignItems:'center', justifyContent : 'center'}}>
      </View>
      <View style={{flex: 1}}>
        <Header2 title ='Transfer' btn={() => navigation.goBack()}/>
        <View style={{padding: 20}}>
          {/* {console.log('data yang di render', item1)} */}
          <DropDownPicker
            placeholder = 'Select Member'
            searchable={true}
            searchablePlaceholder="Search users"
            searchablePlaceholderTextColor="gray"
            seachableStyle={{}}
            dropDownMaxHeight = '85%'
            searchableError={() => <Text>Not Found</Text>}
            items={
              member
            }
            defaultValue ={userSelect != null ? userSelect : ''}
            containerStyle={{height: 60}}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: colors.disable,
              fontSize: 15,
            }}
            itemStyle={{
              justifyContent: 'flex-start',
            }}
            
            dropDownStyle={{backgroundColor: '#fafafa'}}
            onChangeItem={(item) => setUserTujuan(item.value)}
          />
          <Text style={{marginTop: 40, color: '#bbbbbb'}}>Sumber dana</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              marginTop: 10,
              borderColor: colors.disable,
              padding: 15,
              borderRadius: 10,
            }}>
            <Icon
              name="credit-card"
              size={30}
              color={colors.default}
              style={{marginRight: 20}}
            />
            <View>
              <Text style={{fontWeight: 'bold'}}>Minyak Belog Cash</Text>
              <Text style={{color: colors.dark}}>
                Saldo {Rupiah(point)}
              </Text>
            </View>
          </View>
          <View
            style={{backgroundColor: '#fbf6f0', marginTop: 20, padding: 15}}>
            <Text style={{color: colors.dark}}>Nominal Transfer</Text>
            <TextInput
              placeholder="Rp."
              style={{fontSize: 30}}
              keyboardType="number-pad"
              value={isNaN(nominalTransfer.toString()) ? '0' : nominalTransfer.toString()}
              onChangeText={(value) => setNominalTransfer(parseInt(value))}
            />
          </View>
          <Text style={{color: colors.dark, marginTop: 40}}>
            Pesan (opsional)
          </Text>
        </View>
      </View>
      <View
        //  style={{display: display}}
        style={{
          backgroundColor: '#ffffff',
          height: 55,
          // borderWidth: 1,
          // borderColor: colors.disable,
          alignItems: 'center',
          justifyContent: 'center',
          // color : nominalTransfer
        }}>
        {isNaN(nominalTransfer.toString()) ? setNominalTransfer(0) : (nominalTransfer != 0 && userTujuan !==null ? (
         nominalTransfer <= point ? (
          <ButtonCustom
            name='Transfer'
            width= '85%'
            color= {colors.btn}
            // func = {() => {generateCodeOTP(); setModalVisible(true)}}
            func = {() => Alert.alert(
              'Peringatan',
              `Anda akan melakukan Transfer ? `,
              [
                  {
                      text : 'Tidak',
                      onPress : () => console.log('tidak')
                  },
                  {
                      text : 'Ya',
                      onPress : () => {Config.OTP ==1 ? generateCodeOTP() : Transfer() }
                  }
              ]
            )}
          />
          ):(
            <ButtonCustom
              name='Trasnfer'
              width= '85%'
              color= {colors.disable}
              func = {() => alert('Poin Anda Kurang ')}
            />
          )
        ) : (
          <ButtonCustom
            name='Trasnfer'
            width= '85%'
            color= {colors.disable}
            func = {() => alert('Data belum Lengkap')}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Transfer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    backgroundColor: colors.default,
    alignItems: 'center',
  },
  btnBack: {
    marginRight: 10,
  },
  textTopUp: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  textTambahKartu: {
    marginTop: 10,
    color: colors.dark,
  },
  modalView: {
    marginHorizontal: 20,
    backgroundColor: "white",
    height : 300,
    marginTop : '60%',
    borderRadius: 20,
    padding: 35,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  btnTransfer :{
    borderWidth: 1,
    borderRadius: 10,
    height : 45,
    alignItems : 'center',
    justifyContent : 'center',
    backgroundColor: colors.default,
    borderColor: colors.default,
    paddingHorizontal: 100,
    paddingVertical: 5,
    width : 350
  },
  btnTransfer1:{
    borderWidth: 1,
    borderRadius: 10,
    height : 45,
    alignItems : 'center',
    justifyContent : 'center',
    backgroundColor: colors.disable,
    borderColor: colors.disable,
    paddingHorizontal: 100,
    paddingVertical: 5,
    width : 350
  }
});
