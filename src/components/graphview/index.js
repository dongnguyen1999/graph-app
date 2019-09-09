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
        const {graph, width, height, nodeRadius} = this.props;//prop 'graph' is a DraculaGraph
        let layout = new Layout.Spring(graph);
        //first layout nodes in graph
        layout.layout();
        const renderer = new GraphRenderer(graph, width-(2*nodeRadius), height-(2*nodeRadius), nodeRadius);
        //first render graph
        renderer.draw();

        //get nodes, edges with their first position
        this.nodes = renderer.getNodesMap();
        this.edges = renderer.getEdgesMap();

        this.state = {
            //nodes, edges should be properties
            // nodes: nodes,
            // edges: edges,
            views: this.renderGraph(this.nodes, this.edges) //render the first graph status
        }

        //should use width, height from props
        //pass widthPhone, heightPhone when use GraphView as props
        // this.widthPhone = Math.round(Dimensions.get('window').width);
        // this.heightPhone = Math.round(Dimensions.get('window').height);

        this.refresh = this.refresh.bind(this);
        this.renderGraph = this.renderGraph.bind(this);
    }

    /**
     * rerender edge linked to or linked from a node when its position is changed
     * @param {Node} node: a node object in DraculaGraph
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
     * @param {String} connection: id of an edge ("sourceNodeId-targetNodeId")
     */
    updateEdges(node,connection){
        let points = connection.split("-");
        let [source, target] = points;
        let edge = this.edges.get(connection);
        if (node.id === source) edge.source = node;
        else if (node.id === target) edge.target = node;
        this.edges.set(connection, edge);//record new edge
        this.setState({
            views: this.rerenderEdge(connection,edge)
        });
    }

    /**
     * check and compute new position if the point is out of GraphView area
     * @param {Array<Number>} point: an array presents position of a node: [x,y]
     */
    validatePoint(point){
        let {width, height, nodeRadius } = this.props;
        let [x,y] = point;
        if (x < nodeRadius) x = nodeRadius;
        if (y < nodeRadius) y = nodeRadius;
        // if (x > this.widthPhone-nodeRadius) x = this.widthPhone-nodeRadius;
        // if (y > this.heightPhone-nodeRadius) y = this.heightPhone-nodeRadius;
        if (x > width-nodeRadius) x = width-nodeRadius;
        if (y > height-nodeRadius) y = height-nodeRadius;
        return [x,y];
    }

    /**
     * set new state for GraphView if a node is changed
     * @param {Node} node: a node object in DraculaGraph
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
     */
    refresh(node){
        node.point = this.validatePoint(node.point);
        // console.log(node.point);
        this.nodes.set(node.id,node);//record new node
        this.setState({
            views: this.rerenderNode(node.id,node)
        });
        for (let connection of node.connections){
            this.updateEdges(node,connection);
        }
    }


    /**
     * rerender an edge when nodes' position is changed
     * @param {String} id: node.id
     * @param {Node} node: a node object in DraculaGraph
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
     */
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

    /**
     * rerender an edge when its position is changed
     * @param {String} id: sourceNodeId + "-" + targetNodeId
     * @param {Edge} edge: an edge object in DraculaGraph
     * Edge {
        "attraction": 1,
        "shape": true,
        "source": Node
        "target": Node
        "style": { label,...}
        "shape": true,
        }
     */
    rerenderEdge(id, edge){
        let label = edge.style.label || undefined; //get label of edge
        return this.state.views.set(id,
            <Edge
                key={id}
                source={edge.source}
                target={edge.target}
                label={label}
                r={this.props.nodeRadius}
            />
        );
    }

    /**
     * render nodes, edges for the first time store in views (a Map)
     * @param {Node[]} nodes: array of node objects in DraculaGraph
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
     * @param {Edge[]} edges: array of edge objects in DraculaGraph
     * Edge {
        "attraction": 1,
        "shape": true,
        "source": Node
        "target": Node
        "style": { label,...}
        "shape": true,
        }
     */
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
            //Set edge into views
            let label = edge.style.label || undefined; //get label of edge
            views.set(id,
                <Edge
                    key={id}
                    source={edge.source}
                    target={edge.target}
                    label={label}
                    r={this.props.nodeRadius}
                />
            );
        }
        return views;
    }

    /**
     * order views to draw the graph on screen
     * draw edges first, then nodes
     */
    applyViews(){
        let edges = [];
        let nodes = [];
        for (let [key, view] of this.state.views){
            if (key.toString().includes("-"))
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
