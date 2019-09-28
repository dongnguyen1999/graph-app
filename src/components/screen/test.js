import React, { Component } from 'react'
import {View} from "react-native"
import {AdjacencyMatrixGraph} from "../../tool/graph_theory/graphs"
import {RecursiveTraverse, DepthFirstSearch} from "../../tool/graph_theory/algorithms"
import {BreadthFirstSearch} from "../../tool/graph_theory/algorithms"

export default class Test extends Component {
  static navigationOptions = {
    title: 'Test'
  };

  render() {
    let graph = new AdjacencyMatrixGraph(5,7,false);
    graph.addEdge({u: 1, v: 2});
    graph.addEdge({u: 1, v: 3});
    graph.addEdge({u: 1, v: 4});
    graph.addEdge({u: 1, v: 5});
    graph.addEdge({u: 2, v: 3});
    graph.addEdge({u: 2, v: 4});
    graph.addEdge({u: 4, v: 5});
    graph.display();
    let algorithms = new DepthFirstSearch(graph, 1);//start traverse at node 1
    algorithms.run();
    console.log(algorithms.getStates());
    return (
      <View> </View>
    );
  }
}