import React, { Component } from 'react'
import {View} from "react-native"
import {AdjacencyMatrixGraph, EdgeListGraph} from "../../tool/graph_theory/graphs"
import {
  DepthFirstSearchRecursive, 
  DepthFirstSearch, 
  BreadthFirstSearch,
  Tarjan,
  Cycle,
  Bigraph,
  Dijkstra,
  BellmanFord,
  FloydWarshall,
  Kruskal,
  Prim,
  TopologicalSort,
  FordFullkerson,
  HamiltonCycle
} from "../../tool/graph_theory/algorithms"

export default class Test extends Component {
  static navigationOptions = {
    title: 'Test'
  };

  render() {
    let graph = new AdjacencyMatrixGraph(5,6,false);
        graph.addEdge({u: 1, v: 2});
        graph.addEdge({u: 1, v: 3});
        graph.addEdge({u: 2, v: 4});
        graph.addEdge({u: 3, v: 5});
        graph.addEdge({u: 4, v: 1});
        graph.addEdge({u: 5, v: 2});
    let algorithms = new HamiltonCycle(graph,1); // start traverse at node 1
    algorithms.run();
    //console.log(algorithms.end());
    // console.log(algorithms.getStates());
    return (
      <View> </View>
    );
  }
}