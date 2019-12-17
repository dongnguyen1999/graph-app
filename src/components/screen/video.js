import React, { Component } from 'react';
import { View, Text } from 'react-native';


export default class VideoScreen extends Component{
    static navigationOptions = {
        title: 'Videos'
    };
    render(){     
        return(
            <View> 
                <Text>Videos</Text>
            </View>
        );
    }
}