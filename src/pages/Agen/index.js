import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image, ActivityIndicator} from 'react-native';
import {LongPressGestureHandler, ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {profile} from '../../assets';
import {Header, TopUp, Promo, Releoder, ButtonCustom, HeaderComponent, Header2} from '../../component';
import {colors} from '../../utils/colors';
import Axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import Config from "react-native-config";
import { getDistance } from 'geolib';
import Geolocation from '@react-native-community/geolocation'
import { PermissionsAndroid } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box"
const List = (props) => {
  return (
    <View style={styles.body}>
      <Image source={profile} style={styles.image} />
      <Text style={styles.textNama}>{props.nama}</Text>
      <Text style={styles.textNama}>{props.email}</Text>
      <Text style={styles.textNama}>{props.phone}</Text>
      <ButtonCustom
        name = 'Pilih Agen'
        width = '95%'
        color = {colors.btn}
        func = {props.select}
      />
    </View>
  );
};

const Agen = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [agen, setAgen] = useState(null);
  const TOKEN = useSelector((state) => state.TokenApi);
  const [agenDistance, setAgenDistance] = useState(null)
  const isFocused = useIsFocused()
  const [enableLocation, setEnableLocation] = useState()
  var location= {
    latitude: null,
    longitude: null
}
  useEffect(() => {
    if(isFocused){
        // requestLocationPermission().then(res => {
          LocationServicesDialogBox.checkLocationServicesIsEnabled({
              message: "<h2 style='color: #0af13e'>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
              ok: "YES",
              cancel: "NO",
          }).then(success => {
            Promise.all([apiAgents(), requestLocationPermission()]).then(res => {
                let dataAgen=res[0]
                setAgen(res[0])
                console.log('1');
                Geolocation.getCurrentPosition( 
                    (position) => {
                      location.latitude = position.coords.latitude;
                      location.longitude = position.coords.longitude;
                  // setLoading(false) 
                      console.log('2');
                      let arrayAgen = [];
                      dataAgen.map((item, index) => {
                        var distance = getDistance(
                            {latitude: position.coords.latitude, longitude:  position.coords.longitude},
                            {latitude: parseFloat(item.lat), longitude: parseFloat(item.lng)},
                            );
                            arrayAgen[index] = {
                                id : item.id,
                                name : item.name,
                                phone  : item.phone,
                                email : item.email,
                                img : item.img, 
                                distance : distance
                            }
                        })
                        console.log('asas',arrayAgen.sort(function (a, b) {
                          return a.distance - b.distance;
                        }));
                        // console.log(arrayAgen.sort(compare));
                        setAgen(arrayAgen.sort(function (a, b) {
                          return a.distance - b.distance;
                        }))
                        setIsLoading(false)
                  },
                  (error) => {
                      console.log('3');    
                      setIsLoading(false)
                  },
                  { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000 },
                  );
              }).catch(e => {
                console.log('4');
                setIsLoading(false)
              })
          }).catch(e => {
            console.log(e.message);
            apiAgents().then(item => {
              console.log('5');
              setAgen(item)
              setIsLoading(false)
            }).catch(e => {
              console.log('6');
              setIsLoading(false)
            })
          })
        
      }
    }, [isFocused]);


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

  function compare(a, b) {
    // Use toUpperCase() to ignore character casing
      const distance1 = a.distance
      const distance2 = b.distance
    
      let comparison = 0;
      if (distance1 > distance2) {
        comparison = 1;
      } else if (distance1 < distance2) {
        comparison = -1;
      }
      return comparison;
  }

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

  
  if (isLoading) {
    return  (
      <Releoder/>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Header2 title ='Agen' btn={() => navigation.goBack()}/>
      </View>
      <Text style={styles.textAgent}>Pilih Agen</Text>
      <ScrollView>
        <View style={{padding: 20}}>
          {agen.map((list) => {
            return (
              <List
                nama={list.name}
                email={list.email}
                phone={list.phone}
                select={() =>
                  navigation.navigate('CheckOut', {dataAgen: list})
                }
                key={list.id}
              />
            );
          })}
          {/* <Text onPress={()=> console.log(enableLocation)} >halo</Text> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Agen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  body: {
    
    padding: 20,
    // borderWidth : 1,
    // borderColor: colors.disable,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.0,

    elevation: 5,
    marginBottom: 10,
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  textNama: {
    // borderBottomWidth : 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: '#e6e6e6',
    width: 300,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#ff781f',
    padding: 10,
    borderRadius: 5,
    marginTop : 10,
    width : 300,
    alignItems : 'center',
    justifyContent : 'center'
  },
  textBtn: {
    fontSize: 14,
    color: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  textAgent : {
    paddingHorizontal : 20, 
    fontSize : 20, 
    marginTop : 10, 
    borderWidth : 1, 
    marginHorizontal : 20, 
    paddingVertical : 3, 
    borderRadius : 5, 
    fontWeight : 'bold', 
    backgroundColor : '#fbf6f0', 
    borderColor : colors.default, 
    color : colors.default, 
    letterSpacing : 1
  }
});
