
import {useSelector} from 'react-redux';
export function Token() {
      const token = useSelector((state) => state.token);

      // console.log(token);
      return token
    }