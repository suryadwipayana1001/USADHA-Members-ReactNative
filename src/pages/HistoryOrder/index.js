import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, RefreshControl, ScrollView} from 'react-native';
import {colors} from '../../utils/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import Axios from 'axios';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import { Header2, Releoder } from '../../component';
import { Rupiah } from '../../helper/Rupiah';
import { SafeAreaView } from 'react-native-safe-area-context';
import Config from 'react-native-config';

const wait = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

const ItemHistory = (props) => {
  const [color, setColor] = useState('#ffffff')
  const isFocused = useIsFocused();
  useEffect(() => {
    if(props.status == 'closed'){
      setColor(colors.disable)
    }else if (props.status == 'pending'){
      setColor('#FFCCCB')
    }else if(props.status == 'approved' && props.statusd =='process'){
      setColor('#FFFFCD')
    }else if (props.status == 'approved' && props.statusd =='delivered'){
      setColor('#CDFFCC')
    }else if (props.status == 'approved' && props.statusd == 'received'){
      setColor('#00FFFF')
    }
  }, [isFocused, wait()])

  return (
    <View style={{backgroundColor : color}}>
      <View style={{backgroundColor: '#f2efea'}}>
        <Text
          style={{
            marginHorizontal: 20,
            paddingVertical: 8,
            color: colors.dark,
            fontWeight: 'bold',
          }}>
          {props.date}
        </Text>
      </View>
      <TouchableOpacity onPress={props.navigasi} >
            <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
                  <Text style={{fontWeight: 'bold', fontSize: 15}}>{props.jenis}</Text>
            <View
                  style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 8,
                  }}>
                        <Text style={{color: colors.dark}}>{props.name}</Text>
                        <Text style={{color: '#000'}}>{Rupiah(parseInt(props.total))}</Text>
                  </View>
            </View>
      </TouchableOpacity>
    </View>
  );
};

const HistoryOrder = ({navigation}) => {
  const [data, setData] = useState({});
  const userReducer = useSelector((state) => state.UserReducer);
  const TOKEN = useSelector((state) => state.TokenApi);
  const [refreshing, setRefreshing] = React.useState(false);
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true)

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    history()
    wait(1000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    history()
  }, [])

const history = () => {
  Axios.get(Config.API_HISTORY_ORDER+`${userReducer.id}`, 
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Accept' : 'application/json' 
      }
    }
  ).then((result) => {
      console.log('history order ',result.data)
      setData(result.data.data)
      setIsLoading(false)
  }).catch((e) => {
      console.log(e)
  })
}

  if(isLoading){
    return(
      <Releoder/>
    )
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}>
        <Header2 title ='History Order' btn={() => navigation.goBack()}/>
        <ScrollView
            style={styles.scroll}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
          {data.map((item) => {
            return (
              <ItemHistory
              date={item.register}
              jenis={item.memo}
              total={item.total}
              navigasi = {() => {navigation.navigate('HistoryOrderDetail', {data : item})}}
              name = {item.customers.name}
              key ={item.id}
               status = {item.status}
              statusd = {item.status_delivery}
            />
            )
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default HistoryOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    backgroundColor: colors.default,
    alignItems: 'center',
  },
  btnBack: {
    marginRight: 10,
  },
  textTopUp: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  textTambahKartu: {
    marginTop: 10,
    color: colors.dark,
  },
});
