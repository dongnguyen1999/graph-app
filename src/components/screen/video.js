import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'native-base';

export default class VideoScreen extends Component{
    static navigationOptions = {
        title: 'Videos',
        // headerStyle: {
        //     backgroundColor: 'rgb(55,57,106)'
        //   },
        // headerTintColor: '#fff',
    };
    render(){     
        return(
            <View> 
                <Text>Videos</Text>
            </View>
        );
    }
}