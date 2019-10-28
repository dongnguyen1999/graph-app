import Algorithms from "./Algorithm";

/**
 * A graph view
 */
export default class Tarjan extends Algorithms{
    constructor(graph, startingNode){
        super(graph); // call super.constructor to record graph for this algorithm
        this.s = startingNode; // this variable need for algorithm but not need to show on GraphView
        this.setState({
            counter: 0, // Counter number of strong connection
            k: 1,
            stack: this.initArray(0), // Init stack
            num: this.initArray(-1), // Save index of v vertex
            minNum: this.initArray(9999), // Save index smallest,
            onStack: this.initArray(0), // Checking x in stack
        });
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
        this.state.minNum[x] = this.state.k;
        this.state.k++;
        this.state.stack.push(x); // push x into stack
        this.state.onStack[x] = 1; // x is on stack
        this.saveState();
        //Get neighbors of current node
        let neighbors = this.graph.getChildrenVertices(x);
        for(let y of neighbors) { // traversing all v neighbors of u vertex
            if (this.state.num[y] < 0) {
                this.tarjanSolve(y);
                this.state.minNum[x] = Math.min(this.state.minNum[x], this.state.minNum[y]);
                this.saveState();
            } else if (this.state.onStack[y]) {
                this.state.minNum[x] = Math.min(this.state.minNum[x], this.state.num[y]);
                this.saveState();
            }
        }
        // checking where num[x] == minNum[x]
        if(this.state.num[x] === this.state.minNum[x] ){
            this.state.counter++;
            this.saveState();
            let w;
            do{
                w = this.state.stack.pop();
                this.state.onStack[w] = 0;
                this.saveState();
            } while(w !== x);
        }
    }   
    
    isStrongConnection(){
        return this.state.counter === 1;
    }
    /**
     * override
     */
    run(){
        this.saveState(); // save first state;
        this.tarjanSolve(this.s); // start tarjanSolve() method from source vertex
        let check = this.isStrongConnection();
        console.log(check);
    }
}