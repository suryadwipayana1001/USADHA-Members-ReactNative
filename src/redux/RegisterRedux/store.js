import {createStore} from 'redux';
import reducer from './reducer';

const store = createStore(reducer); //dimana pada const store di simpan object reducer

export default store;
