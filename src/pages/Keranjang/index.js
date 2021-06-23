import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {ButtonCustom, Header, HeaderComponent, ItemKeranjang} from '../../component';
import {colors} from '../../utils/colors';
import {useIsFocused} from '@react-navigation/native';
import {
  change_to_qty,
  delete_cart,
  delete_cart_all,
  selected_cart,
} from '../../redux';
import {useSelector, useDispatch} from 'react-redux';
import {Rupiah} from '../../helper/Rupiah';
function useForceUpdate() {
  const [refresh, setRefresh] = useState(0); // integer state
  return () => setRefresh((refresh) => ++refresh); // update the state to force render
}

const Keranjang = ({navigation}) => {
  const [isSelected, setIsSelected] = useState(false);
  const cartReducer = useSelector((state) => state.CartReducer);
  const isFocused = useIsFocused();
  // const [qtyInduk, setQtyInduk] = useState(1);
  const [total, setTotal] = useState(0);
  const dispatch = useDispatch();
  const [cartState, setCartState] = useState(cartReducer);
  const forceUpdate = useForceUpdate();
  
  
  useEffect(() => {
    if(isFocused){
      setTotal(cartState.total);
      setCartState(cartReducer);
      setIsSelected(false);
    }
  }, [isFocused, cartState]);
  
  
  const quantity = (harga, type, cart) => {
    if (type === 'MIN') {
      if (cart.qty !== 0) {
        setTotal(cartReducer.total - harga);
        if (total <= 0) {
          setTotal(0);
        }
      }
    } else if (type === 'PLUSH') {
      setTotal(total + harga);
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
    forceUpdate();
  };

  // delete all item 
  const deleteAll = () => {
    dispatch(delete_cart_all());
    // alert('asasasasasasas')
    setCartState(cartReducer);
    setTotal(cartReducer.total);
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

  return (
    <View style={styles.container}>
       <HeaderComponent/>
      <View style={styles.contentHeader}>
        <Text style={styles.textKeranjang}>Keranjang</Text>
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
          <Text style={styles.textTotal}>Total Harga</Text>
          <Text style={styles.hargaTotal}>{Rupiah(total)} </Text>
        </View>
        {cartState.item.length == 0? 
          (   
            <ButtonCustom
              name = 'Checkout'
              width ='40%'
              color= {colors.disable}
              func = {() => alert('Keranjang Kosong')}
            />
          )   
            :
          ( 
            <ButtonCustom
              name = 'CheckOut'
              width ='40%'
              color= {colors.btn}
              func ={() => { navigation.navigate('Agen')}}
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
  contentHeader: {
    paddingHorizontal: 20,
    marginTop : 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.disable,
  },
  textKeranjang: {
    fontSize: 25,
    marginBottom: 10,
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
