import React, { Component } from 'react'
import ListItem from "../list_item"
import { View, Text, TextInput, TouchableOpacity,
     StyleSheet, AppRegistry,ScrollView} from 'react-native';
import { CheckBox } from "react-native-elements"
 

export default class InputGraph extends Component {
    static navigationOptions = {
        title: 'Graph Input'
    };

    constructor(props) {
      super(props);
      this.state = {
          vertex: 0, //this is an integer
          edge: 0, //this is an integer
          directed: false, //set default directed boolean
          listOfEdge: new Map()
      };
  }

  display(){
      console.log('Number of Vertex: ' + this.state.vertex);
      console.log('Number of Edges: ' + this.state.edge);
      console.log('List of Edges: key: value\n');
      this.displayEdgesList();
  }
  displayEdgesList(){
      for (var [key, value] of this.state.listOfEdge.entries()){
          console.log(key + ": " + value + "\n");
      }
  }

  //start drawing activity
  startDrawingGraph(navigate){
      var edgeList = []
      for (var value of this.state.listOfEdge.values()){
          edgeList.push(value);
      }
      navigate('Drawing',{
        vertex: this.state.vertex,
        edge: this.state.edge,
        isDirected: this.state.directed,
        edgeList: edgeList// array of text-input for edges: ["1,2", "2,3",...]
      });
  }

  //change nbvertex field listener
  updateVertex = (nbVertex) => {
      nbVertext = parseInt(nbVertex);
      if (nbVertex != '' && !isNaN(nbVertex)) return this.setState({vertex: nbVertex});
      return this.setState({vertex: 0});
  }
  //change nbedge field listener
  updateEdge = (nbEdge) => {
      nbEdge = parseInt(nbEdge);
      this.setState({listOfEdge: new Map()});
      if (nbEdge != '' && !isNaN(nbEdge)) return this.setState({edge: nbEdge});
      return this.setState({edge: 0});
  }

  //add new key-value pair into listOfEdge
  addNewEdge = (key, value) => {
      // console.log(key + "  " + value);
      this.setState({listOfEdge: this.state.listOfEdge.delete(key)});
      this.setState({listOfEdge: this.state.listOfEdge.set(key, value)});
  }



  //this function render a list of (ListItem)items for edges
  makeListOfEdgesInput(){
      var viewList = [];
      for (i = 0; i < this.state.edge; i++){
          var strholder = "Edge " + (i+1) + ": u,v,[w]";
          viewList.push(
              <ListItem
                  key = {i}
                  id = {i}
                  placeholder = {strholder}
                  onChangeTextListener = {this.addNewEdge}
              />
          )           
      }
      return(
          <View>
              {viewList}
          </View>
      );
  }


  render(){
      const { navigate } = this.props.navigation;
      return(
        <ScrollView style={{padding: 10, marginTop:16}}>
            <TextInput
                placeholder="Enter number of vertex: "
                style = { styles.input }
                onChangeText = {this.updateVertex}
            />
            <TextInput 
                placeholder="Enter number of edge: "
                style = { styles.input }
                onChangeText = {this.updateEdge}
            />

            <CheckBox
                title='Is directed graph?'
                checked={this.state.directed}
                onPress={() => this.setState({directed: !this.state.directed})}
            />

            {this.makeListOfEdgesInput()}
            <TouchableOpacity style = { styles.button } onPress = {() => {this.startDrawingGraph(navigate)}}>
                <Text> Submit </Text>
            </TouchableOpacity>
            <View marginTop={30}></View>
        </ScrollView>
      );
      
    
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