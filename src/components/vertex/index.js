import React, { Component } from 'react'
import {styles} from "./style"
import {colors} from "./color"
import { Circle, Text, Svg, G } from "react-native-svg"


/**
 * An instance of this class presents a Vertex in GraphView
 * Vertices can be dragged and change their position
 * @prop {Node} node: the Node object that will be drawn on GraphView
 * Node {
            "connections": Array<String>,
            "edges": Array<Edge>,
            "id": "h",
            "layoutForceX": 0,
            "layoutForceY": 0,
            "layoutPosX": -1.1365227254852424,
            "layoutPosY": -0.6805833973160654,
            "point": Array [20,20],
            "shape": true,
        }
 * @prop {Number} r: the radius of a node
 * @prop {function} updatingCallback: a function binded GraphView, tell what to do when a node is dragged
 * @prop {vertex/style} style: style sheet of a node
 *      
 */
export default class Vertex extends Component {
  onDragNodeListener(event, node, callback){
    node.point = [event.nativeEvent.locationX, event.nativeEvent.locationY];
    callback(node);
  }

  render() {
    // console.log('vertex is rendering');
    const { node, r, updatingCallback } = this.props;
    let { style } = this.props;
    const [x, y ] = node.point;
    if (style == undefined) style = styles.normal;
    return (
      <G 
        onMoveShouldSetResponder={() => {console.log('onMoveShouldSetResponder')}}
        onResponderGrant={() => {console.log('onGrant')}}
        onResponderMove={(event) => this.onDragNodeListener(event,node,updatingCallback)}
        onPress={() => {console.log('press')}}
        >
        <Circle 
          cx = {x} 
          cy = {y}
          r = {r}
          style = {style.body}
          >
        </Circle>  
        <Text style = {style.label} x = {x} y = {y} alignmentBaseline={'middle'} textAnchor = {'middle'}>{this.props.children}</Text>
      </G>
    )
  }
}



