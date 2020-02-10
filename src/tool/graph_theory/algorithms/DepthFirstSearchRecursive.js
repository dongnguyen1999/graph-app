import Algorithms from "./Algorithm";
import { AdjacencyMatrixGraph } from "../graphs";

/**
 * A graph view
 */
export default class DepthFirstSearchRecursive extends Algorithms{
    init(source){
        super.init();
        this.source = source || 1; // Initializing the source vertex is a startingNode which is passed from outside
        // Initializing first state
        this.setState({
            mark: this.initArray(0), // Mark all the vertices as not visited 
            focusOn: 0, // The first state have no node in order to focus on it so initialize focusOn of first state is zero
            step: 0, // Initializing the first step is zero
            parent: this.initArray(0),
            markAtLevel: this.initArray(-1), // init with null levels
            level: -1 // init with null level
        });
        this.config = {
            hidden: ["focusOn", "traversingList", "step", "mark"],
            representName: {
                parent: (state, node) => {
                    return "p[" + node.id + "]";
                },
                level: (state, node) => {
                    return "Recursive level"
                }
            },
            overrideRow: {
                markAtLevel: (state, node) => {
                    return (state.markAtLevel[node.id] != -1)?"Marked at level " + state.markAtLevel[node.id] : "Not marked yet";
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
        for (let i = 0; i <= this.graph.nbVertex+1; i++){
            array.push(initValue);
        }
        return array;
    }

    getResultGraph(){
        let nbVertex = this.graph.nbVertex;
        let graph = new AdjacencyMatrixGraph(nbVertex, nbVertex-1, true);
        for (let i = 1; i <= nbVertex; i++){
            let state = this.getState();
            if (state.parent[i] != 0) graph.addEdge({u: state.parent[i], v: i});
        }
        return graph;
    }

    /**
     * Depth-First-Search-Recursive (DFSR) algorithm for traversing a graph.
     * It is used in run() method to record states.
     * @param {Number} source: a source vertex in the graph
     */
    dfsRecursive(source, parent){
        this.state.level++;
        this.state.focusOn = source; // set working on node u;
        this.saveState(); // save the state when first jump to new node
        if (this.state.mark[source]) 
            return; // do nothing if node is marked 
        this.state.mark[source] = 1; // visited source
        this.state.markAtLevel[source] = this.state.level;
        this.state.parent[source] = parent;
        this.saveState(); // save the state when marking the new node
        let getAdjList = this.graph.getChildrenVertices(source);
        for (let v of getAdjList){ // loop through children of u
            this.dfsRecursive(v, source);
            this.state.focusOn = source;
            this.state.level--;
            this.saveState();
        }
        // this.state.focusOn = source; // set jump back parent node
        // this.saveState(); // save the state when jumping back parent
    }

    /**
     * override
     */
    run(source){
        this.source = source;
        this.init(source);
        this.saveState(); // save first state;
        this.dfsRecursive(this.source, 0); // start dfsRecursive() method from node 's'
        this.state.focusOn = 0;
        this.saveState(); // save last state;
    }
}