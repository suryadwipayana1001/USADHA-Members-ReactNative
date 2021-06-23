// /ini contoh state secara global

import {combineReducers} from '@reduxjs/toolkit';

//  const initialState = {
//     name : 'fajar'
//  }

// const reducer = (state = initialState, action)=>{ //kirim nilai initiallState ke state
//     return state; //dan hasilkan nilai state saat reducer ini dipanggil di store,js
// };

const User = {};
const UserReducer = (state = User, action) => {
  //kirim nilai initiallState ke state
  if (action.type === 'SET_DATA_USER') {
    state = action.value
    // console.log('reducer user',state)
  };
  return state; //dan hasilkan nilai state saat reducer ini dipanggil di store,js
};

// const initialStateLogin = {
//   title: 'Login Page',
//   desc: 'ini aalah desc ntuk Login',
// };
// const LoginReducer = (state = initialStateLogin, action) => {
//   //kirim nilai initiallState ke state
//   return state; //dan hasilkan nilai state saat reducer ini dipanggil di store,js
// };

const initialCartItem = {
  item: [],
  total: 0,
  count: 0,
};
const CartReducer = (state = initialCartItem, action) => {
  // console.log('initial reducer',initialCartItem.length)
  if (action.type === 'ADD_TO_CART') {
    // return (
    state.item[state.item.length] = action.valueItem;
    state.total = state.total + action.valueItem.harga;
    state.count = state.count + action.count;

    // item[item.length] = {ID:'3',Name:'Some name 3',Notes:'NOTES 3'};
    // )

    // console.log('count keranajang', state.count)
  } else if (action.type === 'CHANGE_TO_QTY') {
    if (action.valueItem < 0) {
      action.valueItem = 0;
    }
    state.item.map((cart) => {
      if (cart.id === action.id) {
        cart.qty = action.valueItem;
        cart.harga = action.harga;
        // console.log('qty reducer', totalHarga);

        if (action.typeOperator == 'MIN') {
          state.total = state.total - action.harga;
          cart.qty  = cart.qty - 1
          if (state.total < 0) {
            state.total = 0;
          }
            // console.log(cart.qty)
        } else if (action.typeOperator == 'PLUSH') {
          state.total = state.total + action.harga;
          console.log('ini plush pada state', state.total);
        }
      }
      // state.total = state.total + x.harga
      // state.total = 0
      // console.log(state);
      
    });
  } else if (action.type === 'DELETE_CART') {
    var itemArray = state.item;
    for (var i = 0; i < state.item.length; i++) {
      if (itemArray[i].id === action.id) {
        state.total = state.total - (itemArray[i].harga * itemArray[i].qty);
        state.item.splice(i, 1);
        state.count = state.count - 1;
        // console.log(itemArray[i].qty)
      }
    }
  } else if (action.type === 'SELECTED') {
    if (action.id !== null) {
      state.item.map((cart) => {
        if (cart.id == action.id) {
          cart.selected = action.value;
        }
      });
    } else {
      state.item.map((cart) => {
        cart.selected = action.value;
      });
    }
  } else if (action.type === 'DELETE_CART_All') {
    var itemArray = state.item;
    var i = 0;
    while (i < itemArray.length) {
      if (itemArray[i].selected === true) {
        state.total = state.total - (itemArray[i].harga * itemArray[i].qty);
        itemArray.splice(i, 1);
      } else {
        ++i;
      }
      console.log(i);
    }
    state.count = state.item.length;
    // return itemArray;
  } else if (action.type === 'CHECK_OUT_KERANJANG') {
    state.item = [];
    state.total = 0;
    state.count = 0;
  }
  //kirim nilai initiallState ke state
  return state; //dan hasilkan nilai state saat reducer ini dipanggil di store,js
};

const Token = '';

const TokenApi = (state = Token, action) => {
  //kirim nilai initiallState ke state
  if (action.type === 'TOKEN_API') {
    // console.log(action.token)
    state = action.token
    // console.log('reducer TOken', state)
  }
  return state; //dan hasilkan nilai state saat reducer ini dipanggil di store,js
};

const reducer = combineReducers({
  UserReducer,
  // LoginReducer,
  CartReducer,
  TokenApi,
});

export default reducer;
