import React, { Component } from 'react'
import {styles} from "./style"
import {colors} from "./color"
import { Circle, Text, Svg, G } from "react-native-svg"


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
export default function Vertex(props){
  var isMoving = false;

  function onPreDragNodeListener(simulation, node){
    simulation.alphaTarget(0.3).restart();
    node.fx = node.x;
    node.fy = node.y;
  }

  function onDragNodeListener(event, node){
    if (!this.isMoving) this.isMoving = true;
    node.fx = event.nativeEvent.locationX;
    node.fy = event.nativeEvent.locationY;
  }

  function onPressNodeListener(simulation, node, pressingCallback){
    if (!this.isMoving) {
      pressingCallback(node);
    } else {
      simulation.alphaTarget(0);
      node.fx = null;
      node.fy = null;
    }
    this.isMoving = false
  }

  
  // console.log('vertex is rendering');
  const { simulation, node, vertexRadius ,pressingCallback } = props;
  let { style } = props;
  const [x, y ] = [node.x, node.y];
  if (style == undefined) style = styles.normal;
  return (
    <G 
      onMoveShouldSetResponder={() => {console.log("onMoveShouldSetResponder")}}
      onResponderGrant={() => onPreDragNodeListener(simulation, node)}
      onResponderMove={(event) => onDragNodeListener(event,node)}
      onPress={() => {console.log('press')}}
      onResponderRelease = {() => onPressNodeListener(simulation, node, pressingCallback)}
      >
      <Circle 
        cx = {x} 
        cy = {y}
        r = {vertexRadius}
        style = {style.body}
        >
      </Circle>  
      <Text style = {style.label} x = {x} y = {y} alignmentBaseline={'middle'} textAnchor = {'middle'}>{props.children}</Text>
    </G>
  )
}



