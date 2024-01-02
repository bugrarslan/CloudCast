import { View, Text } from 'react-native'
import React from 'react'
import { WebView } from 'react-native-webview';

const WebScreen = ({route}) => {
  console.log('In WebScreen');
  console.log(route.params);
  const url = 'https://www.mgm.gov.tr/tahmin/il-ve-ilceler.aspx?il='+ route.params.loc;

  return (
    <WebView source={{ uri: url }} style={{ flex: 1 }} />
  )
}

export default WebScreen