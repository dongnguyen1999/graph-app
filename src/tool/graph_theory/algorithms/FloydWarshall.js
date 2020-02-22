import Algorithms from "./Algorithm";
const INFINITY = 9999999999;
/**
 * A graph view
 */
export default class FloydWarshall extends Algorithms{
    init(){
        super.init(); // Calling super.constructor to record parent graph for this algorithm
        // Initializing first state
        this.setState({
            path: [], // An empty array which store the shortest path
            distance : this.initMatrix(INFINITY), // Initializing the distance to all vertices to infinity
            next : this.initMatrix(-1), // 2D-array of vertex indices initialized to -1
            focusOn: 0
        });
        this.config = {
            hidden: ["path", "focusOn"],
            representValue: {
                distance: (state, node, index) => { // config for matrix
                    if(state.distance[index][node.id] == INFINITY) return "oo";
                    return state.distance[index][node.id];
                },
            },
            representName: {
                distance: (state, node, index) => { // config for matrix
                    return "Distance from " + index;
                },
            },
            overrideRow: {
                next: (state, node, index) => {
                    if (state.next[index][node.id] == -1) return "No path from " + index;
                    let pathMess = "Shortest path from " + index + ": ";
                    let path = this.getShortestPath(index, node.id);
                    path.forEach((element, index) => {
                        pathMess += element;
                        if (index < path.length-1) pathMess += "-";
                    });
                    return pathMess;
                }
            }
        }
        this.isNegative = false; // This variable use to check a graph which exists negative cycle or not
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
     * Floyd-Warshall algorithm to find all pair shortest path
     * It is used in run() method to record states.
     */
    floydWarshall(){
        let u, v, k;
        // for each vertex
        for(v = 1; v <= this.graph.nbVertex; v++){
            this.state.distance[v][v] = 0;
            this.state.next[v][v] = v;
        }
        this.saveState();
        // for each edge
        let edgeList = this.graph.getEdges();
        for(edge of edgeList){
            u = edge.u;
            v = edge.v;
            w = edge.w;
            this.state.distance[u][v] = w;
            this.state.next[u][v] = v;
        }
        this.saveState();
        // considering new path is better old path, then updating the old path
        // standard Floyd-Warshall implementation
        for(k = 1; k <= this.graph.nbVertex; k++){
            for(u = 1; u <= this.graph.nbVertex; u++){
                for(v = 1; v <= this.graph.nbVertex; v++){
                    this.state.focusOn = v;
                    this.saveState();
                    if(this.state.distance[u][v] > this.state.distance[u][k] + this.state.distance[k][v]){
                        this.state.distance[u][v] = this.state.distance[u][k] + this.state.distance[k][v];
                        this.state.next[u][v] = this.state.next[u][k];
                        this.state.focusOn = k;
                        this.saveState();
                    }
                }
            }
        }
        this.state.focusOn = 0;
        this.saveState();
        // checking for negative cycles
        for(let u = 1; u <= this.state.nbVertex; u++)
            if(this.state.distance[u][u] < 0){
                this.isNegative = true;
                break;
            }
    }

    /**
     * Function to return true if the graph exists negative cycle, otherwise return false
     */
    checkNegativeCycle(){
        return this.isNegative;
    }

    /**
     * Function to return an array which store the shortest path from source vertex to nbVertex
     */
    getShortestPath(u,v){
        if(this.state.next[u][v] == -1)
            return;
        this.state.path = [u];
        while(u != v){
            u = this.state.next[u][v];
            this.state.path.push(u);
        }
        this.saveState();
        return this.state.path;
    }

    /**
     * override
     */
    run(){
        this.saveState(); // saving first state;
        this.floydWarshall(); // starting floydWarshall() method
        // for(let u = 1; u <= this.graph.nbVertex; u++)
        //     for(let v = 1; v <= this.graph.nbVertex; v++)
        //         console.log(u + " -> " + v + ": " + this.state.distance[u][v]);
        //console.log(this.getShortestPath(1,this.graph.nbVertex));
    }
}