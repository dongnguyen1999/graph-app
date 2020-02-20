import Algorithms from "./Algorithm";
import { AdjacencyMatrixGraph } from "../graphs";
const INFINITY = 9999999999;
/**
 * A graph view
 */
export default class BellmanFord extends Algorithms{
    init(source){
        super.init(); // Calling super.init
        this.source = source || 1; // Initializing the source vertex is a startingNode which is passed from outside
        // Initializing first state
        this.setState({
            distance : this.initArray(INFINITY), // Initializing the distance to all vertices to infinity
            predecessor : this.initArray(0), // And having a zero predecessor
            path: [], // An empty array which store the shortest path
            focusOnEdge: {},
            markedEdges: [],
        });
        this.isNegative = false; // This variable use to check a graph which exists negative cycle or not

        this.config = {
            hidden: ["focusOnEdge"],
            representName: {
                predecessor: (state, node) => {
                    return "p[" + node.id + "]";
                }
            },
            overrideRow: {
                distance: (state, node) => {
                    let distance = state.distance[node.id]==INFINITY?"oo":state.distance[node.id];
                    return "Distance from source: " + distance;
                }
            }
        }
    }

    /**
     * return an array is 'nbVertex+1' length, fill with initValue
     * @param {Number} initValue
     */
    initArray(initValue){
        array = [];
        for (var i = 0; i <= this.graph.nbVertex; i++){
            array.push(initValue);
        }
        return array;
    }

    getResultGraph(){
        let thisGraph = this.graph;
        let state = this.getState();
        let markedEdges = [];
        for (let edge of thisGraph.getEdges()){
            let u = edge.u;
            let v = edge.v;
            let w = edge.w;
            if (state.predecessor[u] == v || state.predecessor[v] == u){
                markedEdges.push({u, v, w});
            }
        }
        let graph = new AdjacencyMatrixGraph(thisGraph.nbVertex, thisGraph.nbEdge-1,true);
        for (let edge of markedEdges){
            graph.addEdge(edge);
        }
        return graph;
    }

    /**
     * Bellman-Ford algorithm to find the shortest path between a given source vertex and all other vertices in the graph.
     * It is used in run() method to record states.
     * @param {Number} source: a source vertex in the graph
     */
    bellmanFord(source){
        this.state.distance[source] = 0; // The distance from the source to itself is, of course, zero
        this.state.predecessor[source] = -1; // No predecessor of s
        this.saveState();
        let edgeList = this.graph.getEdges();
        // relaxing edges repeatedly
        for(let it = 1; it < this.graph.nbVertex; it++){
            // traversing all edges in edgeList
            for(let edge of edgeList){
                let u = edge.u;
                let v = edge.v;
                let w = edge.w;
                this.state.focusOnEdge = {u, v, w};
                this.saveState();
                // considering new path is better old path, then updating the old path
                let temp = this.state.distance[u] + w;
                if(temp < this.state.distance[v]){
                    this.state.distance[v] = temp;
                    this.state.predecessor[v] = u;
                    this.state.focusOnEdge = {};
                    this.saveState();
                } else if (!this.graph.isDirected){
                    let s = v, t = u;
                    temp = this.state.distance[s] + w;
                    if(temp < this.state.distance[t]){
                        this.state.distance[t] = temp;
                        this.state.predecessor[t] = s;
                        this.state.focusOnEdge = {};
                        this.saveState();
                    }
                }
            }
        }
        // checking for negative cycle
        for(let edge of edgeList){
            let u = edge.u;
            let v = edge.v;
            let w = edge.w;
            if(this.state.distance[u] != INFINITY && this.state.distance[u] + w < this.state.distance[v]){
                this.isNegative = true;
                break;
            }
        }
        this.state.focusOnEdge = {}
    }

    /**
     * Function to return true if the graph exists negative cycle, otherwise return false
     */
    checkNegativeCycle(){
        return this.isNegative;
    }

    /**
     * Function to return an array which store the shortest path from source vertex to nbVertex
     */
    getShortestPath(){
        let current = this.graph.nbVertex;
        while(current != -1){
            this.state.path.unshift(current);
            current = this.state.predecessor[current];
        }
        this.saveState();
        return this.state.path;
    }

    /**
     * override
     */
    run(){
        this.saveState(); // saving first state;
        this.bellmanFord(this.source); // starting bellmanFord() method from source vertex
        this.saveState();
        // console.log(this.state.distance);
    }
}