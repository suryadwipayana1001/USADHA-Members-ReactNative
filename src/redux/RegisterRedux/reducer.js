// /ini contoh state secara global

import {combineReducers} from '@reduxjs/toolkit';

//  const initialState = {
//     name : 'fajar'
//  }

// const reducer = (state = initialState, action)=>{ //kirim nilai initiallState ke state
//     return state; //dan hasilkan nilai state saat reducer ini dipanggil di store,js
// };

const data = {
  title: 'Login Page',
  desc: 'reducer pada register redux',
};
const DataRegister = (state = data, action) => {
  //kirim nilai initiallState ke state
  return state; //dan hasilkan nilai state saat reducer ini dipanggil di store,js
};

const reducer = combineReducers({
  DataRegister,
});

export default reducer;
