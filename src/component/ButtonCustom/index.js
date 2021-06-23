import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {colors} from '../../utils/colors';
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/dist/MaterialCommunityIcons";

export default function ButtonCustom(props) {
  return (
    <Button
      buttonStyle={{ backgroundColor : props.color}}
      containerStyle={{width : props.width, borderRadius : 10}}
      onPress={props.func}
      title={props.name}
      titleProps={{}}
      titleStyle={{ marginHorizontal: 5 }}
      icon={props.icon}
    />
  );
}

const styles = StyleSheet.create({
  btnBorder: {
    alignItems: 'center',
    // marginBottom : 50,
    height : 45,
    borderWidth: 1,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: colors.btn,
    borderColor: colors.btn,
    justifyContent: 'center'
  },
  btnText: {
    fontSize: 20,
    color: 'white',
  },
});
