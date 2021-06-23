import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet, Text, View, ScrollView, RefreshControl } from 'react-native'
import { Header2, Releoder } from '../../component'
import { ListItem, Avatar, Icon } from 'react-native-elements'
import {useSelector} from 'react-redux';
import Axios from 'axios';
import { Alert } from 'react-native'
import Config from 'react-native-config'

const wait = (timeout) => {
      return new Promise(resolve => {
            setTimeout(resolve, timeout);
      });
}
const LogNotif = ({navigation}) => {
      const [refreshing, setRefreshing] = React.useState(false);
      const userReducer = useSelector((state) => state.UserReducer);
      const TOKEN = useSelector((state) => state.TokenApi);
      const [isLoading, setIsLoading] = useState(true)
      const onRefresh = React.useCallback(() => {
            setRefreshing(true);
            // history()
            // alert('refresh')
            listLog()
            wait(1000).then(() => setRefreshing(false));
      }, []);
      const [list, setList] = useState(null)
      // const list = [
      //       {
      //         name: 'Amy Farha',
      //         avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
      //         subtitle: 'Vice President'
      //       },
      //       {
      //         name: 'Chris Jackson',
      //         avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
      //         subtitle: 'Vice Chairman'
      //       },
      // ]


      useEffect(()=> {
            listLog()
      },[])
      
      const listLog = () => {
            Axios.post(Config.API_LOGS , {customers_id : userReducer.id}, 
            {
                  headers: {
                  Authorization: `Bearer ${TOKEN}`,
                  'Accept' : 'application/json' 
                  }
            }).then((result) => {
                  // console.log('result : ', result.data);
            //      console.log(result.data.data)
                 setList(result.data.data)
                 setIsLoading(false)
            }).catch((error) => {
                  console.log('error ' + error);
                  setIsLoading(false)

                  alert('error')
                  navigation.goBack()
            });
      }

      const listUpdateLog = (id) => {
            Axios.get(Config.API_LOGS_UPDATE + `${id}`,
            {
                  headers: {
                  Authorization: `Bearer ${TOKEN}`,
                  'Accept' : 'application/json' 
                  }
            }).then((result) => {
                  // console.log('result : ', result.data);
                 console.log(result.data.data)
            }).catch((error) => {
                  // console.log('error ' + error);
                  var mes = JSON.parse(error.request._response);
                  // alert(mes.message)
                  console.log(mes.message)
                  setIsLoading(false)

                  // alert('error')
                  // navigation.goBack()
            });
            // console.log(id)
      }

      if (isLoading) {
            return  (
                  <Releoder/>
            )
      }

      return (
            <SafeAreaView style={styles.container}>
                  <View style={{flex: 1}}>
                  <Header2 title ='Logs' btn={() => navigation.goBack()}/>
                  <ScrollView
                        style={styles.scroll}
                        refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                  >
                       {
                              list.map((item, i) => (
                                    <ListItem 
                                          key={i} bottomDivider
                                          onPress = {() => {
                                                listUpdateLog(item.id);
                                                Alert.alert(
                                                      'Message',
                                                      item.memo,
                                                      [
                                                            {
                                                              text: "Oke",
                                                              onPress:onRefresh,
                                                            //   style: "cancel"
                                                            },
                                                      ],
                                                );
                                          }}
                                    >
                                          {/* <Avatar source={{uri: .avatar_url}} /> */}
                                          <View>
                                                <Icon name='chat' />
                                                {item.status == 'unread' ? 
                                                       <View style={{position :'absolute', backgroundColor : 'red', padding : 2, height : 10, width : 10, right : 0, top : 0, borderRadius : 100}}>
                                                       {/* <Text>*</Text> */}
                                                      </View>
                                                      :
                                                      null
                                                }
                                          </View>
                                          <ListItem.Content>
                                                <ListItem.Title>{item.register}</ListItem.Title>
                                          <ListItem.Subtitle>{item.memo}</ListItem.Subtitle>
                                    </ListItem.Content>
                                    </ListItem>
                              ))
                        }
                  </ScrollView>
                  </View>
            </SafeAreaView>
      )
}

export default LogNotif

const styles = StyleSheet.create({
      container: {
            flex: 1,
            backgroundColor: '#ffffff',
      },
})
