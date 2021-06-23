import React, {useState} from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';
import {color} from 'react-native-reanimated';
import {colors} from '../../utils/colors';

const Input = ({placeholder, titlelabel, ...rest}) => {
  const [selectedValue, setSelectedValue] = useState('java');
  return (
    <View style={styles.containerInput}>
      <Text style={styles.titlelabel}>{titlelabel}</Text>
      <TextInput
        placeholder={placeholder}
        style={styles.textInput}
        {...rest} //props ...rest digunaka agar props yang di tambhakan pada saat compoent di panggil bisa langsung di pakai
        // onChangeText={(value) => setName(value)}
      />
    </View>
  );
};

export {Input};

const styles = StyleSheet.create({
  textInput: {
    borderBottomWidth: 1,
    paddingVertical: 15,
    borderColor: colors.default,
  },
  containerInput: {
    marginBottom: 20,
  },
  titlelabel: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});
