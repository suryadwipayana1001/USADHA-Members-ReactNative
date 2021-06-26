import React, {useState, useEffect} from 'react';
import {ActivityIndicator, Alert, Image, StyleSheet, Text, View} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import {productImage} from '../../assets';
import {colors} from '../../utils/colors';
import {useSelector, useDispatch} from 'react-redux';
import {change_to_qty, delete_cart, selected_cart} from '../../redux';
import Axios from 'axios';
import {useIsFocused} from '@react-navigation/native';
import {Rupiah} from '../../helper/Rupiah';

function useForceUpdate() {
  const [refresh, setRefresh] = useState(0); // integer state
  return () => setRefresh((refresh) => ++refresh); // update the state to force render
}

const ItemKeranjang = ({
  cart,
  deleteItem,
  btnMin,
  btnPlush,
  selected,
  selectedFalse,
}) => {
  // const [qty, setQty] = useState(total);
  // const cartReducer = useSelector((state) => state.CartReducer);
  const dispatch = useDispatch();
  const [products, setProducts] = useState({});
  const [qty, setQty] = useState(1);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isSelected, setIsSelected] = useState(cart.selected);
  const forceUpdate = useForceUpdate();
  const TOKEN = useSelector((state) => state.TokenApi);
  const  isFocused = useIsFocused();
  // const [hargaProduct , setHargaProduct] = useState(0);

  // if(loading){
  //   return (
  //     <Text>loading</Text>
  //   )
  // }
  useEffect(() => {
    getProduct();
  }, []);

  useEffect(() => {
    setQty(cart.qty)
  }, [isFocused])
  // useEffect(() => {
  //   if(selected) {
  //     setIsSelected(true)
  //   }else{
  //     setIsSelected(false)
  //   }
  // }, [isSelected])

  const getProduct = () => {
    Axios.get(`https://admin.belogherbal.com/api/close/product/${cart.id}`, {
      headers : {
        Authorization: `Bearer ${TOKEN}`,
        'Accept' : 'application/json' 
      }
    })
    .then((result) => {
      // console.log('data product : ', result.data);
      setProducts(result.data.data);
      setLoading(false);
    });
  };
  const quantity = (type) => {
    if (type === 'min') {
      setQty(qty - 1);
      if (qty <= 1) {
        setIsDisabled(true);
        setQty(0);
        dispatch(change_to_qty(qty, cart.id, parseInt(products.price), type));
        // console.log('qty', qty)
      }
    } else if (type === 'plush') {
      setQty(qty + 1);
      setIsDisabled(false);
      dispatch(change_to_qty(qty + 1, cart.id, parseInt(products.price), type));
    }
    // console.log(type)
  };

  useEffect(() => {
    setIsSelected(cart.selected);
  }, [selected]);

  // const checkItem =() => {
  //   // setIsSelected()
  //   dispatch(selected_cart(cart.id, isSelected))
  //   console.log(selected)
  // }
  useEffect(() => {
    dispatch(selected_cart(cart.id, isSelected));
  }, [isSelected]);

  if (isLoading) {
    return  (
      <View style ={{alignItems : 'center', justifyContent : 'center', flex : 1}}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    )
  }
  return (
    <View>
      <View style={styles.container}>
        <View style={styles.detail}>
          <CheckBox
            value={isSelected}
            onValueChange={(value) => {
              setIsSelected(value);
              // selectedFalse()
            }}
            style={styles.checkbox}
          />
          <Image source={{uri : `https://admin.belogherbal.com/${cart.img}`}} style={styles.image} />
          <View style={styles.textContent}>
            <Text style={styles.title}>{cart.namaProduct} </Text>
            <Text>Sisa 5</Text>
            <Text style={styles.harga}>{Rupiah(cart.harga)}</Text>
          </View>
        </View>
        <View style={styles.formNote}>
          <TouchableOpacity onPress={deleteItem}>
            <Icon name="trash" style={styles.iconTrash} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              quantity('min');
              btnMin();
            }}
            disabled={isDisabled}>
            <Icon name="minus" style={styles.iconMin} />
          </TouchableOpacity>

          <Text style={styles.qty}>{qty} </Text>

          <TouchableOpacity
            onPress={() => {
              quantity('plush');
              btnPlush();
            }}>
            <Icon name="plus" style={styles.iconPlush} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.line} />
    </View>
  );
};

export default ItemKeranjang;

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 20,
    flex: 1,
    flexDirection: 'column',
    // marginBottom :
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 5,
    // marginLeft: 10,
  },
  textContent: {
    paddingHorizontal: 10,
    width: 250,
  },
  title: {
    fontSize: 15,
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  harga: {
    fontWeight: 'bold',
  },
  formNote: {
    // flex : 1,
    // backgroundColor : 'red',
    height: 65,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  note: {
    bottom: 10,
    borderBottomWidth: 1,
    width: 200,
    fontSize: 15,
    borderBottomColor: colors.default,
    // marginRight: 8,
  },
  iconTrash: {
    fontSize: 40,
    color: 'red',
    marginRight: 20,
    // borderWidth : 1
    // paddingHorizontal : 3
  },
  iconMin: {
    fontSize: 20,
    color: '#ffffff',
    paddingHorizontal: 6,
    borderWidth: 1,
    borderRadius: 50,
    textAlign: 'center',
    paddingVertical: 4,
    backgroundColor: colors.default,
    borderColor: colors.default,
    // paddingHorizontal : 3
  },
  iconPlush: {
    fontSize: 20,
    color: '#ffffff',
    paddingHorizontal: 6,
    borderWidth: 1,
    borderRadius: 50,
    textAlign: 'center',
    paddingVertical: 4,
    backgroundColor: 'green',
    borderColor: 'green',
    // paddingHorizontal : 3
  },
  qty: {
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    width: 120,
    textAlign: 'center',
    fontSize: 20,
    borderBottomColor: colors.default,
  },
  line: {
    marginTop: 10,
    borderColor: colors.disable,
    borderWidth: 4,
  },
  btnSimpan: {
    backgroundColor: 'green',
    flexDirection: 'row',
  },
  simpan: {
    textAlign: 'right',
  },
});
