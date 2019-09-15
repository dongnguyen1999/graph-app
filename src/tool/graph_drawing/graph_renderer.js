import React from "react"
import { Graph, Layout, Renderer } from "graphdracula"
import {Dimensions} from 'react-native';
import { Svg, Path, } from "react-native-svg"

export default class GraphRenderer extends Renderer {
    constructor(graph, width, height, radius) {
        super(undefined, graph, width, height);

        this.widthPhone = Math.round(Dimensions.get('window').width);
        this.heightPhone = Math.round(Dimensions.get('window').height);
        this.graph = graph;
        this.width = width || 400;
        this.height = height || 300;
        this.radius = radius || 40;
        this.nodes = new Map();
        this.edges = new Map();
        this.idCounter = 0;
    }
    getNodesMap(){
        return this.nodes;
    }
    getEdgesMap(){
        return this.edges;
    }
    drawNode(node) {
        if(!node.shape){
            if(node.point[0] + this.radius > this.widthPhone)
                node.point[0] -= this.radius*2;
            if(node.point[0] < this.radius)
                node.point[0] += this.radius*2;
            if(node.point[1] + this.radius > this.heightPhone)
                node.point[1] -= this.radius*2;
            if(node.point[1] < this.radius)
                node.point[1] += this.radius*2;


            node.shape = true;
            node.connections = [];
            this.nodes.set(node.id, node);
            // console.log('drawing a node');
        }
    }

    drawEdge(edge) {
      if (!edge.shape) {
        edge.shape = true ;
        let key = edge.source.id+"-"+edge.target.id;
        this.edges.set(key, edge);
        edge.source.connections.push(key);
        edge.target.connections.push(key);
        // console.log('drawing an edge');
      }
    //   console.log(edge);
    }
}
