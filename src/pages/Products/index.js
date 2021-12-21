import { useIsFocused } from '@react-navigation/native';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import Config from "react-native-config";
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { profile } from '../../assets';
import { ButtonCustom, Header2, Releoder } from '../../component';
import { colors } from '../../utils/colors';
import { Image, StyleSheet, Text, View, FlatList, TextInput, Alert } from 'react-native';
import { Rupiah } from '../../helper/Rupiah';
import { useSelector, useDispatch } from 'react-redux';
import { add_to_package } from './../../redux';

const List = (props) => {
  return (
    <TouchableOpacity onPress={props.select}>
      <View style={styles.body(props.selectAgen)}>
        <Image source={{ uri: `${Config.BASE_URL}/${props.img}` }} style={styles.image} />
        <Text style={styles.textNama}>{props.nama}</Text>
        <Text style={styles.textNama}>{Rupiah(parseInt(props.price))}</Text>
        <Text style={styles.textNama}>{props.description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const Products = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState(null);
  const TOKEN = useSelector((state) => state.TokenApi);
  const [selectProduct, setSelectProduct] = useState(null)
  const isFocused = useIsFocused()
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState()
  const [refresh, setRefresh] = useState(false)
  const [find, setFind] = useState('')
  const [form, setForm] = useState({
    customer_id: '',
    phone: '',
  })
  const cartReducer = useSelector((state) => state.PackageReducer.item);
  const userReducer = useSelector((state) => state.UserReducer);
  const dispatch = useDispatch();
  const dataForm = route.params.dataForm;
  const dataType = route.params.dataType;
  // var penanda = false;

  useEffect(() => {
    // alert('use eff')
    if (isFocused) {
      setIsLoading(true)
      getData()
    } else {
      setPage(1)
      setProducts([])
    }
  }, [isFocused, page]);

  const filter = () => {
    setIsLoading(true)
    getData();
  }

  const getData = async () => {
    Promise.all([apiProducts()]).then(res => {
      if (page > 1) {
        setProducts(products.concat(res[0].data))
        // resetData = false
      } else {
        setProducts(res[0].data)
      }
      console.log('getData', res[0].data)
      setLastPage(res[0].data.last_page)
      setIsLoading(false)
      setRefresh(false)
    }).catch(e => {
      setIsLoading(false)
      setRefresh(false)
    })
  };

  const apiProducts = () => {
    const promise = new Promise((resolve, reject) => {
      Axios.get(Config.API_LIST_PRODUCT_MEMBER + `?page=${page}&keyword=${find}`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            'Accept': 'application/json'
          }
        }).then((result) => {
          resolve(result.data);
        }, (err) => {
          reject(err);
          alert('error')
        })
    })
    return promise;
  }

  const handleLoadMore = () => {
    // alert('load more'+'-'+page+'-'+lastPage)
    if (page < lastPage) {
      setPage(page + 1);
    }
  }

  const onRefresh = () => {
    setRefresh(true)
  }

  useEffect(() => {
    // alert('refresh')
    getData()
  }, [refresh])

  var item = {
    id: null,
    id_user: null,
    namaProduct: '',
    harga: null,
    selected: false,
    qty: null,
    note: '',
    status: '',
    weight: '',
    img: '',
    bv: null,
  };

  const insertCart = (product) => {
    item.id = product.id
    item.namaProduct = product.name
    item.harga = parseInt(product.price)
    item.selected = false
    item.qty = 1
    item.note = ''
    item.img = product.img
    item.status = 'pending'
    item.weight = parseFloat(product.weight)
    item.bv = parseInt(product.bv)

    // mencari data jika ada yang sama di keranjang
    let penanda = false;
    cartReducer.some(function (entry, i) {
      if (entry.id == product.id) {
        penanda = true;
        return true;
      }
    });
    console.log(penanda);

    if (!penanda) {
      dispatch(add_to_package(item, 1));
      navigation.navigate('Package', { dataForm: dataForm, dataType: dataType });
      Alert.alert('Add to Package');
    } else {
      Alert.alert('item sudah ada di dalam keranjang');
    }

    // console.log(userReducer.status)
  };

  const renderItem = ({ item }) => {
    let productimg = item.img;
    if (productimg != null && productimg != "") {
      productimg = productimg.replace("/public", "");
    }
    return (
      <List
        nama={item.name}
        price={item.price}
        description={item.description}
        selectProduct={selectProduct ? (item.id == selectProduct.id ? true : false) : false}
        select={() => {
          insertCart(item);
        }}
        key={item.id}
        img={productimg}
      />
    )
  }

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          marginVertical: 10
        }}
      />
    );
  };


  if (isLoading) {
    return (
      <Releoder />
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <View style={styles.container}>
        <Header2 title='Pilih Product' btn={() => navigation.goBack()} />
        <View
          style={{
            marginVertical: 10
          }}
        />
        <View style={{ flexDirection: 'row' }}>
          <TextInput style={styles.search} value={find} onChangeText={(item) => setFind(item)} ></TextInput>
          <ButtonCustom
            name='Filter'
            width='30%'
            color={colors.btn}
            func={() => { setPage(1); filter() }}
          />
        </View>
        <View
          style={{
            marginVertical: 10
          }}
        />
        <FlatList
          // ListHeaderComponent={<Text>Hallo</Text>}
          keyExtractor={(item, index) => index.toString()}
          data={products}
          ItemSeparatorComponent={ItemSeparatorView}
          contentContainerStyle={{ alignItems: 'center' }}
          renderItem={renderItem}
          ListFooterComponent={isLoading ? <Text>Sedang Memuat</Text> : null}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          onRefresh={onRefresh}
          refreshing={refresh}
        />
      </View>

    </SafeAreaView>
  );
};

export default Products;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  body: (select) => ({

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
    borderWidth: 1,
    elevation: 5,
    marginBottom: 10,
    backgroundColor: select ? colors.default : '#ffffff'
  }),
  search: {
    backgroundColor: '#ffffff',
    width: '60%',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#bbbbbb',
    paddingHorizontal: 20,
    marginRight: 10,
    marginLeft: 10
  },
  image: {
    height: 200,
    width: '100%',
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
    marginTop: 10,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center'
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
  textAgent: {
    paddingHorizontal: 20,
    fontSize: 20,
    marginTop: 10,
    borderWidth: 1,
    marginHorizontal: 20,
    paddingVertical: 3,
    borderRadius: 5,
    fontWeight: 'bold',
    backgroundColor: '#fbf6f0',
    borderColor: colors.default,
    color: colors.default,
    letterSpacing: 1
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
