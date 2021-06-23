import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ScrollView, TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../../utils/colors'
import { ListItem, Avatar } from "react-native-elements";
import { ButtonCustom, Header2 } from '../../component'

const Item = (props) =>{
      return (
            <View style={[styles.item ]}>
                  <Text style={[styles.namaBank, {color : props.color}] }>{props.name}</Text>
                  <View style={styles.info}>
                        <Text style={{fontSize : 20, fontWeight : 'bold'}}>Pemilik</Text>
                        <Text style={{fontSize:15, fontWeight : 'bold'}}>{props.pemilik}</Text>
                  </View>
                  <View style={styles.info}>
                        <Text style={{fontSize : 20, fontWeight : 'bold'}}>No Rekening</Text>
                        <Text style={{fontWeight : 'bold', letterSpacing:1, fontSize : 20}}>{props.rekening}</Text>
                  </View>
            </View>
      )
}

const Bank = ({navigation}) => {
      return (
            <SafeAreaView style={styles.containter}>
                  <Header2 title ='Info Bank' btn={() => navigation.goBack()}/>
                  <View style={styles.header}>
                        <Text style={styles.textHeader}><Text style={{color :'#ffffff', fontSize : 18, fontWeight :'bold'}}> Silahkan Transfer Dana</Text> anda ke Rekening Bank sesuai pilihan metode pembayaran yang di pilih sebelumnya</Text>
                  </View>
                  <View style={styles.content}>
                        <ScrollView>
                              <ListItem
                                    Component={TouchableHighlight}
                                    containerStyle={{}}
                                    disabledStyle={{ opacity: 0.5 }}
                                    // onLongPress={() => console.log("onLongPress()")}
                                    // onPress={() => console.log("onLongPress()")}
                                    pad={20}
                                    bottomDivider ={true}
                              >     
                                    <Text style={{fontSize : 40, color:'#4f9deb'}}> BRI</Text>
                                    <ListItem.Content>
                                          <ListItem.Title>
                                                <Text style={{fontSize : 20}}>PT. Usadha Bhakti Buana</Text>
                                          </ListItem.Title>
                                          <ListItem.Subtitle>
                                                <Text style={{fontSize : 20, color : '#000'}}>No. Rek 001701003292302</Text>
                                          </ListItem.Subtitle>
                                    </ListItem.Content>
                              </ListItem>
                              <ListItem
                                    Component={TouchableHighlight}
                                    containerStyle={{}}
                                    disabledStyle={{ opacity: 0.5 }}
                                    // onLongPress={() => console.log("onLongPress()")}
                                    // onPress={() => console.log("onLongPress()")}
                                    pad={20}
                                    bottomDivider ={true}
                              >     
                                    <Text style={{fontSize : 40, color:'#4f9deb'}}> BCA</Text>
                                    <ListItem.Content>
                                          <ListItem.Title>
                                                <Text style={{fontSize : 20}}>PT. Usadha Bhakti Buana</Text>
                                          </ListItem.Title>
                                          <ListItem.Subtitle>
                                                <Text style={{fontSize : 20, color : '#000'}}>No. Rek 0498696999</Text>
                                          </ListItem.Subtitle>
                                    </ListItem.Content>
                              </ListItem>
                        </ScrollView>
                  </View>
                  <View style={styles.footer}>
                        <ButtonCustom
                              name = 'Kembali'
                              color = {colors.btn}
                              width = '80%'
                              func = {() => navigation.goBack()}
                        />
                  </View>
            </SafeAreaView>
      )
}

export default Bank

const styles = StyleSheet.create({
      containter : {
            flex : 1,
            backgroundColor : '#ffffff'
      },
      content : {
            flex : 1,
            paddingHorizontal:20
      },
      header : {
            backgroundColor : colors.default,
            height : 100,
            padding : 20,
            // borderBottomEndRadius : 10,
            // borderBottomStartRadius: 10,
            marginBottom : 20
      },
      textHeader : {
            color : '#ffffff',
            textAlign : 'center',
            fontSize : 15,
            // fontWeight : 'bold'
      },    
      item : {
            borderRadius : 20,
            height : 150,
            borderBottomWidth : 1,
            borderColor : colors.disable,
            marginBottom : 20
      },
      namaBank : {
            fontSize : 25,
            fontFamily : 'serif',
            // color : '#ffffff',
            // color:'#ff781f',
            fontWeight : 'bold',
            letterSpacing : 2
      },
      info : {
            marginTop : 10,
            flexDirection: 'row',
            justifyContent : 'space-between',
            fontFamily : 'sans-serif-medium',
      },
      footer : {
            // backgroundColor : 'black',
            height : 60,
            alignItems : 'center',
            justifyContent : 'center',
      },
      btn :{
            borderWidth : 1,
            width : 300,
            paddingVertical : 10,
            borderRadius : 10,
            backgroundColor : '#ff781f',
            borderColor : '#ff781f',
            shadowColor: "#000",
            shadowOffset: {
                  width: 0,
                  height: 1,
            },
            shadowOpacity: 0.20,
            shadowRadius: 1.41,

            elevation: 2,
      },
      txtBtn : {
            textAlign : 'center',
            fontSize : 15,
            color : '#ffffff',
            letterSpacing : 2,
            fontFamily : 'serif'
      }
})
