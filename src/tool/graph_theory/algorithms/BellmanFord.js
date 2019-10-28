import Algorithms from "./Algorithm";
const INFINITY = 9999999999;
/**
 * A graph view
 */
export default class BellmanFord extends Algorithms{
    constructor(graph, startingNode){
        super(graph); // Calling super.constructor to record parent graph for this algorithm
        this.source = startingNode; // Initializing the source vertex is a startingNode which is passed from outside
        // Initializing first state
        this.setState({
            distance : this.initArray(INFINITY), // Initializing the distance to all vertices to infinity
            predecessor : this.initArray(0), // And having a zero predecessor
            path: [] // An empty array which store the shortest path
        });
        this.isNegative = false; // This variable use to check a graph which exists negative cycle or not
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
                // considering new path is better old path, then updating the old path
                if(this.state.distance[u] != INFINITY && this.state.distance[u] + w < this.state.distance[v]){
                    this.state.distance[v] = this.state.distance[u] + w;
                    this.state.predecessor[v] = u;
                    this.saveState();
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
        // let path = this.getShortestPath();
        // for(let i of path){
        //     console.log(i);
        // }
        console.log(this.state.distance);
    }
}