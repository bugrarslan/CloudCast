import {Image, SafeAreaView, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Dimensions} from 'react-native';
import {MagnifyingGlassIcon} from 'react-native-heroicons/outline';
import {CalendarDaysIcon, MapPinIcon} from 'react-native-heroicons/solid';
import {debounce} from 'lodash';
import {fetchLocations} from '../api/weather';
import {fetchWeatherForecast} from '../api/weather';
import {weatherImages} from '../constants/index';
import * as Progress from 'react-native-progress';
import Geolocation from 'react-native-geolocation-service';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const WeatherByLocationComponent = props => {
  // const [showSearch, toggleSearch] = useState(false);
  // const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);

  // const handleLocation = loc => {
  //   // console.log("location: ", loc);
  //   setLocations([]);
  //   toggleSearch(false);
  //   setLoading(true);
  //   fetchWeatherForecast({
  //     city: loc.name,
  //   }).then(data => {
  //     setWeather(data);
  //     setLoading(false);
  //     storeData("city", loc.name);
  //   });
  // };

  // const handleSearch = value => {
  //   fetchLocations({ city: value }).then(data => {
  //     if (value.length > 2) {
  //       setLocations(data);
  //     }
  //   });
  // };

  const fetchMyWeatherData = async () => {
    if (lat !== null && long !== null) {
      fetchWeatherForecast({
        city: `${lat},${long}`,
      }).then(data => {
        setWeather(data);
        setLoading(false);
      });
    }
  };

  const fetchLocation = () => {
    setLoading(true);
    Geolocation.watchPosition(
      position => {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        fastestInterval: 30000,
        interval: 30000,
      },
    );
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  useEffect(() => {
    fetchMyWeatherData();
  }, [long]);

  // const { current, location } = weather ? weather : null;

  return (
    <SafeAreaView style={{flex: 1}}>
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Progress.CircleSnail thickness={5} size={50} color={'#0bb3b2'} />
        </View>
      ) : (
        <View style={{width: windowWidth, height: windowHeight}}>
          {/* forecast section */}
          <View
            style={{
              justifyContent: 'space-evenly',
              flex: 1,
              paddingHorizontal: 10,
            }}>
            <View style={{height: windowHeight / 17}} />
            {/*Location*/}
            <View>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontSize: 25,
                  fontWeight: 'bold',
                }}>
                {weather?.location?.name},
                <Text
                  style={{
                    fontWeight: 'semibold',
                    color: '#E0E0E0',
                    fontSize: 20,
                  }}>
                  {' ' + weather?.location?.country}
                </Text>
              </Text>
              {/*weather image*/}
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Image
                  source={{uri: 'https:' + weather?.current?.condition?.icon}}
                  style={{width: windowWidth / 2, aspectRatio: 1}}
                />
              </View>
              {/*degree celcius*/}
              <View style={{marginVertical: windowWidth / 30}}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: 60,
                  }}>
                  {weather?.current?.temp_c}&#176;
                </Text>
                <Text style={{textAlign: 'center', color: 'white'}}>
                  {weather?.current?.condition?.text}
                </Text>
              </View>
              {/*other stats*/}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: '4%',
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    style={{
                      width: windowWidth / 20,
                      aspectRatio: 1,
                      marginHorizontal: 6,
                    }}
                    source={require('../assets/icons/wind.png')}
                  />
                  <Text style={{color: 'white', fontWeight: 'semibold'}}>
                    {weather?.current?.wind_kph}km
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    style={{
                      width: windowWidth / 20,
                      aspectRatio: 1,
                      marginHorizontal: 6,
                    }}
                    source={require('../assets/icons/drop.png')}
                  />
                  <Text style={{color: 'white', fontWeight: 'semibold'}}>
                    {weather?.current?.humidity}%
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    style={{
                      width: windowWidth / 20,
                      aspectRatio: 1,
                      marginHorizontal: 6,
                    }}
                    source={require('../assets/icons/sun.png')}
                  />
                  <Text
                    style={{
                      color: 'white',
                      fontWeight: 'semibold',
                    }}>
                    {weather?.forecast?.forecastday[0]?.astro?.sunrise}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          {/*Forecast for next days*/}
          <View
            style={{marginBottom: windowHeight / 20, paddingHorizontal: 10}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: windowHeight / 40,
                marginHorizontal: '3%',
              }}>
              <CalendarDaysIcon size={22} color={'white'} />
              <Text style={{color: 'white', marginHorizontal: '3%'}}>
                Next Three Days Forecast
              </Text>
            </View>

            <View
              style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
              {weather?.forecast?.forecastday?.map((item, index) => {
                let date = new Date(item.date);
                let options = {weekday: 'long'};
                let imageUrl = item?.day?.condition?.icon;
                let dayName = date.toLocaleDateString('en-US', options);
                dayName = dayName.split(',')[0];
                return (
                  <View
                    key={index}
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: windowWidth / 3.5,
                      borderRadius: 20,
                      padding: 10,
                      margin: 5,
                      backgroundColor: 'rgba(255,255,255,0.15)',
                    }}>
                    <Image
                      source={{uri: 'https:' + imageUrl}}
                      style={{height: windowHeight / 17, aspectRatio: 1 / 1}}
                    />
                    <Text style={{color: 'white'}}>{dayName}</Text>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 20,
                        fontWeight: '500',
                      }}>
                      {item?.day?.avgtemp_c}&#176;
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default WeatherByLocationComponent;
