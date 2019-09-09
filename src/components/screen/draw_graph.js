import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions } from "react-native"
import { DraculaGraph, Layout } from "graphdracula"
import { GraphRenderer } from "../../tool/graph_drawing"
import GraphView from "../graphview"
import { ScrollView } from 'react-native-gesture-handler'
import { Header } from "react-navigation"


export default class DrawGraph extends Component {
    static navigationOptions = {
        title: 'Graph Drawing'
    };
    makeGraphFromString(str) {
        var inputs = str.split("\n");
        const firstLine = inputs[0].split(" ");
        var vertex = firstLine[0];
        var edge = firstLine[1];
        // const [vertex, edge] = firstLine;
        var edgeList = [];
        for (var i = 1; i < inputs.length; i++) {
            var chars = inputs[i].trim().split(" ");
            edgeList.push(chars[0] + "," + chars[1]);
        }
        return this.makeGraph(vertex, edge, edgeList);
    }

    // convertEdge(strInput, seperator = ",") {
    //     let inputs = strInput.split(seperator, 2);
    //     if (inputs.length == 2) {
    //         let outputs = [];
    //         inputs.map((substr) => {
    //             outputs.push(parseInt(substr.replace("(", "").replace(")", "").trim()));
    //             return substr;
    //         });
    //
    //         for (let out of outputs) {
    //             if (isNaN(out)) return false;
    //         }
    //         console.log(outputs);
    //         return outputs;
    //     }
    //     return false;
    // }

    // makeGraph(vertex, edge, edgeList) {
    //     var graph = new DraculaGraph();
    //     for (var i = 1; i <= vertex; i++) {
    //         graph.addNode(i);
    //     }
    //     for (var value of edgeList) {
    //         var edge;
    //         if ((edge = this.convertEdge(value)) == false) return false;
    //         if (edge[0] > vertex || edge[1] > vertex) return false;
    //         graph.addEdge(edge[0], edge[1]);
    //     }
    //     return graph;
    // }

    makeGraphFromText(string, increase) {
        let graph = new DraculaGraph();
        let addedSomeEdges = false;
        for (let i = 0; i < string.length; i++) {
            let char = string[i];
            if (char === " ") continue;
            graph.addNode(char);
            for (let otherChar of string.slice(i)) {
                if (char !== otherChar && char < otherChar) {
                    //add an edge with label
                    graph.addEdge(char, otherChar, {label: char+"-"+otherChar});
                    addedSomeEdges = true;
                }
            }
        }

        if (!addedSomeEdges) {
            for (let i = 0; i < string.length; i++) {
                let char = string.charAt(i);
                if (char === " ") continue;
                graph.addNode(char);
                for (var otherChar of string.slice(i)) {
                    if (char !== otherChar && char > otherChar) {
                        //add an edge with label
                        graph.addEdge(char, otherChar, {label: char+"-"+otherChar});
                    }
                }
            }
        }
        // console.log("makeGraphFromText...");
        return graph;
    }

    render() {
        const { state } = this.props.navigation;
        const { input } = state.params;
        // this.makeGraphFromText(state.params.input);
        // var graph = this.makeGraph(state.params.vertex, state.params.edge, state.params.edgeList);
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
        let view = '';
        let graph = this.makeGraphFromText(state.params.input);
        let widthPhone = Math.round(Dimensions.get('window').width);// width of screen
        let heightPhone = Math.round(Dimensions.get('window').height);// height of screen
        if (graph !== false)
            view = <GraphView graph = { graph }
                //set width with widthPhone
                width = {widthPhone}
                //set height with heightPhone-heightTitlebar
                height = {heightPhone-Header.HEIGHT}
                nodeRadius = { 20 }/>;
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