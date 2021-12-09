import { useIsFocused } from '@react-navigation/native'
import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ButtonCustom, Header2, Releoder } from '../../component'
import Select2 from "react-native-select-two"
import { colors, renameKey } from '../../utils'
import { Input } from '../../component/Input'
import { TextInput } from 'react-native-gesture-handler'
import Config from 'react-native-config'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch, useSelector } from 'react-redux';
import { getDistance } from 'geolib';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';

const Courier = ({ navigation, route }) => {
    const [provinces, setProvinces] = useState(null)
    const [cities, setCities] = useState(null)
    const [oldCities, setOldCities] = useState(null)
    const [loading, setLoading] = useState(true)
    const [loadingCost, setLoadingCost] = useState(false)
    const isFocused = useIsFocused()
    const userReducer = useSelector((state) => state.UserReducer);
    const [priceCost, setPriceCost] = useState(0)
    const dataAgen = route.params.dataAgen;
    const typeMenu = route.params.type
    const [toggleChangeCity, setToggleChangeCity] = useState(false)
    const TOKEN = useSelector((state) => state.TokenApi);
    const [dataOngkir, setDataOngkir] = useState({
        origin: (typeMenu == 'Jaringan' && dataAgen.agent.city_id > 0) ? dataAgen.agent.city_id : (typeMenu != 'Jaringan' && dataAgen.city_id > 0) ? dataAgen.city_id : 114, //karangasem,
        destination: userReducer.city_id,
        weight: 0,
        courier: null,
        cost: 0,
        province: userReducer.province_id,
        address: userReducer.address,
    });
    const dispatch = useDispatch();
    const [cost, setCost] = useState([])
    const [courier, setCourier] = useState([
        { name: 'JNE', id: 'jne' },
        { name: 'POS', id: 'pos' },
        { name: 'TIKI', id: 'tiki' }
    ])
    const cartReducer = useSelector((state) => state.CartReducer);
    var location = {
        latitude: 0.0000000,
        longitude: 0.0000000
    }
    const [distance, setDistance] = useState(0)
    const [desti, setDesti] = useState({
        city: userReducer.city_id,
        province: userReducer.province_id,
    });
    Geocoder.init("AIzaSyBxJpfNfWPonmRTm-TktgyaNEVyQxpBHd0");

    const handleInput = (input, value) => {
        setDataOngkir({
          ...dataOngkir,
          [input]: value,
        });
      };

    const getOngkir = (input,b) => {
        console.log('dataOngkir',dataOngkir)
        if (input!='address' && dataOngkir.destination !== null && dataOngkir.origin != null && dataOngkir.origin >0 && dataOngkir.destination >0 && dataOngkir.weight != null && dataOngkir.courier != null) {            
            setLoading(true)
            setLoadingCost(true)
            setCost([])
            Promise.all([CostOngkir(), destiDistance()]).then((result) => {
                console.log('Resultt', result);
                //if free ongkir
                let free_delivery = true;
                if (result[1] > 100000 || dataOngkir.weight > 20000) {
                    free_delivery = false;
                }
                setLoading(false)
                setLoadingCost(false)
                let data = [{
                    id: '',
                    name: '',
                    value: '',
                    service: ''
                }]

                result[0].data.rajaongkir.results[0].costs.map((item, index) => {
                    let item_cost = item.cost[0].value
                    if (free_delivery) {
                        item_cost = 0
                    }
                    data[index] = {
                        id: index + '-' + item_cost,
                        name: `${item.service} Rp. ${item_cost}`,
                        costs: item_cost,
                        service: item.service,
                        baseId: index + '-'
                    }
                })
                setCost(data)
                setDistance(result[1])
            }).catch(e => {
                console.log(e);
            }).finally(f => setLoading(false))
        }
      };

    useEffect(() => {
        // alert('refresh')
        // console.log('data', dataAgen);
        Promise.all([locationApi(), totalWeight(), destiDistance()]).then((result) => {
            console.log('Resultt', result);
            result[0].data.province.forEach(obj => { renameKey(obj, 'title', 'name') });
            result[0].data.city.forEach(obj => { renameKey(obj, 'title', 'name') });
            setProvinces(result[0].data.province)
            setOldCities(result[0].data.city)
            setDataOngkir({ ...dataOngkir, weight: result[1] })
            filterCity(userReducer.province_id, result[0].data.city)
            setDistance(result[2])
        }).catch(e => {
            console.log(e);
        }).finally(f => setLoading(false))
        // if (typeMenu == 'Jaringan' ? !dataAgen.agent.city_id : !dataAgen.city_id) {
        //     // alert('Agen Belum Memiliki lokasi yang pasti mohon pilih agen lain')
        //     // navigation.goBack();
        //     setDataOngkir({
        //         ...dataOngkir,
        //         origin: 114
        //     })
        // }
        // locationApi()
    }, [])

    // useEffect(() => {
    //     // console.log('dataOngkir',dataOngkir)
    //     if (dataOngkir.destination !== null && dataOngkir.origin != null && dataOngkir.origin >0 && dataOngkir.destination >0 && dataOngkir.weight != null && dataOngkir.courier != null) {            
    //         setLoading(true)
    //         setLoadingCost(true)
    //         setCost([])
    //         Promise.all([CostOngkir(), destiDistance()]).then((result) => {
    //             console.log('Resultt', result);
    //             //if free ongkir
    //             let free_delivery = true;
    //             if (result[1] > 100000 || dataOngkir.weight > 20000) {
    //                 free_delivery = false;
    //             }
    //             setLoading(false)
    //             setLoadingCost(false)
    //             let data = [{
    //                 id: '',
    //                 name: '',
    //                 value: '',
    //                 service: ''
    //             }]

    //             result[0].data.rajaongkir.results[0].costs.map((item, index) => {
    //                 let item_cost = item.cost[0].value
    //                 if (free_delivery) {
    //                     item_cost = 0
    //                 }
    //                 data[index] = {
    //                     id: index + '-' + item_cost,
    //                     name: `${item.service} Rp. ${item_cost}`,
    //                     costs: item_cost,
    //                     service: item.service,
    //                     baseId: index + '-'
    //                 }
    //             })
    //             setCost(data)
    //             setDistance(result[1])
    //         }).catch(e => {
    //             console.log(e);
    //         }).finally(f => setLoading(false))
    //         // if (typeMenu == 'Jaringan' ? !dataAgen.agent.city_id : !dataAgen.city_id) {
    //         //     // alert('Agen Belum Memiliki lokasi yang pasti mohon pilih agen lain')
    //         //     // navigation.goBack();
    //         //     setDataOngkir({
    //         //         ...dataOngkir,
    //         //         origin: 114
    //         //     })
    //         // }
    //     }
    // }, [dataOngkir])

    const destiDistance = () => {
        const promiseDistance = new Promise((resolve, reject) => {
            Axios.get(Config.API_PROVINCE_CITY + '?from=' + dataOngkir.origin + '&to=' + desti.city,
                {
                    headers: {
                        Authorization: `Bearer ${TOKEN}`,
                        'Accept': 'application/json'
                    }
                }).then((result) => {
                    resolve(result.data.distance)
                }).catch((error) => {
                    console.log('err', resolve(0));
                });

        })
        return promiseDistance;
    }

    const totalWeight = () => {
        if (typeMenu == 'Checkout') {
            const promiseWeight = new Promise((resolve, reject) => {
                let total = 0
                cartReducer.item.map((item) => {
                    total = total + (item.qty * item.weight);
                })
                resolve(total)
                reject(0)
            })

            return promiseWeight;
        } else {
            // setDataOngkir({...dataOngkir, weight : dataAgen.weight})
            return dataAgen.weight
        }
    }

    const CostOngkir = () => {
        console.log('dataOngkir', dataOngkir)
        const costPromise = new Promise((resolve, reject) => {
            Axios.post('https://api.rajaongkir.com/starter/cost', dataOngkir, {
                headers: {
                    'Accept': 'application/json',
                    'key': 'b01e82d85217f2a4ed868435055a5084'
                }
            }).then(res => {
                resolve(res)
            }).catch((e) => {
                console.log('cost', e.response);
                reject(e.response)
            })
        })

        return costPromise;
    }

    const handleJaringan = () => {
        let price = 0;
        let service = ''
        cost.map((item, index) => {
            if (item.id == priceCost) {
                price = priceCost.replace(item.baseId, '');
                service = item.service
            }
        })

        let data = dataOngkir;
        data.cost = parseFloat(price);
        data.courier = dataOngkir.courier != null ? dataOngkir.courier.toUpperCase() : null
        data.delivery_service = service
        if (data.courier != null && data.destination != null && data.origin != null && data.weight != null && (data.address != null && data.address != '') && data.delivery_service != null) {
            Axios.post(Config.API_REGISTER_DOWNLINE, dataAgen,
                {
                    headers: {
                        Authorization: `Bearer ${TOKEN}`,
                        'Accept': 'application/json'
                    }
                }
            ).then((res) => {
                navigation.navigate('NotifAlert', { notif: 'Registrasi Berhasil' })
                setLoading(false)
                console.log('jaringan', res.data)
            }).catch((e) => {
                var mes = JSON.parse(error.request._response);
                alert(mes)
                console.log(e)
                setLoading(false)
            }).finally(f => setLoading(false))
        } else {
            alert('mohon isi data dengan lengkap')
        }
    }

    const handleCheckout = () => {
        let price = 0;
        let service = ''
        cost.map((item, index) => {
            if (item.id == priceCost) {
                price = priceCost.replace(item.baseId, '');
                service = item.service
            }
        })

        let data = dataOngkir;
        data.cost = parseFloat(price);
        data.courier = dataOngkir.courier != null ? dataOngkir.courier.toUpperCase() : null
        data.delivery_service = service
        console.log('data yg dikirim', data)
        if (data.courier != null && data.destination != null && data.origin != null && data.weight != null && (data.address != null && data.address != '') && data.delivery_service != null) {
            navigation.navigate('CheckOut', { dataAgen: dataAgen, dataOngkir: data })
        } else {
            alert('mohon isi data dengan lengkap')
        }

        console.log(data);
    }

    const handleActivasi = () => {
        let price = 0;
        let service = ''
        cost.map((item, index) => {
            if (item.id == priceCost) {
                price = priceCost.replace(item.baseId, '');
                service = item.service
            }
        })

        let data = dataOngkir;
        data.cost = parseFloat(price);
        data.courier = dataOngkir.courier != null ? dataOngkir.courier.toUpperCase() : null
        data.delivery_service = service
        if (data.courier != null && data.destination && data.origin != null && data.weight != null && (data.address != null && data.address != '') && data.delivery_service != null) {
            setLoading(true)
            Axios.post(Config.API_ACTIVE, dataAgen,
                {
                    headers: {
                        Authorization: `Bearer ${TOKEN}`,
                        'Accept': 'application/json'
                    }
                }
            ).then((result) => {
                console.log('result data', result);
                storeDataUser(result.data.data)
                dispatch({ type: 'SET_DATA_USER', value: result.data.data });
                setLoading(false)
                navigation.navigate('NotifAlert', { notif: 'Sukses Activasi Member' })
            }).catch((error) => {
                // console.log(error.request._response.message);
                var mes = JSON.parse(error.request._response);
                alert(mes.message)
                setLoading(false)
            });
        } else {
            alert('mohon isi data dengan lengkap')
        }
    }


    const locationApi = () => {
        const locationPromise = new Promise((resolve, reject) => {
            Axios.get('https://admin.belogherbal.com/api/open/location', {
                headers: {
                    'Accept': 'application/json'
                }
            }).then((result) => {
                resolve(result)
            }).catch((e) => {
                console.log('location', e);
                reject(e)
            })
        })

        return locationPromise;
    }

    const filterCity = (id, cities = null) => {
        // console.log('old citsssy', cities);
        let data = []
        if (cities == null) {
            oldCities.map((item, index) => {
                if (item.province_id == id) {
                    data[index] = item
                }
            })
        } else {
            cities.map((item, index) => {
                if (item.province_id == id) {
                    data[index] = item
                }
            })
        }
        // console.log('data citie new', cities);
        setCities(data)
    }

    const storeDataUser = async (value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('@LocalUser', jsonValue)
        } catch (e) {
            console.log('Token not Save')
        }
    }

    if (loading) {
        return (
            <Releoder />
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header2 title='Layanan Kurir' btn={() => navigation.goBack()} />
            <View style={{ paddingHorizontal: 20 }}>
                <View style={{ marginVertical: 10 }} />
                <Text>Province</Text>
                <View style={{ marginVertical: 10 }} />
                <Select2
                    isSelectSingle
                    style={{ borderRadius: 5 }}
                    searchPlaceHolderText='Search Province'
                    colorTheme={colors.default}
                    popupTitle="Select Province"
                    title={userReducer.provinces ? userReducer.provinces.title : "Select Province"}
                    selectButtonText='select'
                    cancelButtonText='cancel'
                    data={provinces}
                    onSelect={value => {
                        filterCity(value)
                        getOngkir('province',handleInput('province', value[0]))
                        setDesti({
                            ...desti,
                            province: value
                        })
                        setToggleChangeCity(true)
                    }}
                    onRemoveItem={value => {
                        filterCity(value)
                        getOngkir('province',handleInput('province', value[0]))
                        setDesti({
                            ...desti,
                            province: value
                        })
                        setToggleChangeCity(true)
                    }}
                    style={{ borderColor: colors.default }}
                />
                <View style={{ marginVertical: 10 }} />
                <Text>City</Text>
                <View style={{ marginVertical: 10 }} />
                {/* {cities &&  */}
                <Select2
                    isSelectSingle
                    style={{ borderRadius: 5 }}
                    searchPlaceHolderText='Search City'
                    colorTheme={colors.default}
                    popupTitle="Select City"
                    // title={userReducer.city ?  (!toggleChangeCity? userReducer.city.title : "Select City") : "Select City"}
                    title={!toggleChangeCity ? (userReducer.city ? userReducer.city.title : 'Select City') : 'Select City'}
                    selectButtonText='select'
                    cancelButtonText='cancel'
                    data={cities ? cities : [{ id: null, name: null }]}
                    onSelect={data => {
                        getOngkir('destination',handleInput('destination', data[0]))
                        setDesti({
                            ...desti,
                            city: data
                        })

                    }}
                    onRemoveItem={data => {
                        getOngkir('destination',handleInput('destination', data[0]))
                        setDesti({
                            ...desti,
                            city: data
                        })

                    }}
                    style={{ borderColor: colors.default }}
                />

                <View style={{ marginVertical: 10 }} />
                <Text>Courier</Text>
                <View style={{ marginVertical: 10 }} />
                <Select2
                    isSelectSingle
                    style={{ borderRadius: 5 }}
                    colorTheme={colors.default}
                    searchPlaceHolderText='Pilih Courier'
                    popupTitle="Pilih Courier"
                    title="Pilih Courier"
                    selectButtonText='select'
                    cancelButtonText='cancel'
                    data={courier}
                    onSelect={data => {
                        getOngkir('courier',handleInput('courier', data[0]))
                        // console.log(data)
                    }}
                    onRemoveItem={data => {
                        getOngkir('courier',handleInput('courier', data[0]))
                    }}
                    style={{ borderColor: colors.default }}
                />
                <View style={{ marginVertical: 10 }} />
                <Text>Address</Text>
                <View style={{ marginVertical: 10 }} />
                <TextInput placeholder='isi alamat anda' value={dataOngkir.address} style={styles.address} onChangeText={(value) => getOngkir('address',handleInput('address', value))} />
                <View style={{ marginVertical: 10 }} />
                <Text>Total berat {dataOngkir.weight} (gram)</Text>
                <View style={{ marginVertical: 10 }} />
                <Text>Cost</Text>
                <View style={{ marginVertical: 10 }} />
                <Select2
                    isSelectSingle
                    style={{ borderRadius: 5 }}
                    searchPlaceHolderText='Pilih Model Pengiriman'
                    colorTheme={colors.default}
                    popupTitle={(loadingCost) ? 'Loading...' : "Pilih Model Pengiriman"}
                    title={(loadingCost) ? 'Loading...' : "Pilih Model Pengiriman"}
                    selectButtonText='select'
                    cancelButtonText='cancel'
                    data={cost.length > 0 ? cost : [{ id: null, name: 'Tidak ada Layanan' }]}
                    onSelect={data => {
                        setPriceCost(data[0])
                    }}
                    onRemoveItem={data => {
                        setPriceCost(data[0])
                    }}
                    style={{ borderColor: colors.default }}
                />
                <View style={{ marginVertical: 10 }} />
                {/* <ButtonCustom
                    // name = {typeMenu ? (typeMenu == 'Jaringan' ? 'Jaringan' : 'Checkout') : 'Lanjut'}
                    name = {typeMenu ? (typeMenu =='Jaringan' ? 'Jaringan' : 'Activasi') : 'Chekout'}
                    width = '100%'
                    color = {colors.btn}
                    func = {typeMenu ? (typeMenu =='Jaringan' ? handleJaringan : handleActivasi) : handleCheckout}
                /> */}
                {typeMenu == 'Jaringan' &&
                    <ButtonCustom
                        // name = {typeMenu ? (typeMenu == 'Jaringan' ? 'Jaringan' : 'Checkout') : 'Lanjut'}
                        name='Ragistrasi Downline'
                        width='100%'
                        color={colors.btn}
                        func={handleJaringan}
                    />
                }
                {typeMenu == 'Activasi' &&
                    <ButtonCustom
                        name='Activasi'
                        width='100%'
                        color={colors.btn}
                        func={handleActivasi}
                    />
                }
                {typeMenu == 'Checkout' &&
                    <ButtonCustom
                        name='Checkout'
                        width='100%'
                        color={colors.btn}
                        func={handleCheckout}
                    />
                }
            </View>
        </SafeAreaView>
    )
}

export default Courier

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    address: {
        borderWidth: 1,
        borderColor: colors.default,
        padding: 10,
        minHeight: 100,
        textAlignVertical: 'top'
    }
})
