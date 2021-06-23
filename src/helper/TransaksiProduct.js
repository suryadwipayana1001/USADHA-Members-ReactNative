import Axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';

export function TransaksiProduct(user, total) {
      const dispatch = useDispatch();
      var data = user;
      var sukses = false
      data.point = user.point - total

      if(total >= user.point)
      {
            sukses = false
      }else{
            Axios.put(`http://10.0.2.2:3004/users/${user.id}`, data)
            .then((res) => {
                  console.log('sukses');
                  dispatch({type: 'SET_DATA_USER', value: user});
                  sukses = true
            });
      }



      return sukses
}