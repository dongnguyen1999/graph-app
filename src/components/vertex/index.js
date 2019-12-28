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
    let [x, y] = this.props.node.point;
    this.previousCoord = [x,y];
    this.state = {
      isMoving: false //keep whether a vertex are being dragged
    }
  }

  shouldComponentUpdate(){
    const minDistToChange = 2; //by default offset 1 pixcel is enough to change node
    const {node} = this.props;
    let [x,y] = node.point; // get new coord will be up to date
    let [x0, y0] = this.previousCoord;
    let dist = d2PixcelUtils.distance(x0, y0, x, y);
    if (dist > minDistToChange){
      let { style } = this.props || styles.normal; // get current style for node
      const fontSize = style.label.fontSize || 14; // get font size for label
      // measure length of label text in pixcel
      let stringLabel = this.props.children.toString();
      if (stringLabel instanceof Array){
        stringLabel = "";
        this.props.children.map((child) => {
          stringLabel += child;
        })
      }
      let offset = d2PixcelUtils.measureText(stringLabel, fontSize)/4;// offset calculate from length that used to align text center manually
      this.bodyView.setNativeProps({cx: x, cy: y});
      this.labelView.setNativeProps({x: (x)/2-offset, y: (y)/2});// set the new scaled coord
      this.previousCoord = [x, y];
    }
    return false;
  }



  onDragNodeListener(event, node, draggingCallback){
    // this.setState({isMoving: true});
    // let [x1, y1] = this.coord;
    // let [x2, y2] = [event.nativeEvent.locationX, event.nativeEvent.locationY];
    // let dist = this.calcDistance(x1,y1,x2,y2);
    // if (dist > this.props.r) {
    //   this.coord = [x2, y2];
    //   draggingCallback(node.id, [x2, y2]);
    // }
    // console.log([event.nativeEvent.locationX, event.nativeEvent.locationY]);
    draggingCallback(this.props.id, [event.nativeEvent.locationX, event.nativeEvent.locationY]);
  }

  onPressNodeListener(event,node, pressingCallback){
    // if (!this.state.isMoving) {
    //   pressingCallback(node);
    // }
    // this.setState({isMoving: false});
    // console.log([event.nativeEvent.locationX, event.nativeEvent.locationY]);
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
        onResponderRelease = {(event) => this.onPressNodeListener(event,node,pressingCallback)}
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
          {/* <Text
          ref={component => this.labelView = component}>{this.props.children}</Text> */}
      </G>
      
    )
  }
}



