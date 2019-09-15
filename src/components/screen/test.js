import React, { Component } from 'react'
import {View} from "react-native"
import {AdjacencyMatrixGraph} from "../../tool/graph_theory/graphs"

export default class Test extends Component {
  static navigationOptions = {
    title: 'Test'
  };

  render() {
    graph = new AdjacencyMatrixGraph(4,3, true);
    graph.addEdge({u: 2, v: 1});
    graph.addEdge({u: 1, v: 3});
    graph.addEdge({u: 2, v: 4});
    graph.display();
    return (
      <View>
          
      </View>
    )
  }
}
