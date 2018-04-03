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
  Alert
} from 'react-native';
import { StackNavigator } from 'react-navigation'

class ICOList extends Component<Props>{

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return {
      headerTitle: <Image
          source={require('./whitelogo.png')}
          style={{ width: 42, height: 42 }}
        />,
        headerRight: (
          <TouchableOpacity activeOpacity={0.5} style={{marginRight: 16}}>
           <Image
             source={require('./search_icon.png')}
             style={{ width: 26, height: 26 }}
            />
         </TouchableOpacity>
        ),
        headerLeft: (
          <TouchableOpacity activeOpacity={0.5} style={{marginLeft: 16}} onPress={params.onPressSync}>
           <Image
             source={require('./sync_icon.png')}
             style={{ width: 26, height: 26 }}
            />
         </TouchableOpacity>
        ),
    };
  };

  constructor(props){
    super(props);
    this.state = {
      datasource : [],
      search: false
    }
  }

  componentWillMount(){
    this.props.navigation.setParams({onPressSync: this.updateDataSource});
  }

  componentDidMount(){
    this.updateDataSource();
  }

  updateDataSource(){
    return fetch('http://159.89.170.28/ico_ended')
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        datasource : responseJson.sort(function(a, b){return b.return_since_ico_usd>a.return_since_ico_usd})
      });
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render(){
    return (
      <View style={styles.container}>
        <View style={{backgroundColor:'#000', height: 2}}></View>
        <View style={{flexDirection:'row', justifyContent: 'space-around', padding: 8}}>
          <Text style={{fontWeight: 'bold'}}>COIN</Text>
          <Text style={{fontWeight: 'bold'}}>CURRENT PRICE</Text>
          <Text style={{fontWeight: 'bold'}}>RETURN SINCE ICO</Text>
        </View>
        <View style={{backgroundColor:'#000', height: 2}}></View>
        <FlatList
          data={this.state.datasource}
          renderItem={ ({item})=>
          <View>
            <View style={{flex:1, flexDirection:'row', justifyContent: 'space-between', padding: 8}}>
              <View style={{marginRight: 8, width: 76, flexDirection: 'column', alignItems: 'center'}}>
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
      </View>
    );
  }
}

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

const RootStack = StackNavigator({
  Home: {
    screen: ICOList
  },
},
{
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#fff',
      },
      headerTintColor: '#000',
    }
});

export default class App extends Component<Props> {
  render() {
    return <RootStack/>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  }

});
