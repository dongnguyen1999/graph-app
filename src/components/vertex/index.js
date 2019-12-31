import React, { Component } from 'react'
import {styles} from "./style"
import {colors} from "./color"
import { Circle, Text, Svg, G } from "react-native-svg"
import { d2PixcelUtils } from '../../tool/graph_drawing'


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
    this.counter = 0;
    let [x, y] = this.props.node.point;//keep the current positon
    this.previousCoord = [x,y];
    this.isMoving = false;
  }

  shouldComponentUpdate(){
    if (this.props.shouldRerender){// if this view is set force update fully
      console.log("force rerender " + ++this.counter);
      return true;// return true to rerender fully this Vertex
    }
    const {node} = this.props;
    let [x,y] = node.point; // get new coord will be up to date
    let { style } = this.props || styles.normal; // get current style for node
    const fontSize = style.label.fontSize || 14; // get font size for label
    // measure length of label text in pixcel
    let stringLabel = this.props.children.toString();
    if (stringLabel instanceof Array){ //array join
      stringLabel = stringLabel.join("");
    }
    let offset = d2PixcelUtils.measureText(stringLabel, fontSize)/4;// offset calculate from length that used to align text center manually
    this.bodyView.setNativeProps({cx: x, cy: y, style});
    this.labelView.setNativeProps({x: (x)/2-offset, y: (y)/2});// set the new scaled coord
    this.previousCoord = [x, y];
    return false;
  }



  onDragNodeListener(event, node, draggingCallback){
    const minDistToChange = 5; //by default offset 1 pixcel is enough to change node
    if (!this.isMoving) this.isMoving = true;
    let [x1, y1] = this.previousCoord;
    let [x2, y2] = [event.nativeEvent.locationX, event.nativeEvent.locationY];
    let dist = d2PixcelUtils.distance(x1,y1,x2,y2);
    if (dist > minDistToChange) {
      this.previousCoord = [x2, y2];
      draggingCallback(node, [x2, y2]);
    }
    // console.log([event.nativeEvent.locationX, event.nativeEvent.locationY]);
  }

  onPressNodeListener(node, pressingCallback){
    if (!this.isMoving) {
      pressingCallback(node);
    }
    this.isMoving = false;
    // console.log([event.nativeEvent.locationX, event.nativeEvent.locationY]);
  }

  render() {
    // console.log('vertex is rendering');
    const { node, r,pressingCallback, draggingCallback } = this.props;
    let { style } = this.props;
    const [x, y ] = node.point;
    if (style == undefined) style = styles.normal;
    return (
      <G 
        onMoveShouldSetResponder={() => {console.log("onMoveShouldSetResponder")}}
        // onResponderGrant={() => {console.log("onGrant")}}
        onResponderMove={(event) => this.onDragNodeListener(event,node,draggingCallback)}
        onPress={() => {console.log('press')}}
        onResponderRelease = {() => this.onPressNodeListener(node,pressingCallback)}
        style = {style.label}
        >
        <Circle 
          cx = {x} 
          cy = {y}
          r = {r}
          style = {style.body}
          ref={component => this.bodyView = component}
          >
        </Circle>
        <Text x = {x} y = {y} alignmentBaseline={'middle'} textAnchor = {'middle'}
          ref={component => this.labelView = component}>{this.props.children}</Text>
      </G>
      
    )
  }
}



