import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { ButtonCustom, Header, HeaderComponent, ItemKeranjang, Releoder } from '../../component';
import { colors } from '../../utils/colors';
import { useIsFocused } from '@react-navigation/native';
import { RadioButton } from 'react-native-paper';
import {
  change_to_qty,
  delete_cart,
  delete_cart_all,
  selected_cart,
} from '../../redux';
import { useSelector, useDispatch } from 'react-redux';
import { Rupiah } from '../../helper/Rupiah';
import { Numformat } from '../../helper/Numformat';
import Axios from 'axios';
import Config from "react-native-config";
function useForceUpdate() {
  const [refresh, setRefresh] = useState(0); // integer state
  return () => setRefresh((refresh) => ++refresh); // update the state to force render
}

const Keranjang = ({ navigation }) => {
  const [isSelected, setIsSelected] = useState(false);
  const cartReducer = useSelector((state) => state.PackageReducer);
  const isFocused = useIsFocused();
  // const [qtyInduk, setQtyInduk] = useState(1);
  const [total, setTotal] = useState(0);
  const [bv, setBv] = useState(0);
  const dispatch = useDispatch();
  const [cartState, setCartState] = useState(cartReducer);
  const forceUpdate = useForceUpdate();
  const [checked, setChecked] = useState('user');
  const [activations, setActivations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const TOKEN = useSelector((state) => state.TokenApi);
  const [bvmin, setBvmin] = useState(0);

  useEffect(() => {
    if (isFocused) {
      setIsLoading(true)
      setTotal(cartState.total);
      setBv(cartState.bv);
      setCartState(cartReducer);
      setIsSelected(false);
      getData();
    }
  }, [isFocused, cartState]);

  const checkBvmin = (a,c) => {
    setBvmin(a)
  };

  const getData = async () => {
    Promise.all([apiActivations()]).then(res => {
      setActivations(res[0])
      setIsLoading(false)
    }).catch(e => {
      setIsLoading(false)
    })
  };

  const apiActivations = () => {
    const promise = new Promise((resolve, reject) => {
      Axios.get(Config.API_ACTIVATION_TYPE,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            'Accept': 'application/json'
          }
        }).then((result) => {
          resolve(result.data.data);
          console.log('API_ACTIVATION_TYPE',result.data.data)
        }, (err) => {
          reject(err);
        })
    })
    return promise;
  }

  const quantity = (harga, type, cart) => {
    if (type === 'MIN') {
      if (cart.qty !== 0) {
        setTotal(cartReducer.total - harga);
        if (total <= 0) {
          setTotal(0);
        }
        setBv(cartReducer.bv - harga);
        if (bv <= 0) {
          setBv(0);
        }
      }
    } else if (type === 'PLUSH') {
      setTotal(total + harga);
      setBv(bv + bv);
    }
    // console.log(cart.qty)
    dispatch(change_to_qty(cart.qty, cart.id, harga, type));
  };

  // const tampil = () => {
  //   console.log(cartState);
  // };

  //delete item
  const deleteItem = (id, hargaTotal) => {
    dispatch(delete_cart(id));
    setCartState(cartReducer);
    setTotal(cartReducer.total);
    setBv(cartReducer.bv);
    forceUpdate();
  };

  // delete all item 
  const deleteAll = () => {
    dispatch(delete_cart_all());
    // alert('asasasasasasas')
    setCartState(cartReducer);
    setTotal(cartReducer.total);
    setBv(cartReducer.bv);
    setIsSelected(false);
    forceUpdate();
  };

  //memilih semua keranjang
  const checkAll = () => {
    var trueFalse;
    if (isSelected === false) {
      trueFalse = true;
    } else {
      trueFalse = false;
    }
    dispatch(selected_cart(null, trueFalse));
  };

  if (isLoading) {
    return (
      <Releoder />
    )
  }

  return (
    <View style={styles.container}>
      <HeaderComponent />
      <View style={styles.contentHeader}>
        <Text style={styles.textKeranjang}>Pilih Tipe:</Text>
        {activations.map((item) => {
          let nama_paket=item.name
          nama_paket = nama_paket.charAt(0).toUpperCase() + nama_paket.slice(1);
          let bv_min = item.bv_min * 1000
          return (
            <View style={styles.boxRadio}>
              <View style={{ width: '10%' }} >
                <RadioButton
                  value={item.name}
                  status={checked === item.name ? 'checked' : 'unchecked'}
                  onPress={() => checkBvmin(bv_min,setChecked(item.name)) }
                />
              </View>
              <View style={{ width: '90%' }} >
                <Text style={{ textAlign: 'left', paddingTop: 10 }}>Paket {nama_paket} (min {Numformat(bv_min)} bv)</Text>
              </View>
            </View>
          );
        })}   
      </View>

      <View style={styles.contentHeader}>
        <Text style={styles.textKeranjang}>Keranjang Paket:</Text>
        <View style={styles.boxTitle}>
          <View style={styles.title}>
            <CheckBox
              onChange={checkAll}
              value={isSelected}
              onValueChange={setIsSelected}
              style={styles.checkbox}
            />
            <Text>Pilih Semua Barang</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              deleteAll();
            }}>
            <Text style={styles.textHapus}>Hapus</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.scroll}>
        {cartState.item.map((cart) => {
          return (
            <ItemKeranjang
              key={cart.id}
              selected={isSelected}
              // selectedFalse={() => {selectedFalse()}}
              cart={cart}
              btnMin={() => {
                quantity(cart.harga, 'MIN', cart);
              }}
              btnPlush={() => {
                quantity(cart.harga, 'PLUSH', cart);
              }}
              deleteItem={() => {
                deleteItem(cart.id, cart.qty * cart.harga);
              }}
            />
          );
        })}
      </ScrollView>
      <View style={styles.boxTotal}>
        <View>
          <Text style={styles.textTotal}>{Rupiah(total)}</Text>
          <Text style={styles.hargaTotal}>({Numformat(bv)} bv)</Text>
        </View>
        <ButtonCustom
          name='Tambah'
          width='30%'
          color={colors.btn_primary}
          func={() => { navigation.navigate('Products') }}
        />
        {cartState.item.length == 0 ?
          (
            <ButtonCustom
              name='Checkout'
              width='30%'
              color={colors.disable}
              func={() => alert('Keranjang Kosong')}
            />
          )
          :
          bvmin > bv ?
          (
            <ButtonCustom
              name='CheckOut'
              width='30%'
              color={colors.disable}
              func={() => alert('BV kurang atau masih dibawah batasan minimum.')}
            />
          )
          :
          (
            <ButtonCustom
              name='CheckOut'
              width='30%'
              color={colors.btn}
              func={() => alert('BV cukup.'+bvmin+'-'+bv)}
            />
          )
        }

      </View>
    </View>
  );
};

export default Keranjang;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  boxRadio: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contentHeader: {
    paddingHorizontal: 20,
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.disable,
  },
  textKeranjang: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  boxTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    // justifyContent : 'space-between',
    marginTop: 30,
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  textHapus: {
    // marginLeft: 140,
    color: colors.default,
    fontWeight: 'bold',
  },
  line: {
    marginTop: 10,
    borderColor: colors.disable,
    borderWidth: 4,
  },
  boxTotal: {
    // alignItems: "flex-end",
    height: 60,
    // backgroundColor : 'red',
    paddingHorizontal: 20,
    paddingTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.disable,
  },
  textTotal: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  hargaTotal: {
    fontSize: 16,
  },
  btnBeli: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  borderBtn: {
    borderWidth: 2,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 10,
    justifyContent: 'center',
    borderColor: '#ff781f',
    backgroundColor: '#ff781f',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
