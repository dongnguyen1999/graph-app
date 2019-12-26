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
import * as d3 from 'd3-force'


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
 * @prop {Number} vertexRadius: the radius of a vertex
 * @prop {Number} maxLinkLength: maximum length of a link in GraphView
 * @prop {Number} minNodeDistance: minimum distance between 2 vertices
 * @prop {Boolean} zoomable: setting GraphView to be zoomable or not
 *      
 */
export default class GraphView extends Component {
    constructor(props){
        super(props);
        const {graph, algorithm} = this.props;
        this.algorithm = undefined;
        if (algorithm != undefined){ // if graphview is initialized with algorithm
            this.algorithm = algorithm;// keep algorithm object used as controller
            this.graph = algorithm.graph;// keep graph from algorithm
            this.algorithm.run();// run algorithm for the first time
            this.algorithm.start();// first start
        } else this.graph = graph;// keep graph from prop

        let data = this.produceDataFromGraph(this.graph);// data{nodes, links}
        // console.log(data);

        this.counter = 0;

        this.componentIsMounted = false;// to fix calling render() on unmountd components
        this.state = {
            nodes: data.nodes,// an array of node object
            links: data.links,// an array of link object
            infoPane: undefined,//keep the only InfoPane showing on GraphView, init with no InfoPane - undefined
            //the 3 states for svg transform
            zoom: 1,    
            left: 0,
            top: 0,
        }
    }

    /**
     * produre data from basic graph
     * @param {Graph} graph: a basic graph (src/tool/graph_theory/graphs/Graph)
     * return an object: data{ nodes, links }
     * data {
     *      nodes: an array of node object {id, style ...} 
     *          {
     *              id: a string determine an unique node (require)
     *                      use name of the vertex from basic graph as id (1,2,3...) | one-base index by default
     *              style: specify style for the node (fill, stroke, text,...) (optinal) | undefined for default style
     *                      see about node style at src/components/vertex/style.js
     *          }
     *      links: an array of link object {source, target, weight, label, style, isDirected ...}
     *          {
     *              source: an id(string) of a node object that is the node x in edge (x, y)
     *              target: an id(string) of a node object that is the node y in edge (x, y)
     *              weight: a number show the cost was paid when going from x to y | undefined by default
     *              label: display string in GraphView - middle of the link (optional) | show weight as label by default
     *              style: specify style for the link (type, color, stroke,...) (optional) | undefined for default style
     *                      see about node style at src/components/edge/style.js
     *              isDirected: tell whether the links is directed or not, show arrow shape for directed link | false by default
     *          }
     * }
     */
    produceDataFromGraph(graph){
        let nodes = [];
        let links = [];
        for (let nodeId = 1; nodeId <= graph.nbVertex; nodeId++){// loop through vertices in basic graph
            //add nodes with id is number
            nodes.push({
                id: nodeId.toString()
            });
        }
        for (let edge of graph.getEdges()){// loop through edges in basic graph
            let {u,v,w} = edge;
            let link = {};
            link.source = u.toString();
            link.target = v.toString();
            if (w !== undefined){
                //add weight to link object
                link.weight = w;
                link.label = w.toString();
            }
            if (graph.isDirected) link.isDirected = true;
            links.push(link);
        }
        return {nodes: nodes, links: links};//data {nodes, links}
    }

    /**
     * Handle event on tick in d3-force simulation
     * see more: https://github.com/d3/d3-force#simulation_tick
     */
    ticked(){
        if (this.componentIsMounted) {// make sure call render() when all components are mounted
            // console.log("tick rerender" + ++this.counter);
            // console.log(this.state.nodes);
            this.forceUpdate();// force rerender screen
        }
    }
    
    componentDidMount(){
        // init d3-force simularion
        const { width, height, maxLinkLength, minNodeDistance } = this.props;
        this.componentIsMounted = true;
        this.simulation = d3.forceSimulation(this.state.nodes)
            .force("link", d3.forceLink().id(function(d) { return d.id; }).links(this.state.links).distance(maxLinkLength))
            .force("charge", d3.forceManyBody().strength(-500).distanceMin(minNodeDistance))// see more https://github.com/d3/d3-force#many-body
            .force("center", d3.forceCenter(width / 2, height / 2))
            .on("tick", () => {this.ticked()}).alphaDecay(0.05);
        // console.log(this.simulation.force("charge").strength());
    }

    componentWillUnmount(){
        this.componentIsMounted = false;
    }

    // dragStartedListener(index) {
    //     this.simulation.alphaTarget(0.3).restart();
    //     this.state.nodes[index].fx = this.state.nodes[index].x;
    //     this.state.nodes[index].fy = this.state.nodes[index].y;
    // }
      
    // draggedListener(index, event) {
    //     this.state.nodes[index].fx = event.nativeEvent.locationX;
    //     this.state.nodes[index].fy = event.nativeEvent.locationY;
    // }
    
    // dragEndedListener(index) {
    //     this.simulation.alphaTarget(0);
    //     this.state.nodes[index].fx = null;
    //     this.state.nodes[index].fy = null;
    // }


    /**
     * check and compute new position if the point is out of GraphView area
     * if GraphView is zoomable, compute scaled position depend on zooming value
     * @param {Array<Number>} point: an array presents position of a node: [x,y]
     */
    // validatePoint(point){
    //     let {width, height, nodeRadius, zoomable } = this.props;
    //     let [x,y] = point;
    //     if (!zoomable){
    //         if (x < nodeRadius) x = nodeRadius;
    //         if (y < nodeRadius) y = nodeRadius;
    //         // if (x > this.widthPhone-nodeRadius) x = this.widthPhone-nodeRadius;
    //         // if (y > this.heightPhone-nodeRadius) y = this.heightPhone-nodeRadius;
    //         if (x > width-nodeRadius) x = width-nodeRadius;
    //         if (y > height-nodeRadius) y = height-nodeRadius;
    //     }
    //     return [(x-this.state.left)/this.state.zoom,(y-this.state.top)/this.state.zoom];
    // }

    /**
     * render an array of views that show links in GraphView
     * return an Array<Edge>
     */
    renderLinks(){
        const { vertexRadius } = this.props;
        let linkViews = [];
        this.state.links.forEach((link) => {
            if (link.source.id != undefined){
                linkViews.push(<Edge 
                key={link.source.id + ":" + link.target.id}
                link={link}
                vertexRadius={vertexRadius}/>);
            }
        })
        return linkViews;
    }

    /**
     * render an array of views that show nodes in GraphView
     * return an Array<Vertex>
     */
    renderNodes(){
        const { vertexRadius } = this.props;
        let nodeViews = [];
        this.state.nodes.forEach((node) => {
            if (node.x != undefined){
                nodeViews.push(<Vertex
                    key={node.id}
                    simulation={this.simulation}
                    node={node}
                    vertexRadius={vertexRadius}
                    pressingCallback={() => {
                        this.simulation.stop();
                        this.simulation.tick(3);
                    }}
                    >{node.id}</Vertex>);
            }
        });
        return nodeViews;
    }


    // /**
    //  * define what to do whenever the next button was pressed
    //  * call this.algorithm.next(), rerender the graph
    //  * through false everytime the next() method return undefined
    //  * require to stop the player automatically
    //  */
    // clickNextButtonListener(){
    //     if (this.algorithm.next() == undefined) {
    //         this.algorithm.start();
    //         this.setState({views: this.renderGraph(this.nodes, this.edges)});
    //         return false;
    //     }
    //     return this.setState({views: this.renderGraph(this.nodes, this.edges)});
    // }

    // /**
    //  * define what to do whenever the previous button was pressed
    //  * call this.algorithm.previous(), rerender the graph
    //  */
    // clickPreviousButtonListener(){
    //     if (this.algorithm.previous() == undefined) this.algorithm.start();
    //     return this.setState({views: this.renderGraph(this.nodes, this.edges)});
    // }

    // /**
    //  * define what to do whenever the jump-to-starting button was pressed
    //  * call this.algorithm.start(), rerender the graph
    //  */
    // clickStartButtonListener(){
    //     this.algorithm.start();
    //     return this.setState({views: this.renderGraph(this.nodes, this.edges)});
    // }

    // /**
    //  * define what to do whenever the jump-to-ending button was pressed
    //  * call this.algorithm.end(), rerender the graph
    //  */
    // clickEndButtonListener(){
    //     this.algorithm.end();
    //     return this.setState({views: this.renderGraph(this.nodes, this.edges)});
    // }

    // /** TEMP
    //  * This method render a menu player for algorithms
    //  */
    // renderAlgorithmPlayer(){
    //     if (this.algorithm) 
    //         return <AlgorithmPlayer 
    //             clickNextButton={this.clickNextButtonListener.bind(this)}
    //             clickPreviousButton={this.clickPreviousButtonListener.bind(this)}
    //             clickStartButton={this.clickStartButtonListener.bind(this)}
    //             clickEndButton={this.clickEndButtonListener.bind(this)}
    //         />
    // }

    /**
     * Render an InfoPane for GraphView if a node is pressed
     * There is only one InfoPane showed at the same time with id = "#InfoPane:NodeId"
     * If there is an infoPane is showing, remove current InfoPane
     * Then, show a new InfoPane if this function called with another node
     * @param {Node} node: a node object in DraculaGraph
     */
    // renderInfoPane(node){
    //     if (this.algorithm){
    //         // console.log("render infopane for node ", node.id);
    //         this.setState({
    //             infoPane: <InfoPane
    //                 node={node}
    //                 key={"#InfoPane"+":"+node.id}
    //                 state={this.algorithm.getState()}/>
    //         })
    //     }
    // }

    // isShowingInfoPane(){
    //     return this.state.infoPane != undefined;
    // }

    /**
     * Remove the only InfoPane from views
     * return a String is id of the InfoPane or undefined
     */
    // removeInfoPane(){
    //     let removedPaneId = undefined;
    //     if (this.algorithm && this.isShowingInfoPane()){
    //         removedPaneId = this.state.infoPane.key;
    //         if (removedPaneId){
    //             this.setState({
    //                 infoPane: undefined
    //             })
    //         }
    //     }
    //     return removedPaneId;
    // }

    /**
     * define what to do whenever a specific node was pressed
     * @param {Node} node: a Node object (from GraphDracula)
     */
    // pressVerticesListener(node){
    //     if (!this.isShowingInfoPane()) this.renderInfoPane(node);
    //     else {
    //         let removedPaneId = this.removeInfoPane();
    //         if (removedPaneId){
    //             let removedNodeId = removedPaneId.substring(removedPaneId.lastIndexOf(":")+1);
    //             if (removedNodeId != node.id) this.renderInfoPane(node);
    //         }
    //     }
    // }


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
    // applyViews(){
    //     let edgeViews = Array.from(this.state.edgeViews.values());
    //     let nodeViews = this.state.nodeViews;
    //     let infoPane = [];
    //     if (this.isShowingInfoPane()) infoPane.push(this.state.infoPane);
    //     return edgeViews.concat(nodeViews).concat(infoPane);
    // }

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
        } //else console.log('onMove');//if !isZoomable this wont do anything
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
        }// else console.log('onMoveRelease');//if !isZoomable this wont do anything
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
        // console.log(++this.counter);
        return (
            <View>
                {/* {this.renderAlgorithmPlayer()} */}
                <Svg width={width} height={height}
                    marginTop={10}
                    // onResponderGrant={() => this.removeInfoPane()}
                    onResponderMove={(event) => this.processMoveAndZoomEvent(event)}
                    onPress={() => {console.log('onPress')}}
                    onResponderRelease={() => this.stopMoveAndZoom()}>
                    <G
                        transform={{
                            translateX: left,
                            translateY: top,
                            scale: zoom,
                          }} >
                        {/* {this.applyViews()} */}
                        {this.renderLinks()}
                        {this.renderNodes()}
                    </G>
                </Svg>
            </View>
        )
    }
}
