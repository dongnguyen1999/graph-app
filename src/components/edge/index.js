import React, { Component } from 'react'
import { View,PixelRatio } from "react-native"
import {styles} from "./style"
import {colors} from "./color"
import { Path, Text,G,Line} from 'react-native-svg';

function distance(x1,y1,x2,y2){
  return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}

function degreeOf([ax1, ay1], [ax2, ay2], [bx1, by1], [bx2, by2]){
  let vtA = [ax2 - ax1, ay2 - ay1];
  let vtB = [bx2 - bx1, by2 - by1];
  let cosD = (vtA[0]*vtB[0] + vtA[1]*vtB[1])/distance(ax1, ay1, ax2, ay2)*distance()
}

/**
 * An instance of this class presents a svg shape of graph's egde
 * Edge can display label if having 'label' prop
 * @prop {Number} key: id of this edge in list of edges
 * @prop {Link} link: a link object (data for drawing edge)
 *    Link{
 *         source: a node object that is the node x in edge (x, y)
 *         target: a node object that is the node y in edge (x, y)
 *         weight: a number show the cost was paid when going from x to y | undefined by default
 *         label: display string in GraphView - middle of the link (optional) | show weight as label by default
 *         style: specify style for the link (type, color, stroke,...) (optional) | undefined for default style
 *                 see about node style at src/components/edge/style.js
 *         isDirected: tell whether the links is directed or not, show arrow shape for directed link | false by default
 *    }
 * @prop {Number} vertexRadius: node radius
 */
export default class Edge extends Component{
  constructor(props){
    super(props);
    this.currentSourcePosition = [this.props.link.source.x, this.props.link.source.y];
    this.currentTargetPosition = [this.props.link.target.x, this.props.link.target.y];
    // this.counter = 0;
  }

  shouldComponentUpdate(props, state){
    const minDistToChange = 2*this.props.vertexRadius;
    const minDegreeToChange = Math.PI/100;
    let [ax1, ay1] = this.currentSourcePosition;
    let [ax2, ay2] = this.currentTargetPosition;
    let [bx1, by1] = [props.link.source.x, props.link.source.y];
    let [bx2, by2] = [props.link.target.x, props.link.target.y];
    let currentDist = distance(ax1, ay1, ax2, ay2);
    let newDist = distance(bx1, by1, bx2, by2);
    let vtA = [ax2 - ax1, ay2 - ay1];
    let vtB = [bx2 - bx1, by2 - by1];
    let cosD = (vtA[0]*vtB[0] + vtA[1]*vtB[1])/(currentDist*newDist);
    let degree = Math.acos(cosD);
    if (degree > minDegreeToChange || (Math.abs(newDist-currentDist) > minDistToChange)){
      this.currentSourcePosition = [bx1, by2];
      this.currentTargetPosition = [bx2, by2];
      // if (this.props.link.index == 0) console.log("edge rerender " + ++this.counter);
      return true;
    }
    return false;
  }

  /**
   * render an arrow-shaped view for edge if this edge is directed
   * @param {Number} x1 : source.x
   * @param {Number} y1 : source.y
   * @param {Number} x2 : target.x
   * @param {Number} y2 : target.y
   * @param {Number} r : vertexRadius
   * return svg view or undefined (if this edge is undirected)
   */
  computeArrow(x1,y1,x2,y2,r){
    let dist = distance(x1,y1,x2,y2);
    let isDirected = this.props.link.isDirected || false;// get directed setting | default is false
    if (isDirected && dist > r){
      // compute arrow
      // size & alpha is editable;
      // see more: src/components/edge/compute_arrow.png
      let size = 10;
      let alpha = Math.PI/3;
      let t = 1 - (r/dist);
      let A = {x: x1 + (x2-x1)*t, y: y1 + (y2-y1)*t};
      t -= size/dist;
      let B = {x: x1 + (x2-x1)*t, y: y1 + (y2-y1)*t};
      let uBC = {x: -(B.y-A.y), y: B.x-A.x};
      t = t*Math.tan(alpha/2);
      let C = {x: B.x + uBC.x*t, y: B.y + uBC.y*t};
      let D = {x: B.x - uBC.x*t, y: B.y - uBC.y*t};
      let path = 'M' + D.x + ',' + D.y + ',L' + A.x + ',' + A.y + ',L' + C.x + ',' + C.y;
      return <Path d={path} style={styles.lineBody}/>
    }
    return undefined;
  }

  /**
   * Get data about edge's label and compute the position to draw label along the edge
   * render text view for label if this edge has a label (link.label != undefined)
   * @param {Number} x1 : source.x
   * @param {Number} y1 : source.y
   * @param {Number} x2 : target.x
   * @param {Number} y2 : target.y 
   * return svg view or undefined (if this edge has no label)
   */
  computeLabel(x1,y1,x2,y2){
    var label = this.props.link.label || undefined; //get label from props
    if (label != undefined){
      //compute label position
      var dist = this.distance(x1,y1,x2,y2);
      var t = 0.5;
      var B = {x: x1 + (x2-x1)*t, y: y1 + (y2-y1)*t};
      var uBC = {x: -(y2-y1), y: x2-x1};
      t = 1/20;
      var C = {x: B.x + uBC.x*t, y: B.y + uBC.y*t};
      var D = {x: B.x - uBC.x*t, y: B.y - uBC.y*t};
      let resource = undefined;
      if (x2 < x1) resource = {text: label, x: C.x, y: C.y};
      else resource = {text: label, x: D.x, y: D.y};
      return <Text textAnchor={"middle"} x={resource.x} y={resource.y}>{resource.text}</Text>
    }
    return undefined;
  }

  render(){
    // console.log("render edge");
    const { link, vertexRadius } = this.props;
    var [x1, y1] = [link.source.x, link.source.y];
    var [x2, y2] = [link.target.x, link.target.y];
    return (
        <G>
          <Line x1={x1} y1={y1} x2={x2} y2={y2} style={styles.lineBody}/>
          {this.computeArrow(x1,y1,x2,y2,vertexRadius)}      
          {this.computeLabel(x1,y1,x2,y2)}
        </G>
    )
  }

}
