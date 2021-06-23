import React, { Component } from 'react'
import { Alert, Text, View, StyleSheet } from 'react-native'
import OneSignal from 'react-native-onesignal'
export class Notif extends Component {

  constructor(props) {
    super(props);
    this.state = {
      text : 'Hello Fajar'
    };
  }

  async componentDidMount() {
    /* O N E S I G N A L   S E T U P */
    // OneSignal.setAppId("7c70da1f-5e99-4e15-893a-fa067fb6ca95");
    // OneSignal.setLogLevel(6, 0);
    // OneSignal.setRequiresUserPrivacyConsent(false);
    // OneSignal.promptForPushNotificationsWithUserResponse(response => {
    //     console.log("Prompt response:", response);
    //     console.log(response)
    // });

    // /* O N E S I G N A L  H A N D L E R S */
    OneSignal.setNotificationWillShowInForegroundHandler(notifReceivedEvent => {
        console.log("OneSignal: notification will show in foreground:", notifReceivedEvent);
        let notif = notifReceivedEvent.getNotification();

        const button1 = {
            text: "Cancel",
            onPress: () => { notifReceivedEvent.complete(); },
            style: "cancel"
        };

        const button2 = { text: "Complete", onPress: () => { notifReceivedEvent.complete(notif);}};

        Alert.alert("Complete notification?", "Test", [ button1, button2], { cancelable: true });
    });
    OneSignal.setNotificationOpenedHandler(notification => {
        // console.log("OneSignal: notification opened:", notification);
        alert(notification)
        // this.setState(
        //   {
        //     text : notification
        //   }
        // )
    });
    // OneSignal.setInAppMessageClickHandler(event => {
    //     console.log("OneSignal IAM clicked:", event);
    // });
    // OneSignal.addEmailSubscriptionObserver((event) => {
    //     console.log("OneSignal: email subscription changed: ", event);
    // });
    // OneSignal.addSubscriptionObserver(event => {
    //     console.log("OneSignal: subscription changed:", event);
    //     this.setState({ isSubscribed: event.to.isSubscribed})
    // });
    // OneSignal.addPermissionObserver(event => {
    //     console.log("OneSignal: permission changed:", event);
    // });

    // const deviceState = await OneSignal.getDeviceState();

    // console.log('device state = ' + deviceState['userId']);

    // this.setState({
    //     isSubscribed : deviceState.isSubscribed
    // });
}

  render() {
    return (
      <View style={styles.container}>
      <Text style={styles.welcome}>
        Welcome to the OneSignal Example!
      </Text>
      <Text style={styles.instructions}>
        {this.state.text}
        {/* Using {Platform.OS}? Cool. */}
      </Text>
    </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
});

export default Notif;