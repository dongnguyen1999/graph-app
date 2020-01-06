import Algorithms from "./Algorithm";
import { EdgeListGraph } from "../graphs";

/**
 * A graph view
 */
export default class Kruskal extends Algorithms{
    constructor(graph){
        super(graph); // Calling super.constructor to record parent graph for this algorithm
        this.setState({
            step: 0, // Initializing the first step is zero
            minimumSpanningTree : new EdgeListGraph(this.graph.nbVertex, this.graph.nbVertex-1, false)
        });
        this.sumW = 0; // Initializing sum weight of spanning tree is zero
        this.parent = []; // Array store parent of a vertex
        for(let u = 1; u <= this.graph.nbVertex; u++)
            this.parent[u] = u; // Initializing parent of all vertices are itself
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
     * This function will sort the edges of a graph by weight in ascending order
     */
    sort(){
        let edges = this.graph.getEdges();
        // 2 loops for sorting
        for(let i = 0; i < this.graph.nbEdge-1; i++){
            for(let j = i+1; j < this.graph.nbEdge; j++)
                if(edges[j].w < edges[i].w){
                    let temp = edges[i];
                    edges[i] = edges[j];
                    edges[j] = temp;
                }
        }
        return edges;
    }

    /**
     * Function to find the parent vertex of a vertex.
     * @param {Number} u: a vertex need to find parent vertex
     */
    findRoot(u){
        while(this.parent[u] != u)
            u = this.parent[u];
        return u;
    }

    /**
     * Kruskal algorithm for finding a minimum spanning tree.
     * It is used in run() method to record states
     */
    kruskal(){
        let edgeList = this.sort(); // sorting list of edges
        // traversing all edges of edgeList
        for(let edge of edgeList){
            let u = edge.u;
            let v = edge.v;
            let w = edge.w;
            // finding parent vertex of u and v vertices
            let root_u = this.findRoot(u);
            let root_v = this.findRoot(v);
            // checking u and v vertices is the same parent or not
            if(root_u != root_v){ 
                // if not then adding edge (u,v,w) to tree
                this.state.minimumSpanningTree.addEdge({u: u, v: v, w: w});
                this.parent[root_v] = root_u; // reset parent of v vertex is parent of v vertex
                this.sumW += w;
            }
        }
        // this.state.minimumSpanningTree.display();
    }

    /**
     * Function to get sum weight of minimum spanning tree
     */
    getSumWeight(){
        return this.sumW;
    }

    /**
     * override
     */
    run(){
        this.saveState(); // save first state;
        this.kruskal(); // start kruskal() method from
    }
}