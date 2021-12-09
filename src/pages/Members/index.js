import { useIsFocused } from '@react-navigation/native';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import Config from "react-native-config";
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { profile } from '../../assets';
import { ButtonCustom, Header2, Releoder } from '../../component';
import { colors } from '../../utils/colors';
import { Image, StyleSheet, Text, View, FlatList, TextInput } from 'react-native';

const List = (props) => {
  return (
    <TouchableOpacity onPress={props.select}>
      <View style={styles.body(props.selectAgen)}>
        <Image source={profile} style={styles.image} />
        <Text style={styles.textNama}>{props.nama}</Text>
        <Text style={styles.textNama}>{props.email}</Text>
        <Text style={styles.textNama}>{props.phone}</Text>
      </View>
    </TouchableOpacity>
  );
};

const Members = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState(null);
  const TOKEN = useSelector((state) => state.TokenApi);
  const [selectMember, setSelectMember] = useState(null)
  const isFocused = useIsFocused()
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState()
  const [refresh, setRefresh] = useState(false)
  const [find, setFind] = useState('')
  const [form, setForm] = useState({
    customer_id: '',
    phone: '',
  })

  useEffect(() => {
    // alert('use eff')
    if (isFocused) {
      setIsLoading(true)
      getData()
    } else {
      setPage(1)
      setMembers([])
    }
  }, [isFocused, page]);

  const filter = () => {
    setIsLoading(true)
    getData();
  }

  const getData = async () => {
    Promise.all([apiMembers()]).then(res => {
      if (page > 1) {
        setMembers(members.concat(res[0].data.data))
        // resetData = false
      } else {
        setMembers(res[0].data.data)
      }
      // console.log(res[0].data.data)
      setLastPage(res[0].data.last_page)
      setIsLoading(false)
      setRefresh(false)
    }).catch(e => {
      setIsLoading(false)
      setRefresh(false)
    })
  };

  const apiMembers = () => {
    const promise = new Promise((resolve, reject) => {
      Axios.get(Config.API_MEMBER + `?page=${page}&keyword=${find}`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            'Accept': 'application/json'
          }
        }).then((result) => {
          resolve(result.data);
        }, (err) => {
          reject(err);
          alert('error')
        })
    })
    return promise;
  }

  const handleLoadMore = () => {
    // alert('load more'+'-'+page+'-'+lastPage)
    if (page < lastPage) {
      setPage(page + 1);
    }
  }

  const onRefresh = () => {
    setRefresh(true)
  }

  useEffect(() => {
    // alert('refresh')
    getData()
  }, [refresh])

  useEffect(() => {
    // alert(form.phone)
    if (form.phone != null && form.phone != '') {
      navigation.navigate('Transfer', { dataScan: form.phone })
    }
  }, [form])

  const renderItem = ({ item }) => {
    return (
      <List
        nama={item.name}
        email={item.email}
        phone={item.phone}
        selectMember={selectMember ? (item.id == selectMember.id ? true : false) : false}
        select={() => {
          setForm({
            phone: item.phone
          });
        }}
        key={item.id}
      />
    )
  }

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          marginVertical: 10
        }}
      />
    );
  };


  if (isLoading) {
    return (
      <Releoder />
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <View style={styles.container}>
      <Header2 title='Pilih Member' btn={() => navigation.goBack()} />
      <View
        style={{
          marginVertical: 10
        }}
      />
        <View style={{ flexDirection: 'row' }}>
          <TextInput style={styles.search} value={find} onChangeText={(item) => setFind(item)} ></TextInput>
          <ButtonCustom
            name='Filter'
            width='30%'
            color={colors.btn}
            func={() => { setPage(1); filter() }}
          />
        </View>
        <View
        style={{
          marginVertical: 10
        }}
      />
        <FlatList
          // ListHeaderComponent={<Text>Hallo</Text>}
          keyExtractor={(item, index) => index.toString()}
          data={members}
          ItemSeparatorComponent={ItemSeparatorView}
          contentContainerStyle={{ alignItems: 'center' }}
          renderItem={renderItem}
          ListFooterComponent={isLoading ? <Text>Sedang Memuat</Text> : null}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          onRefresh={onRefresh}
          refreshing={refresh}
        />
      </View>

    </SafeAreaView>
  );
};

export default Members;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  body: (select) => ({

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
    borderWidth: 1,
    elevation: 5,
    marginBottom: 10,
    backgroundColor: select ? colors.default : '#ffffff'
  }),
  search: {
    backgroundColor: '#ffffff',
    width: '60%',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#bbbbbb',
    paddingHorizontal: 20,
    marginRight: 10,
    marginLeft: 10
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
    marginTop: 10,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center'
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
  textAgent: {
    paddingHorizontal: 20,
    fontSize: 20,
    marginTop: 10,
    borderWidth: 1,
    marginHorizontal: 20,
    paddingVertical: 3,
    borderRadius: 5,
    fontWeight: 'bold',
    backgroundColor: '#fbf6f0',
    borderColor: colors.default,
    color: colors.default,
    letterSpacing: 1
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
