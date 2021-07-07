import React, {useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector} from 'react-redux';
import {
  Keranjang,
  Splash,
  Jaringan,
  Profile,
  Login,
  Register,
  Dashboard,
  Menu,
  DetailProduct,
  Scan,
  CheckOut,
  TopUp,
  Transfer,
  History,
  Agen,
  Api,
  HistoryPoint, 
  HistoryOrder,
  HistoryOrderDetail,
  OTP,
  Bank,
  WithDraw,
  Downline,
  HistoryOrderMasuk,
  Notif,
  Reset,
  UploadImg,
  LogNotif,
  UpgradeType,
} from '../pages';
import {ButtomNavigator, NotifAlert} from '../component';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainApp = () => {
  return (
    <Tab.Navigator tabBar={(props) => <ButtomNavigator {...props} />}>
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Menu" component={Menu} />
      <Tab.Screen name="Scan" component={Scan} />
      <Tab.Screen name="Keranjang" component={Keranjang} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

//yang ini page nya kak

const Router = () => {
  return (
    <Stack.Navigator initialRouteName={'Splash'}>
      {/* headershown : false agar menu navbarheader tidak muncul aa*/}
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{headerShown: false}}  
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{headerShown: false}}
      />
         <Stack.Screen
        name="Dashboardx"
        component={Dashboard}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CheckOut"
        component={CheckOut}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DetailProduct"
        component={DetailProduct}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Agen"
        component={Agen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Api"
        component={Api}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="History"
        component={History}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Jaringan"
        component={Jaringan}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TopUp"
        component={TopUp}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Transfer"
        component={Transfer}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MainApp"
        component={MainApp}
        options={{headerShown: false}}
      />
       <Stack.Screen
        name="Profilex"
        component={Profile}
        options={{headerShown: false}}
      />
       <Stack.Screen
        name="HistoryPoint"
        component={HistoryPoint}
        options={{headerShown: false}}  
      />
       <Stack.Screen
        name="HistoryOrder"
        component={HistoryOrder}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="HistoryOrderDetail"
        component={HistoryOrderDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MenuScan"
        component={Scan}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="OTP"
        component={OTP}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Bank"
        component={Bank}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="WithDraw"
        component={WithDraw}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Downline"
        component={Downline}
        options={{headerShown: false}}
      />
       <Stack.Screen
        name="HistoryOrderMasuk"
        component={HistoryOrderMasuk}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="NotifAlert"
        component={NotifAlert}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Notif"
        component={Notif}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Reset"
        component={Reset}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="UploadImg"
        component={UploadImg}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LogNotif"
        component={LogNotif}
        options={{headerShown: false}}
      />
       <Stack.Screen
        name="UpgradeType"
        component={UpgradeType}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default Router;

const styles = StyleSheet.create({});
