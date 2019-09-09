import React, { Component } from 'react'
import { View,PixelRatio } from "react-native"
import {styles} from "./style"
import {colors} from "./color"
import { Path, Text,G} from 'react-native-svg';

export default class Edge extends Component {

  // getVertexBBox(x,y,r){
  //   return {
  //     x: x-r,
  //     y: y-r,
  //     width: 2*r,
  //     height: 2*r
  //   }
  // }

  // updateEdge(connection){
    // if (connection.type == 'source'){
    //   this.setState({sourcePoint: })
    // }
  // }

  // getConnectionPointsInCircle(x,y,r){
  //   /* get bounding boxes of target and source */
  //   const bb = this.getVertexBBox(x,y,r);
  //   let pi = Math.PI
  //   let points = []
  //   for (let t = 0; t <= 2*pi; t += pi/20){
  //     let px = Math.cos(t)*r + x;
  //     let py = Math.sin(t)*r + y;
  //     points.push({x: px, y: py});
  //   }
  //   console.log(points);
  //   return points;
  // }

  // getConnectionPoints(x1,y1,x2,y2,r){
  //   /* get bounding boxes of target and source */
  //   const bb1 = this.getVertexBBox(x1,y1,r);
  //   const bb2 = this.getVertexBBox(x2,y2,r);

  //   const off1 = 0
  //   const off2 = 0
  //   return [

  //     /* NORTH 1 */
  //     { x: bb1.x + bb1.width / 2, y: bb1.y - off1 },

  //     /* SOUTH 1 */
  //     { x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + off1 },

  //     /* WEST  1 */
  //     { x: bb1.x - off1, y: bb1.y + bb1.height / 2 },

  //     /* EAST  1 */
  //     { x: bb1.x + bb1.width + off1, y: bb1.y + bb1.height / 2 },

  //     /* NORTH 2 */
  //     { x: bb2.x + bb2.width / 2, y: bb2.y - off2 },

  //     /* SOUTH 2 */
  //     { x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + off2 },

  //     /* WEST  2 */
  //     { x: bb2.x - off2, y: bb2.y + bb2.height / 2 },

  //     /* EAST  2 */
  //     { x: bb2.x + bb2.width + off2, y: bb2.y + bb2.height / 2 },

  //   ]
  // }


  // computePath(x1,y1,x2,y2,r) {
  //   var p = this.getConnectionPoints(x1,y1,x2,y2,r);
  //   /* distances between objects and according coordinates connection */
  //   var d = {};
  //   var dis = [];
  //   var dx = void 0;
  //   var dy = void 0;
  //   console.log('calulating path');
  //   /*
  //   * find out the best connection coordinates by trying all possible ways
  //   */
  //   /* loop the first object's connection coordinates */
  //   for (var i = 0; i < 4; i++) {
  //     /* loop the second object's connection coordinates */
  //     for (var j = 4; j < 8; j++) {
  //       dx = Math.abs(p[i].x - p[j].x);
  //       dy = Math.abs(p[i].y - p[j].y);
  //       if (i === j - 4 || (i !== 3 && j !== 6 || p[i].x < p[j].x) && (i !== 2 && j !== 7 || p[i].x > p[j].x) && (i !== 0 && j !== 5 || p[i].y > p[j].y) && (i !== 1 && j !== 4 || p[i].y < p[j].y)) {
  //         dis.push(dx + dy);
  //         d[dis[dis.length - 1].toFixed(3)] = [i, j];
  //       }
  //     }
  //   }
  //   var res = dis.length === 0 ? [0, 4] : d[Math.min.apply(Math, dis).toFixed(3)];

  //   /* bezier path */
  //   var x1 = p[res[0]].x;
  //   var y1 = p[res[0]].y;
  //   var x4 = p[res[1]].x;
  //   var y4 = p[res[1]].y;
  //   dx = Math.max(Math.abs(x1 - x4) / 2, 10);
  //   dy = Math.max(Math.abs(y1 - y4) / 2, 10);
  //   var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3);
  //   var y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3);
  //   var x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3);
  //   var y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);

  //   /* assemble path and arrow */
  //   var path = ['M' + x1.toFixed(3), y1.toFixed(3), 'C' + x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(',');
  //   /* arrow */
  //   // // magnitude, length of the last path vector
  //   // var mag = Math.sqrt((y4 - y3) * (y4 - y3) + (x4 - x3) * (x4 - x3));
  //   // // vector normalisation to specified length
  //   // var norm = function norm(x, l) {
  //   //   return -x * (l || 5) / mag;
  //   // };
  //   // // calculate array coordinates (two lines orthogonal to the path vector)
  //   // var arc = [{
  //   //   x: (norm(x4 - x3) + norm(y4 - y3) + x4).toFixed(3),
  //   //   y: (norm(y4 - y3) + norm(x4 - x3) + y4).toFixed(3)
  //   // }, {
  //   //   x: (norm(x4 - x3) - norm(y4 - y3) + x4).toFixed(3),
  //   //   y: (norm(y4 - y3) - norm(x4 - x3) + y4).toFixed(3)
  //   // }];
  //   // path = path + ',M' + arc[0].x + ',' + arc[0].y + ',L' + x4 + ',' + y4 + ',L' + arc[1].x + ',' + arc[1].y;

  //   return path;

  // }

  distance(x1,y1,x2,y2){
    return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
  }

  computeLine(x1,y1,x2,y2,r){
    var dist = this.distance(x1,y1,x2,y2);
    var path = ['M' + x1.toFixed(3), y1.toFixed(3), 'L' + x2.toFixed(3), y2.toFixed(3)].join(',');
    var isDirected = true;
    if (isDirected && dist > r){
      //compute arrow
      // size&alpha is editable;
      var size = 10;
      var alpha = Math.PI/3;
      var t = 1 - (r/dist);
      var A = {x: x1 + (x2-x1)*t, y: y1 + (y2-y1)*t};
      t -= size/dist;
      var B = {x: x1 + (x2-x1)*t, y: y1 + (y2-y1)*t};
      var uBC = {x: -(B.y-A.y), y: B.x-A.x};
      t = t*Math.tan(alpha/2);
      var C = {x: B.x + uBC.x*t, y: B.y + uBC.y*t};
      var D = {x: B.x - uBC.x*t, y: B.y - uBC.y*t};
      var path = ['M' + x1.toFixed(3), y1.toFixed(3), 'L' + A.x.toFixed(3), A.y.toFixed(3)].join(',');
      path = path + ',M' + D.x + ',' + D.y + ',L' + A.x + ',' + A.y + ',L' + C.x + ',' + C.y;
    }
    return path;
  }

  computeLabel(x1,y1,x2,y2){
    var label = this.props.label || undefined; //get label from props
    if (label != undefined){
      //compute label position
      var dist = this.distance(x1,y1,x2,y2);
      var t = 0.5;
      var B = {x: x1 + (x2-x1)*t, y: y1 + (y2-y1)*t};
      var uBC = {x: -(y2-y1), y: x2-x1};
      t = 1/20;
      var C = {x: B.x + uBC.x*t, y: B.y + uBC.y*t};
      var D = {x: B.x - uBC.x*t, y: B.y - uBC.y*t};
      if (x2 < x1) return {text: label, x: C.x, y: C.y};
      return {text: label, x: D.x, y: D.y};
    }
    return undefined;
  }

  render() {
    const { source, target, r } = this.props;
    var sourcePoint = source.point;
    var targetPoint = target.point;
    var label = this.computeLabel(sourcePoint[0],sourcePoint[1],targetPoint[0],targetPoint[1]);
    var labelView = label!=undefined?<Text textAnchor={"middle"} x={label.x} y={label.y}>{label.text}</Text>:[];
    return (
        <G>
          <Path d = {this.computeLine(sourcePoint[0],sourcePoint[1],targetPoint[0],targetPoint[1],r+3)} style = {styles.lineBody} />
          {labelView}
        </G>
    )
  }
}
