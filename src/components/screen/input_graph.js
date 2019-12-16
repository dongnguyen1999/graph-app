import React, { Component } from 'react'
import ListItem from "../list_item"
import { View, Text, TextInput, TouchableOpacity,
     StyleSheet, AppRegistry,ScrollView, Dimensions} from 'react-native';
import { CheckBox, Input } from "react-native-elements"
 

export default class InputGraph extends Component {
  static navigationOptions = {
    title: 'Graph input'
  };
    constructor(props) {
      super(props);
      this.state = {
          vertex: 0, //this is an integer
          edge: 0, //this is an integer
          directed: false, //set default directed boolean
          listOfEdge: new Map(),
          input: ''
      };
      this.handleDataTextarea = this.handleDataTextarea.bind(this);
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
        edgeList.push(value.replace(" ", ","));
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
      this.setState({listOfEdge: this.state.listOfEdge.delete(key)});
      this.setState({listOfEdge: this.state.listOfEdge.set(key, value)});
  };
  //this function render a list of (ListItem)items for edges
  makeListOfEdgesInput(){
      var viewList = [];
      for (let i = 0; i < this.state.edge; i++){
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
  handleDataTextarea(node){
      // console.log(node);
      let data = node.split('\n');
      data.map((index, value) => {
        this.addNewEdge(`${value}`, index);
      });
      this.setState({
        input: data
      });

  }


  render(){
      const { navigate } = this.props.navigation;
      const algorithm = this.props.navigation.getParam('algorithm');
      return(
        <ScrollView style={styles.container}>
            <TextInput style={styles.title}>{algorithm}</TextInput>
          <ScrollView style={styles.content}>
            <View style={styles.groupInput}>
              <TextInput
                  placeholder="Vertex"
                  style = { styles.input }
                  onChangeText = {this.updateVertex}
              />
              <TextInput
                  placeholder="Edges"
                  style = { styles.input }
                  onChangeText = {this.updateEdge}
              />
            </View>

              <CheckBox
                  textStyle={{
                    backgroundColor: 'transparent',
                    borderRadius: 10
                  }}
                  title='Is directed graph?'
                  checked={this.state.directed}
                  onPress={() => this.setState({directed: !this.state.directed})}
              />
            <View style={styles.containerTextarea}>
              <TextInput
                style={styles.textarea}
                placeholder={"u,v, [w]"}
                  multiline
                  numberOfLines={3}
                onChangeText={this.handleDataTextarea}
              />
            </View>
            <Text>{this.state.input}</Text>
            {/*{this.makeListOfEdgesInput()}*/}
            <TouchableOpacity style = { styles.button } onPress = {() => {this.startDrawingGraph(navigate)}}>
              <Text style={styles.textSubmit}> Submit </Text>
            </TouchableOpacity>
          </ScrollView>
        </ScrollView>
      );
      
    
  }
}

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 10,
    paddingVertical: 10,
    height: '100%'
  },
  title: {
    fontSize: 20,
    paddingHorizontal: 5,
    fontWeight: 'bold'
  },
  content: {
    backgroundColor: '#E3E3F4',
    paddingHorizontal: 5,
    paddingVertical:30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 30,
    minHeight: Dimensions.get('screen').height - 250
  },
  groupInput: {
    flexDirection: 'row'
  },
  button:{
      backgroundColor:'#3936EB',
      width:80,
      borderRadius: 8,
      elevation: 8,
      shadowColor: '#fff',
      shadowOffset: {x: 2, y: 2},
      shadowOpacity: 0.2,
      alignItems:'center',
      padding: 5,
      marginTop:30,
      marginLeft:10,

  },
  textSubmit: {

    color: '#fff',
  },
  input:{
    width:50,
    borderRadius: 5,
    backgroundColor: '#fff',
    height: 40,
    padding: 5,
    marginLeft: 10,
    marginBottom: 10,
    marginVertical: 5,
  },
  containerTextarea: {
    paddingHorizontal: 10
  },
  textarea: {
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 5,
    padding: 5,
  }
});
const theme = {
  CheckBox: {
    titleStyle: {
      backgroundColor: 'transparent',
      borderRadius: 10
    }
  }
};