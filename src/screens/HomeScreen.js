import { ImageBackground, SafeAreaView, StatusBar, PermissionsAndroid } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { storeData, getData } from "../utils/AsyncStorage";
import Swiper from 'react-native-swiper'
import WeatherBySearchComponent from "../components/WeatherBySearchComponent";
import WeatherByLocationComponent from "../components/WeatherByLocationComponent";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const HomeScreen = (props) => {

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle={"light-content"} />
      <ImageBackground
        blurRadius={70} source={require("../assets/images/bg.png")}
        style={{ width: windowWidth, height: windowHeight }}>
        <Swiper>
          <WeatherBySearchComponent/>
          <WeatherByLocationComponent/>
        </Swiper>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default HomeScreen;
