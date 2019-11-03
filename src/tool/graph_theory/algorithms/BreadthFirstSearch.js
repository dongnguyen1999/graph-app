import Algorithms from "./Algorithm";

/**
 * A graph view
 */
export default class BreadthFirstSearch extends Algorithms{
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
     * Breadth-First-Search (BFS) algorithm for traversing a graph.
     * It is used in run() method to record states
     * @param {Number} source: a source vertex in the graph
     */
    bfs(source){
        this.state.focusOn = source;
        this.saveState();
        let queue = [];
        let front = 0, rear = 0;
        queue[rear++] = source; // inserting the source vertex into queue
        this.state.mark[source] = 1; // visited source
        this.state.traversingList[source] = ++this.state.step;
        this.saveState();
        while(front < rear){
            let u = queue[front++]; // get a vertex from queue and call it is u vertex
            let getAdjList = this.graph.getChildrenVertices(u);
            for(let v of getAdjList){ // travesing all v neighbors of u vertex
                this.state.focusOn = v;// focus on new vertex
                this.saveState();
                if(this.state.mark[v] != 1){ // cheking v neighbor is visited or not
                    this.state.mark[v] = 1; // if not then mark v is visited
                    queue[rear++] = v; // inserting the v neighbor into queue
                    this.state.traversingList[v] = ++this.state.step;
                    this.saveState();
                }
            }
        }
    }

    /**
     * override
     */
    run(){
        this.saveState(); // save first state;
        this.bfs(this.source); // start bfs() method from source vertex
    }
}