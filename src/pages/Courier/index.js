import { useIsFocused } from '@react-navigation/native'
import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ButtonCustom, Header2, Releoder } from '../../component'
import Select2 from "react-native-select-two"
import { colors, renameKey } from '../../utils'
const Courier = ({navigation,route}) => {
    const [provinces, setProvinces] = useState(null)
    const [cities, setCities] = useState(null)
    const [oldCities, setOldCities] = useState(null)
    const [loading, setLoading] = useState(true)
    const [loadingCost, setLoadingCost] = useState(false)
    const isFocused = useIsFocused()
    const [priceCost, setPriceCost] = useState(0)
    const dataAgen= route.params.dataAgen;
    const [dataOngkir, setDataOngkir] = useState({
        origin : 170, //karangasem,
        destination : null,   
        weight : 1000,
        courier : null, 
        cost : 0

    });
    const [cost, setCost] = useState([])
    const [courier, setCourier]  = useState([
        {name : 'JNE', id : 'jne'},
        {name : 'POS', id : 'pos'},
        {name : 'TIKI', id : 'tiki'}
    ])
    useEffect(() => {
        locationApi();
        console.log('data Agen', dataAgen);
    },[])

        useEffect (() => {
        if(dataOngkir.destination !== null && dataOngkir.origin !=null && dataOngkir.weight !=null &&dataOngkir.courier !=null){
            setLoadingCost(true)
            setCost([])
            Axios.post('https://api.rajaongkir.com/starter/cost',dataOngkir, {
                headers : {
                    'Accept' : 'application/json',
                    'key' : ' 9ec286006faf2cdb3bd8247af91607a2'
                }
            }).then(res => {
                console.log('cost',res);
                let data = [{
                    id : '',
                    name : '',
                    value : '',
                }]

                res.data.rajaongkir.results[0].costs.map((item, index) => {
                    data[index] ={
                        id : index + '-' + item.cost[0].value,
                        name : `${item.service} Rp. ${item.cost[0].value}`,
                        costs : item.cost,
                        baseId : index + '-'
                    }
                })
                console.log(res.data.rajaongkir.results[0].costs);
                setCost(data)
            }).catch((e) => {
                console.log('cost',e.response);
            }).finally(f => setLoadingCost(false))
        }
    },[dataOngkir])

    const handleCheckout = () => {
        let price = 0;
        cost.map((item,index) => {
            if(item.id == priceCost){
                price = priceCost.replace(item.baseId, '');
            }
        })

        let data = dataOngkir;
        data.cost = parseFloat(price);
        data.courier = dataOngkir.courier.toUpperCase()
        if(data.courier != null && data.destination !=null && data.origin !=null && data.weight !=null && data.cost !=0){
            navigation.navigate('CheckOut', {dataAgen: dataAgen, dataOngkir : data})
        }else{
            alert('mohon isi data dengan lengkap')
        }
    }

    const locationApi = () => {
        Axios.get('http://adminc.belogherbal.com/api/open/location', {
          headers : {
            'Accept' : 'application/json'
          }
        }).then((result) => {
          console.log(result);
          result.data.province.forEach(obj => {renameKey(obj, 'title', 'name')});
          result.data.city.forEach(obj => {renameKey(obj, 'title', 'name')});
          setProvinces( result.data.province)
          setOldCities(result.data.city)
        }).catch((e) => {
          console.log('location', e);
        }).finally(() => setLoading(false))
    }
    
    const filterCity = (id) => {
        let data = []
        oldCities.map((item, index) => {
            if(item.province_id == id){
            data[index] = item
            }
        })

        console.log(data);

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
                    title="Select Province"
                    selectButtonText='select'
                    cancelButtonText = 'cancel'
                    data={provinces}
                    onSelect={value => {
                        filterCity(value)
                    }}
                    onRemoveItem={value => {
                        filterCity(value)
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
                        title="Select City"
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
                    searchPlaceHolderText='Search City'
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
    }
})
