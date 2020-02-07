import Algorithms from "./Algorithm";
const WHITE = -1; // mark a vertex which is no visit
const BLUE = 0; // mark a vertex which visited and highlighted in blue
const RED = 1; // mark a vertex which visited and highlighted in red
/**
 * A graph view
 */
export default class Bigraph extends Algorithms{
    init(source){
        super.init(); // Calling super.constructor to record parent graph for this algorithm
        this.source = source || 1; // Initializing the source vertex is a startingNode which is passed from outside
        // Initializing first state
        this.setState({
            color: this.initArray(WHITE), // Initializing color of all vertices is white
            focusOn: 0,
            mark: this.initArray(0),
            conflict: 0,
        });

        this.config = {
            hidden: ["focusOn", "mark"],
            overrideRow: {
                color: (state, node) => {
                    if(state.color[node.id] == WHITE) return "color["+node.id+"] = -1";
                    if(state.color[node.id] == BLUE) return "color["+node.id+"] = 0";
                    if(state.color[node.id] == RED) return "color["+node.id+"] = 1";
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
     * 
     * It is used in run() method to record states.
     * @param {Number} source: a source vertex in the graph
     * @param {Number} c: a color
     */
    colorize(source,c){
        this.state.color[source] = c; // highlight source vertex in c color
        this.state.mark[source] = 1;
        this.state.focusOn = source;
        this.saveState();
        let adjList = this.graph.getChildrenVertices(source);
        for(v of adjList){ // traversing all v neighbors of source vertex
            if(this.state.color[v] == WHITE) // if v vertex is white
                this.colorize(v,!c); // recursive call colorize() to visit v
            else
                if(this.state.color[v] == c){ // if there is a v vertex is the same color with c
                    this.state.conflict = 1; // there are two adjacent vertices which highlighted the same color
                    return; // exit
                }
        }
    }

    /**
     * If containCycle() function return 1 that means the graph is not bigraph.
     * Otherwise the graph is bigraph.
     */
    containCycle(){
        return this.state.conflict;
    }

    /**
     * This function will return an array which store all red vertices
     */
    getRedVertices(){ 
        let redVertices = [];
        for(let u = 1; u <= this.graph.nbVertex; u++)
            if(this.state.color[u] == RED)
                redVertices.push(u);
        return redVertices;
    }

    /**
     * This function will return an array which store all blue vertices
     */
    getBlueVertices(){
        let blueVertices = [];
        for(let u = 1; u <= this.graph.nbVertex; u++)
            if(this.state.color[u] == BLUE)
                blueVertices.push(u);
        return blueVertices;
    }
    
    /**
     * override
     */
    run(source){
        this.init(source);
        this.saveState(); // saving first state
        this.colorize(this.source,BLUE);
        // if(this.containCycle())
        //     console.log("Not bigraph");
        // else{
        //     console.log("Bigraph");
        //     console.log("RED Vertices: ");
        //     console.log(this.getRedVertices());
        //     console.log("BLUE Vertices: ");
        //     console.log(this.getBlueVertices());
        // }
        this.state.focusOn = 0; // focus on nothing for the last state
        this.saveState(); // saving last state
    }
}