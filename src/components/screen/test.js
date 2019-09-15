import React, { Component } from 'react'
import {View} from "react-native"
import {AdjacencyMatrixGraph} from "../../tool/graph_theory/graphs"
<<<<<<< HEAD
import {RecursiveTraverse, DepthFirstSearch} from "../../tool/graph_theory/algorithms"
import {BreadthFirstSearch} from "../../tool/graph_theory/algorithms"
=======
import {RecursiveTraverse} from "../../tool/graph_theory/algorithms"
>>>>>>> graphview-edits

export default class Test extends Component {
  static navigationOptions = {
    title: 'Test'
  };

  render() {
<<<<<<< HEAD
    let graph = new AdjacencyMatrixGraph(5,7,false);
    graph.addEdge({u: 1, v: 2});
=======
    let graph = new AdjacencyMatrixGraph(4,3, true);
    graph.addEdge({u: 2, v: 1});
>>>>>>> graphview-edits
    graph.addEdge({u: 1, v: 3});
    graph.addEdge({u: 1, v: 4});
    graph.addEdge({u: 1, v: 5});
    graph.addEdge({u: 2, v: 3});
    graph.addEdge({u: 2, v: 4});
<<<<<<< HEAD
    graph.addEdge({u: 4, v: 5});
    graph.display();
    let algorithms = new DepthFirstSearch(graph, 1);//start traverse at node 1
    algorithms.run();
    console.log(algorithms.getStates());
=======
    let algorithms = new RecursiveTraverse(graph, 1);//start traverse at node 1
    algorithms.run();
    console.log(algorithms.getStates());

    /**output
     * Array [
        Object {
          "focusOn": 0,
          "k": 0,
          "mark": Array [0,0,0,0,0,],
          "n": Array [0,0,0,0,0,],
        },
        Object {
          "focusOn": 1,
          "k": 0,
          "mark": Array [0,0,0,0,0,],
          "n": Array [0,0,0,0,0,],
        },
        Object {
          "focusOn": 1,
          "k": 1,
          "mark": Array [0,1,0,0,0,],
          "n": Array [0,1,0,0,0,],
        },
        Object {
          "focusOn": 3,
          "k": 1,
          "mark": Array [0,1,0,0,0,],
          "n": Array [0,1,0,0,0,],
        },
        Object {
          "focusOn": 3,
          "k": 2,
          "mark": Array [0,1,0,1,0,],
          "n": Array [0,1,0,2,0,],
        },
        Object {
          "focusOn": 3,
          "k": 2,
          "mark": Array [0,1,0,1,0,],
          "n": Array [0,1,0,2,0,],
        },
        Object {
          "focusOn": 1,
          "k": 2,
          "mark": Array [0,1,0,1,0,],
          "n": Array [0,1,0,2,0,],
        },
      ]
     * 
     */
>>>>>>> graphview-edits
    return (
      <View> </View>
    );
  }
}