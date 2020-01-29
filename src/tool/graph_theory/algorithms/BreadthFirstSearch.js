import Algorithms from "./Algorithm";
import { Queue } from "../../graph_drawing";

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
            traversingList: this.initArray(0), // Initializing the order of traversing of all vertex is zero
            queue: new Queue(),
            parent: this.initArray(0),
        });
        this.config = {
            hidden: ["focusOn", "traversingList", "queue", "step"],
            representName: {
                //step: "Buoc",
                parent: (state, node) => {
                    return "p[" + node.id + "]" 
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

    /**
     * Breadth-First-Search (BFS) algorithm for traversing a graph.
     * It is used in run() method to record states
     * @param {Number} source: a source vertex in the graph
     */
    bfs(source){
        let front = 0, rear = 0;
        this.state.focusOn = source;
        this.state.queue.enqueue(source); // inserting the source vertex into queue
        this.state.mark[source] = 1; // visited source
        this.state.traversingList[source] = ++this.state.step;
        this.saveState();
        while(!this.state.queue.empty()){
            let u = this.state.queue.dequeue(); // get a vertex from queue and call it is u vertex
            this.saveState();
            let getAdjList = this.graph.getChildrenVertices(u);
            for(let v of getAdjList){ // travesing all v neighbors of u vertex
                this.state.focusOn = v;// focus on new vertex
                if(this.state.mark[v] != 1){ // cheking v neighbor is visited or not
                    this.state.mark[v] = 1; // if not then mark v is visited
                    this.state.queue.enqueue(v); // inserting the v neighbor into queue
                    this.state.parent[v] = u;
                    this.state.traversingList[v] = ++this.state.step;
                    this.saveState();
                }
            }
        }
        this.state.focusOn = 0; // focus on nothing for the last state
    }

    /**
     * override
     */
    run(){
        this.saveState(); // save the first state;
        this.bfs(this.source); // start bfs() method from source vertex
        this.saveState(); // save the last state
    }
}