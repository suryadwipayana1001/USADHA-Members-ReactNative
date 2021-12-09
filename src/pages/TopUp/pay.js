import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View } from 'react-native'
import WebView from 'react-native-webview';

const Pay = ({navigation, route}) => {
    let urimap = route.params.urimap 
    useEffect(() => {
       console.log(urimap);
    }, [])
    return (
        <SafeAreaView style={styles.container}>
            {/* <Text>{urimap}</Text> */}
            <WebView
                source={{
                uri: urimap
                }}
                onMessage={event => event.nativeEvent.data === 'WINDOW_CLOSED' ? navigation.navigate('NotifAlert', {notif : 'Mohon Selesaikan Proses Pembayaran, Petunjuk Lebih Lanjut Bisa Lihat Email.'}) : alert(event.nativeEvent.data)}
            />
        </SafeAreaView>
    )
}

export default Pay

const styles = StyleSheet.create({
    container : {
        flex : 1
    }
})
