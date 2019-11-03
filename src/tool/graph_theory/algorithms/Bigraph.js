import Algorithms from "./Algorithm";
import { ThemeConsumer } from "react-native-elements";
const WHITE = -1; // mark a vertex which is no visit
const BLUE = 0; // mark a vertex which visited and highlighted in blue
const RED = 1; // mark a vertex which visited and highlighted in red
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
        this.conflict = 0;
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
        this.saveState();
        let adjList = this.graph.getChildrenVertices(source);
        for(v of adjList){ // travesing all v neighbors of source vertex
            if(this.state.color[v] == WHITE) // if v vertex is white
                this.checkBigraph(v,!c); // recursive call colorize() to visit v
            else
                if(this.state.color[v] == c){ // if there is a v vertex is the same color with c
                    this.conflict = 1; // there are two adjacent vertices which highlighted the same color
                    return; // exit
                }
        }
    }

    /**
     * Function to return 1 if a graph is not a bigraph, otherwise return 0
     */
    checkBigraph(){
        return this.conflict;
    }
    
    /**
     * override
     */
    run(){
        this.saveState(); // saving first state;
        this.colorize(this.source,BLUE);
        /*
        if(this.conflict)
            console.log("no");
        else
            console.log("yes");
        console.log("RED");
        for(let u = 1; u <= this.graph.nbVertex; u++)
            if(this.state.color[u] == RED)
                console.log(u); */
    }
}