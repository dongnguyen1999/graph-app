import React, { Component } from 'react';
import { View, Text, TouchableHighlight, TouchableOpacity, StyleSheet, Dimensions, FlatList } from 'react-native';
import { DrawerActions } from 'react-navigation-drawer';
const WIDTH = Dimensions.get('window').width;

export default class ContentComponent extends Component{
    constructor(props){
        super(props);
        this.algorithmName = [
            { key: 'DFS', name: 'Depth First Search' },
            { key: 'DFSR', name: 'Depth First Search Recursive' },
            { key: 'BFS', name: 'Breadth First Search' },
            { key: 'Tarjan', name: 'Tarjan' },
            { key: 'Cycle', name: 'Checking Cycle' },
            { key: 'Bigraph', name: 'Checking Bigraph' },
            { key: 'HamitonCycle', name: 'Hamilton Cycle' },
            { key: 'Dijkstra', name: 'Moore-Dijkstra' },
            { key: 'BellmanFord', name: 'Bellman-Ford' },
            { key: 'Warshall', name: 'Floyd-Warshall' },
            { key: 'TopoSort', name: 'Topological Sort' },
            { key: 'Kruskal', name: 'Kruskal' },
            { key: 'Prim', name: 'Prim' },
            { key: 'FordFullkerson', name: 'Ford-Fullkerson' }
        ];
    };
    
    render(){
        const { navigate } = this.props.navigation;
        return(
            <TouchableOpacity style = { styles.drawer } activeOpacity = { 1 }>
                <FlatList 
                    data = { this.algorithmName }
                    renderItem = {({item}) => <TouchableHighlight 
                                                    underlayColor = {'rgba(0,0,0,0.2)'} 
                                                    style = { styles.row } 
                                                    onPress = {() => {
                                                        navigate('Drawer', {algorithmName: item.key});
                                                        this.props.navigation.dispatch(DrawerActions.closeDrawer());
                                                    }}
                                                >
                            <Text style = {styles.text}> { item.name } </Text>
                        </TouchableHighlight>
                    }
                    keyExtractor = { item => item.key }
                />
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    drawer: {
        flex: 1,
        width: WIDTH*0.83,
        backgroundColor: 'rgb(55,57,106)'
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 15,
        color: 'white'
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 15,
        paddingLeft: 10
    }
});