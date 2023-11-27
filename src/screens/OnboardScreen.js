import React, { useEffect, useState } from "react";
import { Dimensions, Text, TouchableOpacity, View} from "react-native";
import FastImage from "react-native-fast-image";
import { check, PERMISSIONS, RESULTS, request} from "react-native-permissions";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const OnboardScreen = ({navigation}) => {

  const requestPermission = () => {
    request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((response) => {
      console.log(response)
    })
  }

  const checkPermission = () => {
    check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      .then((result) => {
        switch (result) {
          case RESULTS.DENIED:
            requestPermission();
            break;
          case RESULTS.GRANTED:
            navigation.navigate("Home");
            break;
          case RESULTS.BLOCKED:
            requestPermission();
            break;
        }
      })
      .catch((error) => {
        // …
      });
  }

  const handleNavigation = () => {
    checkPermission()
  }

  return(
    <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
      <FastImage source={require("../assets/images/bg.png")} resizeMode={FastImage.resizeMode.cover} style={{width:windowWidth, height:windowHeight, position:"absolute", top:0}}/>
      <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-around",width:windowWidth}}>
        <Text style={{textAlign:"center", color:"white", fontSize:15, fontWeight:"bold"}}>Welcome to the CloudCast</Text>
        <TouchableOpacity
          onPress={()=> {handleNavigation()}}
          style={{ width:windowWidth/5, height:windowHeight/9, justifyContent:"center", alignItems:"center", borderRadius:40, borderWidth:2, borderColor:"gray"}}>
          <Text style={{ textAlign:"center", fontSize:20}}>Go</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default OnboardScreen
