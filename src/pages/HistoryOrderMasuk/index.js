import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../../utils/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ScrollView} from 'react-native-gesture-handler';
import Axios from 'axios';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import { Releoder } from '../../component';
import { Rupiah } from '../../helper/Rupiah';
import Config from 'react-native-config';

const ItemHistory = (props) => {
  return (
    <View>
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
      <TouchableOpacity >
      {/* onPress={props.navigasi} */}
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

const HistoryOrderMasuk = ({navigation}) => {
  const [data, setData] = useState({});
  const userReducer = useSelector((state) => state.UserReducer);
  const TOKEN = useSelector((state) => state.TokenApi);
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
   Axios.get(Config.API_HISTORY_ORDER_AGENT + `${userReducer.id}`, 
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
  }, [])

  if(isLoading){
    return(
      <Releoder/>
    )
  }
  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.btnBack}
            onPress={() => {
              navigation.goBack();
            }}>
            <Icon name="chevron-circle-left" color="#ffffff" size={25} />
          </TouchableOpacity>
          <Text style={styles.textTopUp}> History Order Masuk</Text>
        </View>
        <ScrollView>
          {data.map((item) => {
            return (
              <ItemHistory
              date={item.register}
              jenis={item.memo}
              total={item.total}
              navigasi = {() => {navigation.navigate('HistoryOrderDetail')}}
              name = {item.customers.name}
              key ={item.id}
            />
            )
          })}
        </ScrollView>
      </View>
      {/* <View style={{ backgroundColor : '#ffffff', height : 55, borderWidth : 1, borderColor : colors.disable, alignItems : 'center', justifyContent : 'center'}}>
                        <TouchableOpacity style={{borderWidth:1, borderRadius : 50, backgroundColor : colors.disable, borderColor :colors.disable, paddingHorizontal: 100, paddingVertical : 5}}>
                              <Text style={{color : '#ffffff', fontWeight : 'bold', fontSize : 15}}>
                                    Top Up Sekarang
                              </Text>
                        </TouchableOpacity>
                  </View> */}
    </View>
  );
};

export default HistoryOrderMasuk;

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
