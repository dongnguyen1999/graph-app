import React, { Component } from 'react'
import Vertex from "../vertex"
import Edge from "../edge"
import {Dimensions, View} from "react-native"
import {styles} from "./style"
import { GraphRenderer, Graph, Layout} from "../../tool/graph_drawing"
import Svg, { Path } from 'react-native-svg';
import { DraculaGraph } from 'graphdracula';

export default class GraphView extends Component {
    constructor(props){
        super(props);
        const {graph, width, height, nodeRadius} = this.props;
        let layout = new Layout.Spring(graph);
        layout.layout();
        const renderer = new GraphRenderer(graph, width-(2*nodeRadius), height-(2*nodeRadius), nodeRadius);
        renderer.draw();
        let nodes = renderer.getNodesMap();
        let edges = renderer.getEdgesMap();
        this.state = {
            nodes: nodes,
            edges: edges,
            views: this.renderGraph(nodes, edges)
        }

        this.widthPhone = Math.round(Dimensions.get('window').width);
        this.heightPhone = Math.round(Dimensions.get('window').height);
        this.refresh = this.refresh.bind(this);
        this.renderGraph = this.renderGraph.bind(this);
    }
    updateEdges(node,connection){ //connection is id of an edge
        let points = connection.split("-");//conection: "sourceNodeId-targetNodeId"
        let [source, target] = points;
        let edge = this.state.edges.get(connection);
        if (node.id === source) edge.source = node;
        else if (node.id === target) edge.target = node;
        this.setState({
            edges: this.state.edges.set(connection, edge),
            views: this.rerenderEdge(connection,edge)
        });
    }

    validatePoint(point){
        let {width, height, nodeRadius } = this.props;
        let [x,y] = point;
        if (x < nodeRadius) x = nodeRadius;
        if (y < nodeRadius) y = nodeRadius;
        if (x > this.widthPhone-nodeRadius) x = this.widthPhone-nodeRadius;
        if (y > this.heightPhone-nodeRadius) y = this.heightPhone-nodeRadius;
        return [x,y];
    }

    refresh(node){
        node.point = this.validatePoint(node.point);
        // console.log(node.point);
        this.setState({
            nodes: this.state.nodes.set(node.id,node),
            views: this.rerenderNode(node.id,node)
        });
        for (let connection of node.connections){
            this.updateEdges(node,connection);
        }
    }

    rerenderNode(id, node){
        return this.state.views.set(id,
            <Vertex
                key={id}
                node={node}
                r={this.props.nodeRadius}
                updatingCallback={this.refresh}
            >{id}</Vertex>
        );
    }

    rerenderEdge(id, edge){
        return this.state.views.set(id,
            <Edge
                key={id}
                source={edge.source}
                target={edge.target}
                r={this.props.nodeRadius}
            />
        );
    }

    renderGraph(nodes, edges){
        let views = new Map(); //Init views

        for (let [id, node] of nodes){ //Destructuring
            //Set node into views
            views.set(id,
                <Vertex
                    key={id}
                    node={node}
                    r={this.props.nodeRadius}
                    updatingCallback={this.refresh.bind(this)}>
                    {id}
                </Vertex>
            );
        }
        for (let [id,edge] of edges){
            //Set node into views
            views.set(id,
                <Edge
                    key={id}
                    source={edge.source}
                    target={edge.target}
                    r={this.props.nodeRadius}
                />
            );
        }
        return views;
    }
    applyViews(){
        let edges = [];
        let nodes = [];
        for (let [key, view] of this.state.views){
            if (key.includes("-"))
                edges.push(view);
            else nodes.push(view);
        }
        return edges.concat(nodes);
    }
    render() {

        const {width, height} = this.props;
        return (
            <View>
                <Svg width={width} height={height}>
                    {this.applyViews()}
                </Svg>
            </View>
        )
    }
}
