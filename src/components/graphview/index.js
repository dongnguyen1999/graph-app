import React, { Component } from 'react'
import Vertex from "../vertex"
import Edge from "../edge"
import {Dimensions, View} from "react-native"
import {styles} from "./style"
import { GraphRenderer, Graph, Layout} from "../../tool/graph_drawing"
import Svg, { Path, G } from 'react-native-svg';
import { DraculaGraph } from 'graphdracula';


/**
 * Calculate distance between 2 points
 * @param {Number} x1: x coordinate of the first point
 * @param {Number} y1: y corrdinate of the first point
 * @param {Number} x2: x coordinate of the second point
 * @param {Number} y2: y coordinate of the second point
 */
function calcDistance(x1, y1, x2, y2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
}

function middle(p1, p2) {
    return (p1 + p2) / 2;
}

/**
 * Calculate the middle point between 2 points
 * @param {Number} x1: x coordinate of the first point
 * @param {Number} y1: y corrdinate of the first point
 * @param {Number} x2: x coordinate of the second point
 * @param {Number} y2: y coordinate of the second point
 */
function calcCenter(x1, y1, x2, y2) {
    return {
        x: middle(x1, x2),
        y: middle(y1, y2),
    };
}


/**
 * An instance of this class presents a GraphView area with vertices and edges inside
 * Vertices can be dragged and change their position
 * Edges can display label
 * @prop {Number} width: the width of GraphView area
 * @prop {Number} height: the hight of GraphView area
 * @prop {Graph} graph: the basic graph (src/tool/graph_theory/graphs/Graph) need to show on GraphView
 * @prop {Number} nodeRadius: the radius of a vertex
 * @prop {Boolean} zoomable: setting GraphView to be zoomable or not
 *      
 */
export default class GraphView extends Component {
    constructor(props){
        super(props);
        const {graph, width, height, nodeRadius} = this.props;

        this.graph = graph;//keep graph
        let uiGraph = this.convertToUIGraph(graph);
        let layout = new Layout.Spring(uiGraph);
        //first layout nodes in graph
        layout.layout();
        const renderer = new GraphRenderer(uiGraph, width-(2*nodeRadius), height-(2*nodeRadius), nodeRadius);
        //first render graph
        renderer.draw();

        //get nodes, edges with their first position
        this.nodes = renderer.getNodesMap();
        this.edges = renderer.getEdgesMap();

        this.state = {
            //nodes, edges should be properties
            // nodes: nodes,
            // edges: edges,
            views: this.renderGraph(this.nodes, this.edges), //render the first graph status
            //the 3 states for svg transform
            zoom: 1,    
            left: 0,
            top: 0,
        }

        //should use width, height from props
        //pass widthPhone, heightPhone when use GraphView as props
        // this.widthPhone = Math.round(Dimensions.get('window').width);
        // this.heightPhone = Math.round(Dimensions.get('window').height);

        this.refresh = this.refresh.bind(this);
        this.renderGraph = this.renderGraph.bind(this);
    }

    /**
     * convert a basic graph to DraculaGraph
     * @param {Graph} graph: a basic graph (src/tool/graph_theory/graphs/Graph)
     */
    convertToUIGraph(graph){
        let uiGraph = new DraculaGraph();//init uiGraph
        for (let nodeId = 1; nodeId <= graph.nbVertex; nodeId++){
            //add nodes with id is number
            uiGraph.addNode(nodeId);
        }
        for (let edge of graph.getEdges()){
            let {u,v,w} = edge;
            if (w !== undefined){
                //add edge with label
                uiGraph.addEdge(u,v,{label: w});
            } else uiGraph.addEdge(u,v);//add edge without label
        }
        return uiGraph;
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
     * if GraphView is zoomable, compute scaled position depend on zooming value
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
        return [(x-this.state.left)/this.state.zoom,(y-this.state.top)/this.state.zoom];
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
                isDirected={this.graph.isDirected}
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
                    isDirected={this.graph.isDirected}
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

    /**
     * Handle dragging and pinching GraphView event
     * @param {ReactEvent} event 
     */
    processMoveAndZoomEvent(event){
        let isZoomable = this.props.zoomable || false; //get zoomable setting 
        if (isZoomable){
            const touches = event.nativeEvent.touches;
            const length = touches.length;
            if (length === 1) {//touch screen with 1 finger
                const [{ locationX, locationY }] = touches;
                this.processTouch(locationX,locationY);
            } else if (length === 2) {//touch screen with 2 fingers
                const [touch1, touch2] = touches;
                this.processPinch(
                    touch1.locationX,
                    touch1.locationY,
                    touch2.locationX,
                    touch2.locationY
                );
            }
        } else console.log('onMove');//if !isZoomable this wont do anything
    }

    /**
     * Handle touching, pinching event ended
     * set GraphView to normal state if it is in moving or zooming state
     */
    stopMoveAndZoom(){
        let isZoomable = this.props.zoomable || false; //get zoomable setting
        if (isZoomable){
            this.setState({
                isZooming: false,
                isMoving: false,
              });
        } else console.log('onMoveRelease');//if !isZoomable this wont do anything
    }

    /**
     * process pinch event
     * Base on https://snack.expo.io/@msand/svg-pinch-to-pan-and-zoom
     * @param {Number} x1: x coordinate of the first touched point
     * @param {Number} y1: y coordinate of the first touched point
     * @param {Number} x2: x coordinate of the second touched point
     * @param {Number} y2: y coordinate of the second touched point
     */
    processPinch(x1, y1, x2, y2) {
        const distance = calcDistance(x1, y1, x2, y2);
        const { x, y } = calcCenter(x1, y1, x2, y2);   
        if (!this.state.isZooming) {//if is not in zooming state
          //set GraphView into zooming state with initial values
          const { top, left, zoom } = this.state;
          this.setState({
            isZooming: true,
            initialX: x,
            initialY: y,
            initialTop: top,
            initialLeft: left,
            initialZoom: zoom,
            initialDistance: distance,
          });
        } else {//is in zooming state
          const {
            initialX,
            initialY,
            initialTop,
            initialLeft,
            initialZoom,
            initialDistance,
          } = this.state;
    
          const touchZoom = distance / initialDistance;
          const dx = x - initialX;
          const dy = y - initialY;
    
          //calculate new left, top, zoom values
          const left = (initialLeft + dx - x) * touchZoom + x;
          const top = (initialTop + dy - y) * touchZoom + y;
          const zoom = initialZoom * touchZoom;
    
          this.setState({
            zoom,
            left,
            top,
          });
        }
      }

      /**
       * process drag event
       * @param {Number} x: x coordinate of the touched point
       * @param {Number} y: y coordinate of the touched point
       */
      processTouch(x, y) {
        if (!this.state.isMoving || this.state.isZooming) {//if not in moving state or in zooming state
          //set GraphView into moving state with initial values
          const { top, left } = this.state;
          this.setState({
            isMoving: true,
            isZooming: false,
            initialLeft: left,
            initialTop: top,
            initialX: x,
            initialY: y,
          });
        } else {//is in moving state
          //calculate new left, top values
          const { initialX, initialY, initialLeft, initialTop } = this.state;
          const dx = x - initialX;
          const dy = y - initialY;
          this.setState({
            left: initialLeft + dx,
            top: initialTop + dy,
          });
        }
      }

    render() {
        const {width, height} = this.props;
        const { left, top, zoom } = this.state;
        return (
            <View>
                <Svg width={width} height={height}
                    onMoveShouldSetResponder={() => {console.log('onMoveShouldSetResponder')}}
                    onResponderGrant={() => {console.log('onGrant')}}
                    onResponderMove={(event) => this.processMoveAndZoomEvent(event)}
                    onPress={() => {console.log('onPress')}}
                    onResponderRelease={() => this.stopMoveAndZoom()}>
                    <G
                        transform={{
                            translateX: left,
                            translateY: top,
                            scale: zoom,
                          }} >
                        {this.applyViews()}
                    </G>
                </Svg>
            </View>
        )
    }
}
