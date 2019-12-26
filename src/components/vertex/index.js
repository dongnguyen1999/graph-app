import React, { Component } from 'react'
import {styles} from "./style"
import {colors} from "./color"
import { Circle, Text, Svg, G } from "react-native-svg"

function distance(x1,y1,x2,y2){
  return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}

/**
 * An instance of this class presents a Vertex in GraphView
 * Vertices can be dragged and change their position
 * @prop {Simulation} simulation: a d3-force simularion
 * @prop {Node} node: the Node object that will be drawn on GraphView
 * Node {
          
        }
 * @prop {Number} vertexRadius: the radius of a node
 * @prop {function} pressingCallback: a function binded GraphView, tell what to do when a node is pressed
 *      
 */
export default class Vertex extends Component{
  constructor(props){
    super(props);
    this.isMoving = false;
    this.currentPosition = [this.props.node.x, this.props.node.y];
    // this.counter = 0;
  }

  shouldComponentUpdate(props, state){
    let [x1, y1] = this.currentPosition;
    let [x2, y2] = [props.node.x, props.node.y];
    let dist = distance(x1,y1,x2,y2);
    const minDistToChange = 1;
    if (dist > minDistToChange){
      this.currentPosition = [x2, y2];
      return true;
    }
    return false;
  }

  onPreDragNodeListener(simulation, node){
    simulation.alphaTarget(0.3).restart();
    node.fx = node.x;
    node.fy = node.y;
  }

  onDragNodeListener(event, node){
    if (!this.isMoving) this.isMoving = true;
    node.fx = event.nativeEvent.locationX;
    node.fy = event.nativeEvent.locationY;
  }

  onPressNodeListener(simulation, node, pressingCallback){
    if (!this.isMoving) {
      pressingCallback(node);
    } else {
      simulation.alphaTarget(0);
      node.fx = null;
      node.fy = null;
    }
    this.isMoving = false
  }

  
  render(){
    // console.log('vertex is rendering');
    const { simulation, node, vertexRadius ,pressingCallback } = this.props;
    let { style } = this.props;
    const [x, y ] = [node.x, node.y];
    if (style == undefined) style = styles.normal;
    return (
      <G 
        onMoveShouldSetResponder={() => {console.log("onMoveShouldSetResponder")}}
        onResponderGrant={() => this.onPreDragNodeListener(simulation, node)}
        onResponderMove={(event) => this.onDragNodeListener(event,node)}
        onPress={() => {console.log('press')}}
        onResponderRelease = {() => this.onPressNodeListener(simulation, node, pressingCallback)}
        >
        <Circle 
          cx = {x} 
          cy = {y}
          r = {vertexRadius}
          style = {style.body}
          >
        </Circle>  
        <Text style = {style.label} x = {x} y = {y} alignmentBaseline={'middle'} textAnchor = {'middle'}>{this.props.children}</Text>
      </G>
    );
   }
}



