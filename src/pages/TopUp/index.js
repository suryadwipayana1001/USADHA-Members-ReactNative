import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import {colors} from '../../utils/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import {Rupiah} from '../../helper/Rupiah';
import {useDispatch, useSelector} from 'react-redux';
import Axios from 'axios';
import { ButtonCustom, Header2, HeaderComponent, Releoder } from '../../component';
import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Config from 'react-native-config';

const NominalData = [
  { id: 1, nominal: 200000}, {id: 2, nominal: 300000}, {id: 3, nominal: 500000}
];

// item nominal 
const ItemNominal = ({item, onPress, style}) => (
  <TouchableOpacity onPress={onPress} style={[styles.btnNominal, style]}>
    <Text style={styles.title}>{Rupiah(item.nominal)}</Text>
  </TouchableOpacity>
);

// item type trasnfer
const ItemTypeTransfer = ({item, onPress, style}) => (
  <TouchableOpacity style={[styles.btnTambahBank, style]} onPress={onPress}>
    <Icon name="credit-card" color={colors.default} size={20} />
    <Text style={styles.textTambahKartu}>
      {item.name} Kartu 
    </Text>
  </TouchableOpacity>
);

function useForceUpdate() {
  const [refresh, setRefresh] = useState(0); // integer state
  return () => setRefresh((refresh) => ++refresh); // update the state to force render
}

const TopUp = ({navigation}) => {
  const [selectedId, setSelectedId] = useState(null);
  const [selectedIdTypeTransfer, setSelectedIdTypeTransfer] = useState(null);
  const [nominal, setNominal] = useState(0);
  const [typeTransfer, setTypeTransfer] = useState(null);
  var borderColor = '#fbf6f0';
  var backgroundColor = '#fbf6f0';
  const userReducer = useSelector((state) => state.UserReducer);
  const [display, setDisplay] = useState('flex');
  const TOKEN = useSelector((state) => state.TokenApi);
  const [point, setPoint] = useState(0)
  const [isLoading, setIsLoading] = useState(true);
  const [typeTf, setTypeTf]=useState(null)

  useEffect(() => {
    Axios.get(Config.API_POINT+`${userReducer.id}`, {
      headers : {
        Authorization: `Bearer ${TOKEN}`,
        'Accept' : 'application/json' 
      }
    })
    .then((result) => {
      // console.log('data point api', result.data.data[0].balance_points)
      setPoint(result.data.data[0].balance_points)
      // setIsLoading(false)
      getTf()
    });
  }, [])

  const getTf =  () => {
    Axios.get(Config.API_ACCOUNT_CASHS, {
      headers : {
        Authorization: `Bearer ${TOKEN}`,
        'Accept' : 'application/json' 
      }
    }).then((res) => {
      setTypeTf(res.data)
       setIsLoading(false)
    })
  }
  const setValueNominal = (value) => {
    setNominal(value);
  };

  const renderItem = ({item}) => {
    borderColor = item.id === selectedId ? '#ff781f' : '#fbf6f0';
    if (item.nominal !== nominal) {
      borderColor = '#fbf6f0';
    }
    return (
      <ItemNominal
        item={item}
        onPress={() => {
          setSelectedId(item.id);
          setValueNominal(item.nominal);
        }}
        style={{borderColor}}
      />
    );
  };

  const renderItemTypeTransfer = ({item}) => {
    borderColor = item.id === selectedIdTypeTransfer ? '#ff781f' : '#fbf6f0';

    return (
      <ItemTypeTransfer
        item={item}
        onPress={() => {
          setSelectedIdTypeTransfer(item.id);
          // setTypeTransfer(item);
        }}
        style={{backgroundColor, borderColor}}
      />
    );
  };

  const actionTopUP = () => {
    setIsLoading(true)
    Axios.post(Config.API_TOPUP, formTopUp,
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Accept' : 'application/json' 
      }
    }
  ).then((result) => {
    setPoint(point + formTopUp.amount)
    navigation.navigate('NotifAlert', {notif : '1. Bank BRI \n PT. Usadha Bhakti Buana \n No.Rek 001701003292302 \n \n 2.Bank BCA \n A.n PT Usadha Bhakti Buana \n No.Rek 0498696999'} );
    setIsLoading(false)
    // navigation.navigate('Bank');
  }).catch((error) => {
     console.log('error ' + error);
      setIsLoading(false)
    });

    console.log(formTopUp)
  };

  const dateRegister = () => {
    var todayTime = new Date();
    var month = todayTime.getMonth() + 1;
    var day = todayTime.getDate();
    var year = todayTime.getFullYear();
    return year + "-" + month + "-" + day;
  }

  var formTopUp = {
    register : dateRegister(),
    customers_id : userReducer.id,
    memo : 'Top up poin',
    accounts_id : selectedIdTypeTransfer,
    amount : nominal,
  }

  // useEffect(() => {
  //   formTopUp.amount = nominal
  // }, [nominal])

  if (isLoading) {
    return  (
      <Releoder/>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}>
        <Header2 title ='Top Up' btn={() => navigation.goBack()}/>
        <FlatList
          style={{width: '100%'}}
          nestedScrollEnabled
          data={['filter', 'title1', 'list1', 'title2', 'list2']}
          keyExtractor={(data) => data}
          renderItem={({item, index}) => {
            switch (index) {
              case 0:
                return (
                  <View style={styles.infoTopUp}>
                    <Text style={styles.textTopUpKe}>Top Up ke</Text>
                    <View style={styles.contentInfoSaldo}>
                      <Icon
                        name="credit-card"
                        size={20}
                        style={styles.iconWallet}
                      />
                      <View>
                        <Text style={styles.textMinyakBelogCash}>
                          Minyak Belog Cash
                        </Text>
                        <Text style={styles.infoSaldo}>
                          Balance {Rupiah(parseInt(point))}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              case 1:
                return (
                  <View style={styles.contentNominalTopUp}>
                    <Text style={styles.textNominalTopUp}>
                      Pilih Nominal Top Up
                    </Text>
                    <View style={styles.boxBtnTambahKartuAtm}>
                      <FlatList
                        data={NominalData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        extraData={selectedId}
                        numColumns={3}
                        contentContainerStyle={{
                          flexGrow: 1,
                          alignItems: 'center',
                        }}
                      />
                    </View>
                    <Text style={styles.textAtauMasukanNominal}>
                      Atau masukkan nominal top up di sini
                    </Text>
                    <TextInput
                      onFocus={() => setDisplay('none')}
                      onBlur={() => setDisplay('flex')}
                      placeholder="Rp."
                      keyboardType="number-pad"
                      style={styles.textInputNominal}
                      value={isNaN(nominal.toString()) ? '' : nominal.toString()}
                      onChangeText={(value) => {
                        setNominal(parseInt(value));
                      }}
                    />
                  </View>
                );
              case 2:
                return (
                  <View style={styles.contentTransfer}>
                    <Text style={styles.textTransferBank}>Transfer Bank</Text>
                    <View style={styles.boxBtnTambahKartuAtm}>
                      <FlatList
                        data={typeTf}
                        renderItem={renderItemTypeTransfer}
                        keyExtractor={(item) => item.id}
                        extraData={selectedIdTypeTransfer}
                        numColumns={2}
                        contentContainerStyle={{
                          flexGrow: 1,
                          alignItems: 'center',
                        }}
                      />
                    </View>
                  </View>
                );
              default:
                return null;
            }
          }}
        />
      </View>
      <View style={[styles.containerButton]}>
        {nominal !== 0 && selectedIdTypeTransfer != null ? (
          <ButtonCustom
            name='Top Up Sekarang'
            width= '85%'
            color= {colors.btn}
            func = {() => Alert.alert(
              'Peringatan',
              `Topup sekarang ? `,
              [
                  {
                      text : 'Tidak',
                      onPress : () => console.log('tidak')
                  },
                  {
                      text : 'Ya',
                      onPress : () => actionTopUP()
                  }
              ]
            )}
          />
        ) : (
          <ButtonCustom
            name='Top Up Sekarang'
            width= '85%'
            color= {colors.disable}
            func = {() => alert('mohon lengkapi data terlebih dahulu')}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default TopUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.disable,
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
  infoTopUp: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
  },
  textTopUpKe: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentInfoSaldo: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.disable,
    padding: 10,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  iconWallet: {
    marginRight: 20,
    borderWidth: 1,
    textAlign: 'center',
    padding: 5,
    borderRadius: 5,
    backgroundColor: colors.default,
    borderColor: colors.default,
    color: '#ffffff',
  },
  textMinyakBelogCash: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  infoSaldo: {
    color: colors.dark,
  },
  contentNominalTopUp: {
    backgroundColor: '#ffffff',
    marginTop: 5,
    padding: 20,
  },
  textNominalTopUp: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  btnNominal: {
    borderWidth: 2,
    padding: 10,
    borderRadius: 50,
    borderColor: '#fbf6f0',
    marginHorizontal: 5,
  },
  textNominal: {
    fontSize: 13,
    color: 'black',
  },
  textAtauMasukanNominal: {
    marginTop: 10,
    color: colors.dark,
  },
  textInputNominal: {
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fbf6f0',
    borderColor: '#fbf6f0',
    marginBottom: 10,
    padding: 10,
  },
  contentTransfer: {
    marginTop: 5,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  textTransferBank: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  boxBtnTambahKartuAtm: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnTambahBank: {
    alignItems: 'center',
    borderWidth: 2,
    paddingVertical: 30,
    borderRadius: 10,
    paddingHorizontal: 25,
    borderColor: colors.default,
    backgroundColor: '#fbf6f0',
    marginVertical: 12,
    marginHorizontal: 10,
    width: 160,
    // textAlign : 'center'
    // alignItems : 'center'
  },
  textTambahKartu: {
    marginTop: 10,
    color: colors.dark,
    textAlign: 'center',
  },
  containerButton: {
    backgroundColor: '#ffffff',
    height: 65,
    borderWidth: 1,
    borderColor: colors.disable,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTopUp: {
    borderWidth: 1,
    borderRadius: 10,
    height : 45,
    alignItems : 'center',
    justifyContent : 'center',
    backgroundColor: colors.disable,
    borderColor: colors.disable,
    paddingHorizontal: 100,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  buttonColor: {
    backgroundColor: '#ff781f',
    borderColor: '#ff781f',
  },
});
