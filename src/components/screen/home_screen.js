import React, { Component } from 'react';
import { View, Button, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import GraphView from '../graphview';
import { AdjacencyMatrixGraph } from '../../tool/graph_theory/graphs';
import { Dimensions,View, TextInput, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'
import {Button,Header, SearchBar} from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
export default class HomeScreen extends Component{
    static navigationOptions = {
        title: 'Home'
    };
    constructor(props){
        super(props);
        this.state = {
            isDirected: false,
            hasFocus: false,
            listAlgorithmsName: []
        };
        this.algorithmsName = {
            DFS: 'Depth First Search',
            DFSR: 'Depth First Search Recursive',
            BFS: 'Breadth First Search',
            Tarjan: 'Tarjan',
            Cycle: 'Checking Cycle',
            Bigraph: 'Checking Bigraph',
            HamitonCycle: 'Finding Hamiton Cycle',
            Dijkstra: 'Dijkstra',
            BellmanFord: 'Bellman-Ford',
            Warshall: 'Floyd-Warshall',
            TopoSort: 'Topological Sorting',
            Kruskal: 'Kruskal',
            Prim: 'Prim',
            FordFullkerson: 'Ford-Fullkerson'
        };
    }
    componentDidMount() {

        let listAlgorithmsName = [];
        for(let name in this.algorithmsName)
            listAlgorithmsName.push({
                name: this.algorithmsName[name],
                key: name
            });
        this.setState({
            listAlgorithmsName: [...listAlgorithmsName]
        })
    }
    getAlgorithmsName(){
        return this.algorithmsName;
    }
    updateSearch = search => {
        let listAlgorithmsName = [];
        for(let name in this.algorithmsName){
            let _name = this.algorithmsName[name].toUpperCase();
            if( _name.indexOf(search.toUpperCase()) >= 0 || search.trim() === '')
                listAlgorithmsName.push({
                    name: this.algorithmsName[name],
                    key: name
                });
        }
        this.setState({
            search ,
            listAlgorithmsName: [...listAlgorithmsName]});
    };
    onFocusSearch(hasFocus){
        this.setState({
            hasFocus
        })
    } */

    makeGraph(){
        let graph = new AdjacencyMatrixGraph(5,7,this.state.isDirected);
        graph.addEdge({u: 1, v: 2});
        graph.addEdge({u: 1, v: 3});
        graph.addEdge({u: 1, v: 4});
        graph.addEdge({u: 1, v: 5});
        graph.addEdge({u: 2, v: 3});
        graph.addEdge({u: 2, v: 4});
        graph.addEdge({u: 4, v: 5});
        return graph;
    }

    render(){
        let widthPhone = Dimensions.get('window').width;
        let heightPhone = Dimensions.get('window').height;
        return(
            <View>
                <View style = { styles.buttonContainer }>
                    <Button
                        title = 'Undirected'
                        color = 'rgb(55,57,106)'
                        onPress = {() => this.setState({isDirected:false})}    
                    />
                    <Button 
                        title = 'Directed'
                        color = 'rgb(55,57,106)'
                        onPress = {() => this.setState({isDirected:true})}
                    />  
                </View>
                <GraphView 
                    graph = { this.makeGraph() }
                    key = { this.state.isDirected }
                    width = { widthPhone }
                    height = { heightPhone-200 }
                    nodeRadius = { 20 }
                    zoomable= { true }
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginTop: 20,
        justifyContent: 'center',
    }
});
