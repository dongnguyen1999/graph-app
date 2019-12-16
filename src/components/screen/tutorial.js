import React, { Component } from 'react'
import {View,Text} from "react-native"
import { Icon } from "react-native-elements"

export default class Tutorial extends Component {
  static navigationOptions = {
    title: 'Tutorial', //will be showed as tab label in bottom navigator
    tabBarIcon: <Icon 
                        name='help'
                        color='black'
                        onPress={() => clickStartButton()}
                    />
  };

  render() { 
    return (
      <View>
        <Text>Tutorial Screen</Text>
      </View>
    );
  }
}
