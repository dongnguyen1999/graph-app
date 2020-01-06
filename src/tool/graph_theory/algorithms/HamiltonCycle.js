import Algorithms from "./Algorithm";
/**
 * A graph view
 */
export default class HamiltonCycle extends Algorithms{
    constructor(graph, startingNode){
        super(graph); // Calling super.constructor to record parent graph for this algorithm
        this.source = startingNode; // Initializing the source vertex is a startingNode which is passed from outside
        // Initializing first state
        this.setState({
            mark: this.initArray(0),
            hamiltonCycle: this.initMatrix(0)
        });
        this.count = 1;
        this.state.mark[1] = 1; // start from vertex 1
    }

    /**
     * return an array is 'nbVertex+1' length, fill with initValue
     * @param {Number} initValue
     */
    initArray(initValue){
        array = [];
        for (var i = 0; i <= this.graph.nbVertex; i++){
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
            let line = [];
            for (let j = 0; j <= this.graph.nbVertex; j++){
                line[j] = initValue;
            }
            matrix.push(line);
        }
        return matrix;
    }

    /**
     * 
     * It is used in run() method to record states.
     * @param {Number} i: try to choose a vertex i in the graph
     */
    hamilton(i){
        this.state.hamiltonCycle[this.count][1] = 1;
        this.saveState();
        for(let v = 1; v <= this.graph.nbVertex; v++){
            let u = this.state.hamiltonCycle[this.count][i-1]; // get vertex u and chech whether u adjacent with v or not
            if(this.state.mark[v] == 0 && (this.graph.adjacent(u,v) != false)){ // an v is visited or not
                this.state.hamiltonCycle[this.count][i] = v; // adding v to hamiltonCycle[count][i]
                if(i < this.graph.nbVertex){
                    this.state.mark[v] = 1; // visit v
                    this.hamilton(i+1); // call recursive with i+1
                    this.state.mark[v] = 0; // reset vertex v is not visit, that means return the first state of v
                }
                else
                    if(this.graph.adjacent(v,1) != false){
                        this.count++; // increasing count by one
                        for(let j = 1; j <= this.graph.nbVertex; j++)
                            this.state.hamiltonCycle[this.count][j] = this.state.hamiltonCycle[this.count-1][j];
                    }
            }
            this.saveState();
        }
    }
    
    /**
     * Function to return an matrix which store the hamilton cycles
     * Ex: there are two hamilton cycles in the graph: 1 2 3 4 5 1 and 1 3 4 2 1
     * At the row have index 0 will store 1 2 3 4 5 1, and index 1 store 1 3 4 2 1
     */
    getHamiltonCycle(){
        return this.hamiltonCycle;
    }

    /**
     * override
     */
    run(){
        this.saveState(); // saving first state;
        this.hamilton(this.source+1); // starting hamilton() method from source+1 vertex
        //this.getHamiltonCycle();
    }
}