import React, { useEffect, useState } from "react";
import { Dimensions, ImageBackground, Text, TouchableOpacity, View} from "react-native";
import FastImage from "react-native-fast-image";
import { check, PERMISSIONS, RESULTS, request} from "react-native-permissions";
import { PermissionsAndroid } from 'react-native';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const OnboardScreen = ({navigation}) => {

  const handlePermissionCheck = async () => {
    try {
      // İzin kontrolü burada gerçekleştirilir
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Uygulama İzni',
          message: 'Uygulamayı kullanabilmek için konum izni gerekiyor.',
          buttonNeutral: 'Daha sonra sor',
          buttonNegative: 'Reddet',
          buttonPositive: 'İzin Ver',
        },
      );
      
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // İzin verildiyse ana sayfaya yönlendirme
        navigation.navigate('Home');
      } else {
        console.log('İzin reddedildi');
        // İzin reddedildiyse isteğinize göre işlemleri yapabilirsiniz
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    // Component yüklendiğinde izin kontrolü yapılır
    handlePermissionCheck();
  }, []);

  return(
    <View style={{flex:1}}>
      <ImageBackground source={require("../assets/images/bg.png")} blurRadius={70} style={{ width: windowWidth, height: windowHeight, alignItems:"center", justifyContent:"center" }}>
        <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-around",width:windowWidth}}>
        <Text style={{textAlign:"center", color:"white", fontSize:20, fontWeight:"bold"}}>Welcome to the CloudCast</Text>
      </View>
      </ImageBackground>
    </View>
  )
}

export default OnboardScreen
