import axios from 'react-native-axios'

const searchApiCall = async (city) => {
  const options = {
    method: 'GET',
    url: 'https://weatherapi-com.p.rapidapi.com/search.json',
    params: {q: city},
    headers: {
      'X-RapidAPI-Key': 'f32ca9fcd0msh358530d5af88277p1eec5ejsn0e55f57eef2c',
      'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
    }
  }
  try{
    const response = await axios.request(options)
    return response.data
  }catch (error){
    console.log('error', error)
    return null;
  }
}

const forecastApiCall = async (city) => {
  const options = {
    method: 'GET',
    url: 'https://weatherapi-com.p.rapidapi.com/forecast.json',
    params: {
      q: city,
      days:'3'
    },
    headers: {
      'X-RapidAPI-Key': 'f32ca9fcd0msh358530d5af88277p1eec5ejsn0e55f57eef2c',
      'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
    }
  }
  try{
    const response = await axios.request(options)
    return response.data
  }catch (error){
    console.log('error', error)
    return null;
  }
}

export const fetchWeatherForecast = params=> {
  return forecastApiCall(params.city)
}

export const fetchLocations = params=> {
  return searchApiCall(params.city)
}
