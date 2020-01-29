import Algorithms from "./Algorithm";
import Stack from "../../graph_drawing/stack";

/**
 * A graph view
 */
export default class DepthFirstSearch extends Algorithms{
    init(source){
        super.init();
        this.source = source || 1; // Initializing the source vertex is a startingNode which is passed from outside
        // Initializing first state
        this.setState({
            mark: this.initArray(0), // Mark all the vertices as not visited 
            focusOn: 0, // The first state have no node in order to focus on it so initialize focusOn of first state is zero
            step: 0, // Initializing the first step is zero
            traversingList: this.initArray(0), // Initializing the order of traversing of all vertex is zero
            stack: new Stack(),
            parent: this.initArray(0),
        });

        //an example for algorithm.config
        this.config = {
            hidden: ["focusOn", "stack", "step"],
            representName: {
                parent: (state, node) => {
                    return "p[" + node.id + "]";
                }
            },
            overrideRow: {
                traversingList: (state, node) => {
                    if (state.traversingList[node.id] == 0) return "Not marked yet"
                    return "Marked at step " + state.traversingList[node.id];
                },
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
     * Depth-First-Search (DFS) algorithm for traversing a graph.
     * It is used in run() method to record states.
     * @param {Number} source: a source vertex in the graph
     */
    dfs(source){
        // console.log(source);
        this.state.stack.push(source); // pushing source vertex into Stack
        this.saveState();
        while(!this.state.stack.empty()){
            let u = this.state.stack.pop(); // get the first vertex from stack and call it is u vertex
            this.state.focusOn = u;
            if(this.state.mark[u] == 1){ // cheking u vertex is visited or not
                //this.state.stack.shift();
                this.saveState();
                continue; // if u visited then ignoring it
            }
            this.state.mark[u] = 1; // if not, then visited u vertex
            this.state.traversingList[u] = ++this.state.step;
            // console.log("Length: " + this.states.length);
            this.saveState();
            let getAdjList = this.graph.getChildrenVertices(u);
            for(let v of getAdjList){ // traversing all v neighbors of u vertex 
                if(this.state.mark[v] == 0){
                    this.state.parent[v] = u;
                }
                this.state.stack.push(v); // inserting the v neighbor into stack
                this.saveState();
            }
        }
        this.state.focusOn = 0; // focus on nothing for the last state
    }

    displayParent(){
        for(let i = 1; i <= this.graph.nbVertex; i++)
            console.log('parent[' + i + '] = ' + this.state.parent[i]);
    }

    /**
     * override
     */
    run(source){
        // console.log(this.source);
        this.init(source);
        this.saveState(); // save the first state;
        this.dfs(this.source); // start dfs() method from source vertex
        // this.displayParent();
        this.saveState(); // save the last state
    }
}