import Algorithms from "./Algorithm";

/**
 * A graph view
 */
export default class Dijkstra extends Algorithms{
    constructor(graph, startingNode){
        super(graph); // call super.constructor to record graph for this algorithm
        this.s = startingNode; // this variable need for algorithm but not need to show on GraphView
        this.setState({
            distance : this.initArray(9999), // shortest path from s to i
            predecessor: this.initArray(0), // Vertex before i
            mark: this.initArray(0),
            path: [] // An empty array which store the shortest path
        });
        //console.log(this.graph.nbVertex)
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
     * Dijkstra algorithm to find the shortest path between a given source vertex and all other vertices in the graph.
     * It is used in run() method to record states.
     * @param {Number} s: a source vertex in the graph
     */
    dijkstraSolve(s){
        const INF = 9999;
        this.state.predecessor[s] = -1;
        this.state.distance[s] = 0;
        this.saveState();
        const vertex = this.graph.nbVertex;
        let i;
        //Get matrix
        const _matrix = this.graph.adjacencyMatrix;
        for(let it = 1; it < vertex; it++){
            let minDistance = INF;
            for(let j = 1; j <= vertex; j++){
            // finding a vertex which do not visit and distance < minDistance
                if(this.state.mark[j] === 0 && this.state.distance[j] < minDistance){
                    minDistance = this.state.distance[j]; // reset minDistance 
                    i = j; // saving this vertex
                }
            }
            this.state.mark[i] = 1; // visit i
            this.saveState();
            // considering new path is better old path, then updating the old path
            for(let j = 1; j <= vertex; j++){
                if(_matrix[i][j] !== 0 && this.state.mark[j] === 0){
                    if(this.state.distance[i] + _matrix[i][j] < this.state.distance[j]){
                        this.state.distance[j] = this.state.distance[i] + _matrix[i][j];
                        this.state.predecessor[j] = i;
                        this.saveState();
                    }
                }
            }
        }
    }

     /**
     * Function to return an array which store the shortest path from source vertex to nbVertex
     */
    getShortestPath(){
        let current = this.graph.nbVertex;
        while(current != -1){
            this.state.path.unshift(current);
            current = this.state.predecessor[current];
        }
        this.saveState();
        return this.state.path;
    }

    /**
     * override
     */
    run(){
        this.saveState();//save first state;
        this.dijkstraSolve(this.s); //start dijkstraSolve method from source vertex
        // let path = this.getShortestPath();
        // for(let i of path){
        //     console.log(i);
        // }
        //console.log(this.state.distance);
    }
}