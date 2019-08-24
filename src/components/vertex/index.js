import React, { Component } from 'react'
import {styles} from "./style"
import {colors} from "./color"
import { Circle, Text, Svg, G } from "react-native-svg"

export default class Vertex extends Component {
  onDragNodeListener(event, node, callback){
    node.point = [event.nativeEvent.locationX, event.nativeEvent.locationY];
    callback(node);
  }

  render() {
    // console.log('vertex is rendering');
    const { node, r, updatingCallback} = this.props;
    // var x = node.point[0];
    // var y = node.point[1];
    const [x, y ] = node.point;
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
          style = {styles.circleVertexBody}
          >
        </Circle>  
        <Text style = {styles.vertexName} x = {x} y = {y} alignmentBaseline={'middle'} textAnchor = {'middle'}>{this.props.children}</Text>
      </G>
    )
  }
}



