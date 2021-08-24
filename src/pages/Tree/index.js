import React, { useEffect, useReducer, useState } from 'react';
import { StyleSheet, Text,View,Image } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header2 } from '../../component';
import { avatartree,avatartreepasif,avatar,circleup,circleright,circledown, circleleft} from '../../assets';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import Config from 'react-native-config';
import { ActivityIndicator } from 'react-native';
import { colors } from '../../utils/colors';


const Type = (props) =>{
    return(
        <View style={{flexDirection:'row'}}>
            <View style={[styles.type,{backgroundColor:props.backgroundColor,borderColor:props.borderColor}]}></View>
            <Text style={{paddingHorizontal:5, color:'#696969'}}>{props.text}</Text>
        </View>
    )
}

const ExpandRight =(props)=>{
    return(
        <View style={{flexDirection:'row', height:310}}>
            <View style={{justifyContent:'center'}}>
                <LineHorizontal/>
            </View>
            <View style={{justifyContent:'center'}} >
                <TouchableOpacity style={styles.boxExpand} onPress={props.onPress}>
                    <Image source={circleright} style={{width:20, height:20}}/>
                </TouchableOpacity>
            </View>
        </View>
    )
}
const ExpandLeft =(props)=>{
    return(
        <View style={{flexDirection:'row', height:310}}>
            <View style={{justifyContent:'center'}} >
                <TouchableOpacity style={styles.boxExpand} onPress={props.onPress}>
                    <Image source={circleleft} style={{width:20, height:20}}/>
                </TouchableOpacity>
            </View>
            <View style={{justifyContent:'center'}}>
                <LineHorizontal/>
            </View>
        </View>
    )
}
const ExpandDown =()=>{
    return(
        <View style={styles.boxExpand}>
            <Image source={circledown} style={{width:20, height:20}}/>
       </View>
    )
}
const ExpandUp =(props)=>{
    return(
        <TouchableOpacity onPress={props.onPress}>
            <View style={{alignItems:'center'}}>
                <View style={styles.boxExpand}>
                        <Image source={circleup} style={{width:20, height:20}}/>
                </View>
                <LineVertical/>
            </View>
         </TouchableOpacity>
    )
}
const LineVertical =()=>{
    return(
        <View style={{backgroundColor:'#696969',height : 70, width:1}}>
        </View>
    )
}
const LineHorizontal =()=>{
    return(
        <View style={{backgroundColor:'#696969', height:1, width:70}}>
        </View>
    )
}


const BoxDataLeft =(props)=>{
    const user = props.user
    var typeColor = {
        backgroundColor : '#ffffff',
        borderColor : '#ffffff'
    }
    if(user.activations.name == 'user'){
        typeColor = {
            backgroundColor : '#1AE383',
            borderColor : '#13CE75'   
        }
    }else if(user.activations.name == 'gold'){
        typeColor = {
            backgroundColor : '#FFDC26',
            borderColor : '#EFBD3C'   
        }
    }else if(user.activations.name == 'silver'){
        typeColor = {
            backgroundColor : '#E5E5E5',
            borderColor : '#DDDCDC'   
        }
    }else if(user.activations.name == 'platinum'){
        typeColor = {
            backgroundColor : '#FF0000',
            borderColor : '#E30303'   
        }
    }   

    return(
        <View>
            <View style={{width:220,alignItems:'center'}}>
            </View>
            <View style={{flexDirection:'row'}}>
                <View style={styles.boxData}>
                <View style={{alignItems:'center'}}>
                    <Image source={avatar} style={{width:80, height:80}}/>
                </View>
                <View style={[styles.boxText,{justifyContent:'space-between'}]}>
                    <View style={{flex:1,alignItems:'center',justifyContent:'center',flexDirection:'row', marginVertical:10}}>
                        <Type 
                            backgroundColor={typeColor.backgroundColor} 
                            borderColor={typeColor.borderColor}   
                        />
                    </View>
                </View>
                    <View style={styles.boxText}>
                        <View style={{flex:1.2}}>
                            <Text style={styles.label}>Kode </Text>
                        </View>
                        <View style={{flex:0.1}}>
                            <Text style={styles.label}>: </Text>
                        </View>
                        <View style={{flex:2}}>
                            <Text style={styles.text}>{user.code}</Text>
                        </View>
                    </View>
                    <View style={styles.boxText}>
                        <View style={{flex:1.2}}>
                            <Text style={styles.label}>Nama</Text>
                        </View>
                        <View style={{flex:0.1}}>
                            <Text style={styles.label}>: </Text>
                        </View>
                        <View style={{flex:2}}>
                            <Text style={styles.text}>{user.name}</Text>
                        </View>
                    </View>
                    <View style={styles.boxText}>
                        <View style={{flex:1.2}}>
                            <Text style={styles.label}>Tipe</Text>
                        </View>
                        <View style={{flex:0.1}}>
                            <Text style={styles.label}>: </Text>
                        </View>
                        <View style={{flex:2}}>
                            <Text style={styles.text}>{user.activations.name}</Text>
                        </View>
                    </View>
                    <View style={{width:'100%', height:1, backgroundColor:'#C4C4C4',marginVertical:5}}></View>
                    <View style={styles.boxText}>
                        <View style={{flex:1.2}}>
                            <Text style={styles.label}>Activasi</Text>
                        </View>
                        <View style={{flex:0.1}}>
                            <Text style={styles.label}>: </Text>
                        </View>
                        <View style={{flex:2}}>
                            <Text style={styles.text}>{user.activation_at.slice(0,10)}</Text>
                        </View>
                    </View>
                </View>
                <View style={{justifyContent:'center'}}>
                    <LineHorizontal/>
                </View>
            </View>
        </View>
    )
}

const BoxDataMid =(props)=>{
    const user = props.user
      var typeColor = {
        backgroundColor : '#ffffff',
        borderColor : '#ffffff'
    }
    if(user.activations){
        if(user.activations.name == 'user'){
            typeColor = {
                backgroundColor : '#1AE383',
                borderColor : '#13CE75'   
            }
        }else if(user.activations.name == 'gold'){
            typeColor = {
                backgroundColor : '#FFDC26',
                borderColor : '#EFBD3C'   
            }
        }else if(user.activations.name == 'silver'){
            typeColor = {
                backgroundColor : '#E5E5E5',
                borderColor : '#DDDCDC'   
            }
        }else if(user.activations.name == 'platinum'){
            typeColor = {
                backgroundColor : '#FF0000',
                borderColor : '#E30303'   
            }
        }   
    }
    return(
        // <ExpandUp onPress={() => {getDownline(userReducer.ref_id); setUserReducer(lastUserReducer.pop()); }}
        <View style={{alignItems:'center'}}>
            {props.show? <ExpandUp onPress={props.onPress} /> : null}
            <View style={styles.boxData}>
            <View style={{alignItems:'center'}}>
                <Image source={avatar} style={{width:80, height:80}}/>
            </View>
                <View style={[styles.boxText,{justifyContent:'space-between'}]}>
                    <View style={{flex:1,alignItems:'center',justifyContent:'center',flexDirection:'row', marginVertical:10}}>
                        <Type 
                            backgroundColor={typeColor.backgroundColor} 
                            borderColor={typeColor.borderColor}   
                        />
                    </View>
                </View>
                <View style={styles.boxText}>
                    <View style={{flex:1.2}}>
                        <Text style={styles.label}>Kode </Text>
                    </View>
                    <View style={{flex:0.1}}>
                        <Text style={styles.label}>: </Text>
                    </View>
                    <View style={{flex:2}}>
                        <Text style={styles.text}>{user.code}</Text>
                    </View>
                </View>
                <View style={styles.boxText}>
                    <View style={{flex:1.2}}>
                        <Text style={styles.label}>Nama</Text>
                    </View>
                    <View style={{flex:0.1}}>
                        <Text style={styles.label}>: </Text>
                    </View>
                    <View style={{flex:2}}>
                        <Text style={styles.text}>{user.name}</Text>
                    </View>
                </View>
                <View style={styles.boxText}>
                    <View style={{flex:1.2}}>
                        <Text style={styles.label}>Tipe</Text>
                    </View>
                    <View style={{flex:0.1}}>
                        <Text style={styles.label}>: </Text>
                    </View>
                    <View style={{flex:2}}>
                        {user.activations && <Text style={styles.text}>{user.activations.name}</Text>}
                    </View>
                </View>
                <View style={styles.boxText}>
                    <View style={{flex:1.2}}>
                        <Text style={styles.label}>Refferal</Text>
                    </View>
                    <View style={{flex:0.1}}>
                        <Text style={styles.label}>: </Text>
                    </View>
                    <View style={{flex:2}}>
                        <Text style={styles.text}>{user.refferal.code} - {user.refferal.name}</Text>
                    </View>
                </View>
                <View style={{width:'100%', height:1, backgroundColor:'#C4C4C4',marginVertical:5}}></View>
                <View style={styles.boxText}>
                    <View style={{flex:1.2}}>
                        <Text style={styles.label}>Activasi</Text>
                    </View>
                    <View style={{flex:0.1}}>
                        <Text style={styles.label}>: </Text>
                    </View>
                    <View style={{flex:2}}>
                      {user.activations &&   <Text style={styles.text}>{user.activation_at.slice(0,10)}</Text>}
                    </View>
                </View>
            </View>
            {!props.lineVertical &&
                <View style={{alignItems:'center'}}>
                  <LineVertical/>
                </View>
            }
            {props.end}
        </View>
    )
}


// BASE

const Tree = ({navigation}) => {
    const baseDataUser = useSelector((state) => state.UserReducer);
    const [userReducer, setUserReducer] = useState(useSelector((state) => state.UserReducer))
    const [userFirstReducer, setFirstUserReducer] = useState(useSelector((state) => state.UserReducer))
    const [lastUserReducer, setLastUserReducer] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const TOKEN = useSelector((state) => state.TokenApi);
    const [data, setData] = useState([])
    const isFocused = useIsFocused();

    useEffect(() => {
        if(isFocused){
            getDownline()
        }
    }, [isFocused])

    const getDownline = (id = null) => {
        setIsLoading(true)
        if(id ==null ){
            id = baseDataUser.id
        }
          axios.get(Config.API_DOWNLINE + `${id}`, 
                {
                      headers: {
                            Authorization: `Bearer ${TOKEN}`,
                            'Accept' : 'application/json' 
                      }
                }
          ).then((res) => {
                console.log('data user',res.data)
                setData(res.data.data)
                setIsLoading(false)
          }).catch(e => {
              console.log(e);
              alert('gagal ambil data')
          }).finally(f => setIsLoading(false))

          console.log('user last', lastUserReducer);
    }

    const Spinner = () => {
        return (
            <View style={{ flex : 1, alignItems :'center', justifyContent :'center' }}>
                <ActivityIndicator size='large' color={colors.default} />
            </View>
        )
    }
    return (
        <SafeAreaView style={styles.container}>
                <Header2 title ='Pohon Jaringan' btn={() => navigation.navigate('Menu')}/>
                {/* <ScrollView> */}
                    <View style={styles.box}>
                        <View style={{flexDirection:'row', flex:1}}>
                            <View style={{flex:1, flexDirection:'row', justifyContent:'center'}}>
                                <View style={{alignItems:'center', paddingHorizontal:5}}>
                                    <Image source={avatartree} style={{width:40, height:40}}/>
                                    <Text style={{color:'#696969'}}>Active User</Text>
                                </View>
                                <View style={{alignItems:'center', paddingHorizontal:5}}>
                                    <Image source={avatartreepasif} style={{width:40, height:40}}/>
                                    <Text style={{color:'#696969'}}>Inactive User</Text>
                                </View>
                            </View>
                            <View style={{flexDirection:'row', flex:1,justifyContent:'center', alignItems:'center'}}>
                                <View style={{paddingHorizontal:5}}>
                                    <View style={{paddingVertical:5}}>
                                        <Type 
                                            backgroundColor='#1AE383' 
                                            borderColor='#13CE75' 
                                            text='User'
                                        />
                                    </View>
                                    <View style={{paddingVertical:5}}>
                                        <Type 
                                            backgroundColor='#FFDC26' 
                                            borderColor='#EFBD3C'
                                            text='Gold'    
                                        />
                                    </View>
                                </View>
                                <View style={{paddingHorizontal:5}}>
                                    <View style={{paddingVertical:5}}>
                                        <Type 
                                            backgroundColor='#E5E5E5' 
                                            borderColor='#DDDCDC' 
                                            text='Silver'
                                        />
                                    </View>
                                    <View style={{paddingVertical:5}}>
                                        <Type 
                                            backgroundColor='#FF0000' 
                                            borderColor='#E30303'
                                            text='Platinum'    
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    {isLoading && <Spinner />}
                    {!isLoading && 
                        <ScrollView >
                            
                            <View style={{alignItems:'center', paddingHorizontal:20, paddingVertical:20}}>
                                <ScrollView horizontal>
                                    <View style={{flexDirection:'column',  justifyContent:'center'}}>
                                        <View style={{height:'auto', justifyContent:'center'}}>
                                            {/* {baseDataUser.id != userReducer.id ? <ExpandUp onPress={() => {getDownline(userReducer.ref_id); setUserReducer(lastUserReducer.pop()); }} /> : null} */}
                                            <View style={{ flexDirection:'row' }} >
                                                <View style={{ width:70 }} />
                                                    <BoxDataMid user = {userReducer} show ={baseDataUser.id != userReducer.id ? true : false} onPress={() => {getDownline(userReducer.ref_id); setUserReducer(lastUserReducer.pop());}}  lineVertical = {data.length > 0 ?false :true}  />
                                                <View style={{ width:120 }} />
                                            </View>
                                            
                                            <View >
                                                {!isLoading && data.map((item, index) => {
                                                    return (
                                                        <View style={{flexDirection : 'row'}} key={index} >
                                                            <View style={{ width:70 }} />
                                                            <BoxDataMid user = {item}  lineVertical = {(data.length-1) <= index ? true :false}  />
                                                            <ExpandRight onPress={() => {getDownline(item.id); setUserReducer(item); setFirstUserReducer(userReducer); lastUserReducer.push(userReducer)}} /> 
                                                        </View>
                                                    )
                                                })}
                                            </View>
                                        </View>
                                    </View>
                                
                                </ScrollView>
                            </View>
                        </ScrollView>
                    }

                {/* </ScrollView> */}
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
container : {
    flex :1,
    backgroundColor : '#f4f4f4',
  },
  box:{
    backgroundColor:"white",
    elevation:10,
    padding:10,
    width:"100%",
    height:80
  },
  boxData:{
    elevation:5,
    padding:20,
    paddingTop:10,
    width:220,
    backgroundColor:'#FFFFFF',
    // borderWidth:1,
    // borderColor:'blue',
    height:310,
    alignItems:'center',
    justifyContent:'center'
  },
  boxExpand:{
    elevation:5,
    padding:20,
    height:30,
    width:50,
    backgroundColor:'#FFFFFF',
    alignItems:'center',
    justifyContent:'center'
  },
  boxText:{
    flexDirection:'row',
    height:'auto',
    paddingVertical:2,
  
  },
  label:{
    color:'#696969',
    fontSize:15,
    fontWeight:'bold'
  },
  text:{
    color:'#696969',
    fontSize:15
  },
  textExpand:{
    color:'#3C9DD8',
    fontSize:15,
    fontWeight:'bold'
  },
  type:{
    width:20, 
    height:20, 
    borderRadius:20, 
    borderWidth:2
  }

})
export default Tree