import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Dimensions} from 'react-native';
import {MagnifyingGlassIcon} from 'react-native-heroicons/outline';
import {CalendarDaysIcon, MapPinIcon} from 'react-native-heroicons/solid';
import {debounce} from 'lodash';
import {fetchLocations} from '../api/weather';
import {fetchWeatherForecast} from '../api/weather';
import {weatherImages} from '../constants/index';
import * as Progress from 'react-native-progress';
import {storeData, getData} from '../utils/AsyncStorage';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const WeatherBySearchComponent = ({navigation}) => {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);

  const handleLocation = async loc => {
    // console.log("location: ", loc);
    setLocations([]);
    toggleSearch(false);
    setLoading(true);
    fetchWeatherForecast({
      city: loc.name,
    }).then(data => {
      setWeather(data);
      setLoading(false);
      storeData('city', loc.name);
    });
  };

  const handleSearch = value => {
    fetchLocations({city: value}).then(data => {
      if (value.length > 2) {
        setLocations(data);
      }
    });
  };

  useEffect(() => {
    fetchMyWeatherData();
  }, []);

  const fetchMyWeatherData = async () => {
    let myCity = await getData('city');
    let defaultCity = 'Istanbul';
    if (!myCity) myCity = defaultCity;
    fetchWeatherForecast({
      city: myCity,
    }).then(data => {
      setWeather(data);
      setLoading(false);
    });
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  // const { current, location } = weather ? weather : null;

  return (
    <SafeAreaView style={{flex: 1}}>
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Progress.CircleSnail thickness={5} size={50} color={'#0bb3b2'} />
        </View>
      ) : (
        <View style={{flex:1}}>
          {/* forecast section */}
          <View
            style={{
              justifyContent: 'space-evenly',
              paddingHorizontal: 10,
              flex: 1,
              backgroundColor:'red'
            }}>
            {/*Location*/}
            <View style={{height: windowHeight / 17}}>
              <View
                style={{
                  backgroundColor: showSearch
                    ? 'rgba(255,255,255,0.2)'
                    : 'transparent',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  borderRadius: 50,
                }}>
                {showSearch ? (
                  <TextInput
                    onChangeText={handleTextDebounce}
                    placeholder="Search city"
                    placeholderTextColor={'lightgray'}
                    style={{paddingLeft: windowWidth / 20, flex: 1}}
                  />
                ) : null}
                <TouchableOpacity
                  onPress={() => toggleSearch(!showSearch)}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    borderRadius: 20,
                    padding: 10,
                    margin: 4,
                  }}>
                  <MagnifyingGlassIcon size="22" color="white" />
                </TouchableOpacity>
              </View>
              {locations.length > 0 && showSearch ? (
                <View
                  style={{
                    width: '100%',
                    backgroundColor: '#E0E0E0',
                    top: 60,
                    borderRadius: 30,
                    position: 'absolute',
                  }}>
                  {locations.map((loc, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleLocation(loc)}
                        style={[
                          {
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: 10,
                            paddingLeft: 15,
                            borderColor: '#BDBDBD',
                          },
                          index + 1 !== locations.length && {
                            borderBottomWidth: 2,
                          },
                        ]}>
                        <MapPinIcon size={20} color={'gray'} />
                        <Text
                          style={{
                            color: 'black',
                            fontSize: 20,
                            marginLeft: '2%',
                          }}>
                          {loc?.name}, {loc?.country}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : null}
            </View>

            <View style={{}}>
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
                  style={{width: windowWidth / 2, aspectRatio: 1, }}
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
                  <Text style={{color: 'white', fontWeight: 'semibold'}}>
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
                marginHorizontal: windowWidth / 20,
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
          <TouchableOpacity onPress={()=> navigation.navigate('Web', {loc:weather?.location?.name})} style={{justifyContent:'center', alignItems:'center'}}><Text style={{fontSize:20}}>View More Details...</Text></TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default WeatherBySearchComponent;
