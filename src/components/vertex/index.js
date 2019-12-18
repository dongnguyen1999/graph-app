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
 * @prop {function} draggingCallback: a function binded GraphView, tell what to do when a node is dragged
 * @prop {function} pressingCallback: a function binded GraphView, tell what to do when a node is pressed
 * @prop {vertex/style} style: style sheet of a node
 *      
 */
export default class Vertex extends Component {
  constructor(props){
    super(props)
    this.coord = this.props.node.point;
    this.state = {
      isMoving: false //keep whether a vertex are being dragged
    }
  }

  calcDistance(x1, y1, x2, y2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
  }


  onDragNodeListener(event, node, draggingCallback){
    this.setState({isMoving: true});
    let [x1, y1] = this.coord;
    let [x2, y2] = [event.nativeEvent.locationX, event.nativeEvent.locationY];
    let dist = this.calcDistance(x1,y1,x2,y2);
    if (dist > this.props.r) {
      this.coord = [x2, y2];
      draggingCallback(node.id, [x2, y2]);
    }
  }

  onPressNodeListener(node, pressingCallback){
    if (!this.state.isMoving) {
      pressingCallback(node);
    }
    this.setState({isMoving: false});
  }

  render() {
    // console.log('vertex is rendering');
    const { node, r,pressingCallback, draggingCallback } = this.props;
    let { style } = this.props;
    const [x, y ] = node.point;
    if (style == undefined) style = styles.normal;
    // if (!this.state.isMoving) draggingCallback(node.id, this.state.coord);
    return (
      <G 
        onMoveShouldSetResponder={() => {console.log("onMoveShouldSetResponder")}}
        // onResponderGrant={() => {console.log("onGrant")}}
        onResponderMove={(event) => this.onDragNodeListener(event,node,draggingCallback)}
        onPress={() => {console.log('press')}}
        onResponderRelease = {() => this.onPressNodeListener(node,pressingCallback)}
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



