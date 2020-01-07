import Algorithms from "./Algorithm";

/**
 * A graph view
 */
export default class DepthFirstSearch extends Algorithms{
    constructor(graph, startingNode){
        super(graph); // Calling super.constructor to record parent graph for this algorithm
        this.source = startingNode; // Initializing the source vertex is a startingNode which is passed from outside
        // Initializing first state
        this.setState({
            mark: this.initArray(0), // Mark all the vertices as not visited 
            focusOn: 0, // The first state have no node in order to focus on it so initialize focusOn of first state is zero
            step: 0, // Initializing the first step is zero
            traversingList: this.initArray(0), // Initializing the order of traversing of all vertex is zero
            stack: this.initArray(0),
            parent: this.initArray(0),
        });
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
     * Depth-First-Search (DFS) algorithm for traversing a graph.
     * It is used in run() method to record states.
     * @param {Number} source: a source vertex in the graph
     */
    dfs(source){
        let top = 0;
        this.state.stack[top++] = source; // pushing source vertex into Stack
        this.saveState();
        while(top != 0){
            let u = this.state.stack[--top]; // get the first vertex from stack and call it is u vertex
            this.state.focusOn = u;
            this.saveState();
            if(this.state.mark[u] == 1) // cheking u vertex is visited or not
                continue; // if u visited then ignoring it
            this.state.mark[u] = 1; // if not, then visited u vertex
            this.state.traversingList[u] = ++this.state.step;
            let getAdjList = this.graph.getChildrenVertices(u);
            for(let v of getAdjList){ // traversing all v neighbors of u vertex 
                if(this.state.mark[v] == 0){
                    this.state.stack[top++] = v; // inserting the v neighbor into stack
                    this.state.parent[v] = u;
                }
                this.saveState();
            }
        }
    }

    displayParent(){
        for(let i = 1; i <= this.graph.nbVertex; i++)
            console.log('parent[' + i + '] = ' + this.state.parent[i]);
    }

    /**
     * override
     */
    run(){
        this.saveState(); // save first state;
        this.dfs(this.source); // start dfs() method from source vertex
        this.displayParent();
    }
}