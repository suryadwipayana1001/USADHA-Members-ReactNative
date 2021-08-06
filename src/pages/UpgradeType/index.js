import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Image } from 'react-native'
import { Text } from 'react-native'
import { StyleSheet, View } from 'react-native'
import Config from 'react-native-config'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { profile, promo2 } from '../../assets'
import { ButtonCustom, Header2, Releoder } from '../../component'
import { Rupiah } from '../../helper/Rupiah'
import { colors } from '../../utils/colors'
import { useDispatch, useSelector } from 'react-redux';

const Item = (props) => {
    return(
        <View style={styles.item(props.select)}>
            <TouchableOpacity onPress={props.onPress} >
                <Text style={styles.titleItem} >{props.name}</Text>
                <View style={{flexDirection : 'row', alignItems : 'center', marginTop : 5}}>
                    <Image source={promo2} style={styles.image} />
                    <Text style={styles.desc}>{props.desc}</Text>
                </View>
                <Text style={styles.price} >{Rupiah(props.price)}</Text>
            </TouchableOpacity>
        </View>
    )
}

const ListAgen = (props) => {
    return (
      <View style={styles.bodyAgen(props.select)}>
          <TouchableOpacity onPress={props.onPress} style={{alignItems : 'center'}} >
                <Image source={profile} style={styles.image} />
                <Text style={styles.textNama}>{props.nama}</Text>
                <Text style={styles.textNama}>{props.email}</Text>
                <Text style={styles.textNama}>{props.phone}</Text>
          </TouchableOpacity>
      </View>
    );
  };

const UpgradeType = ({navigation}) => {
    const TOKEN = useSelector((state) => state.TokenApi);
    const userReducer = useSelector((state) => state.UserReducer);
    const [paket, setPaket] = useState(null)
    const [loading, setloading] = useState(true)
    const [agen, setAgen] = useState(true)
    const [point, setPoint] = useState(0)
    const [pageAgen, setPageAgen] = useState(false)
    const dispatch = useDispatch();
    const [form, setForm] = useState({
        id : userReducer.id,
        package_id : null,
        agents_id : null
    })

    useEffect(() => {
        let isAmounted = true
        if(isAmounted){
            Promise.all([ApiPaket(), ApiAgen(), ApiPoint()]).then((res) => {
                console.log(res);
                setPaket(res[0])
                setAgen(res[1])
                setPoint(parseInt(res[2].data[0].balance_points))
                setloading(false)
            }).catch(e => {
                // console.log(e)
                setloading(false)
            })
        }
        return () => {
           isAmounted = false
        }
    }, [])

    const ApiPaket = () => {
        const promisePaket = new Promise((resolve, reject) => {
            axios.get(Config.API_PACKAGES_UPGRADE + `${userReducer.activation_type_id}`,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Accept' : 'application/json' 
                    }
                }
            ).then((res) => {
                console.log(res);
                // setPaket(res.data)
                resolve(res.data)
            }).catch((e) =>{ 
                reject(e.result)
            })
        })
        return promisePaket;
    }

    const ApiAgen = () => {
        const promiseAgen = new Promise((resolve, reject) => {
            axios.get(Config.API_AGENTS, 
            {
                headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Accept' : 'application/json' 
                }
            }).then((res) => {
                console.log(res);
                // setPaket(res.data)
                resolve(res.data)
            }).catch((e) =>{ 
                reject(e.result)
            })
        })
        return promiseAgen;
    }


    // Axios.get(Config.API_POINT + `${userReducer.id}`, {
    //     headers : {
    //       Authorization: `Bearer ${TOKEN}`,
    //       'Accept' : 'application/json' 
    //     }
    //   })

    const ApiPoint = () => {
        const promisePoint = new Promise((resolve, reject) => {
            axios.get(Config.API_POINT + `${userReducer.id}`, 
            {
                headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Accept' : 'application/json' 
                }
            }).then((res) => {
                console.log(res);
                // setPaket(res.data)
                resolve(res.data)
            }).catch((e) =>{ 
                reject(e.request)
            })
        })
        return promisePoint;
    }

    // const storeDataUser = async (value) => {
    //     try {
    //       const jsonValue = JSON.stringify(value)
    //       await AsyncStorage.setItem('@LocalUser', jsonValue)
    //     } catch (e) {
    //       console.log('Token not Save')
    //     }
    // }

    const activasi = () => {
        if(form.package_id !=null && form.agents_id != null && form.id !=null){
            setloading(true)
            axios.post(Config.API_UPGRADE, form,
                {
                    headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Accept' : 'application/json' 
                    }
                }
            ).then((res) => {
                console.log(res);
                dispatch({type : 'SET_DATA_USER', value:res.data.data});
                storeDataUser(res.data.data) 
                navigation.navigate('NotifAlert', {notif : 'Upgrade Berhasil'})
                setloading(false)
            }).catch((e) => {
                // console.log(e.request);
                let mes = JSON.parse(e.request._response)
                // console.log(mes.message);
                alert(mes.message)
                setloading(false)
            })
        }else{
            alert('data belum lengkap')
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

    if(loading){
        return (<Releoder/>)
    }

    if(!pageAgen ){
        return (
            <SafeAreaView style={styles.container}>
                <Header2 title ='Upgrade Type' btn={() => navigation.goBack()}/>
                <Text style={styles.title}>Pilih Paket</Text>
                <View style={{flex : 1}}>
                    <ScrollView>
                        <View style={styles.body} >
                            {paket && 
                                paket.map((item, index) => {
                                    return (
                                        <Item
                                            key = {index}
                                            name = {item.name}
                                            desc = {item.description}
                                            price = {parseInt(item.price)}
                                            select = {item.id == form.package_id ? true : false}
                                            onPress = {() => setForm({...form, package_id : item.id})}
                                        />
                                    )
                                })
                            }
                        </View>
                    </ScrollView>
                </View>
                <View style={{padding : 20}}>
                    <ButtonCustom
                        name = 'Lanjutkan'
                        width = '100%'
                        color = {form.package_id !== null ? colors.default : colors.disable}
                        func = {() => {form.package_id !== null ? setPageAgen(true) : alert('pilih paket terlebih dahulu')}}
                    />
                </View>
            </SafeAreaView>
        )
    }else{
        return (
            <SafeAreaView style={styles.container}>
                <Header2 title ='Upgrade Type' btn={() => navigation.goBack()}/>
                <Text style={styles.title}>Pilih Agen</Text>
                <View style={{flex : 1}}>
                    <ScrollView>
                        <View style={styles.body} >
                        {agen.map((list) => {
                            return (
                            <ListAgen
                                nama={list.name}
                                email={list.email}
                                phone={list.phone}
                                select={form.agents_id == list.id ? true : false }
                                onPress ={() => setForm({...form, agents_id : list.id})}
                                key={list.id}
                            />
                            );
                        })}
                        </View>
                    </ScrollView>
                </View>
                <View style={{padding : 20, flexDirection :'row', justifyContent : 'space-around'}}>
                    <ButtonCustom
                        name = 'back'
                        width = '40%'
                        color = 'red'
                        func = {() => setPageAgen(false)}
                    />
                      <ButtonCustom
                        name = 'Upgrade'
                        width = '40%'
                        color = {form.agents_id !== null ? colors.default : colors.disable}
                        func = {activasi}
                    />
                </View>
            </SafeAreaView>
        )
    }
}

export default UpgradeType

const styles = StyleSheet.create({
    container : {
        backgroundColor : 'white',
        flex : 1
    },
    title : {
        paddingHorizontal : 20,
        fontSize : 25,
        marginTop : 10,
        color : colors.default,
        fontWeight : 'bold'
    },
    body : {
        paddingHorizontal : 20,
        paddingVertical : 10,
        justifyContent : 'center',
        alignItems : 'center'
    },
    item :(select) => ( {
        borderColor : select ? colors.default : colors.dark,
        borderWidth : 0.9,
        backgroundColor : '#ffffff',
        width : '100%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        
        elevation: 5,
        padding : 10,
        borderRadius : 5,
        marginBottom : 10
        // height : 300,
    }),
    titleItem : {
        color : 'black',
        fontWeight : 'bold',
        fontSize : 15,
    },
    image : {
        width : '50%',
        height : 100,
        resizeMode : 'stretch'
    },
    desc : {
        flex : 1,
        marginLeft : 5,
        color :colors.dark
    }, 
    price : {
        fontSize : 15,
        fontWeight : 'bold',
        marginVertical : 10
    },
    bodyAgen:(select) => ( {
        borderColor : colors.default ,
        padding: 20,
        borderWidth : select ? 3 : 0,
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
      }),
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
})
