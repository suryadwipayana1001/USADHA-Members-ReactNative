import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  RefreshControl,
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  Image
} from 'react-native';
import {HeaderComponent, TopUp, Promo, Releoder,Header, ButtonCustom} from '../../component';
// import {DashboardProduct} from '../../component/Product';
import {colors} from '../../utils/colors';
import {useSelector} from 'react-redux';
import Axios from 'axios';
import { Rupiah } from '../../helper/Rupiah';
import {useIsFocused} from '@react-navigation/native';
import {
  profile,
  promo1,
  promo2,
  promo3,
} from '../../assets';
import Config from "react-native-config";
import { BackHandler } from 'react-native';
const wait = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

const Dashboard = ({navigation}) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [products, setProducts] = useState({});
  const [isLoading, setLoading] = useState(true);
  const userReducer = useSelector((state) => state.UserReducer);
  const TOKEN = useSelector((state) => state.TokenApi);
  const [point, setPoint] = useState(0)
  const isFocused = useIsFocused();
  const [notifBagde, setNotifBadge] = useState(0)
  const source = Axios.CancelToken.source();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getPoint()
    wait(1000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    if(TOKEN == ''){
      navigation.replace('Login')
    }else{
     if(isFocused){
        getProduct();
      }
    }
  }, [isFocused])
 
  const menuTopUpHistoryTrasnfer = (type) => {
    if (type === 'topUp') {
      navigation.navigate('TopUp');
    } else if (type === 'history') {
      navigation.navigate('History');
    } else if (type === 'transfer') {
      navigation.navigate('Transfer');
    }
  };

  const getProduct = () => {
    Axios.get(Config.API_LIST_PRODUCT_MEMBER, 
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          // cancelToken : source.token,
          'Accept' : 'application/json' ,
        }
      }
    ).then((result) => {
      // console.log('result : ', result.data);
      setProducts(result.data);
      getPoint();
    }).catch((error) => {
      console.log('error ' + error);
      alert('koneksi error, mohon buka ulang aplikasinya')
      BackHandler.exitApp()
   });
  };

  const getPoint = () => {
    Axios.get(Config.API_POINT + userReducer.id, {
      headers : {
        Authorization: `Bearer ${TOKEN}`,
        // cancelToken : source.token,
        'Accept' : 'application/json' 
      }
    })
    .then((result) => {
      // console.log('data point api', result.data.data[0].balance_points)
      setPoint(parseInt(result.data.data[0].balance_points))
      countNotifBadge();
    }).catch(() => {
      alert('koneksi error, mohon buka ulang aplikasinya')
      BackHandler.exitApp()
    })
  }

  const countNotifBadge = () => {
    Axios.post(Config.API_UNREAD_LOGS, {customers_id : userReducer.id},{
      headers : {
        Authorization: `Bearer ${TOKEN}`,
        // cancelToken : source.token,
        'Accept' : 'application/json' 
      }
    })
    .then((result) => {
      // console.log('data point api', result.data.data[0].balance_points)
      // console.log(result.data.count)
      setNotifBadge(result.data.count)
      setLoading(false)
    }).catch(() => {
      alert('koneksi error, mohon buka ulang aplikasinya')
      BackHandler.exitApp()
    })
  }

  // if(source){
  //   source.cancel(getProduct()) 
  // }
  
  if (isLoading) {
    return  (
        <Releoder/>
    )
  }

  return (
    <View style={styles.container}>
      <HeaderComponent notif = {notifBagde}  navigasi= {()=>navigation.navigate('LogNotif') } boll = {true}/>
      <ScrollView
        // scrollEnabled={true}
        // contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.contentHeader}>
          <Text style={styles.textRp}>Saldo Poin </Text>
          <Text style={styles.textRp}>{Rupiah(point)}</Text>
          <View style={{position:'absolute', alignItems : 'center', justifyContent : 'center', width : '100%', marginLeft: 20}}>
            {userReducer.img == null || userReducer.img == '' ?  
              <Image
                  source={profile}
                  style={{height: 70, width: 70, borderRadius : 50, marginBottom : 5}}
              /> : 
              <Image
                source = {{uri : `${Config.BASE_URL}${userReducer.img}?time` + new Date()}}
                style={{height: 70, width: 70, borderRadius : 50, marginBottom : 5}}
              />
            }
             <Text style={{color : '#ffffff', fontWeight : 'bold'}}>{userReducer.name + ' - ' + userReducer.code}</Text>
          </View>
          <View style={styles.topUp}>
            <TopUp
              name="Top Up"
              icon="plus-circle"
              menu={() => {
                menuTopUpHistoryTrasnfer('topUp');
              }}
              color="#ec524b"
            />
            <TopUp
              name="Transfer"
              icon="random"
              menu={() => {
                menuTopUpHistoryTrasnfer('transfer');
              }}
              color="#0e49b5"
            />
            <TopUp
              name="History"
              icon="history"
              menu={() => {
                menuTopUpHistoryTrasnfer('history');
              }}
              color="#03c4a1"
            />
          </View>
        </View>
        {/* content --header */}
        <View style={styles.line}/>
        <View style={styles.promo}>
          <View style={styles.headerPromo}>
            <Text style={styles.textPromo}> Info Dan Promo Spesial</Text>
            <TouchableOpacity>
              <Text style={styles.textlihatPromo}> Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal pagingEnabled>
            <Promo sourceimage={promo1} />
            <Promo sourceimage={promo2} />
            <Promo sourceimage={promo3} />
          </ScrollView>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 10,
            }}>
          </View>
        </View>
        <View style={styles.line}/>
        <View style={{width : '100%',
            height : '85%',
            padding : 5,
            flexDirection : 'row',
            flexWrap : 'wrap',
            backgroundColor : '#ffffff'}}>
         {products.map((product)=> {
          let productimg = product.img;
          if(productimg != null && productimg !=""){
            productimg  = productimg.replace("/public", "");
          }
          return(
            <TouchableOpacity style={{width : '50%', backgroundColor : '#ffffff', height : 300, padding : 5, marginBottom : 5,}} onPress ={() => navigation.navigate('DetailProduct', {id: product.id})} key={product.id}>
              <View style={{ padding : 5, height :290, borderRadius : 3, borderWidth : 0.1, borderColor : colors.disable, backgroundColor:'#f9fcfb'}}>
                <View style={{flex:1}}>
                  <Text style={{marginTop : 8, fontWeight : 'bold'}}>{product.name}</Text>
                  <Image style={styles.imageProduct} source = {{uri : `${Config.BASE_URL}/${productimg}`}}/>
                  <Text style={{marginVertical : 10}}>{Rupiah(parseInt(product.price))}</Text>
                  <Text>{product.description}</Text>
                </View>
                {/* <View style={{height : 50, backgroundColor : 'red', alignItems : 'center'}}>
                  <ButtonCustom
                    width='70%'
                    name= 'Detail'
                    color={colors.btn}
                    radius = {5}
                  />
                </View> */}
              </View>
            </TouchableOpacity>
          )
         })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor : '#ffffff'
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentHeader: {
    paddingHorizontal: 20,
    backgroundColor: colors.default,
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    height: 150,
    marginBottom: 50,
  },
  textName : {
    color : '#ffffff',
  },  
  textSaldo: {
    letterSpacing: 2,
    color: '#ffffff',
    fontWeight: '500',
  },
  textRp: {
    marginVertical: 5,
    fontWeight: 'bold',
    color: '#ffffff',
    fontSize: 15,
    width : 120
  },
  textHarga: {
    fontSize: 20,
    letterSpacing: 2,
  },
  point: {
    color: 'gold',
  },
  topUp: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    justifyContent: 'space-around',
    borderRadius: 10,
    height: 70,
    marginTop: 45,
    alignItems: 'center',
    borderColor: '#e8e8e8',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  line: {
    borderWidth: 3,
    borderColor: '#e8e8e8',
  },
  promo: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  headerPromo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    alignItems: 'center',
  },
  textPromo: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  textlihatPromo: {
    letterSpacing: 1,
    color: '#ff781f',
  },
  product: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    flexWrap: 'wrap',
  },
  imageProduct : {
    height : 100,
    width : '100%',
    marginTop : 10,
    resizeMode : 'stretch'
  }
});

export default Dashboard;