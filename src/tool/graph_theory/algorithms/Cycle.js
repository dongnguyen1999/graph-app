import Algorithms from "./Algorithm";
const WHITE = 0; // mark a vertex which no visit
const GRAY = 1; // mark a vertex which is visiting
const BLACK = 2; // mark a vertex which visited
/**
 * A graph view
 */
export default class Cycle extends Algorithms{
    constructor(graph, startingNode){
        super(graph); // Calling super.constructor to record parent graph for this algorithm
        this.source = startingNode; // Initializing the source vertex is a startingNode which is passed from outside
        // Initializing first state
        this.setState({
            color: this.initArray(WHITE), // Initializing color of all vertices is white
        });
        this.cycle = 0; // Set a cycle variable is zero, that means no cycle in the graph
        this.parent = this.initArray(0); // An array use for checking cycle of undirected graph
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
     * Function to check a graph which exist a cycle or not by using color the graph combines with DFS algorithm
     * It is used in run() method to record states.
     * @param {Number} source: a source vertex in the graph
     * @param {Number} isDirected: isDirected is true is the graph is directed, false if the graph is undirected
     */
    visit(source,isDirected){
        // checking cycle of directed graph
        if(isDirected == true){
            this.state.color[source] = GRAY; // filling source vertex with gray
            this.saveState();
            let adjList = this.graph.getChildrenVertices(source);
            for(v of adjList){ // travesing all v neighbors of source vertex
                if(this.state.color[v] == GRAY){ // if there is a v vertex is gray
                    this.cycle = 1; // then detected a cycle
                    return; // exit
                }
                if(this.state.color[v] == WHITE) // if v vertex is not visit
                    this.checkCycle(v,true); // recursive call checkCycle() to visit v
            }
            this.state.color[source] = BLACK; // mark source is black
            this.saveState();
        } 
        // checking cycle of undirected graph is almost similar with directed graph
        else{
            this.state.color[source] = GRAY;
            this.saveState();
            let adjList = this.graph.getChildrenVertices(source);
            for(v of adjList){
                if(this.parent[source] == v) // if parent of source vertex is v
                    continue; // then ignore it
                if(this.state.color[v] == GRAY){
                    this.cycle = 1;
                    return;
                }
                if(this.state.color[v] == WHITE){
                    this.parent[v] = source;
                    this.checkCycle(v,false);
                }
            }
            this.state.color[source] = BLACK;
            this.saveState();
        }
    }

    /**
     * Function to return 1 if the graph exists a cycle, otherwise return 0
     */
    checkCycle(){
        return this.cycle;
    }
    
    /**
     * override
     */
    run(){
        this.saveState(); // saving first state;
        this.visit(this.source,false);
        /*
        if(this.checkCycle())
            console.log("cycle");
        else
            console.log("no cycle"); */
    }
}