import React, { Component } from 'react'
import {View,Text} from "react-native"
import {AdjacencyMatrixGraph, EdgeListGraph} from "../../tool/graph_theory/graphs"
import InfoPane from '../infopane'
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
  //   let graph = new AdjacencyMatrixGraph(5,6,false);
  //       graph.addEdge({u: 1, v: 2});
  //       graph.addEdge({u: 1, v: 3});
  //       graph.addEdge({u: 2, v: 4});
  //       graph.addEdge({u: 3, v: 5});
  //       graph.addEdge({u: 4, v: 1});
  //       graph.addEdge({u: 5, v: 2});
  //   let algorithms = new HamiltonCycle(graph,1); // start traverse at node 1
  //   algorithms.run();

    // let graph = new AdjacencyMatrixGraph(5,7,false);
    // graph.addEdge({u: 1, v: 2});
    // graph.addEdge({u: 1, v: 3});
    // graph.addEdge({u: 1, v: 4});
    // graph.addEdge({u: 1, v: 5});
    // graph.addEdge({u: 2, v: 3});
    // graph.addEdge({u: 2, v: 4});
    // graph.addEdge({u: 4, v: 5});
    // graph.display();
    // let algorithms = new DepthFirstSearch(graph, 1);//start traverse at node 1
    // algorithms.run();
    // let graph = new EdgeListGraph(7,12,false);
    // graph.addEdge({u: 1, v: 4, w: 5});
    // graph.addEdge({u: 1, v: 5, w: 7});
    // graph.addEdge({u: 1, v: 7, w: 7});
    // graph.addEdge({u: 2, v: 3, w: 6});
    // graph.addEdge({u: 2, v: 4, w: 8});
    // graph.addEdge({u: 2, v: 6, w: 2});
    // graph.addEdge({u: 3, v: 4, w: 8});
    // graph.addEdge({u: 3, v: 7, w: 5});
    // graph.addEdge({u: 4, v: 5, w: 4});
    // graph.addEdge({u: 4, v: 6, w: 4});
    // graph.addEdge({u: 4, v: 7, w: 3});
    // graph.addEdge({u: 5, v: 6, w: 3});
    // graph.display();
    // let algorithms = new Kruskal(graph); // start traverse at node 1
    // algorithms.run();
    //console.log(algorithms.end());
    // console.log(algorithms.getStates());
    
    return (
      <View>
        <Text>Test Screen</Text>
      </View>
    );
  }
}