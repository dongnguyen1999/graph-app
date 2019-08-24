import React, { Component } from 'react'
import {View} from "react-native"
import {AdjacencyMatrixGraph} from "../../tool/graph_theory"

export default class Test extends Component {
  render() {
    graph = new AdjacencyMatrixGraph(5, true);
    graph.initGraphFromString(
      `4 3
      2 1
      1 3
      2 4`
    );
    graph.display();
    return (
      <View>
          
      </View>
    )
  }
}
