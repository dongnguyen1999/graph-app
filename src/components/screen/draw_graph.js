import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions } from "react-native"
import { DraculaGraph, Layout } from "graphdracula"
import { GraphRenderer } from "../../tool/graph_drawing"
import GraphView from "../graphview"
import { ScrollView } from 'react-native-gesture-handler'
import { Header } from "react-navigation"
import { AdjacencyMatrixGraph } from "../../tool/graph_theory/graphs"
import { DepthFirstSearch } from "../../tool/graph_theory/algorithms"


export default class DrawGraph extends Component {
    static navigationOptions = {
        title: 'Graph Drawing'
    };

    // makeGraphFromString(str) {
    //     var inputs = str.split("\n");
    //     const firstLine = inputs[0].split(" ");
    //     var vertex = firstLine[0];
    //     var edge = firstLine[1];
    //     // const [vertex, edge] = firstLine;
    //     var edgeList = [];
    //     for (var i = 1; i < inputs.length; i++) {
    //         var chars = inputs[i].trim().split(" ");
    //         edgeList.push(chars[0] + "," + chars[1]);
    //     }
    //     return this.makeGraph(vertex, edge, edgeList);
    // }

    /**
     * return array of numbers from text-input: [u,v,w]
     * @param {String} strInput: text-input of an edge, Ex: "1,2" or "1,2,5"
     * @param {String} seperator: seperator of the text-input, 
     *                  Ex: for "1,2" seperator is ","
     *                  Default: ","
     */
    convertEdge(strInput, seperator = ",") {
        let inputs = strInput.split(seperator);
        if (inputs.length == 2 || inputs.length == 3) {
            let outputs = [];
            let [u,v,w] = inputs;
            outputs.push(parseInt(u));
            outputs.push(parseInt(v));
            for (let out of outputs) {
                if (isNaN(out)) return false;
            }
            if (inputs.length == 3) outputs.push(w);
            console.log(outputs);
            return outputs;
        }
        return false;
    }


    /**
     * Make an instance of AdjacencyMatrixGraph class
     * @param {Number} vertex: number of vertices
     * @param {Number} edge: number of edges
     * @param {Array<String>} edgeList: array of text-input for edges: ["1,2", "2,3",...]
     * @param {Boolean} isDirected: directed style of graph
     */
    makeGraph(vertex, edge, edgeList,isDirected) {
        var graph = new AdjacencyMatrixGraph(vertex, edge, isDirected);
        for (var value of edgeList) {
            var edge;
            if ((edge = this.convertEdge(value)) == false) return false;
            if (edge[0] > vertex || edge[1] > vertex) return false;
            if (edge.length == 3) graph.addEdge({ u: edge[0], v: edge[1], w: edge[2]});
            else graph.addEdge({ u: edge[0], v: edge[1]});
        }
        return graph;
    }

    // makeGraphFromText(string) {
    //     let graph = new DraculaGraph();
    //     let addedSomeEdges = false;
    //     for (let i = 0; i < string.length; i++) {
    //         let char = string[i];
    //         if (char === " ") continue;
    //         graph.addNode(char);
    //         for (let otherChar of string.slice(i)) {
    //             if (char !== otherChar && char < otherChar) {
    //                 //add an edge with label
    //                 graph.addEdge(char, otherChar, {label: char+"-"+otherChar});
    //                 addedSomeEdges = true;
    //             }
    //         }
    //     }

    //     if (!addedSomeEdges) {
    //         for (let i = 0; i < string.length; i++) {
    //             let char = string.charAt(i);
    //             if (char === " ") continue;
    //             graph.addNode(char);
    //             for (var otherChar of string.slice(i)) {
    //                 if (char !== otherChar && char > otherChar) {
    //                     //add an edge with label
    //                     graph.addEdge(char, otherChar, {label: char+"-"+otherChar});
    //                 }
    //             }
    //         }
    //     }
    //     // console.log("makeGraphFromText...");
    //     return graph;
    // }

    render() {
        const { state } = this.props.navigation;
        // const { input } = state.params;
        // this.makeGraphFromText(state.params.input);
        // let { vertex, edge, edgeList, isDirected } = state.params;
        // let graph = this.makeGraph(vertex, edge, edgeList, isDirected);

        // var graph = this.makeGraphFromString(
        //   `13 16
        //   1 4
        //   1 2
        //   1 12
        //   2 4
        //   3 7
        //   4 6
        //   4 7
        //   5 6
        //   5 8
        //   5 9
        //   6 7
        //   6 13
        //   8 9
        //   10 11
        //   10 12
        //   11 12`
        // );
        // let graph = this.makeGraphFromText(state.params.input);

        // let graph = new AdjacencyMatrixGraph(4,3, false);
        // graph.addEdge({u: 2, v: 1, w: 5});
        // graph.addEdge({u: 1, v: 3});
        // graph.addEdge({u: 2, v: 4});

        let graph = new AdjacencyMatrixGraph(5,7,false);
        graph.addEdge({u: 1, v: 2});
        graph.addEdge({u: 1, v: 3});
        graph.addEdge({u: 1, v: 4});
        graph.addEdge({u: 1, v: 5});
        graph.addEdge({u: 2, v: 3});
        graph.addEdge({u: 2, v: 4});
        graph.addEdge({u: 4, v: 5});
        graph.display();
        let algorithm = new DepthFirstSearch(graph, 1);

        let widthPhone = Math.round(Dimensions.get('window').width);// width of screen
        let heightPhone = Math.round(Dimensions.get('window').height);// height of screen
        let view = '';
        if (graph !== false)
            view = <GraphView algorithm = { algorithm }
                //set width with widthPhone
                width = {widthPhone}
                //set height with heightPhone-heightTitlebar
                height = {heightPhone-Header.HEIGHT}
                nodeRadius = { 20 }
                zoomable={true}
                />;
        else view = <Text> Something went wrong from Input! </Text>;
        return (
            <View style={styles.container}>
                {
                    view
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        padding: 0,
    }
})