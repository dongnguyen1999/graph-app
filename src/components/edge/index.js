import React, { Component } from 'react'
import { View,PixelRatio } from "react-native"
import {styles} from "./style"
import {colors} from "./color"
import { Path, Text,G, Line} from 'react-native-svg';
import { d2PixcelUtils } from '../../tool/graph_drawing'


/**
 * An instance of this class presents a svg shape of graph's egde
 * Edge can display label if having 'label' prop
 * @prop {Number} key: id of this edge in list of edges
 * @prop {Node} source: the source node of the edge
 * @prop {Node} target: the source node of the edge
 *     Node {
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
 * @prop {String|Number} label: label that show along the edge
 * @prop {Number} r: node radius
 * @prop {Boolean} isDirected: set the edge having arrow or not
 */
export default class Edge extends Component {

  shouldComponentUpdate(){
    const { nodeStyle, source, target, r } = this.props;
    let fullRadius = nodeStyle.body.strokeWidth || 0;
    fullRadius += r;
    let [x1, y1] = source.point;
    let [x2, y2] = target.point;
    this.lineView.setNativeProps({x1: x1, y1: y1, x2: x2, y2: y2});
    if (this.arrowView) this.arrowView.setNativeProps({d: this.computeArrow(x1, y1, x2, y2, fullRadius)});
    let label = this.computeLabel(x1, y1, x2, y2);
    if (this.labelView) this.labelView.setNativeProps({x: label.x/2, y: label.y/2});
    this.previousSourcePosition = [x1, y1];
    this.previousTargetPosition = [x2, y2]
    return false;
  }

  computeArrow(x1,y1,x2,y2,r){
    let dist = d2PixcelUtils.distance(x1,y1,x2,y2);
    let isDirected = this.props.isDirected || false;// get directed setting
    let path = undefined;
    if (isDirected && dist > r){
      //compute arrow
      // size&alpha is editable;
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
      path = ',M' + D.x + ',' + D.y + ',L' + A.x + ',' + A.y + ',L' + C.x + ',' + C.y;
    }
    return path;
  }


  computeLabel(x1,y1,x2,y2){
    let label = this.props.label || undefined; //get label from props
    if (label != undefined){
      //compute label position
      // let dist = this.distance(x1,y1,x2,y2);
      let t = 0.5;
      let B = {x: x1 + (x2-x1)*t, y: y1 + (y2-y1)*t};
      let uBC = {x: -(y2-y1), y: x2-x1};
      t = 1/20;
      let C = {x: B.x + uBC.x*t, y: B.y + uBC.y*t};
      let D = {x: B.x - uBC.x*t, y: B.y - uBC.y*t};
      if (x2 < x1) return {text: label, x: C.x, y: C.y};
      return {text: label, x: D.x, y: D.y};
    }
    return undefined;
  }

  render() {
    // console.log("render edge");
    const { source, target, r, nodeStyle } = this.props;
    let [x1, y1] = source.point;
    let [x2, y2] = target.point;
    let fullRadius = nodeStyle.body.strokeWidth || 0;
    fullRadius += r;
    let label = this.computeLabel(x1, y1, x2, y2);
    let labelView = label!=undefined?<Text textAnchor={"middle"} x={label.x} y={label.y} ref={com => this.labelView=com}>{label.text}</Text>:[];
    let arrowPath = this.computeArrow(x1, y1, x2, y2, fullRadius);
    let arrowView = arrowPath!=undefined?<Path d={arrowPath} style={styles.lineBody} ref={com => this.arrowView=com}/>:[];
    return (
        <G>
          <Line x1={x1} y1={y1} x2={x2} y2={y2} style={styles.lineBody} ref={com => this.lineView=com}/>
          {arrowView}
          {labelView}
        </G>
    )
  }
}
