import Algorithms from "./Algorithm";

/**
 * A graph view
 */
export default class Tarjan extends Algorithms{
    constructor(graph, startingNode){
        super(graph); // call super.constructor to record graph for this algorithm
        this.s = startingNode; // this variable need for algorithm but not need to show on GraphView
        this.setState({
            stack: this.initArray(0), // Init stack
            num: this.initArray(-1), // Save index of v vertex
            min_num: this.initArray(9999), // Save index smallest,
            mark: this.initArray(0),
            focusOn: 0,
            counter: 0, // count number of strong connection
            k: 1,
            on_stack: this.initArray(0),
            countNode: 0, // count number of nodes removed from stack,
            parent: this.initArray(0),
        });
        this.config = {
            hidden: ["stack", "mark", "focusOn", "counter", "k", "countNode"]
        };
    }

    /**
     * return an array is 'nbVertex+1' length, fill with initValue
     * @param {Number} initValue
     */
    initArray(initValue){
        let arr = [];
        for (let i = 0; i <= this.graph.nbVertex; i++){
            arr.push(initValue);
        }
        return arr;
    }

    /**
     * Tarjan algorithm to find the strong connection.
     * It is used in run() method to record states.
     * @param {Number} x: a source vertex in the graph
     */
    tarjanSolve(x){//Strong connection
        this.state.num[x] = this.state.k;
        this.state.min_num[x] = this.state.k;
        this.state.focusOn = x;
        this.state.k++;
        this.state.stack.push(x); // push x into stack
        this.state.on_stack[x] = 1; // x is on stack
        this.saveState();
        //Get neighbors of current node
        let neighbors = this.graph.getChildrenVertices(x);
        for(let y of neighbors) { // traversing all v neighbors of u vertex
            if (this.state.num[y] < 0) {
                this.tarjanSolve(y);
                this.state.min_num[x] = Math.min(this.state.min_num[x], this.state.min_num[y]);
                this.state.focusOn = y;
                this.saveState();
            } else if (this.state.on_stack[y]) {
                this.state.min_num[x] = Math.min(this.state.min_num[x], this.state.num[y]);
                this.state.focusOn = y;
                this.saveState();
            }
        }
        // checking where num[x] == minNum[x]
        if(this.state.num[x] === this.state.min_num[x] ){
            this.state.counter++;
            this.saveState();
            let w;
            do{
                w = this.state.stack.pop();
                this.state.on_stack[w] = 0;
                this.state.mark[w] = 1;
                if(x != w) 
                    this.state.countNode++;
                this.saveState();
            } while(w !== x);
        }
    }   
    
    numberOfStrongConnected(){
        return this.state.counter;
    }

    isStrongConnected(){
        if(this.state.countNode == this.graph.nbVertex)
            return true;
        return false;
    }

    displayParent(){
        for(let i = 1; i <= this.graph.nbVertex; i++)
            console.log('parent[' + i + '] = ' + this.state.parent[i]);
    }

    /**
     * override
     */
    run(){
        this.saveState(); // save the first state;
        this.tarjanSolve(this.s); // start tarjanSolve() method from source vertex
        this.state.focusOn = 0; // focus on nothing for the last state
        this.saveState(); // save the last state
        // console.log("Number of strong connected: " + this.numberOfStrongConnected());
        // if(this.isStrongConnected()){
        //     console.log("strong connected");
        // }
        // else console.log("unconnected")
        this.displayParent();
    }
}