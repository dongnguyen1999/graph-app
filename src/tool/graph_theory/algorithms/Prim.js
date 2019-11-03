import Algorithms from "./Algorithm";
import {AdjacencyMatrixGraph} from "../graphs"
const INFINITY = 9999999999;
/**
 * A graph view
 */
export default class Prim extends Algorithms{
    constructor(graph, startingNode){
        super(graph); // Calling super.constructor to record parent graph for this algorithm
        this.source = startingNode; // Initializing the source vertex is a startingNode which is passed from outside
        this.setState({
            mark: this.initArray(0), // Mark all the vertices as not visited 
            distance : this.initArray(INFINITY), // Initializing the distance to all vertices to infinity
            predecessor : this.initArray(0), // And having a zero predecessor
            // Initializing minimumSpanningTree is a undirected graph 
            // with number of vertices is the same number of vertices of the graph and (nbVertex-1) edges
            minimumSpanningTree : new AdjacencyMatrixGraph(this.graph.nbVertex,this.graph.nbVertex-1,false)
        });
        this.sumW = 0; // Initializing sum weight of spanning tree is zero
    }

    /**
     * return an array is 'nbVertex+1' length, fill with initValue
     * @param {Number} initValue
     */
    initArray(initValue){
        array = [];
        for (var i = 0; i <= this.graph.nbVertex+1; i++){
            array.push(initValue);
        }
        return array;
    }

    /**
     * Prim algorithm for finding a minimum spanning tree.
     * It is used in run() method to record states.
     * @param {Number} source: a source vertex in the graph
     */
    prim(source){
        const _matrix = this.graph.adjacencyMatrix;
        this.state.distance[source] = 0;
        this.state.predecessor[source] = -1;

        let sChildren = this.graph.getAdjacentVertices(source);
        for(let v of sChildren){
            this.state.distance[v] = _matrix[source][v]; // assigning distance[v] is the weight of edge (source,v)
            this.state.predecessor[v] = source; // predecessor of v is source
        }

        this.state.mark[source] = 1; // visited source vertex
        this.saveState();
        let u;
        for(let it = 1; it < this.graph.nbVertex; it++){
            let minDist = INFINITY;
            for(let i = 1; i <= this.graph.nbVertex; i++){
                // finding u vertex which have the lowest distance[u]
                if(!this.state.mark[i] && this.state.distance[i] < minDist){
                    minDist = this.state.distance[i]; // reset minDist
                    u = i; // saving this vertex
                }
            }
            this.state.mark[u] = 1; // visited u 
            // adding egde (this.state.predecessor[u], u, minDist) into minimumSpanningTree
            this.state.minimumSpanningTree.addEdge({u: this.state.predecessor[u], v: u, w: minDist});
            this.sumW += minDist;
            let getAdjList = this.graph.getAdjacentVertices(u);
            // updating distance and predecessor of each neighbor v of u vertex
            for(let v of getAdjList){
                if(_matrix[u][v] < this.state.distance[v]){
                    this.state.distance[v] = _matrix[u][v];
                    this.state.predecessor[v] = u;
                }
            }
            this.saveState();
        }
    }
    
    /**
     * Function to get sum weight of minimum spanning tree.
     */
    getSumWeight(){
        return this.sumW;
    }

    /**
     * override
     */
    run(){
        this.saveState(); // save first state;
        this.prim(this.source); // start prim() method from source vertex
    }
}