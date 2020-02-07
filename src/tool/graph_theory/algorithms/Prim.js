import Algorithms from "./Algorithm";
import {AdjacencyMatrixGraph} from "../graphs"
const INFINITY = 9999999999;
/**
 * A graph view
 */
export default class Prim extends Algorithms{
    init(source){
        super.init(); // Calling super.constructor to record parent graph for this algorithm
        this.source = source || 1; // Initializing the source vertex is a startingNode which is passed from outside
        this.setState({
            focusOn: 0,
            distance : this.initArray(INFINITY), // Initializing the distance to all vertices to infinity
            predecessor : this.initArray(0), // No predecessor
            mark: this.initArray(0), // Mark all the vertices as not visited 
            // Initializing minimumSpanningTree is a undirected graph 
            // with number of vertices is the same number of vertices of the graph and (nbVertex-1) edges
            minimumSpanningTree : new AdjacencyMatrixGraph(this.graph.nbVertex,this.graph.nbVertex-1,false),
            sumW: 0, // Initializing sum weight of spanning tree is zero
        });

        this.config = {
            hidden: ["focusOn", "minimumSpanningTree", "sumW"],
            representName: {
                distance: (state, node) => {
                    return "pi[" + node.id + "]";
                },
                predecessor: (state, node) => {
                    return "p[" + node.id + "]";
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
        // console.log("source node = " + source);
        const _matrix = this.graph.adjacencyMatrix;
        this.state.mark[source] = 1; // visited source vertex
        this.state.focusOn = source;
        this.state.distance[source] = 0;
        let childNodes = this.graph.getAdjacentVertices(source);
        // for each neightbors of source node
        // console.log(childNodes);
        for(let v of childNodes){
            this.state.distance[v] = _matrix[source][v]; // assigning distance[v] is the weight of edge (source,v)
            // console.log("distance["+v+"] = " + this.state.distance[v]);
            this.state.predecessor[v] = source; // parent of v is source
        }
        this.saveState();
        let u;
        for(let it = 1; it < this.graph.nbVertex; it++){
            let minDist = INFINITY;
            for(let i = 1; i <= this.graph.nbVertex; i++){
                // finding u vertex which have the lowest distance[u]
                if(this.state.mark[i] == 0 && this.state.distance[i] < minDist){
                    minDist = this.state.distance[i]; // reset minDist
                    u = i; // saving this vertex
                }
            }
            // console.log("u = " + u);
            this.state.mark[u] = 1; // visited u 
            this.state.focusOn = u;
            // adding egde (this.state.parent[u], u, minDist) into minimumSpanningTree
            this.state.minimumSpanningTree.addEdge({u: this.state.predecessor[u], v: u, w: minDist});
            this.state.sumW += minDist;
            this.saveState();
            let adjList = this.graph.getAdjacentVertices(u);
            // console.log("Adjacent List of " + u);
            // console.log(adjList);
            // updating distance and parent of each neighbor v of u vertex
            for(let v of adjList){
                if(this.state.distance[v] > _matrix[u][v] && this.state.mark[v] == 0){
                    this.state.distance[v] = _matrix[u][v];
                    this.state.predecessor[v] = u;
                }
            }
            this.saveState();
        }
        this.state.focusOn = 0; // focus on nothing for the last state
    }
    
    /**
     * Function to get sum weight of minimum spanning tree.
     */
    getSumWeight(){
        return this.state.sumW;
    }

    displayParent(){
        for(let i = 1; i <= this.graph.nbVertex; i++)
            console.log('parent[' + i + '] = ' + this.state.predecessor[i]);
    }

    /**
     * override
     */
    run(source){
        this.init(source);
        this.saveState(); // save first state;
        this.prim(this.source); // start prim() method from source vertex
        // let sumW = this.getSumWeight();
        // console.log("Sum weight = " + sumW);
        // console.log("Minimum spanning tree: ");
        // this.state.minimumSpanningTree.display();
        // this.displayParent();
        this.saveState();
    }
}