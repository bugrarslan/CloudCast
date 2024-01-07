import { ImageBackground, SafeAreaView, StatusBar, PermissionsAndroid } from "react-native";
import React from "react";
import { Dimensions } from "react-native";
import Swiper from 'react-native-swiper'
import WeatherBySearchComponent from "../components/WeatherBySearchComponent";
import WeatherByLocationComponent from "../components/WeatherByLocationComponent";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const HomeScreen = ({navigation}) => {

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle={"light-content"} />
      <ImageBackground
        blurRadius={70} source={require("../assets/images/bg.png")}
        style={{ width: windowWidth, height: windowHeight }}>
        <Swiper loop={false}>
          <WeatherBySearchComponent navigation={navigation}/>
          <WeatherByLocationComponent navigation={navigation}/>
        </Swiper>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default HomeScreen;
