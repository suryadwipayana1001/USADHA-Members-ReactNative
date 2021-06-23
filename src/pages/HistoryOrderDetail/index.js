import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Image, ScrollView, ActivityIndicator} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import {colors} from '../../utils/colors';
import {Rupiah} from '../../helper/Rupiah';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ButtonCustom, NotifAlert, Releoder } from '../../component';
import Axios from 'axios';
import {useSelector} from 'react-redux';
import { Alert } from 'react-native';
import Config from 'react-native-config';

const Item = (props) => {
  return (
    <View>
      <View
        style={{marginBottom: 10, paddingHorizontal: 20, paddingVertical: 10}}>
        <Text style={{fontWeight: 'bold'}}>Pesanan {props.pesanan}</Text>
        <View style={{flexDirection : 'row', justifyContent : 'space-between'}}>
            <Text style={{letterSpacing: 2}}>{props.agent}</Text>
            <Text style={{color:'#ef4f4f', letterSpacing:1}}>{props.status}</Text>
        </View>
            <Text style={{letterSpacing: 2}}>{props.phone}</Text>
            <Text style={{letterSpacing: 2}}>{props.address}</Text>
        <View style={styles.item}>
          <Image source={{uri : props.img}} style={{width: 80, height: 80}} />
          <View style={{marginLeft: 10, marginBottom: 15}}>
            <Text style={{fontWeight: 'bold'}}>{props.name}</Text>
            {/* <Text style={{fontWeight: 'bold'}}>Random</Text> */}
            <Text style={{color: colors.dark}}>
              {props.qty} barang 
            </Text>
            <Text style={{fontWeight: 'bold'}}>{Rupiah(props.harga)}</Text>
            <Text>{props.date}</Text>
          </View>
        </View>
        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
          <Text style={{fontSize: 16}}>Subtotal</Text>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>
            {Rupiah(props.hargaSub)}
          </Text>
        </View>
      </View>
      <View style={{backgroundColor: colors.disable, height: 8}} />
    </View>
  );
};

const HistoryOrderDetail = ({navigation, route}) => {

  const [order, setOrder] = useState(route.params.data)
  const [status, setStatus] = useState(route.params.data.status)
  const [statusDelivery, setStatusDelivery] = useState(route.params.data.status_delivery)
  const TOKEN = useSelector((state) => state.TokenApi)
  const [isLoading, setIsLoading] = useState(false)

  const batal = () => {
    setIsLoading(true)
    Axios.get(`${Config.BASE_URL}/api/close/order-cancel/${order.id}`, 
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Accept' : 'application/json' 
        }
      }).then((res) => {
        console.log(res)
        setIsLoading(false)
        navigation.navigate('NotifAlert', {notif :res.data.message})
      }).catch((e) => {
        console.log(e)
        setIsLoading(false)
      })
    // console.log(order.id)
  }

  const terima = () => {
    setIsLoading(true)
    Axios.get(`${Config.BASE_URL}/api/close/delivery-member-update/${order.id}`, 
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Accept' : 'application/json' 
        }
      }).then((res) => {
        console.log(res)
        setIsLoading(false)
        navigation.navigate('NotifAlert', {notif :'Orderan di terima'})
      }).catch((e) => {
        console.log(e)
        setIsLoading(false)
      })
    // console.log(order.id)
  }
  
  if (isLoading) {
    return  (
      <Releoder/>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.btnBack}
          onPress={() => {
            navigation.goBack();
          }}>
          <Icon name="chevron-circle-left" color="#ffffff" size={25} />
        </TouchableOpacity>
        <Text style={styles.textTopUp}>History Order Detail</Text>
      </View>
      <ScrollView>
        <View style={styles.body}>
              {order.products.map((data, index) => {
               return (
                <Item
                  name={data.name}
                  img = {Config.BASE_URL + `${data.img}`}
                  harga={parseInt(data.price)}
                  hargaSub={parseInt(data.price) * parseInt(data.pivot.quantity)}
                  pesanan={index + 1}
                  qty={data.pivot.quantity}
                  status = {route.params.data.status}
                  date = {route.params.data.register}
                  key={data.id}
                  agent = {route.params.data.agents.name}
                  phone = {route.params.data.agents.phone}
                  address = {route.params.data.agents.address}
                />
               )
              })}
          <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
            <Text style={{fontWeight: 'bold', marginBottom: 10}}>
              Ringkasan belanja
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}>
              <Text>Sub Total Item (1 Barang)</Text>
              <Text>{Rupiah(parseInt(order.total))}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}>
              {/* <Text>Biaya Pengiriman (1 Barang)</Text>
              <Text>{Rupiah(0)}</Text> */}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                Total Harga
              </Text>
              <Text style={{fontWeight: 'bold'}}>
                {Rupiah(parseInt(order.total))}
              </Text>
            </View> 
          </View>
          <View style={{backgroundColor: colors.disable, height: 8}} />
          {status == 'pending' &&
            <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'space-around', marginTop : 20}}>
               <ButtonCustom
                name = "Batal"
                width = '90%'
                color = {'#e23e57'}
                func = {() => Alert.alert(
                  'Peringatan',
                  `Batalkan Pesanan ? `,
                  [
                      {
                          text : 'Tidak',
                          onPress : () => console.log('tidak')
                      },
                      {
                          text : 'Ya',
                          onPress : () => batal()
                      }
                  ]
                )}
              />  
            </View>
          }
          {((statusDelivery == 'received' && status == 'approved') || status =='closed' )&&  
            <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'space-around', marginTop : 20}}>
               <ButtonCustom
                name = "Kembali"
                width = '90%'
                color = {colors.btn}
                func = {() => navigation.goBack()}
              />  
            </View>
          }

          {(statusDelivery == 'process' && status == 'approved')&&  
            <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'space-around', marginTop : 20}}>
              <ButtonCustom
                name = "Kembali"
                width = '90%'
                color = {colors.btn}
                func = {() => navigation.goBack()}
              />  
            </View>
          }

          {(status == 'approved' && statusDelivery == 'delivered')&&
            <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'space-around', marginTop : 20}}>
              <ButtonCustom
                name = "Terima"
                width = '90%'
                color = {colors.btn}
                func = {() => Alert.alert(
                  'Peringatan',
                  `Apakah anda sudah menerima Pesanan ? `,
                  [
                      {
                          text : 'Tidak',
                          onPress : () => console.log('tidak')
                      },
                      {
                          text : 'Ya',
                          onPress : () => terima()
                      }
                  ]
                )}
              />  
            </View>
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HistoryOrderDetail;

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
  textTopUp: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft : 10 
  },
  body: {
    // paddingHorizontal : 20,
    marginBottom: 10,
  },
  item: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  borderLogin: {
    borderWidth: 1,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: '#fc8621',
    borderColor: '#fc8621',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    marginTop: 15,
  },
  textBtnLogin: {
    color: '#ffffff',
    fontSize: 18,
  },
});
