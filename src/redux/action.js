export const add_to_cart = (value, count) => {
  return {type: 'ADD_TO_CART', valueItem: value, count: count};
};

export const change_to_qty = (value, id, harga, typeOperator) => {
  return {
    type: 'CHANGE_TO_QTY',
    valueItem: value,
    id: id,
    harga: harga,
    typeOperator: typeOperator,
  };
};

export const delete_cart = (id = null) => {
  return {type: 'DELETE_CART', id: id};
};

export const delete_cart_all = () => {
  return {type: 'DELETE_CART_All'};
};

export const selected_cart = (id = null, value) => {
  return {type: 'SELECTED', id: id, value: value};
};

export const check_out_keranjang = () => {
  return {type: 'CHECK_OUT_KERANJANG'};
};

export const token_api = (token) => {
  return {type : 'TOKEN_API', token}
}
