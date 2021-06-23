import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image, ActivityIndicator} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {profile} from '../../assets';
import {Header, TopUp, Promo, Releoder, ButtonCustom, HeaderComponent, Header2} from '../../component';
import {colors} from '../../utils/colors';
import Axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import Config from "react-native-config";


const List = (props) => {
  return (
    <View style={styles.body}>
      <Image source={profile} style={styles.image} />
      <Text style={styles.textNama}>{props.nama}</Text>
      <Text style={styles.textNama}>{props.email}</Text>
      <Text style={styles.textNama}>{props.phone}</Text>
      <ButtonCustom
        name = 'Pilih Agen'
        width = '95%'
        color = {colors.btn}
        func = {props.select}
      />
    </View>
  );
};

const Agen = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [agen, setAgen] = useState(null);
  const TOKEN = useSelector((state) => state.TokenApi);
  useEffect(() => {
    Axios.get(Config.API_AGENTS, 
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Accept' : 'application/json' 
        }
      }
    ).then((result) => {
        // console.log(result.data)
        setAgen(result.data)
        setIsLoading(false)
    });

  }, []);

  if (isLoading) {
    return  (
      <Releoder/>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Header2 title ='Agen' btn={() => navigation.goBack()}/>
      </View>
      <Text style={styles.textAgent}>Pilih Agen</Text>
      <ScrollView>
        <View style={{padding: 20}}>
          {agen.map((list) => {
            return (
              <List
                nama={list.name}
                email={list.email}
                phone={list.phone}
                select={() =>
                  navigation.navigate('CheckOut', {dataAgen: list})
                }
                key={list.id}
              />
            );
          })}
          {/* <Text>halo</Text> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Agen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  body: {
    
    padding: 20,
    // borderWidth : 1,
    // borderColor: colors.disable,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.0,

    elevation: 5,
    marginBottom: 10,
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  textNama: {
    // borderBottomWidth : 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: '#e6e6e6',
    width: 300,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#ff781f',
    padding: 10,
    borderRadius: 5,
    marginTop : 10,
    width : 300,
    alignItems : 'center',
    justifyContent : 'center'
  },
  textBtn: {
    fontSize: 14,
    color: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  textAgent : {
    paddingHorizontal : 20, 
    fontSize : 20, 
    marginTop : 10, 
    borderWidth : 1, 
    marginHorizontal : 20, 
    paddingVertical : 3, 
    borderRadius : 5, 
    fontWeight : 'bold', 
    backgroundColor : '#fbf6f0', 
    borderColor : colors.default, 
    color : colors.default, 
    letterSpacing : 1
  }
});
