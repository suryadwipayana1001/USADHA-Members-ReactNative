import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { ButtonCustom, Header, HeaderComponent, ItemKeranjang, Releoder } from '../../component';
import { colors } from '../../utils/colors';
import { useIsFocused } from '@react-navigation/native';
import { RadioButton } from 'react-native-paper';
import {
  change_to_package_qty,
  delete_package,
  delete_package_all,
  selected_package,
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

const Package = ({ navigation, route }) => {
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
  const dataForm = route.params.dataForm;
  const dataType = route.params.dataType;
  const [activationType, setActivationType] = useState(1);
  const [checkeddef, setCheckeddef] = useState(0);

  useEffect(() => {
    console.log('cartReducer', cartReducer)
    console.log('dataFormm', dataForm)
    console.log('dataType', dataType)
    if (isFocused) {
      setIsLoading(true)
      setTotal(cartState.total);
      setBv(cartState.bv);
      setCartState(cartReducer);
      setIsSelected(false);
      getData();
    }
  }, [isFocused, cartState]);

  const checkBvmin = (a, b, c) => {
    setBvmin(a)
    setActivationType(b)
  };

  const getData = async () => {
    // console.log('dataType',dataType)    
    Promise.all([apiActivations()]).then(res => {
      // console.log('apiActivations', res[0])
      // console.log('dataForm.activations.id', dataForm.activations.id)
      let dataActivationsArr = []
      let bvPrev = 0
      let firstSelected = 0
      if (dataType == 'Upgrade') {
        console.log('Upgrade',dataType)
        let dataActivations = res[0]
        dataActivations.map((item, index) => {
          if (item.id == dataForm.activations.id) {
            bvPrev = item.bv_min
          }
          if (item.id > dataForm.activations.id) {
            dataActivationsArr[index] = { id: item.id, name: item.name, type: item.type, bv_min: item.bv_min - bvPrev, bv_max: item.bv_max - bvPrev }
            if (firstSelected == 0 && checkeddef==0) {
              setChecked(item.name)
              setBvmin((item.bv_min - bvPrev)*1000)
              setActivationType(item.id)
              setCheckeddef(1)
            }
            firstSelected = firstSelected + 1
          }
        })
        // console.log('dataActivationsArr',dataActivationsArr)
        setActivations(dataActivationsArr)
      } else {
        console.log('Not Upgrade',dataType)
        setActivations(res[0])
      }
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
          console.log('API_ACTIVATION_TYPE', result.data.data)
        }, (err) => {
          reject(err);
        })
    })
    return promise;
  }

  const quantity = (harga, bvv, weight, type, cart) => {
    console.log('cartReducer cqty', cartReducer)
    if (type === 'MIN') {
      let totale = cartReducer.total - harga
      setTotal(totale);
      if (totale <= 0) {
        setTotal(0);
      }
      let bve = cartReducer.bv - bvv
      setBv(bve);
      if (bve <= 0) {
        setBv(0);
      }
    } else if (type === 'PLUSH') {
      let totale = cartReducer.total + harga
      setTotal(totale);
      if (totale <= 0) {
        setTotal(0);
      }
      let bve = cartReducer.bv + bvv
      setBv(bve);
      if (bve <= 0) {
        setBv(0);
      }
    }
    console.log('cart', cart)
    dispatch(change_to_package_qty(cart.qty, cart.id, harga, bvv, weight, type));
    setCartState(cartReducer);
  };

  // const tampil = () => {
  //   console.log(cartState);
  // };

  //delete item
  const deleteItem = (id, hargaTotal) => {
    console.log('cartReducer awal del', cartReducer)
    dispatch(delete_package(id));
    setCartState(cartReducer);
    setTotal(cartReducer.total);
    setBv(cartReducer.bv);
    forceUpdate();
    console.log('cartReducer del', cartReducer)
  };

  // delete all item 
  const deleteAll = () => {
    console.log('cartReducer awal del all', cartReducer)
    dispatch(delete_package_all());
    // alert('asasasasasasas')
    setCartState(cartReducer);
    setTotal(cartReducer.total);
    setBv(cartReducer.bv);
    setIsSelected(false);
    forceUpdate();
    console.log('cartReducer del all', cartReducer)
  };

  //memilih semua keranjang
  const checkAll = () => {
    var trueFalse;
    if (isSelected === false) {
      trueFalse = true;
    } else {
      trueFalse = false;
    }
    dispatch(selected_package(null, trueFalse));
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
          let nama_paket = item.name
          nama_paket = nama_paket.charAt(0).toUpperCase() + nama_paket.slice(1);
          let bv_min = item.bv_min * 1000
          return (
            <View style={styles.boxRadio}>
              <View style={{ width: '10%' }} >
                <RadioButton
                  value={item.name}
                  status={checked === item.name ? 'checked' : 'unchecked'}
                  onPress={() => checkBvmin(bv_min, item.id, setChecked(item.name))}
                />
              </View>
              <View style={{ width: '90%' }} >
                <Text style={{ textAlign: 'left', paddingTop: 10 }}>Paket {nama_paket} ({item.id != 4 ? item.bv_min +' - '+ item.bv_max : 'min '+Numformat(item.bv_min)} bv)</Text>
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
                quantity(cart.harga, cart.bv, cart.weight, 'MIN', cart);
              }}
              btnPlush={() => {
                quantity(cart.harga, cart.bv, cart.weight, 'PLUSH', cart);
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
          <Text style={styles.hargaTotal}>({Numformat(bv/1000)} bv)</Text>
        </View>
        <ButtonCustom
          name='Tambah'
          width='30%'
          color={colors.btn_primary}
          func={() => { navigation.navigate('Products', { dataForm: dataForm, dataType: dataType }) }}
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
                func={() => navigation.navigate('Agen', { dataForm: dataForm, dataType: dataType, activationType: activationType })}
              />
            )
        }

      </View>
    </View>
  );
};

export default Package;

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
