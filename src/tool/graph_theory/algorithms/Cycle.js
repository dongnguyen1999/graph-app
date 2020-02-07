import Algorithms from "./Algorithm";
const WHITE = 0; // mark a vertex which no visit
const GRAY = 1; // mark a vertex which is visiting
const BLACK = 2; // mark a vertex which visited
/**
 * A graph view
 */
export default class Cycle extends Algorithms{
    init(source){
        super.init(); // Calling super.constructor to record parent graph for this algorithm
        this.source = source || 1; // Initializing the source vertex is a startingNode which is passed from outside
        // Initializing first state
        this.setState({
            color: this.initArray(WHITE), // Initializing color of all vertices is white
            cycle: 0, // Set a cycle variable is zero, that means no cycle in the graph
            parent: this.initArray(0), // An array use for checking cycle of undirected graph,
            mark: this.initArray(0),
            focusOn: 0,
        });
        
        this.config = {
            hidden: ["focusOn", "mark"],
            overrideRow: {
                color: (state, node) => {
                    if(state.color[node.id] == WHITE) return "color["+node.id+"] = 0";
                    if(state.color[node.id] == GRAY) return "color["+node.id+"] = 1";
                    if(state.color[node.id] == BLACK) return "color["+node.id+"] = 2";
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
    visit(source){
        // checking cycle of directed graph
        // console.log("Is directed: " + this.graph.isDirected);
        if(this.graph.isDirected){
            this.state.color[source] = GRAY; // filling source vertex with gray
            this.state.mark[source] = 1;
            this.state.focusOn = source;
            this.saveState();
            let adjList = this.graph.getChildrenVertices(source);
            for(v of adjList){ // travesing all v neighbors of source vertex
                if(this.state.color[v] == GRAY){ // if there is a v vertex is gray
                    this.state.cycle = 1; // then detected a cycle
                    return; // exit
                }
                if(this.state.color[v] == WHITE) // if v vertex is not visit
                    this.visit(v,true); // recursive call checkCycle() to visit v
            }
            this.state.color[source] = BLACK; // mark source is black
            this.saveState();
        } 
        // checking cycle of undirected graph is almost similar with directed graph
        else{
            this.state.color[source] = GRAY;
            this.state.mark[source] = 1;
            this.state.focusOn = source;
            this.saveState();
            let adjList = this.graph.getChildrenVertices(source);
            for(v of adjList){
                if(this.state.parent[source] == v) // if parent of source vertex is v
                    continue; // then ignore it
                if(this.state.color[v] == GRAY){
                    this.state.cycle = 1;
                    return;
                }
                if(this.state.color[v] == WHITE){
                    this.state.parent[v] = source;
                    this.visit(v,false);
                }
            }
            this.state.color[source] = BLACK;
            this.saveState();
        }
    }

    /**
     * If this function return 1 that means the graph contain cycle. 
     * Otherwise the graph is not contain cycle.
     */
    containCycle(){
        return this.state.cycle;
    }
    
    /**
     * override
     */
    run(source){
        this.init(source);
        this.saveState(); // saving first state;
        this.visit(this.source);
        
        // if(this.containCycle())
        //     console.log("cycle");
        // else
        //     console.log("no cycle");
        this.state.focusOn = 0; // focus on nothing for the last state
        this.saveState(); // saving last state
    }
}