import {
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useCallback} from 'react';
import {Dimensions} from 'react-native';
import {debounce} from 'lodash';
import {fetchLocations, fetchWeatherForecast} from '../api/weather';
import {CalendarDaysIcon, MapPinIcon} from 'react-native-heroicons/solid';
import {storeData, getData} from '../utils/AsyncStorage';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SearchScreen = ({navigation}) => {
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});

  const handleSearch = value => {
    fetchLocations({city: value}).then(data => {
      if (value.length > 2) {
        setLocations(data);
      }
    });
  };

  const handleLocation = loc => {
    console.log("location: ", loc);
    setLocations([]);
    fetchWeatherForecast({
      city: loc.name,
    }).then(data => {
      setWeather(data);
      storeData('city', loc.name);
        navigation.goBack();
    });
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <ImageBackground
        blurRadius={70}
        source={require('../assets/images/bg.png')}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TextInput
          onChangeText={handleTextDebounce}
          placeholder="Search city"
          placeholderTextColor={'lightgray'}
          style={{ width:windowWidth, textAlign:'center', fontSize: 20, color: 'white', padding: 10, borderRadius: 30,}}
        />

        {locations.length > 0 && (
          <View
            style={{
              width: '90%',
              backgroundColor: '#E0E0E0',
              borderRadius: 30,
            }}>
            {locations.map((loc, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {handleLocation(loc)}}
                  style={[
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 10,
                      paddingLeft: 10,
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
        )}
      </ImageBackground>
    </SafeAreaView>
  );
};

export default SearchScreen;
