import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';


export default class HomeScreen extends Component{
    static navigationOptions = {
        title: 'Algorithms'
    };

    constructor(props){
        super(props);
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

    getAlgorithmsName(){
        return this.algorithmsName;
    }

    render(){
        const { navigate } = this.props.navigation;
        let listAlgorithmsName = [];
        for(let name in this.algorithmsName)
            listAlgorithmsName.push(this.algorithmsName[name]);
        return(
            <ScrollView>
                { listAlgorithmsName.map((value, index) =>
                    <TouchableOpacity style = { styles.frame } key = { index } onPress = {() => navigate('Input')}>
                        <Text style = { styles.text }> { value } </Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    frame: {
        alignItems: 'center',
        padding: 16,
        borderRadius: 4,
        backgroundColor: '#a8aeb3',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 0},
        elevation: 10,
        marginBottom: 16
    },
    text: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold'
    }
});
