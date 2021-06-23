import React, {Component, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image, Alert,  PermissionsAndroid} from 'react-native';
import Config from 'react-native-config';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
// import Axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
// import {NativeModules} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob'
import { ButtonCustom, Header2, Releoder } from '../../component';
import { colors } from '../../utils/colors';

const options = {
  title: 'konsepKoding',
  takePhotoButtonTitle: 'Take photo with your camera',
  chooseFromLibraryButtonTitle: 'Choose photo from library',
};

const UploadImg = ({navigation}) => {
  
  const TOKEN = useSelector((state) => state.TokenApi);
  const [avatarSource, setAvatarSource] = useState(null)
  const [pic, setPic] = useState(null)
  const userReducer = useSelector((state) => state.UserReducer);
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();  
  // const RNFetchBlob = NativeModules.RNFetchBlob;
  
  const requestCameraPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
  };


  const getCamera = async () => {
    let isCameraPermitted = await requestCameraPermission();
    launchCamera(
      {
        mediaType: 'photo',
        includeBase64: true,
        maxHeight: 360,
        maxWidth: 360,
      },
      (response) => {
        // console.log('respone',response.errorCode)
        if(response.didCancel){
          console.log('gambar ksoong')
        }else{
         if(response.errorCode){
           console.log('kosong')
         }else{
          setAvatarSource(response)
         }
        }
      },
    )
    setAvatarSource(null)
  }

  const getGalery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
        maxHeight: 360,
        maxWidth: 360,
      },
      (response) => {
         // console.log('respone',response.errorCode)
         if(response.errorCode){
           setAvatarSource(null)
          console.log('izin camera belum di dapatkan')
        }else{
          // console.log ('kosong')
          // setAvatarSource(response);
          if(response.didCancel){
            console.log('gambar ksoong')
          }else{
            setAvatarSource(response)
            console.log('ada')
          }
        }
      },
    )
    setAvatarSource(null)
  }

  const sendImg = () => {
    // console.log('klik')
    if(typeof(avatarSource) == 'undefined') {
      alert('pilih gambar dahulu')
    }else{
      setLoading(true)
      RNFetchBlob.fetch(
        'POST',
          Config.API_UPLOAD_IMG + `${userReducer.id}`,
        {
          Authorization: `Bearer ${TOKEN}`,
          otherHeader: 'foo',
          'Accept' : 'application/json' ,
          'Content-Type': 'multipart/form-data',
        },
        [
          // name: image adalah nama properti dari api kita
          {name: 'img', filename: avatarSource.fileName, data: avatarSource.base64},
        ],
      ).then((resp) => {
        setLoading(false)
        var data = JSON.parse(resp.data);
        // console.log(data.data)
        dispatch({type: 'SET_DATA_USER', value: data.data});
        // storeDataToken(res.data.token.token)
        // storeDataUser( res.data.user)
        navigation.navigate('Profile')
        // setAvatarSource(null)
      }).catch((err) => {
        console.log(err) 
        alert('Upload Gagal');
        // setAvatarSource(null)
        setLoading(false)
      }) 
    } 
  }

  
  if(loading){
    return (
      <Releoder/>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
       <Header2 title ='Foto Profile' btn={() => navigation.goBack()}/>
      <Text style={styles.welcome}>Update Foto Profile</Text>

      <Image
        source={avatarSource}
        style={{width: '100%', height: 500 , margin: 10}}
      />

      <View style={{alignItems : 'center'}}>
        <View style={{marginBottom : 10}}>
          <ButtonCustom
              name = 'Pilih Image'
              color = {colors.dark}
              width = '100%'
              // func = {() => updateData()}
              func = {() => Alert.alert(
                'Foto Profile',
                `Galery atau Camera? `,
                [
                    {
                        text : 'Galery',
                        onPress : () => getGalery()
                    },
                    {
                        text : 'Camera',
                        onPress : () => getCamera()
                    }
                ]
            )}
          />
        </View>
        {avatarSource != null? 
           <View>
            <ButtonCustom
              name = 'Upload Image'
              color = {colors.btn}
              width = '100%'
              func = {() => Alert.alert(
                'Foto Profile',
                `Ubah Foto Profile ? `,
                [
                    {
                        text : 'Tidak',
                        // onPress : () => getGalery()
                        onPress : console.log('tidak')
                    },
                    {
                        text : 'Ya',
                        onPress : () => sendImg()
                    }
                ]
              )}
            />
          </View> 
          :
          null
        }
      </View>
  </SafeAreaView>
  )
}

export default UploadImg

const styles = StyleSheet.create({
   container: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#ffffff',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
})
