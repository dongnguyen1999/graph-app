import React, { Component } from 'react'
import Vertex from "../vertex"
import Edge from "../edge"
import {Dimensions, View, TouchableOpacity, Text} from "react-native"
import {styles} from "./style"
import { styles as nodeStyles } from "../vertex/style"
import { GraphRenderer, Graph, Layout} from "../../tool/graph_drawing"
import Svg, { Path, G } from 'react-native-svg';
import { DraculaGraph } from 'graphdracula';
import { Button } from 'react-native-elements'
import InfoPane from '../infopane'
import AlgorithmPlayer from './algoritm_player'


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
        const {graph, width, height, nodeRadius, algorithm} = this.props;
        this.algorithm = undefined;
        if (algorithm != undefined){ //if graphview is initialized with algorithm
            this.algorithm = algorithm;// keep algorithm object used as controller
            this.graph = algorithm.graph;//keep graph from algorithm
            this.algorithm.run();//run algorithm for the first time
            this.algorithm.start();
        } else this.graph = graph;//keep graph from prop

        let uiGraph = this.convertToUIGraph(this.graph);
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
            nodeViews: [],
            edgeViews: [],
            infoPane: undefined,//keep the only InfoPane showing on GraphView, init with no InfoPane
            //the 3 states for svg transform
            zoom: 1,    
            left: 0,
            top: 0,
        }

        this.renderGraph(this.nodes, this.edges);

        //should use width, height from props
        //pass widthPhone, heightPhone when use GraphView as props
        // this.widthPhone = Math.round(Dimensions.get('window').width);
        // this.heightPhone = Math.round(Dimensions.get('window').height);

        // this.refresh = this.refresh.bind(this);
        // this.renderGraph = this.renderGraph.bind(this);
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
        // console.log(connection);
        let points = connection.split("-");
        let [source, target] = points;
        let edge = this.edges.get(connection);
        if (node.id === source) edge.source.point = node.point;
        else if (node.id === target) edge.target.point = node.point;
        this.state.edgeViews = this.rerenderEdge(connection,edge);
    }

    /**
     * check and compute new position if the point is out of GraphView area
     * if GraphView is zoomable, compute scaled position depend on zooming value
     * @param {Array<Number>} point: an array presents position of a node: [x,y]
     */
    validatePoint(point){
        let {width, height, nodeRadius, zoomable } = this.props;
        let [x,y] = point;
        if (!zoomable){
            if (x < nodeRadius) x = nodeRadius;
            if (y < nodeRadius) y = nodeRadius;
            // if (x > this.widthPhone-nodeRadius) x = this.widthPhone-nodeRadius;
            // if (y > this.heightPhone-nodeRadius) y = this.heightPhone-nodeRadius;
            if (x > width-nodeRadius) x = width-nodeRadius;
            if (y > height-nodeRadius) y = height-nodeRadius;
        }
        return [(x-this.state.left)/this.state.zoom,(y-this.state.top)/this.state.zoom];
    }

    
    moveNode(id, newCoord){
        // console.log(this.vertexRef[id].props);
        if (this.isShowingInfoPane()) this.removeInfoPane();
        point = this.validatePoint(newCoord);
        let node = this.nodes.get(id);
        node.point = point;
        // node.point = newCoord;
        for (let connection of node.connections){
            // this.updateEdges(node, connection);
            let edge = this.edges.get(connection);
            // console.log(connection, edge.source.point, edge.target.point);
        }
        this.renderGraph(this.nodes,this.edges);
        this.forceUpdate();
        // this.setState({});
    }

    /** For fixing duplicate code
     * create a node with standard setting
     * @param {String} id: node.id
     * @param {Node} node: a node object in DraculaGraph
     * return a Vertex component
     */
    // createNode(id, node){
    //     return <Vertex
    //             key={id}
    //             id={id}
    //             x={node.point[0]}
    //             y={node.point[1]}
    //             style = {this.getNodeStyle(id)}
    //             r={this.props.nodeRadius}
    //             pressingCallback={this.pressVerticesListener.bind(this)}
    //             draggingCallback={this.moveNode.bind(this)}
    //             >{id}</Vertex>
    // }
    createNode(id, node){
        return <Vertex
                key={id}
                id={id}
                node={node}
                style = {this.getNodeStyle(id)}
                r={this.props.nodeRadius}
                pressingCallback={this.pressVerticesListener.bind(this)}
                draggingCallback={this.moveNode.bind(this)}
                >{id}</Vertex>
    }

    /** For fixing duplicate code
     * create an edge with standard setting
     * @param {String} id: sourceNodeId + "-" + targetNodeId
     * @param {Edge} edge: an edge object in DraculaGraph
     * return an Edge component
     */
    createEdge(id, edge){
        let label = edge.style.label || undefined; //get label of edge
        return <Edge
                    key={id}
                    id={id}
                    source={edge.source}
                    target={edge.target}
                    label={label}
                    r={this.props.nodeRadius}
                    isDirected={this.graph.isDirected}
                    nodeStyle = {this.getNodeStyle(edge.target.id)} // used to carculate arrow shape (directed graph)
                />
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
        return this.state.edgeViews.set(id,
            this.createEdge(id, edge)
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
        this.state.edgeViews = [];
        for (let [id,edge] of edges){
            // //Set edge into edge views map
            // this.state.edgeViews.set(id, this.createEdge(id, edge));
            this.state.edgeViews.push(this.createEdge(id,edge));
        }
        this.state.nodeViews = [];
        for (let [id, node] of nodes){ //Destructuring
            //Set node into node views array
            this.state.nodeViews.push(this.createNode(id,node));
        }
    }

    /**
     * define what to do whenever the next button was pressed
     * call this.algorithm.next(), rerender the graph
     * through false everytime the next() method return undefined
     * require to stop the player automatically
     */
    clickNextButtonListener(){
        if (this.algorithm.next() == undefined) {
            this.algorithm.start();
            this.setState({views: this.renderGraph(this.nodes, this.edges)});
            return false;
        }
        return this.setState({views: this.renderGraph(this.nodes, this.edges)});
    }

    /**
     * define what to do whenever the previous button was pressed
     * call this.algorithm.previous(), rerender the graph
     */
    clickPreviousButtonListener(){
        if (this.algorithm.previous() == undefined) this.algorithm.start();
        return this.setState({views: this.renderGraph(this.nodes, this.edges)});
    }

    /**
     * define what to do whenever the jump-to-starting button was pressed
     * call this.algorithm.start(), rerender the graph
     */
    clickStartButtonListener(){
        this.algorithm.start();
        return this.setState({views: this.renderGraph(this.nodes, this.edges)});
    }

    /**
     * define what to do whenever the jump-to-ending button was pressed
     * call this.algorithm.end(), rerender the graph
     */
    clickEndButtonListener(){
        this.algorithm.end();
        return this.setState({views: this.renderGraph(this.nodes, this.edges)});
    }

    /** TEMP
     * This method render a menu player for algorithms
     */
    renderAlgorithmPlayer(){
        if (this.algorithm) 
            return <AlgorithmPlayer 
                clickNextButton={this.clickNextButtonListener.bind(this)}
                clickPreviousButton={this.clickPreviousButtonListener.bind(this)}
                clickStartButton={this.clickStartButtonListener.bind(this)}
                clickEndButton={this.clickEndButtonListener.bind(this)}
            />
    }

    /**
     * Render an InfoPane for GraphView if a node is pressed
     * There is only one InfoPane showed at the same time with id = "#InfoPane:NodeId"
     * If there is an infoPane is showing, remove current InfoPane
     * Then, show a new InfoPane if this function called with another node
     * @param {Node} node: a node object in DraculaGraph
     */
    renderInfoPane(node){
        if (this.algorithm){
            // console.log("render infopane for node ", node.id);
            this.setState({
                infoPane: <InfoPane
                    node={node}
                    key={"#InfoPane"+":"+node.id}
                    state={this.algorithm.getState()}/>
            })
        }
    }

    isShowingInfoPane(){
        return this.state.infoPane != undefined;
    }

    /**
     * Remove the only InfoPane from views
     * return a String is id of the InfoPane or undefined
     */
    removeInfoPane(){
        let removedPaneId = undefined;
        if (this.algorithm && this.isShowingInfoPane()){
            removedPaneId = this.state.infoPane.key;
            if (removedPaneId){
                this.setState({
                    infoPane: undefined
                })
            }
        }
        return removedPaneId;
    }

    /**
     * define what to do whenever a specific node was pressed
     * @param {Node} node: a Node object (from GraphDracula)
     */
    pressVerticesListener(node){
        if (!this.isShowingInfoPane()) this.renderInfoPane(node);
        else {
            let removedPaneId = this.removeInfoPane();
            if (removedPaneId){
                let removedNodeId = removedPaneId.substring(removedPaneId.lastIndexOf(":")+1);
                if (removedNodeId != node.id) this.renderInfoPane(node);
            }
        }
    }


    /**
     * Style a node depend on information from this.algorithm
     * return a nodeStyle - src/components/vertex/style
     * @param {Number} nodeId: id of a Node object (node.id)
     */
    getNodeStyle(nodeId){
        if (!this.algorithm) return nodeStyles.normal;
        let state = this.algorithm.getState();
        if (state){
            if (state.focusOn == nodeId && state.mark[nodeId]) return nodeStyles.focusOnMarked;
            if (state.focusOn == nodeId && !state.mark[nodeId]) return nodeStyles.focusOn;
            if (state.mark[nodeId]) return nodeStyles.marked;
        }
        return nodeStyles.normal;
    }

    /**
     * order views to draw the graph on screen
     * draw edges first, then nodes
     */
    applyViews(){
        // let edgeViews = Array.from(this.state.edgeViews.values());
        let nodeViews = this.state.nodeViews;
        // let nodeViews = this.state.nodeViews;
        let edgeViews = this.state.edgeViews;
        let infoPane = [];
        if (this.isShowingInfoPane()) infoPane.push(this.state.infoPane);
        return edgeViews.concat(nodeViews).concat(infoPane);
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
                {this.renderAlgorithmPlayer()}
                <Svg width={width} height={height}
                    marginTop={10}
                    onResponderGrant={() => this.removeInfoPane()}
                    onResponderMove={(event) => this.processMoveAndZoomEvent(event)}
                    onPress={() => {console.log('onPress')}}
                    onResponderRelease={() => this.stopMoveAndZoom()}>
                    <G
                        transform={{
                            translateX: left,
                            translateY: top,
                            scale: zoom,
                          }} 
                          >
                        {this.applyViews()}
                    </G>
                </Svg>
            </View>
        )
    }
}
