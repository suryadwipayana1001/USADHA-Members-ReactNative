import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../../utils/colors';

const Header2 = (props) => {
      return (
      <View style={styles.header}>
            <TouchableOpacity
                  style={styles.btnBack}
                  onPress={props.btn}>
                  <Icon name="chevron-circle-left" color="#ffffff" size={25} />
            </TouchableOpacity>
            <Text style={styles.text}>{props.title}</Text>
      </View>
      )
}

export default Header2

const styles = StyleSheet.create({
      header: {
            paddingRight: 20,
            paddingVertical: 0,
            flexDirection: 'row',
            backgroundColor: colors.default,
            alignItems: 'center',
      },
      btnBack: {
            marginRight: 10,
            width : 60,
            alignItems : 'center',
            height : 50,
            justifyContent : 'center',
            // backgroundColor : 'black',
      },
      text: {
            color: '#ffffff',
            fontSize: 20,
            fontWeight: 'bold',
      },
})
