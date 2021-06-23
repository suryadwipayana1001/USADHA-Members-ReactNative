import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Image, ScrollView, ActivityIndicator} from 'react-native';
import {colors} from '../../utils/colors';
import {useIsFocused} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {Rupiah} from '../../helper/Rupiah';
import Axios from 'axios';
import {check_out_keranjang, delete_cart_all} from '../../redux';
import { TransaksiProduct } from '../../helper/TransaksiProduct';
import { ButtonCustom, Header2, Releoder } from '../../component';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert } from 'react-native';
import Config from 'react-native-config';

const Item = (props) => {
  return (
    <View>
      <View
        style={{marginBottom: 10, paddingHorizontal: 20, paddingVertical: 10}}>
        <Text style={{fontWeight: 'bold'}}>Pesanan {props.pesanan}</Text>
        <Text style={{letterSpacing: 2}}>Usadha Bhakti</Text>
        <View style={styles.item}>
          <Image source={props.img} style={{width: 80, height: 80}} />
          <View style={{marginLeft: 10, marginBottom: 15}}>
            <Text style={{fontWeight: 'bold'}}>{props.name}</Text>
            <Text style={{fontWeight: 'bold'}}>Random</Text>
            <Text style={{color: colors.dark}}>
              {props.qty} barang (250 gr)
            </Text>
            <Text style={{fontWeight: 'bold'}}>{Rupiah(props.harga)}</Text>
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

const CheckOut = ({navigation, route}) => {
  const userReducer = useSelector((state) => state.UserReducer);
  const [agen, setAgen] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const cartReducer = useSelector((state) => state.CartReducer);
  const isFocused = useIsFocused();
  const [cartState, setCartState] = useState(cartReducer);
  const dispatch = useDispatch();
  const [point, setPoint] = useState(0);
  const [total, setTotal] = useState(0);
  const TOKEN = useSelector((state) => state.TokenApi);
  var pesanan = 0;
  const dataCart=[]
  let isMounted = true
  
  useEffect(() => {
    isMounted = true
    cartState.item.map((cart) => {
      dataCart[dataCart.length] = {
        products_id : cart.id,
        price : cart.harga,
        quantity : cart.qty,
        // name : 'asasasas'
      };
      setTotal (cart.harga * cart.qty)
    })

    setOrders({
      ...orders,
      cart : dataCart
    })
    // setIsLoading(false)

    Axios.get(Config.API_POINT + `${userReducer.id}`, {
      headers : {
        Authorization: `Bearer ${TOKEN}`,
        'Accept' : 'application/json' 
      }
    })
    .then((result) => {
      // console.log('data point api', result.data)
      if(isMounted){
        setIsLoading(false)
      setPoint(parseInt(result.data.data[0].balance_points))
      }
    });

    return () => { isMounted = false };
  }, [isFocused]);
  
  const dateRegister = () => {
    var todayTime = new Date();
    var month = todayTime.getMonth() + 1;
    var day = todayTime.getDate();
    var year = todayTime.getFullYear();
    return year + "-" + month + "-" + day;
  }
  
  const [orders, setOrders] = useState({
    register: dateRegister(),
    customers_id: userReducer.id,
    memo: "",
    agents_id : route.params.dataAgen.id,
    cart: dataCart,
  });
  
  const ordersData = () => {
    
      if(point >= total){
        setIsLoading(true)
        Axios.post(Config.API_ORDER, orders,
          {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
              'Accept' : 'application/json' ,
              'content-type': 'application/json'
            }
          }
        ).then((result) => {
          if(result.data.success == true ){
            console.log(result.data)
            setOrders(null);
            dispatch(check_out_keranjang());
            // alert('Pesanan anda sedang di buat')
            navigation.navigate('NotifAlert', {notif : 'Pesanan anda Berhasil'})
            setIsLoading(false)
          }else{
            alert('point anda kurang')
          }
          setIsLoading(false)
        }).catch((error) => {
          // alert(' ' + error);
          navigation.navigate('CheckOut')
          alert('pesanan gagal di buat')
          setIsLoading(false)
        });
      }else{
        // navigation.navigate('CheckOut')
        alert('point anda kurang');
      }
  };

  if (isLoading) {
    return  (
      <Releoder/>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header2 title ='Checkout' btn={() => navigation.goBack()}/>
      <ScrollView>
        <View style={styles.body}>
        {cartState.item.map((cart) => {
            pesanan++;
            return (
              <Item
                name={cart.namaProduct}
                img = {{uri : Config.BASE_URL + `${cart.img}`}}
                harga={cart.harga}
                hargaSub={cart.harga * cart.qty}
                pesanan={pesanan}
                qty={cart.qty}
                key={cart.id}
              />
            );
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
              <Text>Agen </Text>
              <Text>
                {route.params.dataAgen.name}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}>
              <Text>Sub Total Item ({cartReducer.item.length} Barang)</Text>
              <Text>{Rupiah(cartReducer.total)}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}>
              <Text>Biaya Pengiriman ({cartReducer.item.length} Barang)</Text>
              <Text>{Rupiah(0)}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                Total Harga ({cartReducer.item.length} Barang)
              </Text>
              <Text style={{fontWeight: 'bold'}}>
                {Rupiah(cartReducer.total)}
              </Text>
            </View> 
          </View>
          <View style={{backgroundColor: colors.disable, height: 8, alignItems : 'center', justifyContent : 'center'}} />
            <View style={{justifyContent : 'center', alignItems : 'center', marginTop : 20}}>
              <ButtonCustom
                name = 'Buat Pesanan'
                width = '90%'
                color = {colors.btn}
                func = {() => Alert.alert(
                  'Peringatan',
                  `Checkout sekarang ? `,
                  [
                      {
                          text : 'Tidak',
                          onPress : () => console.log('tidak')
                      },
                      {
                          text : 'Ya',
                          onPress : () => ordersData()
                      }
                  ]
              )}
              />
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CheckOut;

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
  },
  body: {
    // paddingHorizontal : 20,
    marginBottom: 10,
  },
  item: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
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
