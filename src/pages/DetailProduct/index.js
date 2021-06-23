import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image, Dimensions, Alert, ActivityIndicator} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import {productImage, productImage2} from '../../assets';
import {Header, Header2, HeaderComponent, Releoder} from '../../component';
import {colors} from '../../utils/colors';
import Axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import {add_to_cart} from './../../redux';
import {Rupiah} from '../../helper/Rupiah';
import {useIsFocused} from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Config from "react-native-config";

const width = Dimensions.get('window').width;

const DetailProduct = ({navigation, route}) => {
  function useForceUpdate() {
    const [refresh, setRefresh] = useState(0); // integer state
    return () => setRefresh((refresh) => ++refresh); // update the state to force render
  }

  // cara ambil data dari params yang dikirimkan dengan navigation {route.params.id}
  const [product, setProduct] = useState({});
  // const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const cartReducer = useSelector((state) => state.CartReducer.item);
  const userReducer = useSelector((state) => state.UserReducer);
  const dispatch = useDispatch();
  // const forceUpdate = useForceUpdate();
  const TOKEN = useSelector((state) => state.TokenApi);

  var penanda = false;

  useEffect(() => {
    getDataProduct();
    console.log('produk prodyk')
  }, []);

  const getDataProduct = () => {
    Axios.get(`${Config.API_PRODUCT}${route.params.id}`, {
      headers : {
        Authorization: `Bearer ${TOKEN}`,
        'Accept' : 'application/json' 
      }
    })
    .then((res) => {
      setProduct(res.data.data);
      setLoading(false);
      console.log('notif', res.data.message)
    });
  };

  var item = {
    id: null,
    id_user: null,
    namaProduct: '',
    harga: null,
    selected: false,
    qty: null,
    note: '',
    status: '',
  };
  
  const insertCart = () => {
        if(userReducer.status === 'active'){
              item.id= product.id
            item.namaProduct= product.name
            item.harga= parseInt(product.price)
            item.selected= false
            item.qty= 1
            item.note= ''
            item.img = product.img
            item.status= 'pending'

        
          // mencari data jika ada yang sama di keranjang
          cartReducer.some(function (entry, i) {
            if (entry.id == product.id) {
              penanda = true;
              return true;
            }
          });
          console.log(penanda);

          if (!penanda) {
            dispatch(add_to_cart(item, 1));
            navigation.navigate('Dashboard');
            Alert.alert('Add to Cart');
          } else {
            Alert.alert('item sudah ada di dalam keranjang');
        }
      }else{
        alert('Mohon melakukan activasi dahulu')
      }

    // console.log(userReducer.status)
  };

  const tampil = () => {
    console.log(userReducer);
  };

  if (loading) {
    return (
      <Releoder/>
    )
  }
  return (
    <SafeAreaView style={styles.container}>
        <View style={{flex : 1}}>
          <Header2 title ='Produk Detail' btn={() => navigation.goBack()}/>
          <ScrollView>
            <View style={styles.container}>
              <ScrollView
                style={styles.scrollImage}
                pagingEnabled
                horizontal
                showsHorizontalScrollIndicator={false}>
                <View style={styles.borderImage}>
                  <Image
                    source={{uri: `${Config.BASE_URL}/${product.img}`}}
                    style={styles.image}
                  />
                </View>
              </ScrollView>
              {/* <View style={styles.content}> */}
              <View style={styles.contentTitle}>
                <Text style={styles.harga}> {Rupiah(parseInt(product.price))} </Text>
                <Text style={styles.title}> {product.name} </Text>
                <View style={styles.contentTerjual}>
                  <Text style={styles.textTerjual}> Terjual 20</Text>
                  <Text style={styles.bintang}>
                    {' '}
                    <Icon name="star" style={styles.star} /> 4.8 (9)
                  </Text>
                </View>
              </View>
              <View style={styles.line} />
              <View style={styles.contentInfo}>
                <Text style={styles.textInfo}>Informasi Produk</Text>
                <View style={styles.infoProduk}>
                </View>
                <View style={styles.infoProduk}>
                  <Text style={styles.info}>Kondisi</Text>
                  <Text style={styles.info}>Baru</Text>
                </View>
                <View style={styles.infoProduk}>
                  <Text style={styles.info}>Pemesanan min</Text>
                  <Text style={styles.info}>1 Buah</Text>
                </View>
                <View style={styles.infoProduk}>
                  <Text style={styles.info}>Date</Text>
                  <Text style={styles.info}>{product.updated_at}</Text>
                </View>
              </View>
              <View style={styles.line} />
              <View style={styles.contentInfo}>
                <Text style={styles.textInfo}>Deskripsi</Text>
                <Text style={styles.title}>{product.description}</Text>
                <Text>{product.deskripsi}</Text>
              </View>
              {/* </View> */}
            </View>
          </ScrollView>
        </View>
        <View style={{height : 40, backgroundColor : 'red'}}>
          <View style={styles.borderButton}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.buttonChat} onPress={tampil}>
                <Icon name="comment" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonCheckout}>
                <Text style={styles.textCheckout}>Langsung beli</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonCart}
                // onPress={() => navigation.navigate('Keranjang')}
                onPress={() => {
                  insertCart();
                }}>
                <Text style={styles.textCart}> Tambah keranjang</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
    </SafeAreaView>
  );
};

export default DetailProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    // paddingBottom: 100,
  },
  borderImage: {
    // borderTopWidth: 1,
    borderColor: colors.disable,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    flexDirection: 'row',
  },
  image: {
    // width : width,
    flex: 1,
    height: 350,
    width: width,
    resizeMode: 'stretch',
  },
  content: {
    padding: 20,
  },
  harga: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  contentTitle: {
    padding: 20,
  },
  title: {
    color: colors.dark,
    letterSpacing: 2,
    fontSize: 15,
    paddingVertical: 10,
    fontWeight: 'bold',
  },
  contentTerjual: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  textTerjual: {
    color: colors.dark,
  },
  bintang: {
    marginLeft: 15,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 3,
    textAlign: 'center',
    borderColor: colors.dark,
    color: colors.dark,
  },
  star: {
    color: 'yellow',
    fontSize: 20,
    textAlign: 'center',
  },
  line: {
    marginTop: 10,
    borderColor: colors.disable,
    borderWidth: 4,
  },
  contentInfo: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  textInfo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoProduk: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  borderButton: {
    flex: 1,
    flexDirection: 'row',
    // flexDirection : "row",
    alignItems: 'flex-end',
  },
  buttonContainer: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    width: width,
    // height: 100,
    // borderWidth : 1,
    color: colors.disable,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    borderTopColor: colors.disable,
    borderTopWidth: 1,
    justifyContent: 'space-between',
    position: 'relative',
    paddingHorizontal: 20,
    // marginTop : 100
  },
  buttonChat: {
    marginTop: 6,
    // marginLeft: 20,
    borderWidth: 2,
    paddingHorizontal: 8,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#28df99',
    borderColor: '#28df99',
  },
  icon: {
    color: '#ffffff',
    fontSize: 20,
  },
  buttonCheckout: {
    marginTop: 6,
    marginLeft: 10,
    borderWidth: 2,
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 10,
    borderColor: colors.btn,
  },
  buttonCart: {
    marginTop: 6,
    // marginLeft: 10,
    borderWidth: 2,
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 10,
    borderColor: '#ff781f',
    // borderColor : 'green'
    backgroundColor: '#ff781f',
  },
  textCheckout: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.btn,
  },
  textCart: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  scrollImage: {
    width: width,
    height: 350,
  },
});
