import Algorithms from "./Algorithm";

/**
 * A graph view
 */
export default class DepthFirstSearchRecursive extends Algorithms{
    constructor(graph, startingNode){
        super(graph); // Calling super.constructor to record parent graph for this algorithm
        this.source = startingNode; // Initializing the source vertex is a startingNode which is passed from outside
        // Initializing first state
        this.setState({
            mark: this.initArray(0), // Mark all the vertices as not visited 
            focusOn: 0, // The first state have no node in order to focus on it so initialize focusOn of first state is zero
            step: 0, // Initializing the first step is zero
            traversingList: this.initArray(0) // Initializing the order of traversing of all vertex is zero
        });
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

    /**
     * Depth-First-Search-Recursive (DFSR) algorithm for traversing a graph.
     * It is used in run() method to record states.
     * @param {Number} source: a source vertex in the graph
     */
    dfsRecursive(source){
        this.state.focusOn = source; // set working on node u;
        this.saveState(); // save the state when first jump to new node
        if (this.state.mark[source]) return; // do nothing if node is marked 
        this.state.mark[source] = 1; // visited u
        this.state.traversingList[source] = ++this.state.step;
        this.saveState(); // save the state when marking the new node
        let getAdjList = this.graph.getChildrenVertices(source);
        for (let v of getAdjList){ // loop through children of u
            this.dfsRecursive(v);
        }
        this.state.focusOn = source; // set jump back parent node
        this.saveState(); // save the state when jumping back parent
    }

    /**
     * override
     */
    run(){
        this.saveState(); // save first state;
        this.dfsRecursive(this.source); // start dfsRecursive() method from node 's'
    }
}