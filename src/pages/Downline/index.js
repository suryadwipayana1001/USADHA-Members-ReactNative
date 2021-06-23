import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {Header, Header2, HeaderComponent} from '../../component';
import { useSelector} from 'react-redux';
import Axios from 'axios';
import {Releoder} from '../../component';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ListItem, Avatar } from "react-native-elements";
import { TouchableHighlight } from "react-native";
import Config from 'react-native-config';



const Downline = ({navigation}) => {
      const TOKEN = useSelector((state) => state.TokenApi);
      const [data, setData] = useState(null)
      const userReducer = useSelector((state) => state.UserReducer);
      const [isLoading, setIsLoading] = useState(true)

      const getDownline = () => {
            Axios.get(Config.API_DOWNLINE + `${userReducer.id}`, 
                  {
                        headers: {
                              Authorization: `Bearer ${TOKEN}`,
                              'Accept' : 'application/json' 
                        }
                  }
            ).then((res) => {
                  console.log(res.data.data)
                  setData(res.data.data)
                  setIsLoading(false)
            })
      }

      useEffect(() => {
            getDownline()
      }, [])

      if (isLoading) {
            return  (
                  <Releoder/>
            )
      }

      return (
            <SafeAreaView style={styles.container}>
                  <Header2 title ='List Downline' btn={() => navigation.goBack()}/>
                  <ScrollView>
                        <View style={{padding : 20,}}>
                              <Text style={{fontSize : 20, fontWeight :'bold'}}>Downline / Mitra Langsung</Text>
                              {data.map((item, index) => {
                                    return (
                                          <ListItem
                                                style={{marginVertical : 2}}
                                                Component={TouchableHighlight}
                                                containerStyle={{}}
                                                disabledStyle={{ opacity: 0.5 }}
                                                onLongPress={() => console.log("onLongPress()")}
                                                onPress={() => console.log("onPress()")}
                                                pad={20}
                                                bottomDivider ={true}
                                                key = {item.id}
                                          >
                                                <Text>{index + 1}</Text>
                                                <Avatar
                                                source={{
                                                uri:
                                                      "https://avatars0.githubusercontent.com/u/32242596?s=460&u=1ea285743fc4b083f95d6ee0be2e7bb8dcfc676e&v=4"
                                                }}
                                                />
                                                <ListItem.Content>
                                                      <ListItem.Title>
                                                            <Text>Nama : {item.name}</Text>
                                                      </ListItem.Title>
                                                      <ListItem.Subtitle>
                                                            <Text>Code    : {item.code}</Text>
                                                      </ListItem.Subtitle>
                                                      <ListItem.Subtitle>
                                                            <Text>Alamat : {item.address}</Text>
                                                      </ListItem.Subtitle>
                                                </ListItem.Content>
                                          </ListItem>
                                                
                                    )
                              })}
                        </View>
                  </ScrollView>
            </SafeAreaView>
      )
}

export default Downline

const styles = StyleSheet.create({
      container : {
            flex :1,
            backgroundColor : '#ffffff'
      }
})
