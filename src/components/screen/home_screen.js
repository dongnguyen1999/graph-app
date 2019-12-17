import React, { Component } from 'react';
import { View, TextInput, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'
import {Button,Header, SearchBar} from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
export default class HomeScreen extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            search: '',
            hasFocus: false
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

    getAlgorithmsName(){
        return this.algorithmsName;
    }
    updateSearch = search => {
        this.setState({ search });
    };
    onFocusSearch(hasFocus){
        this.setState({
            hasFocus
        })
    }
    render(){
        const { navigate } = this.props.navigation;
        let listAlgorithmsName = [];
        for(let name in this.algorithmsName)
            listAlgorithmsName.push({
                name: this.algorithmsName[name],
                key: name
            });
        return(
            <View style={styles.container}>
                <SearchBar
                    onChangeText={this.updateSearch}
                    placeholder='Search...'
                    caretHidden={true}
                    lightTheme={true}
                    searchIcon={<MaterialIcons
                        style={{
                            color: this.state.hasFocus ? '#fff' : 'rgb(149,151,203)',
                            fontSize: 20
                        }}
                        name={'search'}/>}
                    style={{
                        backgroundColor: 'white',
                        borderWidth: 0, //no effect
                        shadowColor: 'white', //no effect
                        borderBottomColor: 'transparent',
                        borderTopColor: 'transparent',
                        color: '#fff'
                    }}
                    onFocus={this.onFocusSearch.bind(this, true)}
                    onBlur={this.onFocusSearch.bind(this, false)}
                    containerStyle={{
                        borderWidth: 0, //no effect
                        shadowColor: 'white', //no effect
                        borderBottomColor: 'transparent',
                        borderTopColor: 'transparent',
                        marginTop: 40,
                        marginBottom: 30,
                        padding: 0,
                        backgroundColor: 'rgb(55,57,106)',
                        borderRadius: 10,
                        borderColor: '#fff',
                        color: '#fff',
                    }}
                    inputContainerStyle={{
                        height: 50,
                        backgroundColor: !this.state.hasFocus ? 'rgb(55,57,106)' : 'rgb(149,151,203)',
                        borderColor: '#fff',
                        borderRadius: 10,
                    }}
                    inputStyle={{
                        color:  this.state.hasFocus ? '#fff' : 'rgb(149,151,203)',
                    }}
                    // placeholderTextColor={{
                    //     color: 'rgb(149,151,203)'
                    // }}
                    value={this.state.search}/>

                <ScrollView style={styles.list}>

                    { listAlgorithmsName.map((value, index) =>
                        <TouchableOpacity style = { styles.frame } key = { index } onPress = {() => navigate('Input', {algorithm: {name: value.name, key: value.key}})}>
                            <Text style = { styles.text }> { value.name } </Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
      padding: 10,
      backgroundColor: 'rgb(25,27,71)',
      borderColor: 'transparent'
    },
    list: {
        paddingHorizontal: 30,
        marginBottom: 110,
    },
    frame: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 20,
        borderRadius: 4,
        backgroundColor: 'rgb(108,114,246)',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 5, height: 5},
        elevation: 8,
        shadowColor: 'white',
        marginBottom: 15
    },
    text: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold'
    },
    textInput: {

        backgroundColor: 'white',
        borderWidth: 0, //no effect
        shadowColor: 'white', //no effect
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
    },
    focusedTextInput: {
        backgroundColor: 'white',
        borderWidth: 0, //no effect
        shadowColor: 'white', //no effect
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
    }
});
