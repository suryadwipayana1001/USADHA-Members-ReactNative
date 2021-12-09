import { useIsFocused } from '@react-navigation/native';
import Axios from 'axios';
import { getDistance } from 'geolib';
import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { Alert, Image, PermissionsAndroid, StyleSheet, Text, View } from 'react-native';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import Config from 'react-native-config';
import { FlatList, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import MapView, { Callout, Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { profile } from '../../assets';
import { ButtonCustom, Header2, Releoder } from '../../component';
import { Input } from '../../component/Input';
import { Rupiah } from '../../helper/Rupiah';
import { colors } from '../../utils/colors';
import DropDownPicker from 'react-native-dropdown-picker';
import Geolocation from 'react-native-geolocation-service';

const ItemPaket = ({ item, onPress, style }) => (
  <View style={{marginBottom : 10}}>
     <TouchableOpacity onPress={onPress} style={[styles.item, style,  styles.agen]}>
       <Text style={styles.textName}>{item.name}</Text>
         <View style={{flexDirection : 'row', alignItems:'center'}}>
           <Image source={{uri: Config.BASE_URL + `${item.img}`}} style={{width : 80, height: 80, borderWidth:1, marginRight:20, marginBottom : 10}}/>
           {/* <Image style={{width : 80, height: 80, borderWidth:1, marginRight:20, marginBottom : 10}} source={profile}></Image> */}
           <View style={{justifyContent : 'center', width : '65%'}}>
            <Text>{item.description}</Text>
            <Text style={{fontSize : 15, marginTop :5, fontWeight:'bold'}}> {Rupiah(parseInt(item.price))}</Text>
           </View>
         </View>
     </TouchableOpacity>
  </View>
);
const ItemAgen = ({ item, onPress, style }) => (
  <View style={{marginBottom : 10}}>
     <TouchableOpacity onPress={onPress} style={[styles.item, style,  styles.agen]}>
       <Text style={styles.textName}>{item.name}</Text>
         <View style={{flexDirection : 'row', alignItems:'center'}}>
           <Image source={profile} style={{width : 80, height: 80, borderWidth:1, marginRight:20, marginBottom : 10}}/>
           {/* <Image style={{width : 80, height: 80, borderWidth:1, marginRight:20, marginBottom : 10}} source={profile}></Image> */}
           <View style={{width:'70%', marginLeft : 5}}>
              <Text style={{fontWeight :'bold'}}>Email</Text>
              <Text> {item.email}</Text>
              <Text style={{fontWeight :'bold'}}>No.Hp</Text>
              <Text> {item.phone}</Text>
              <Text style={{fontWeight :'bold'}}>Alamat</Text>
              <Text> {item.address}</Text>
            </View>
         </View>
     </TouchableOpacity>
  </View>
);

var colorbtn = colors.disable
const Jaringan = ({navigation}) => {
  const TOKEN = useSelector((state) => state.TokenApi);
  const userReducer = useSelector((state) => state.UserReducer);
  const [item1, setItem1] = useState(null);
  const [selectPaket, setSelectPaket] = useState(false)
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [point, setPoint] = useState(0)
  const [harga, setHarga] = useState(0)
  const isFocused = useIsFocused()
  const [agen, setAgen] = useState(null);
  const [enableLocation, setEnableLocation] = useState()
  const [selectAgen,setSelectAgen] = useState(false)
  const { width, height } = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 1.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const LATITUDE = -8.3978769;
  const LONGITUDE = 115.2141418;
  const [selectAgenLocation, setSelectAgenLocation] = useState(null)
    var location= {
      latitude: 0.0000000,
      longitude: 0.0000000
  }
  const [member, setMember] = useState([]);
  
  const dateRegister = () => {
    var todayTime = new Date();
    var month = todayTime.getMonth() + 1;
    var day = todayTime.getDate();
    var year = todayTime.getFullYear();
    return year + "-" + month + "-" + day;
  }

  const [form , setForm] = useState({
    register : dateRegister(),
    password : '',
    name : '',
    phone : '',
    email : '',
    address : '',
    ref_id : userReducer.id,
    package_id : '',
    agents_id : '',
    agent : null,
    weight : 0
  })

  const onInputChange = (input, value) => {
    setForm({
      ...form,
      [input]: value,
    });
  };

  
  if(form.address != '' && form.name != '' && form.phone != '' && confirm !='' && form.password != '' && form.email !=''){
    colorbtn = colors.btn
  }

  useEffect(() => {
    // setUserSelect(null)
    setLoading(true)
    Axios.get(Config.API_MEMBER_TREE + '?ref_id=169'  , {
      headers : {
        Authorization: `Bearer ${TOKEN}`,
        'Accept' : 'application/json' 
      }
    })
    .then((result) => {
      // console.log('data point api', result.data)
     
      // setMember(data1);
      console.log('data point api', data1)
      setLoading(false);    
    }).catch((error) => {
      console.log('error qui' + JSON.stringify(error));
      setLoading(false);
    });
  }, [])

  //  useEffect(() => {
  //   if(isFocused){                  
  //     LocationServicesDialogBox.checkLocationServicesIsEnabled({
  //         message: "<h2 style='color: #0af13e'>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
  //         ok: "YES",
  //         cancel: "NO",
  //     }).then(success => {
  //       Promise.all([apiAgents(), requestLocationPermission(), getPaket(), getPoint(), getMember()]).then(res => {
  //         console.log('memberr',member)  
  //         let dataAgen=res[0]
  //           setAgen(res[0])
            
  //           // console.log('1', res[0]);
  //           Geolocation.getCurrentPosition( 
  //               (position) => {
  //                 location.latitude = position.coords.latitude;
  //                 location.longitude = position.coords.longitude;
  //             // setLoading(false) 
  //                 // console.log('2');
  //                 let arrayAgen = [];
  //                 dataAgen.map((item, index) => {
  //                     var distance = getDistance(
  //                     {latitude: position.coords.latitude, longitude:  position.coords.longitude},
  //                     {latitude: parseFloat(item.lat), longitude: parseFloat(item.lng)},
  //                     );
  //                     arrayAgen.push(item)
  //                     arrayAgen[index].distance = distance
  //                 })
  //                   setAgen(arrayAgen.sort(function (a, b) {
  //                     return a.distance - b.distance;
  //                   }))
  //                   setLoading(false)
  //             },
  //             (error) => {
  //                 // console.log('3');    
  //                 setLoading(false)
  //             },
  //             { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000 },
  //             );
  //         }).catch(e => {
  //           // console.log('4', e);
  //           setLoading(false)
  //         })
  //     }).catch(e => {
  //       console.log(e.message);
  //       apiAgents().then(item => {
  //         // console.log('5');
  //         setAgen(item)
  //         setLoading(false)
  //       }).catch(e => {
  //         // console.log('6');
  //         setLoading(false)
  //       })
  //     })
    
  //   }
  // }, [isFocused])

  const getPaket = () => {
    Axios.get(Config.API_PACKAGES_MEMBER, 
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Accept' : 'application/json' 
        }
      }
    ).then((result) => {
      // console.log('result : ', result.data);
      setItem1(result.data.data)
      setLoading(false);
    }).catch((error) => {
      console.log('error ' + error);
    });
  }

  const apiAgents = () => {
      // console.log('root path',RootPath);
      const promise = new Promise ((resolve, reject) => {
        Axios.get(Config.API_AGENTS, 
          {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
              'Accept' : 'application/json' 
            }
          }).then((result) => {
                  resolve(result.data);
          }, (err) => {
                reject(err);
          })
      })
      return promise;
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
    });
  }
  const getMember = () => {
    // setUserSelect(null)
    setLoading(true)
    Axios.get(Config.API_MEMBER_TREE + '?ref_id=169'  , {
      headers : {
        Authorization: `Bearer ${TOKEN}`,
        'Accept' : 'application/json' 
      }
    })
    .then((result) => {
      // console.log('data point api', result.data)
      let data1
      result.data.map((data, index) => {
        data1[index] = {
          label: data.name + ' - ' + data.id,
          value: data.id,
          icon: () => <Icon name="user" size={18} color="#900" />,
        };
      });
      // setMember(data1);
      console.log('data point api', data1)
      setLoading(false);    
    }).catch((error) => {
      console.log('error ' + error.response);
      setLoading(false);
    });
  } 
  
  const renderItem = ({ item }) => {
    const borderColor = item.id === selectedId ? "#ff7b54" : colors.disable;

    return (
      <ItemPaket
        item={item}
        // onPress={() => {setSelectedId(item.id);setPaket(item);}}
        // onPress ={() => {onInputChange('package_id', item.id); setSelectedId(item.id); setHarga(parseInt(item.price))}}
        onPress ={() => {setForm({...form, package_id : item.id, weight : parseFloat(item.weight)}); setSelectedId(item.id); setHarga(parseInt(item.price))}}
        style={{ borderColor }}
      />
    );
  };
  
  const renderItemAgen = ({ item }) => {
    const borderColor = item.id == selectedId ? "#ff7b54" : colors.disable;

    return (
      <ItemAgen
        item={item}
        // onPress={() => {setSelectedId(item.id);setPaket(item);}}
        // onPress ={() => { setSelectedId(item.id);onInputChange('agents_id', item.id)}}
        onPress ={() => { setSelectedId(item.id);setForm({...form, agents_id : item.id, agent : item})}}
        style={{ borderColor }}
      />
    );
  };
  
  const requestLocationPermission =  async () => {
    let info ='';
    try {
        const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Location Permission',
          'message': 'MyMapApp needs access to your location'
        }
        )

       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setEnableLocation(true)
       } else {
          setEnableLocation(false)
       }
    } catch (err) {
        info=1
    }

    return enableLocation
  }
  
  const courier = () => {
      if(point >= harga ){
      setLoading(true)
      if(confirm === form.password){
        navigation.navigate('Courier', {dataAgen: form, type : 'Jaringan'})
      }else{
        alert('password tidak sama')
        setLoading(false)
      }
    }else{
      alert('Poin Anda Kurang')
    }
  }
  
  if(loading){
    return (
      <Releoder/>
    )
  }

  if(selectPaket === false){
    return (
      <SafeAreaView style={styles.container}>
        <Header2 title ='Downline' btn={() => navigation.goBack()}/>
          <ScrollView>
            <View style={styles.form}>
                <View style={{marginBottom : 70}}>
                  <Text style={styles.textTitle}>Pendaftaran Downline</Text>
                  {/* <View style={styles.login}>
                    <Text style={styles.textLogin}> ayo buruan gabung </Text>
                  </View> */}
                  <DropDownPicker
            placeholder = 'Select Member'
            searchable={true}
            searchablePlaceholder="Search referal"
            searchablePlaceholderTextColor="gray"
            seachableStyle={{}}
            dropDownMaxHeight = '85%'
            searchableError={() => <Text>Not Found</Text>}
            items={
              member
            }
            defaultValue =''
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
                  
                  <Input
                    placeholder = 'Password'
                    title="Password"
                    secureTextEntry={true}
                    value={form.password}
                    onChangeText={(value) => onInputChange('password', value)}
                  />
                  <Input
                    placeholder ='Confirm Password'
                    title="Confirm Password"
                    secureTextEntry={true}
                    value={form.confirmPassword}
                    onChangeText={(value) => setConfirm(value)}
                  />
                  <Input
                    placeholder ='Name'
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
                  <View style={{marginTop : 20, alignItems : 'center', justifyContent : 'center'}}>
                    {/* <FlatList
                      data={item1}
                      renderItem={renderItem}
                      keyExtractor={(item) => item.id.toString()}
                      extraData={selectedId}
                      // numColumns={2}
                      // contentContainerStyle={{
                      //   flexGrow: 1,
                      //   alignItems: 'center',
                      // }}
                    /> */}
                    {form.address != '' && form.name != '' && form.phone != '' && confirm !='' && form.password != '' && form.email !='' ? 
                      form.password == confirm ? (
                        <ButtonCustom
                          name='Selanjutnya'
                          width= '100%'
                          color= {colors.btn}
                          func = {() => setSelectPaket(true)}
                        />
                      ): (
                        <ButtonCustom
                          name='Selanjutnya'
                          width= '100%'
                          color= {colors.btn}
                          func = {() => alert('Password tidak sama')}
                      />
                      )
                    : (
                      <ButtonCustom
                        name='Selanjutnya'
                        width= '100%'
                        color= {colors.disable}
                        func = {() => alert('Mohon lengkapi data anda')}
                      />
                    )}
                  </View>
                </View>
                      {/* );
                  } */}
            </View>
          </ScrollView>
      </SafeAreaView  >
    );
  }else{
    return(
      <SafeAreaView style={{backgroundColor : '#ffffff', flex : 1}}>
        <Header2 title ='Paket Downline' btn={() => setSelectPaket(false)}/>
        {selectAgen ? 
          <View style={{ flex:1 }}>
              <View style={{ flex : 1 }} >
                  <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: LATITUDE,
                        longitude: LONGITUDE,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                        }}
                    >

                    {agen && agen.map((item) => {
                        return (
                            <Marker
                                key ={item.id}
                                coordinate={{latitude : (parseFloat(item.lat) == 0.00000000 ?  location.latitude : parseFloat(item.lat)), longitude:(parseFloat(item.lng) == 0.00000000 ?location.longitude : parseFloat(item.lng))}}
                                onPress={() => {setSelectedId(item.id), onInputChange('agent', item) }}
                                // draggable
                            >
                                <Callout style={styles.plainView}>
                                    <View>
                                        <Text>{item.name}</Text>
                                    </View>
                                </Callout>
                            </Marker>
                        )
                    })}

                  </MapView>
              </View>
              <View style={{flex:1}}>
                <View style={{padding : 20, flex : 1}}>
                <Text style={{textAlign : 'center', fontSize : 20}}>Paket dan Agen</Text>
                <Text style={[styles.titlelabel , {marginBottom : 5}]} >Pilih Agen</Text>
                <FlatList
                  data={agen}
                  renderItem={renderItemAgen}
                  keyExtractor={(item) => item.id.toString()}
                  extraData={selectedId}
                /> 
              </View>
              <View style={{height : 60, paddingHorizontal : 20}}>
                <View style={{flexDirection : 'row', justifyContent : 'space-between'}}>
                  <ButtonCustom
                    name='Back Paket'
                    width= 'auto'
                    color= {'red'}
                    func = {() => {setSelectAgen(false); onInputChange('package_id', '')}}
                  />
                  {form.agents_id != '' ? (
                      <ButtonCustom
                        name='Pilih Agen'
                        width= '65%'
                        color= {colors.btn}
                        // func = {() => activasi()}
                        func = {() => Alert.alert(
                          'Peringatan',
                          `Activasi Member ? `,
                          [
                                {
                                      text : 'Tidak',
                                      onPress : () => console.log('tidak')
                                },
                                {
                                      text : 'Ya',
                                      onPress : () => {courier()}
                                }
                          ]
                    )}
                      />
                    ): (
                    <ButtonCustom
                      name='Pilih Agen'
                      width= '65%'
                      color= {colors.disable}
                      func = {() => alert('Pilih Agen ')}
                    />
                  )}
                </View>
              </View>  
            </View>
          </View>
        :
        <View style={{flex : 1}}>
          <View style={{padding : 20, flex : 1}}>
              <Text style={{textAlign : 'center', fontSize : 20}}>Paket dan agen</Text>
              <Text style={[styles.titlelabel , {marginBottom : 5}]} >Pilih Paket</Text>
              <FlatList
                data={item1}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                extraData={selectedId}
              /> 
          </View>
          <View style={{height : 60, paddingHorizontal : 20}}>
              {form.package_id ? (
                  <ButtonCustom
                    name='Pilih Paket'
                    width= '100%'
                    color= {colors.btn}
                    func = {() => {setSelectAgen(true); onInputChange('agents_id', ''); setSelectedId(null)}}
                  />
                ): (
                <ButtonCustom
                  name='Pilih Paket'
                  width= '100%'
                  color= {colors.disable}
                  func = {() => alert('Pilih Paket dan agen ')}
                />
                )}
          </View>
        </View>
      }
      </SafeAreaView>
      // <NotifAlert/>
    )
  }
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
  box : {
    marginBottom : 10
  },
  agen : {
    padding : 20,
    marginBottom : 10,
    borderWidth : 3,
    // borderColor : colors.disable,
    borderRadius : 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 0,
  },  
  pilihPaket : {
    marginBottom : 5
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
    marginLeft : 20,
    color : '#ffffff'
  },
  bell: {
    fontSize: 20,
    color: 'white',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  // D:\dev\RNTest\node_modules\@react-native-picker\picker\windows\ReactNativePicker\ReactNativePicker.vcxproj
});
