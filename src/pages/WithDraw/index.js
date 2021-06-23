import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, TouchableHighlight } from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import {ButtonCustom, Header, Header2, HeaderComponent, Releoder} from '../../component';
import { colors } from '../../utils/colors';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Rupiah} from '../../helper/Rupiah';
import { useSelector} from 'react-redux';
import Axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert } from 'react-native';
import Config from 'react-native-config';

const NominalData = [
      { id: 1, nominal: 200000}, {id: 2, nominal: 300000}, {id: 3, nominal: 500000}
];

const ItemNominal = ({item, onPress, style}) => (
      <TouchableOpacity onPress={onPress} style={[styles.btnNominal, style]}>
            <Text style={styles.titlenominal}>{Rupiah(item.nominal)}</Text>
      </TouchableOpacity>
);

const ItemBank = ({item, onPress, style}) => (
      <TouchableOpacity style={[styles.btnTambahBank, style]} onPress={onPress}>
            <Icon name="credit-card" color={colors.default} size={20} />
            <Text style={styles.textTambahKartu}>
            {item.name} 
            </Text>
      </TouchableOpacity>
);

const WithDraw = ({navigation}) => {

      const [bank, setBank] = useState('')
      const [rekening, setRekening] = useState('')
      const [selectedId, setSelectedId] = useState(null);
      const [selectedBank, setSelectedBank] = useState(null);
      var borderColor = '#fbf6f0';
      const [nominal, setNominal] = useState(0);
      const userReducer = useSelector((state) => state.UserReducer);
      const [point, setPoint] = useState(0)
      const TOKEN = useSelector((state) => state.TokenApi);
      const [isLoading, setIsLoading] = useState(true)
      const [modalVisible, setModalVisible] = useState(false);
      const [codeOTP, setCodeOTP] = useState('');
      const [code, setCode] = useState('');
      const [listBank, setListBank] = useState([
            {
                  id : 1,
                  name : 'Bank BRI',
                  value : 'BRI'
            },
            {
                  id : 2,
                  name : 'Bank BCA',
                  value : 'BCA'
            }
      ])

      const renderItem = ({item}) => {
            borderColor = item.id === selectedId ? '#ff781f' : '#fbf6f0';
            if (item.nominal !== nominal) {
              borderColor = '#fbf6f0';
            }
            return (
              <ItemNominal
                item={item}
                onPress={() => {
                  setSelectedId(item.id);
                  setValueNominal(item.nominal);
                }}
                style={{borderColor}}
              />
            );
      };


      const renderListBank = ({item}) => {
          borderColor = item.id === selectedBank ? '#ff781f' : '#fbf6f0';
      
             return (
                  <ItemBank
                        item={item}
                        onPress={() => {
                        setSelectedBank(item.id);
                        // setTypeTransfer(item);
                        }}
                        style={{borderColor}}
                  />
            );
        };
      

      const setValueNominal = (value) => {
            setNominal(value);
      };

      const dateRegister = () => {
            var todayTime = new Date();
            var month = todayTime.getMonth() + 1;
            var day = todayTime.getDate();
            var year = todayTime.getFullYear();
            return year + "-" + month + "-" + day;
      }

      let dataWithDraw = {
            register : dateRegister(),
            customers_id : userReducer.id,
            amount : nominal,
            bank_name : selectedBank,
            bank_acc_no : rekening
      }
        
      const actionWithDraw = () => {
            // if(nominal <= )
            setIsLoading(true)
            Axios.post(Config.API_WITHDRAW, dataWithDraw,
                  {
                        headers: {
                              Authorization: `Bearer ${TOKEN}`,
                              'Accept' : 'application/json' 
                        }
                  }
            ).then((res) => {
                  console.log(res.data.message)
                  // alert(res.data.message)
                  navigation.navigate('NotifAlert', {notif : res.data.message})
                  setModalVisible(false)
                  setIsLoading(false)
            }).catch((e) => {
                  var mes = JSON.parse(e.request._response);
                  alert(mes.message)
                  setIsLoading(false)
            })
      }


      const getPoint = () => {
            Axios.get(Config.API_POINT + `${userReducer.id}`, {
                  headers : {
                    Authorization: `Bearer ${TOKEN}`,
                    'Accept' : 'application/json' 
                  }
            })
            .then((result) => {
                  // console.log('data point api', result.data.data[0].balance_points)
                  setPoint(parseInt(result.data.data[0].balance_points))
                  setIsLoading(false)
                  // setIsLoading(false)
            });
      }

      useEffect(() => {
            getPoint()
      }, [])


      const generateCodeOTP = () => {
            setModalVisible(true)
            var digits = '0123456789'; 
            let OTP = ''; 
            for (let i = 0; i <5; i++ ) { 
                  OTP += digits[Math.floor(Math.random() * 10)]; 
            } 
            setCodeOTP(OTP) 

            // console.log(OTP)
      }
        
      useEffect(() => {
      //  send otp
      if(codeOTP !== ''){
            Axios.post(Config.API_NUSA_SMS + `&SMSText=${codeOTP}&GSM=${userReducer.phone.replace(0, "62")}&otp=Y&output=json`) 
            .then((res) => {
                  alert('Otp Send via SMS')
                  // console.log(res)
            }).catch((err)=>{
                  console.log('gagal')
            })
            console.log(codeOTP)
      }
      }, [codeOTP])
        
      const verifyOtp = () => {
            // console.log(route.params.phone)
            // console.log(code)
            console.log(codeOTP)
            if(code === codeOTP){
                actionWithDraw()
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
            <SafeAreaView style={{backgroundColor : 'white', flex : 1}}>
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
                                          verifyOtp();
                                          setModalVisible(false)
                                          }}
                                    >
                                          <Text style={{color : '#ffffff', fontWeight : 'bold'}}>Submit</Text>
                                    </TouchableHighlight>
                              </View>
                        </View>
                  </View>
            </Modal>
                  <Header2 title ='Withdraw' btn={() => navigation.goBack()}/>
                  <View style={{flex : 1}}>
                        <FlatList
                              style={{width: '100%', paddingHorizontal : 20}}
                              nestedScrollEnabled
                              data={['filter', 'title1', 'list1', 'title2', 'list2']}
                              keyExtractor={(data) => data}
                              renderItem={({item, index}) => {
                                    switch (index) {
                                    case 0:
                                    return (
                                          <View style={styles.infoTopUp}>
                                                <View style={styles.boxPilihBank}>
                                                      <Text style={styles.txtPilihBank}>No Rek</Text>
                                                      <TextInput 
                                                            style={styles.inputRek}
                                                            placeholder = '*****************************'
                                                            value = {rekening}
                                                            keyboardType='number-pad'
                                                            onChangeText = {(item) => setRekening (item)}
                                                      />
                                                </View>
                                          </View>
                                    );
                                    case 1 : 
                                    return (
                                    <View style={styles.infoTopUp}>
                                          <Text style={styles.txtNominal}>Pilih Nominal Withdraw</Text>

                                          <View style={styles.boxBtnTambahKartuAtm}>
                                                <FlatList
                                                      data={NominalData}
                                                      renderItem={renderItem}
                                                      keyExtractor={(item) => item.id}
                                                      extraData={selectedId}
                                                      numColumns={3}
                                                      contentContainerStyle={{
                                                      flexGrow: 1,
                                                      alignItems: 'center',
                                                      }}
                                                />
                                          </View>
                                          <Text style={styles.textAtauMasukanNominal}> Atau masukkan nominal top up di sini </Text>
                                          <TextInput
                                                // onFocus={() => setDisplay('none')}
                                                // onBlur={() => setDisplay('flex')}
                                                placeholder="Rp."
                                                keyboardType="number-pad"
                                                style={styles.textInputNominal}
                                                value={isNaN(nominal.toString()) ? '0' : nominal.toString()}
                                                onChangeText={(value) => {
                                                      setNominal(parseInt(value));
                                                }}
                                          />
                                    </View>
                                    );
                                    case 2: 
                                    return (
                                          <View style={styles.contentTransfer}>
                                                <Text style={styles.textTransferBank}>Transfer Bank</Text>
                                                <View style={styles.boxBtnTambahKartuAtm}>
                                                <FlatList
                                                      data={listBank}
                                                      renderItem={renderListBank}
                                                      keyExtractor={(item) => item.id}
                                                      extraData={selectedBank}
                                                      numColumns={2}
                                                      contentContainerStyle={{
                                                      flexGrow: 1,
                                                      alignItems: 'center',
                                                      }}
                                                />
                                                </View>
                                          </View>
                                    );
                                    default:
                                    return null;
                                    }
                              }}
                        />
                  </View>
                  <View style={{height : 60, paddingHorizontal : 20}}>
                        <View style={styles.footer}>
                              {nominal != 0 && selectedBank != null && rekening !=''? (
                                    nominal <= point ? (
                                          // <TouchableOpacity style={[styles.btnWithDraw]} onPress={() => {generateCodeOTP(); setModalVisible(true)}}>
                                          //       <Text style={styles.txtBtnDraw}>With Draw Now</Text>
                                          // </TouchableOpacity>
                                          <ButtonCustom
                                                name = 'Withdraw Now'
                                                width = '100%'
                                                color = {colors.btn}
                                                func = {() => Alert.alert(
                                                      'Peringatan',
                                                      `Witdraw sekarang ? `,
                                                      [
                                                            {
                                                                  text : 'Tidak',
                                                                  onPress : () => console.log('tidak')
                                                            },
                                                            {
                                                                  text : 'Ya',
                                                                  onPress : () => {Config.OTP == 1 ? generateCodeOTP() : actionWithDraw()}
                                                                  // onPress :() => actionWithDraw()
                                                            }
                                                      ]
                                                )}
                                          />
                                    ):(
                                          <ButtonCustom
                                                name = 'Withdraw'
                                                width ='100%'
                                                color= {colors.disable}
                                                func ={() => {alert('Poin Anda Kurang')}}
                                          />
                                    )
                              ) : (
                                    <ButtonCustom
                                          name = 'Withdraw'
                                          width ='100%'
                                          color= {colors.disable}
                                          func ={() => {alert('Data Anda Tidak Lengkap')}}
                                    />
                              )}
                        </View>
                  </View>
            </SafeAreaView>
      )
}

export default WithDraw

const styles = StyleSheet.create({
      container : {
            flex: 1,
            backgroundColor:'#ffffff'
      },
      content : {
            padding : 20
      },
      title : {
            fontFamily : 'Roboto',
            textAlign : 'center',
            fontSize : 25,
            borderBottomColor : colors.dark,
            fontWeight : 'bold'
      },
      titlenominal : {
            fontFamily : 'Roboto',
            textAlign : 'center',
            fontSize : 15,
            borderBottomColor : colors.dark,
            // borderBottomWidth : 1
      },
      boxPilihBank : {
            flexDirection :'row',
            alignItems : 'center',
            marginTop : 20,
            // justifyContent : 'space-between'
      },
      txtPilihBank : {
            marginRight : 20,
            fontSize : 15
      },
      inputRek : {
            marginLeft : 15,
            width : 250,
            borderBottomWidth : 1,
            borderRadius : 5,
            height : 40,
            letterSpacing : 1,
            backgroundColor : '#ffffff',
            fontSize : 16
      },
      txtNominal : {
            marginTop : 20,
            fontSize : 20,
            marginBottom : 10
      },
      boxBtnTambahKartuAtm: {
            flexDirection: 'row',
            justifyContent: 'space-between',
      },
      btnNominal: {
            borderWidth: 2,
            padding: 10,
            borderRadius: 50,
            borderColor: '#fbf6f0',
            marginHorizontal: 5,
      },
      contentNominalTopUp: {
            backgroundColor: '#ffffff',
            marginTop: 10,
            padding: 20,
      },
      textAtauMasukanNominal: {
            marginTop: 10,
            color: colors.dark,
      },
      textInputNominal: {
            borderWidth: 1,
            borderRadius: 10,
            backgroundColor: '#fbf6f0',
            borderColor: '#fbf6f0',
            marginBottom: 10,
            padding: 10,
      },
      btnWithDraw : {
            borderWidth : 1,
            padding: 10,
            borderRadius : 10,
            width : 250,
            alignItems : 'center',
            backgroundColor : '#ff781f',
            borderColor : '#ff781f',
            shadowColor: "#000",
            shadowOffset: {
                  width: 0,
                  height: 1,
            },
            shadowOpacity: 0.18,
            shadowRadius: 1.00,

            elevation: 1,
            width : 350,
            height : 45
      },
      footer : {
            alignItems : 'center',
      },
       txtBtnDraw : {
            color : '#ffffff',
            fontWeight : 'bold',
            fontSize : 18
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
      btnTambahBank: {
            alignItems: 'center',
            borderWidth: 2,
            paddingVertical: 30,
            borderRadius: 10,
            paddingHorizontal: 25,
            borderColor: colors.default,
            backgroundColor: '#fbf6f0',
            marginVertical: 12,
            marginHorizontal: 10,
            width: 160,
      // textAlign : 'center'
      // alignItems : 'center'
      },
      textTambahKartu: {
            marginTop: 10,
            color: colors.dark,
            textAlign: 'center',
      },
})
