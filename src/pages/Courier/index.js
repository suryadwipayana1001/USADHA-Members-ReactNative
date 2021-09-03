import { useIsFocused } from '@react-navigation/native'
import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ButtonCustom, Header2, Releoder } from '../../component'
import Select2 from "react-native-select-two"
import { colors, renameKey } from '../../utils'
import { useSelector } from 'react-redux'
import { Input } from '../../component/Input'
import { TextInput } from 'react-native-gesture-handler'
const Courier = ({navigation,route}) => {
    const [provinces, setProvinces] = useState(null)
    const [cities, setCities] = useState(null)
    const [oldCities, setOldCities] = useState(null)
    const [loading, setLoading] = useState(true)
    const [loadingCost, setLoadingCost] = useState(false)
    const isFocused = useIsFocused()
    const userReducer = useSelector((state) => state.UserReducer);
    const [priceCost, setPriceCost] = useState(0)
    const dataAgen= route.params.dataAgen;
    const [toggleChangeCity, setToggleChangeCity] = useState(false)
    const [dataOngkir, setDataOngkir] = useState({
        origin : 170, //karangasem,
        destination : userReducer.city_id,   
        weight : 1000,
        courier : null, 
        cost : 0,
        province :userReducer.province_id,   
        address : userReducer.address,
    });
    const [cost, setCost] = useState([])
    const [courier, setCourier]  = useState([
        {name : 'JNE', id : 'jne'},
        {name : 'POS', id : 'pos'},
        {name : 'TIKI', id : 'tiki'}
    ])
    useEffect(() => {
        Promise.all([locationApi()]).then((result) => {
            result[0].data.province.forEach(obj => {renameKey(obj, 'title', 'name')});
            result[0].data.city.forEach(obj => {renameKey(obj, 'title', 'name')});
            setProvinces( result[0].data.province)
            setOldCities(result[0].data.city)
            filterCity(userReducer.province_id, result[0].data.city )
        }).catch(e => {
            console.log(e);
        }).finally(f => setLoading(false))
        locationApi()
    },[])


    useEffect (() => {
        if(dataOngkir.destination !== null && dataOngkir.origin !=null && dataOngkir.weight !=null &&dataOngkir.courier !=null){
            setLoadingCost(true)
            setCost([])
            CostOngkir().then((res) => {
                let data = [{
                    id : '',
                    name : '',
                    value : '',
                    service : ''
                }]

                res.data.rajaongkir.results[0].costs.map((item, index) => {
                    data[index] ={
                        id : index + '-' + item.cost[0].value,
                        name : `${item.service} Rp. ${item.cost[0].value}`,
                        costs : item.cost,
                        service : item.service,
                        baseId : index + '-'
                    }
                })
                console.log(res.data.rajaongkir.results[0].costs);
                setCost(data)
            }).catch(e => {
                console.log(e);
            }).finally(f=>setLoading(false))
        }
    },[dataOngkir])

    const CostOngkir = () => {
        const costPromise = new Promise((resolve, reject) => {
            Axios.post('https://api.rajaongkir.com/starter/cost',dataOngkir, {
                headers : {
                    'Accept' : 'application/json',
                    'key' : ' 9ec286006faf2cdb3bd8247af91607a2'
                }
                }).then(res => {
                    resolve(res)
                }).catch((e) => {
                    console.log('cost',e.response);
                    reject(e.response)
                })
        })

        return costPromise;
    }

    const handleCheckout = () => {
        let price = 0;
        let service = ''
        cost.map((item,index) => {
            if(item.id == priceCost){
                price = priceCost.replace(item.baseId, '');
                service = item.service
            }
        })

        let data = dataOngkir;
        data.cost = parseFloat(price);
        data.courier = dataOngkir.courier != null ? dataOngkir.courier.toUpperCase() :null
        data.delivery_service = service
        if(data.courier != null && data.destination !=null && data.origin !=null && data.weight !=null && data.cost !=0 && (data.address != null && data.address!='') && data.delivery_service !=null){
            navigation.navigate('CheckOut', {dataAgen: dataAgen, dataOngkir : data})
        }else{
            alert('mohon isi data dengan lengkap')
        }
        
        console.log(data);
    }

    const locationApi = () => {
        const locationPromise = new Promise((resolve, reject) => {
            Axios.get('http://admin.belogherbal.com/api/open/location', {
                headers : {
                    'Accept' : 'application/json'
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
        console.log('old citsssy', cities);
        let data = []
        if(cities == null) {
            oldCities.map((item, index) => {
                if(item.province_id == id){
                data[index] = item
                }
            })
        }else{
            cities.map((item, index) => {
                if(item.province_id == id){
                data[index] = item
                }
            })
        }
        console.log('data citie new', cities);
        setCities(data)
    }

    if(loading){
       return(
        <Releoder/>
       )
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header2 title ='Layanan Kurir' btn={() => navigation.goBack()}/>
            <View style={{paddingHorizontal : 20}}>
                <View style={{marginVertical : 10}} />
                <Text>Province</Text>
                <View style={{marginVertical : 10}} />
                <Select2
                    isSelectSingle
                    style={{ borderRadius: 5 }}
                    searchPlaceHolderText='Search Province'
                    colorTheme={colors.default}
                    popupTitle="Select Province"
                    title={userReducer.provinces ? userReducer.provinces.title : "Select Province"}
                    selectButtonText='select'
                    cancelButtonText = 'cancel'
                    data={provinces}
                    onSelect={value => {
                        filterCity(value)
                        setDataOngkir({
                            ...dataOngkir,
                            province : value
                        })
                        setToggleChangeCity(true)
                    }}
                    onRemoveItem={value => {
                        filterCity(value)
                        setDataOngkir({
                            ...dataOngkir,
                            province : value
                        })
                        setToggleChangeCity(true)
                    }}
                    style={{borderColor : colors.default}}
              />
                <View style={{marginVertical : 10}} />
                <Text>City</Text>
                <View style={{marginVertical : 10}} />
                {/* {cities &&  */}
                     <Select2
                        isSelectSingle
                        style={{ borderRadius: 5 }}
                        searchPlaceHolderText='Search City'
                        colorTheme={colors.default}
                        popupTitle="Select City"
                        // title={userReducer.city ?  (!toggleChangeCity? userReducer.city.title : "Select City") : "Select City"}
                        title = {!toggleChangeCity ? userReducer.city.title : 'Select City'}
                        selectButtonText='select'
                        cancelButtonText = 'cancel'
                        data={cities ? cities : [{id :null, name :null}]}
                        onSelect={data => {
                            setDataOngkir({
                                ...dataOngkir,
                                destination : data[0]
                            })
                         
                        }}
                        onRemoveItem={data => {
                            setDataOngkir({
                                ...dataOngkir,
                                destination : data[0]
                            })
                         
                        }}
                        style={{borderColor : colors.default}}
                    /> 
           
                <View style={{marginVertical : 10}} />
                <Text>Courier</Text>
                <View style={{marginVertical : 10}} />
                <Select2
                    isSelectSingle
                    style={{ borderRadius: 5 }}
                    colorTheme={colors.default}
                    searchPlaceHolderText='Search Courier'
                    popupTitle="Select Courier"
                    title="Select Courier"
                    selectButtonText='select'
                    cancelButtonText = 'cancel'
                    data={courier}
                    onSelect={data => {
                        setDataOngkir({
                            ...dataOngkir,
                            courier : data[0]
                        })
                        console.log(data)
                    }}
                    onRemoveItem={data => {
                        setDataOngkir({
                            ...dataOngkir,
                            courier : data[0]
                        })
                     
                    }}
                    style={{borderColor : colors.default}}
                />
                <View style={{marginVertical : 10}} />
                <Text>Address</Text>
                <View style={{marginVertical : 10}} />
                <TextInput placeholder='isi alamat anda' value={dataOngkir.address} style={styles.address} onChangeText={(value) => setDataOngkir({...dataOngkir, address : value})} />
                <View style={{marginVertical : 10}} />
                <Text>Cost</Text>
                <View style={{marginVertical : 10}} />
                <Select2
                    isSelectSingle
                    style={{ borderRadius: 5 }}
                    searchPlaceHolderText='Search Cost'
                    colorTheme={colors.default}
                    popupTitle={(loadingCost)  ? 'Loading...' : "Select Cost"} 
                    title={(loadingCost )  ? 'Loading...' : "Select Cost"} 
                    selectButtonText='select'
                    cancelButtonText = 'cancel'
                    data={cost.length > 0  ? cost : [{id :null, name :'Tidak ada Layanan'}]}
                    onSelect={data => {
                        setPriceCost(data[0])
                    }}
                    onRemoveItem={data => {
                        setPriceCost(data[0])
                    }}
                    style={{borderColor : colors.default}}
                /> 
                 <View style={{marginVertical : 10}} />
                <ButtonCustom
                    name = 'Lanjut'
                    width = '100%'
                    color = {colors.btn}
                    func = {handleCheckout}
                />
            </View>
        </SafeAreaView>
    )
}

export default Courier

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor: '#ffffff',
    },
    address : {
        borderWidth : 1,
        borderColor : colors.default,
        padding : 10,
        minHeight : 100,
        textAlignVertical: 'top' 
    }
})
