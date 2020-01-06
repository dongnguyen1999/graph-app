import Algorithms from "./Algorithm";
const INFINITY = 9999999999;
/**
 * A graph view
 */
export default class FordFullkerson extends Algorithms{
    constructor(graph, startingNode, sinkNode){
        super(graph); // Calling super.constructor to record parent graph for this algorithm
        this.s = startingNode;
        this.t = sinkNode;
        this.setState({
            flow: this.initMatrix(0),
            capacity: this.graph.adjacencyMatrix,
            dir: this.initArray(0),
            predecessor: this.initArray(0),
            sigma: this.initArray(0),
            queue: this.initArray(0),
        });
        this.maxFlowValue = 0; // Initializing maximum flow value is zero
        this.S = [];
        this.T = [];
    }

    /**
     * return an array is 'nbVertex+1' length, fill with initValue
     * @param {Number} initValue
     */
    initArray(initValue){
        array = [];
        for (let i = 0; i <= this.graph.nbVertex; i++){
            array.push(initValue);
        }
        return array;
    }

    /**
     * return an  matrix 'nbVertex x nbVertex', fill with initValue
     * @param {Number} initValue 
     */
    initMatrix(initValue){
        matrix = [];
        for(let i = 0; i <= this.graph.nbVertex; i++){
            let line = []
            for (let j = 0; j <= this.graph.nbVertex; j++){
                line[j] = initValue;
            }
            matrix.push(line);
        }
        return matrix;
    }

    /**
     * Function to return the minimum number between two numbers
     * @param {Number} num1 
     * @param {Number} num2 
     */
    min(num1,num2){
        return num1 < num2 ? num1:num2;
    }

    /**
     * Ford-Fullkerson algorithm for computing the maximum flow in a flow network
     * It is used in run() method to record states.
     * @param {Number} s: a source vertex in the graph
     * @param {Number} t: a sink vertex in the graph
     */
    fordFullkerson(s,t){
        while(true){
            let found = 0;
            // delete label of all vertices in the graph
            this.state.dir = this.initArray(0);
            // assign label for s is [+, s, INFINITY]
            this.state.dir[s] = 1;
            this.state.predecessor[s] = s;
            this.state.sigma[s] = INFINITY;
            // push s to the queue
            this.state.queue.push(s); // push s into queue
            this.saveState();
            // finding a path which can increase flow
            while(this.state.queue.length > 0){
                let u = this.state.queue.pop(); // pop u from queue
                for(let v = 1; v <= this.graph.nbVertex; v++){
                    // assign label for directed edges are [+, u, min(sigma(u), capacity[u][v] - flow[u][v])]
                    if(this.state.dir[v] == 0 && this.graph.adjacent(u,v) && this.state.flow[u][v] < this.state.capacity[u][v]){
                        this.state.dir[v] = 1;
                        this.state.predecessor[v] = u;
                        this.state.sigma[v] = this.min(this.state.sigma[u], (this.state.capacity[u][v] - this.state.flow[u][v]));
                        this.state.queue.push(v);
                    }
                    // assign label for inverted edges are [-, u, min(sigma(u), flow[v][u])]
                    if(this.state.dir[v] == 0 && this.graph.adjacent(v,u) && this.state.flow[v][u] > 0){
                        this.state.dir[v] = -1;
                        this.state.predecessor[v] = u;
                        this.state.sigma[v] = this.min(this.state.sigma[u], this.state.flow[v][u]);
                        this.state.queue.push(v);
                    }
                }
                this.saveState();
                // checking whether found the path which can increase flow or not
                if(this.state.dir[t] != 0){
                    found = 1; // if found then set found variable is 1
                    break; // exit while() loop
                }
            }
            // increasing the flow based on the path which found above
            let x, y, sigma;
            if(found == 1){
                x = t;
                sigma = this.state.sigma[t];
                this.maxFlowValue += sigma;
                while(x != s){ // traversing from t -> s
                    y = this.state.predecessor[x];
                    if(this.state.dir[x] > 0) // increasing for all directed edges
                        this.state.flow[y][x] += sigma;
                    else // decreasing for all inverted edges
                        this.state.flow[x][y] -= sigma;
                    x = y;
                }
                this.saveState();
            }
            else
                break;
        }
        // finding minimun cut
        for(let u = 1; u <= this.graph.nbVertex; u++){
            if(this.state.dir[u] != 0)
                this.S.push(u);
            else
                this.T.push(u);
        }
    }
    
    /**
     * Function to get the maximal flow value in flow network
     */
    getMaxFlowVal(){
        return this.maxFlowValue;
    }

    /**
     * override
     */
    run(){
        this.saveState(); // save first state;
        this.fordFullkerson(this.s, this.t); // start fordFullkerson() method from source vertex
        // console.log(this.maxFlowValue);
        // console.log(this.S);
        // console.log(this.T);
    }
}