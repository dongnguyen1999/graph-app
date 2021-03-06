import React, { Component } from 'react';
import Vertex from "../vertex";
import Edge from "../edge";
import {Dimensions, View, TouchableOpacity, Text} from "react-native";
import {styles} from "./style";
import { styles as nodeStyles } from "../vertex/style";
import { styles as edgeStyles } from "../edge/style";
import { GraphRenderer, Graph, Layout, d2PixcelUtils} from "../../tool/graph_drawing";
import Svg, { Path, G } from 'react-native-svg';
import { DraculaGraph } from 'graphdracula';
import { Button } from 'react-native-elements';
import InfoPane from '../infopane';
import AlgorithmPlayer from '../algorithm_player';
import InfoFrame from '../infoFrame/InfoFrame';
import { AdjacencyMatrixGraph } from '../../tool/graph_theory/graphs';

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
        const { graph, width, height, nodeRadius, algorithm, keyAlgo } = this.props;
        this.keyAlgo = keyAlgo;
        this.algorithm = undefined;
        if (algorithm != undefined){ //if graphview is initialized with algorithm
            this.algorithm = algorithm;// keep algorithm object used as controller
            this.graph = algorithm.graph;//keep graph from algorithm
            this.algorithm.run(); //run algorithm for the first time
            this.algorithm.start();
        } else this.graph = graph;//keep graph from prop
        //console.log(this.graph);
        
        //init nodes map and edges map
        this.nodes = new Map();
        this.edges = new Map();
        this.isDirected = false;

        this.state = {
            nodeViews: new Map(),
            edgeViews: new Map(),
            infoPane: undefined,//keep the only InfoPane showing on GraphView, init with no InfoPane

            //the 3 states for svg transform
            zoom: 1,    
            left: 0,
            top: 0,

            isPlaying: false, // keep whether the algorithm player is playing or not
            graphType: undefined, // keep the 'key' of current graph, 'key' is used to load a whole new displaying with a new graph data
            sourceNode: 0,
            targetNode: 0,
            dialogVisible: true,
            isMovingNode: false,
        }

        //should use width, height from props
        //pass widthPhone, heightPhone when use GraphView as props
        // this.widthPhone = Math.round(Dimensions.get('window').width);
        // this.heightPhone = Math.round(Dimensions.get('window').height);

        // this.refresh = this.refresh.bind(this);
        // this.renderGraph = this.renderGraph.bind(this);
    }

    componentDidMount(){
        this.processingGraphData = this.convertToUIGraph(this.graph);// produce graphData{nodes, edges, isDirected} from input basic graph
        this.loadNewGraphData("process", this.processingGraphData);// load graphData to draw in screen
    }

    /**
     * convert a basic graph to UIGraph that is actually an object { nodes: Map<Node>, edges: Map<Edge>, isDirected: Boolean }
     * @param {Graph} graph a basic graph (src/tool/graph_theory/graphs/Graph)
     * @returns an object { nodes: Map<Node>, edges: Map<Edge>, isDirected: Boolean }
     */
    convertToUIGraph(graph){
        const { width, height, nodeRadius } = this.props;
        //const { graph } = this.props;
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

        /**
         * Sort an UIGraph by rank (layout UI nodes with rank)
         * @param {Map<Node>} nodes a map of UI nodes
         * @param {Array<Number>} rank an array of nodes' id ordered by rank
         * @param {Boolean} isAsc option for sorting asc(true) or desc(false)
         * @return {Map<Node>} a map of UI nodes
         */
        function sortRank(nodes, rank, isAsc){
            let found = true;
            let r = 0;
            let listOfRanks = [];
            // make listOfRanks is a list of sets, each set contains nodeIds at that rank
            while (found){
                found = false;
                let rankR = []
                for (let i = 1; i <= graph.nbVertex; i++){
                    if (rank[i] == r){
                        rankR.push(i);
                        found = true;
                    }
                }
                if (found) listOfRanks.push(rankR);
                r++;
            }
            //loop through listOfRanks and compute position for each UI node
            let cellHeight = height/listOfRanks.length;
            let cursor = {x: 0, y: 0};
            listOfRanks.forEach((rankR, r) => {
                cursor.y = r*cellHeight;
                cursor.x = 0;
                let cellWidth = width/rankR.length;
                rankR.forEach((nodeId, i) => {
                    cursor.x = i*cellWidth;
                    let coord = d2PixcelUtils.centerRect(cursor.x, cursor.y, cellWidth, cellHeight);
                    nodes.get(nodeId).point = [coord.x, coord.y];
                })
            })
            return nodes;
        }
        
        let layout = new Layout.Spring(uiGraph);
        //first layout nodes in graph
        layout.layout();
        const renderer = new GraphRenderer(uiGraph, width-(2*nodeRadius), height-(2*nodeRadius), nodeRadius);
        //first render graph
        renderer.draw();
        this.isDirected = graph.isDirected;
        let nodes = renderer.getNodesMap();
        // console.log(graph.UIConfig);
        if (graph.UIConfig){
            if (graph.UIConfig.sortRank != undefined) {
                let sortRankData = graph.UIConfig.sortRank;
                nodes = sortRank(nodes, sortRankData.rank, sortRankData.option);
            }
        }
        return {nodes: nodes, edges: renderer.getEdgesMap(), isDirected: graph.isDirected}
    }

    /**
     * Apply new displaying with a specific graphData
     * @param {String} key string that will be set to new graphView as 'key' props
     * @param {Graph} graphData an object { nodes: Map<Node>, edges: Map<Edge> }
     */
    loadNewGraphData(key, graphData){
        this.nodes = graphData.nodes;
        this.edges = graphData.edges;
        this.isDirected = graphData.isDirected;
        this.renderGraph(this.nodes, this.edges);// render UI components the first time
        this.setState({graphType: key});
    }

    /**
     * check and compute new position if the point is out of GraphView area
     * if GraphView is zoomable, compute scaled position depend on zooming value
     * @param {Array<Number>} point: an array presents position of a node: [x,y]
     */
    validatePoint(point){
        let { width, height, nodeRadius, zoomable } = this.props;
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

    /**
     * remove infopane if it is showing
     * force stop algorithm player if it is playing
     * update new position for node and call it rerender with new props
     * loop through the list of edges connected to this node, call it rerender with new props too
     * force update components tree
     * @param {Node} node the node that call this callback function
     * @param {Array<Number} newCoord a 2-length array contains the coordinate which is the new position of the node
     */
    moveNode(node, newCoord){
        // console.log(this.vertexRef[id].props);
        if (this.isShowingInfoPane()) this.removeInfoPane();
        point = this.validatePoint(newCoord);
        node.point = point;
        // console.log(node);
        this.state.nodeViews.set(node.id, this.createNode(node.id, node));// update new props for node
        for (let connection of node.connections){
            // this.updateEdges(node, connection);
            let edge = this.edges.get(connection);
            // console.log(connection, edge.source.point, edge.target.point);
            this.state.edgeViews.set(connection, this.createEdge(connection, edge));//update new props for edges
        }
        if (!this.state.isMovingNode) this.state.isMovingNode = true;
        this.forceUpdate();// this.setState({});
    }

    /** For fixing duplicate code
     * create a node with setting from specific node
     * @param {String} id: node.id
     * @param {Node} node: a node object in DraculaGraph
     * return a Vertex component
     */
    createNode(id, node){
        return <Vertex
                key={id}
                id={id}
                node={node}
                style = {this.getNodeStyle(id)}
                r={this.props.nodeRadius}
                pressingCallback={this.pressVerticesListener.bind(this)}
                draggingCallback={this.moveNode.bind(this)}
                releaseCallback={this.releaseVerticesListener.bind(this)}
                >{id}</Vertex>
    }

    /** For fixing duplicate code
     * create an edge with  from specific edge
     * @param {String} id: sourceNodeId + "-" + targetNodeId
     * @param {Edge} edge: an edge object in DraculaGraph
     * return an Edge component
     */
    createEdge(id, edge){
        //const { graph, nodeRadius } = this.props;
        let label = edge.style.label || undefined; //get label of edge
        return <Edge
                    key={id}
                    id={id}
                    source={edge.source}
                    target={edge.target}
                    style = {this.getEdgeStyle(id)}
                    label={label}
                    r={this.props.nodeRadius}
                    isDirected={this.isDirected}
                    nodeStyle = {this.getNodeStyle(edge.target.id)} // used to carculate arrow shape (directed graph)
                    // onPlayingCallback = { this.handleDataCallback.bind(this) }
                />
    }

    /**
     * render nodes, edges for the first time store in views (a Map)
     * render fully GraphView with nodes and edges
     * call the first in constructor
     * be also called when update new state of the running algorithm
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
        this.state.edgeViews = new Map();
        for (let [id,edge] of edges){
            // //Set edge into edge views map
            this.state.edgeViews.set(id, this.createEdge(id,edge));
        }
        this.state.nodeViews = new Map();
        for (let [id, node] of nodes){ //Destructuring
            //Set node into node views map
            this.state.nodeViews.set(id,this.createNode(id,node));
        }
    }

    /**
     * a callback function prepared for algorithm player
     * force render fully graph
     * @param {Number} showInfoPaneAt node id tell where to show infoPane
     */
    fullyRefresh(){
        this.renderGraph(this.nodes, this.edges);
        this.forceUpdate();
    }


    // R.I.P
    // Using data callback from algoithmPlayer is very dangerous
    // It can break player if it is playing
    // handleDataCallback(data){
    //     if(data) 
    //         this.setState({isPlaying:true});
    //     else 
    //         this.setState({isPlaying:false});
    // }

    /**
     * This method render a menu player for algorithms
     */
    renderAlgorithmPlayer(){
        if(this.algorithm) 
            return <AlgorithmPlayer 
                        algorithm = { this.algorithm }
                        keyAlgo = { this.keyAlgo }
                        rerenderCallback = { this.fullyRefresh.bind(this) }
                        showResultCallback = { this.showResultGraph.bind(this) }
                        removeResultCallback = { this.removeResultGraph.bind(this) }
                        graphViewIsChanging = { this.state.isMovingNode || this.state.infoPane || this.state.isMoving || this.state.isZooming}
                        // renderInfoPaneCallback = {this.pressVerticesListener.bind(this)}
                        removeInfoPaneCallback = {this.removeInfoPane.bind(this)}
                        // dataCallback = { this.handleDataCallback.bind(this) }
                    />
    }

    /**
     * Function to render stack/queue frame which will apply for algorithms using stack and queue
     */
    renderInfoFrame(){
        let listAlgos = ['DFS', 'BFS', 'Tarjan', 'FordFullkerson'];
        // if(this.state.algorithmPlaying && listAlgos.includes(this.keyAlgo)){
        if(listAlgos.includes(this.keyAlgo)){
            return <InfoFrame state = { this.algorithm.getState()}/>
        }
    }

    /**
     * make result graph from state and show it on GraphView svg
     * @param {State} state the last state of current algorithm (this.algotithm)
     */
    showResultGraph(state){
        // let supportedAlgos = ['DFS', 'BFS'];
        if (!this.isShowingResultGraph()){
            //make resultGraph from state
            let graph = this.algorithm.getResultGraph();
            // console.log(graph);
            this.resultGraphData = this.convertToUIGraph(graph);//get UI data
            // load on svg
            if (graph.UIConfig == undefined || graph.UIConfig.sortRank == undefined){
                for (let node of this.processingGraphData.nodes.values()){
                    let resultNode = this.resultGraphData.nodes.get(node.id);
                    // console.log(resultNode);
                    resultNode.point = node.point;
                }
            }
            this.loadNewGraphData("result", this.resultGraphData);
        } else this.fullyRefresh();
    }

    renderResultTextIntro(){
        if (this.isShowingResultGraph()) return (
            <View style={styles.resultTextContainer}>
                <Text style={styles.resultTextView}>Result Graph</Text>
            </View>
        );
    }

    isShowingResultGraph(){
        return (this.state.graphType == "result");
    }

    /**
     * remove result graph if it is showing
     */
    removeResultGraph(){
        if (this.isShowingResultGraph()){
            for (let resultNode of this.resultGraphData.nodes.values()){
                let node = this.processingGraphData.nodes.get(resultNode.id);
                // console.log(resultNode);
                node.point = resultNode.point;
            }
            this.loadNewGraphData("process", this.processingGraphData);
        }
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
                    algorithm={this.algorithm}
                    zoomable={this.props.zoomable}
                    />
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

    releaseVerticesListener(){
        this.setState({isMovingNode: false});
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
            if (state.focusOn && state.focusOn == nodeId){
                if (state.mark && state.mark[nodeId]) return nodeStyles.focusOnMarked;
                return nodeStyles.focusOn;
            }
            if (state.mark && state.mark[nodeId]) return nodeStyles.marked;
        }
        return nodeStyles.normal;
    }

    /**
     * Style a edge depend on information from this.algorithm
     * return a edgeStyle - src/components/edge/style
     * @param {String} edgeId: id of a edge (sourceNodeId + "-" + targetNodeId)
     */
    getEdgeStyle(edgeId){
        let [sourceNodeId, targetNodeid] = edgeId.split("-");
        let sourceId = parseInt(sourceNodeId);
        let targetId = parseInt(targetNodeid);
        if(!this.algorithm) return edgeStyles.normalEdgeStyle;
        let state = this.algorithm.getState();
        let supportedAlgos = ["Kruskal", "BellmanFord"];
        if(supportedAlgos.includes(this.keyAlgo)){
            if(state){
                // check if this edge is focused on
                if(state.focusOnEdge.u == sourceId && state.focusOnEdge.v == targetId ||
                    state.focusOnEdge.v == sourceId && state.focusOnEdge.u == targetId
                    ){
                    return edgeStyles.focusOnEdgeStyle;
                }

                let spanningTree = state.minimumSpanningTree;
                let edges = undefined;
                if (spanningTree) edges = spanningTree.getEdges();// if having spanningTree, get edges from it
                if (this.keyAlgo == "BellmanFord"){// only work with BellmanFord, to show marked edges
                    edges = [];
                    for (let i = 1; i <= this.graph.nbVertex; i++){
                        let p = state.predecessor[i];
                        if (p > 0) edges.push({u: p, v: i});
                    }
                }
                // console.log(edges);
                if (edges){
                    for (let edge of edges){
                        if (edge.u == sourceId && edge.v == targetId ||
                            edge.v == sourceId && edge.u == targetId
                            ){
                            return edgeStyles.markedStyle;
                        }
                    }
                }
            }
        }
        return edgeStyles.normalEdgeStyle;
    }

    /**
     * order views to draw the graph on screen
     * draw edges first, then nodes
     */
    applyViews(){
        // let edgeViews = Array.from(this.state.edgeViews.values());
        let nodeViews = Array.from(this.state.nodeViews.values());
        let edgeViews = Array.from(this.state.edgeViews.values());
        let defaultInfoPane = [];
        if (this.algorithm){
            let state = this.algorithm.getState();
            if (!this.state.isMovingNode && state.focusOn && state.focusOn > 0){
                // console.log(state.focusOn);
                let node = this.nodes.get(state.focusOn);
                defaultInfoPane = <InfoPane
                                node={node}
                                key={"#InfoPane"+":"+node.id}
                                algorithm={this.algorithm}
                                />
            }
        }
        let infoPane = (this.isShowingInfoPane())? this.state.infoPane: defaultInfoPane;
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
        } //else console.log('onMoveRelease');//if !isZoomable this wont do anything
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
        const distance = d2PixcelUtils.distance(x1, y1, x2, y2);
        const { x, y } = d2PixcelUtils.center(x1, y1, x2, y2);   
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
        // console.log(this.state.isPlaying);
        return (
            <View>
                {/* {this.renderDialog()} */}
                {this.renderAlgorithmPlayer()}
                {this.renderInfoFrame()}
                {this.renderResultTextIntro()}
                <Svg width={width} height={height}
                    key={this.state.graphType}
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
        );
    }
}
