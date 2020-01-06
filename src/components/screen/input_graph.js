import React, { Component } from 'react'
import ListItem from "../list_item"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { CheckBox, ThemeConsumer } from "react-native-elements"
import { DrawerActions } from 'react-navigation-drawer';

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
            listOfEdge: new Map(),
            input: ''
        };
        this.handleDataTextarea = this.handleDataTextarea.bind(this);
        this.startDrawingGraph = this.startDrawingGraph.bind(this);
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
    startDrawingGraph(navigation){
        // console.log(navigation);
        let edgeList = []
        for (let value of this.state.listOfEdge.values()){
            edgeList.push(value.replace(" ", ","));
        }
        navigation.navigate('Drawing',{
            vertex: this.state.vertex,
            edge: this.state.edge,
            isDirected: this.state.directed,
            edgeList: edgeList,// array of text-input for edges: ["1,2", "2,3",...],
            algorithmValue: this.props.navigation.getParam('algorithmName')
        });
        //console.log(this.props);
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
        //console.log(node);
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
        const {navigation} = this.props;
        //const algorithm = this.props.navigation.getParam('algorithm');
        // const keyAlgorithm = algorithm.key;
        // console.log(keyAlgorithm);
        return(
            <View style={styles.container}>
                {/* <TextInput style={styles.title}>{algorithmName}</TextInput> */}
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
                            containerStyle={{
                                borderWidth:0,
                                padding: 0,
                                backgroundColor: 'transparent'
                            }}
                            textStyle={{
                                backgroundColor: 'transparent',
                                borderRadius: 10,
                                color: 'rgb(25,27,71)'
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
                    {/* <Text>{this.state.input}</Text> */}
                    {/*{this.makeListOfEdgesInput()}*/}
                    <TouchableOpacity 
                            style = { styles.button } 
                            onPress = {() => this.props.navigation.dispatch(DrawerActions.openDrawer())}>
                        <Text style={styles.textSubmit}> Choose algorithm </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                            style = { styles.button } 
                            onPress = {() => {this.startDrawingGraph(navigation)}}>
                        <Text style={styles.textSubmit}> Submit </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
        
        
    }
}

const styles = StyleSheet.create({
    container: {
        // paddingHorizontal: 10,
        backgroundColor: '#fff',
        paddingVertical: 10,
        height: '100%'
    },
    title: {
        fontSize: 20,
        paddingHorizontal: 15,
        fontWeight: 'bold',
        color: 'rgb(55,57,106)'
    },
    content: {
        backgroundColor: '#fff',
        paddingHorizontal: 5,
        paddingVertical:30,
        // borderTopLeftRadius: 30,
        // borderTopRightRadius: 30,
        marginTop: 10,
        // minHeight: Dimensions.get('screen').height - 250
    },
    groupInput: {
        flexDirection: 'row'
    },
    button:{
        backgroundColor:'rgb(55,57,106)',
        width: 150,
        borderRadius: 8,
        elevation: 8,
        shadowColor: '#fff',
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.2,
        alignItems:'center',
        padding: 5,
        marginTop:30,
        marginLeft:10,
    },
    textSubmit: {
        color: '#fff',
        elevation: 8,
        shadowColor: 'white',
        shadowOffset: {width: 2, height: 2}
    },
    input:{
        width:70,
        borderRadius: 8,
        backgroundColor: '#fff',
        height: 40,
        padding: 5,
        marginLeft: 10,
        marginBottom: 10,
        marginVertical: 5,
        elevation: 4,
        shadowColor: 'white',
        shadowOffset: {width: 2, height: 2}
    },
    containerTextarea: {
        paddingHorizontal: 10
    },
    textarea: {
        backgroundColor: '#fff',
        marginVertical: 5,
        borderRadius: 5,
        padding: 5,
        elevation: 4,
        shadowColor: 'white',
        shadowOffset: {width: 2, height: 2}
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