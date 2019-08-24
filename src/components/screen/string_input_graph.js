import React, { Component } from 'react'
import { View, Text, TextInput, TouchableOpacity,
    StyleSheet, AppRegistry,ScrollView } from 'react-native';

export default class StringInputGraph extends Component {
    static navigationOptions = {
        title: 'InputGraph'
    }

  constructor(props){
      super(props);
      this.state = {
          input: ""
      }
  }

  updateInput(text){
      this.setState({input: text});
  }

  startDrawingGraph(navigate){
      navigate('Drawing', {input: this.state.input});
  }

  render() {
    const {navigate} = this.props.navigation;
    return (
        <View>
            <TextInput 
                placeholder="Enter string input for graph: "
                style = { styles.input }
                onChangeText = {(text) => this.updateInput(text)}
            />
            <TouchableOpacity style = { styles.button } onPress = {() => {this.startDrawingGraph(navigate)}}>
                <Text> Submit </Text>
            </TouchableOpacity>
        </View> 
    )
  }
}

const styles = StyleSheet.create({
    button:{
        borderWidth:1,
        backgroundColor:'grey',
        width:50,
        alignItems:'center',
        marginTop:30,
        marginLeft:10
    },
    input:{
        width:200,
        borderWidth:1,
        marginTop:20,
        marginLeft:10,
        height: 40, 
        paddingLeft:10
    },
  });