import Algorithms from "./Algorithm";
import { EdgeListGraph } from "../graphs";

/**
 * A graph view
 */
export default class Kruskal extends Algorithms{
    init(){
        super.init(); // Calling super.constructor to record parent graph for this algorithm
        this.setState({
            // step: 0, // Initializing the first step is zero
            minimumSpanningTree : new EdgeListGraph(this.graph.nbVertex, this.graph.nbVertex-1, false),
            parent: this.initArray(0), // Array store parent of a vertex
            sumW: 0, // Initializing sum weight of spanning tree is zero
            focusOnEdge: {},
        });
        for(let u = 1; u <= this.graph.nbVertex; u++)
            this.state.parent[u] = u; // Initializing parent of all vertices are itself
        
        this.config = {
            hidden: ["minimumSpanningTree", "sumW", "mark"],
            representName: {
                parent: (state, node) => {
                    return "p[" + node.id + "]";
                }
            },
        }
        
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
        while(this.state.parent[u] != u)
            u = this.state.parent[u];
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
            this.state.focusOnEdge = {u: u, v: v, w: w};
            this.saveState();
            // finding parent vertex of u and v vertices
            let root_u = this.findRoot(u);
            let root_v = this.findRoot(v);
            // checking u and v vertices is the same parent or not
            if(root_u != root_v){ 
                // if not then adding edge (u,v,w) to tree
                this.state.minimumSpanningTree.addEdge({u: u, v: v, w: w});
                this.state.parent[root_v] = root_u; // reset parent of v vertex is parent of v vertex
                this.state.sumW += w;
                this.saveState();
            }
        }
        this.state.focusOnEdge = {u: 0, v: 0, w: 0}; // focus on nothing for the last state
    }

    /**
     * Function to get sum weight of minimum spanning tree
     */
    getSumWeight(){
        return this.state.sumW;
    }

    /**
     * override
     */
    run(){
        this.init();
        this.saveState(); // save first state;
        this.kruskal(); // start kruskal() method from
        // let sumW = this.getSumWeight();
        // console.log("Sum weight = " + sumW);
        // console.log("Minimum spanning tree: ");
        // this.state.minimumSpanningTree.display();
        this.saveState(); // save last state
    }
}