import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Dimensions} from 'react-native';
import {MagnifyingGlassIcon} from 'react-native-heroicons/outline';
import {CalendarDaysIcon} from 'react-native-heroicons/solid';
import {fetchWeatherForecast} from '../api/weather';
import * as Progress from 'react-native-progress';
import {getData} from '../utils/AsyncStorage';
import {useFocusEffect} from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const WeatherBySearchComponent = ({navigation}) => {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Buraya A sayfasının her render edildiğinde yapılması istenen işlemleri ekleyebilirsiniz.
    // Örneğin, verilerin yeniden getirilmesi, durum sıfırlama, vb.
    console.log('A Screen rendered');
    fetchMyWeatherData();

    return () => {
      // Eğer bir temizleme işlemi yapmanız gerekirse, buraya ekleyebilirsiniz.
    };
  }, []); // Bu boş bağımlılık dizisi sayfanın sadece bir kez render edilmesini sağlar.

  useFocusEffect(() => {
    // Sayfa odaklandığında yapılacak işlemleri buraya ekleyebilirsiniz.
    // Örneğin, her seferinde verileri getirme işlemi yapabilirsiniz.
    if (count > 0) {
      console.log('A Screen focused');
      fetchMyWeatherData();
      setCount(0);
    }

    return () => {
      // Eğer bir temizleme işlemi yapmanız gerekirse, buraya ekleyebilirsiniz.
    };
  });

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

  return (
    <SafeAreaView style={{flex: 1}}>
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Progress.CircleSnail thickness={5} size={50} color={'#0bb3b2'} />
        </View>
      ) : (
        <View style={{flex: 1}}>
          {/* forecast section */}
          <View
            style={{
              justifyContent: 'space-evenly',
              paddingHorizontal: 10,
              flex: 1,
            }}>
            {/*Location*/}
            <View style={{height: windowHeight / 17, width: 50}}>
              <View
                style={{
                  borderRadius: 50,
                  width: 50,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setCount(1);
                    navigation.navigate('Search');
                  }}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    borderRadius: 20,
                    padding: 10,
                    margin: 4,
                  }}>
                  <MagnifyingGlassIcon size="22" color="white" />
                </TouchableOpacity>
              </View>
            </View>

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
              <Text
                style={{
                  textAlign: 'center',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: 20,
                }}>
                {weather?.current?.condition?.text}
              </Text>
            </View>
            {/*other stats*/}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
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
          {/*Forecast for next days*/}
          <View
            style={{marginBottom: windowHeight / 20, paddingHorizontal: 10}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <CalendarDaysIcon size={25} color={'white'} />
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
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Web', {loc: weather?.location?.name})
              }
              style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 20, padding: 10}}>
                View More Details...
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default WeatherBySearchComponent;
