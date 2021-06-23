import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { colors } from '../../utils/colors';

const IconWithView = (props) => {
  return (
    <View>
      <View
        style={{
          width: 60,
          height: 60,
          backgroundColor: colors.default,
          borderRadius: 60,
        }}
      />
      <Text style={{maxWidth: 70, textAlign: 'center', marginTop: 10}}>
        {' '}
        {props.title}{' '}
      </Text>
    </View>
  );
};

const IconAction = () => {
  return (
    <View
      style={{
        width: 35,
        height: 35,
        backgroundColor: '#ffffff',
        borderRadius: 35,
      }}
    />
  );
};
class Scan extends React.Component {
  // const TOKEN = useSelector((state) => state.TokenApi);
  state = {
    barcode : {},
    // TOKEN : useSelector((state) => state.TokenApi)
  }


  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
    }
  };

  actionScan = (barcode = {}) => {
     this.setState(
        {barcode : barcode}
      )
      if(barcode == null){
        console.log('null')
      }else{
        this.props.navigation.navigate('Transfer', { dataScan: barcode.data })
      }
  }

  render(){
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1, backgroundColor: 'grey'}}>

        <RNCamera
                ref={ref => {
                  this.camera = ref;
                }}
                style={{
                  width : '100%',
                  height : '100%',
                  // position : 'absolute',
                  // top:0,
                  // left : 0,
                  flex: 1,
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}
                type={RNCamera.Constants.Type.back}
                flashMode={RNCamera.Constants.FlashMode.on}
                androidCameraPermissionOptions={{
                  title: 'Permission to use camera',
                  message: 'We need your permission to use your camera',
                  buttonPositive: 'Ok',
                  buttonNegative: 'Cancel',
                }}
                // androidRecordAudioPermissionOptions={{
                //   title: 'Permission to use audio recording',
                //   message: 'We need your permission to use your audio',
                //   buttonPositive: 'Ok',
                //   buttonNegative: 'Cancel',
                // }}
                onBarCodeRead={(barcode) => {
                  // console.log(barcode);
                  this.actionScan(barcode)
                  // this.setState(
                  //   {barcode : barcode}
                  // )
                }}
              />
        </View>
      </View>
    );
  }

  
};

export default Scan;

const styles = StyleSheet.create({});