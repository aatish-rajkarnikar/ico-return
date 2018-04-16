/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  Button,
  StatusBar
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
} from 'react-native-admob';

class ReturnICOItem extends Component<Props>{
  render(){
    let returnValue = this.props.text.substr(0, this.props.text.indexOf('x'));
    let val = parseFloat(returnValue);
    let color = val > 1.0 ? '#2ecc71' : '#e74c3c';
    return (
      <View style={{borderRadius: 4, borderColor: color, borderWidth: 1, padding: 2}}>
        <Text style={{fontSize: 12, color: color}}>{this.props.text}</Text>
      </View>
    );
  }
}

export default class App extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      datasource : [],
      searchText : "",
      isSearching: false
    }
  }


  componentDidMount(){
    //this.showInterstitial();
    this.updateDataSource();
  }

  updateDataSource(){
    return fetch('http://159.89.172.199/icodrops_ended')
    .then((response) => response.json())
    .then((responseJson) => {
      let sortedData = responseJson.sort(function(a, b){
        let aReturnICO = a.return_since_ico_usd.substr(0, a.return_since_ico_usd.indexOf('x'))
        let bReturnICO = b.return_since_ico_usd.substr(0, b.return_since_ico_usd.indexOf('x'))
        let aValue = parseFloat(aReturnICO == '' ? 0 : aReturnICO);
        let bValue = parseFloat(bReturnICO == '' ? 0 : bReturnICO);
        return bValue-aValue;
      });
      this.setState({
        datasource : sortedData
      });
    })
    .catch((error) => {
      console.error(error);
    });
  }

  showInterstitial(){
    AdMobInterstitial.setAdUnitID(Platform.OS === 'ios' ? 'ca-app-pub-5492969470059595/8084958793' : 'ca-app-pub-5492969470059595/3347513724');
    AdMobInterstitial.setTestDevices([AdMobInterstitial.simulatorId]);
    AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd());
  }


  header(){

    if (!this.state.isSearching){
      return (
        <View style={{flexDirection: 'row', marginTop: Platform.OS === 'ios' ? 20 : 0, height: 44, justifyContent: 'space-between', alignItems: 'center'}}>
          <TouchableOpacity activeOpacity={0.5} style={{marginLeft: 16}} onPress={this.onPressSync}>
           <Image
             source={require('./sync_icon.png')}
             style={{ width: 26, height: 26 }}
            />
         </TouchableOpacity>

         <Image
            source={require('./whitelogo.png')}
            style={{ width: 44, height: 44 }}
          />
          <TouchableOpacity activeOpacity={0.5} style={{marginRight: 16}} onPress={()=>{
            this.setState({'isSearching': true})
          }}>
           <Image
             source={require('./search_icon.png')}
             style={{ width: 26, height: 26 }}
            />
         </TouchableOpacity>
        </View>
      )
    }

    return(
      <View style={{flexDirection: 'row', marginTop: Platform.OS === 'ios' ? 20 : 0, marginLeft: 16, marginRight: 16, height: 44, justifyContent: 'space-between', alignItems:'center'}}>
        <TextInput
          style={{backgroundColor: '#ecf0f1', height: 36, padding: 8, flex: 1, borderRadius: 4, marginRight: 8}}
          placeholder='search'
          onChangeText={(text)=>{
            this.setState({'searchText' : text})
          }}
          value={this.state.searchText}
          underlineColorAndroid='#ecf0f1'
        />
       <Button
         title='cancel'
         color='#000'
         style={{marginLeft: 8}}
         onPress={()=>{
           this.setState({'isSearching': false, 'searchText' : ''})
         }}
       />
      </View>
    )
  }

  render(){
    return (
      <View style={styles.container}>
        <StatusBar
           backgroundColor="#FFF"
           barStyle="dark-content"
         />
        {this.header()}
        <View style={{backgroundColor:'#000', height: 2}}></View>
        <View style={{flexDirection:'row', justifyContent: 'space-between', padding: 8}}>
          <Text style={{fontWeight: 'bold'}}>COIN</Text>
          <Text style={{fontWeight: 'bold'}}>CURRENT PRICE</Text>
          <Text style={{fontWeight: 'bold'}}>RETURN SINCE ICO</Text>
        </View>
        <View style={{backgroundColor:'#000', height: 2}}></View>
        <FlatList
          data={this.state.datasource.filter(item => item.name.toUpperCase().includes(this.state.searchText.toUpperCase()) || item.ticker.toUpperCase().includes(this.state.searchText.toUpperCase()))}
          renderItem={ ({item})=>
          <View>
            <View style={{flex:1, flexDirection:'row', justifyContent: 'space-between', padding: 8}}>
              <View style={{marginRight: 8, flexDirection: 'column', alignItems: 'center'}}>
                <Image style={{width: 50, height: 50}} source={{uri: item.logo}}  />
                <Text style={{marginTop: 8, fontWeight: 'bold'}}>{item.ticker}</Text>
              </View>
              <View style={{flexDirection: 'column', justifyContent: 'space-around'}}>
                <Text style={{fontSize: 12}}>{item.token_price_usd}</Text>
                <Text style={{fontSize: 12}}>{item.token_price_btc}</Text>
                <Text style={{fontSize: 12}}>{item.token_price_eth}</Text>
              </View>
              <View style={{flexDirection: 'column', justifyContent: 'space-around'}}>
                <ReturnICOItem text={item.return_since_ico_usd}/>
                <ReturnICOItem text={item.return_since_ico_btc}/>
                <ReturnICOItem text={item.return_since_ico_eth}/>
              </View>
            </View>
            <Text style={{fontSize: 10, marginBottom: 8, marginRight: 8,alignSelf: 'flex-end', color: '#999'}}>ICO PRICE: {item.ico_token_price}</Text>
            <View style={{flex:1, height: 0.5, backgroundColor:'#999'}}></View>
          </View>
        }
        />

        {/* <AdMobBanner
          adSize="smartBannerPortrait"
          testDevices={[AdMobBanner.simulatorId]}
          adUnitID={Platform.OS === 'ios' ? "ca-app-pub-5492969470059595/2730231353" : "ca-app-pub-5492969470059595/9987573148"}
          onAdFailedToLoad={error => console.error(error)}
        /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  }

});
