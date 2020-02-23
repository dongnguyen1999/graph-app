import Algorithms from "./Algorithm";
/**
 * A graph view
 */
export default class TopologicalSort extends Algorithms{
    init(){
        super.init(); // Calling super.constructor to record parent graph for this algorithm
        this.setState({
            focusOn: 0, // The first state have no node in order to focus on it so initialize focusOn of first state is zero
            // step: 0, // Initializing the first step is zero
            rank: this.initArray(0), // Initializing rank of all vertices is zero
            listTopoSort: [] // Initializing all element in list of topological sorting is zero
        });
        this.config = {
            hidden: ["focusOn"],
            representName: {
                listTopoSort: "Topo Order:"
            },
            representValue: {
                listTopoSort: (state, node) => {
                    let value = undefined;
                    for (let i = 0; i < state.listTopoSort.length; i++){
                        if (!value) value = state.listTopoSort[i];
                        else value += state.listTopoSort[i];
                        if (i < state.listTopoSort.length-1) value += "-"
                    }
                    if (!value) return "unknown"
                    return value;
                }
            }
        }
    }

    getResultGraph(){
        let thisGraph = this.graph;
        let state = this.getState();
        thisGraph.UIConfig = {
            sortRank: {
                option: true,
                rank: state.rank
            }
        }
        return thisGraph;
    }

    /**
     * return an array is 'nbVertex+1' length, fill with initValue
     * @param {Number} initValue
     */
    initArray(initValue){
        array = [];
        for (var i = 0; i <= this.graph.nbVertex+1; i++){
            array.push(initValue);
        }
        return array;
    }

    /**
     * Topological sorting algorithm for finding topo sort and rank of each vertex on a graph.
     * It is used in run() method to record states.
     */
    toposort(){
        let d = []; // Store degree in of all vertices
        let S1 = []; // Set of all vertices with no incoming edge
        for(let i = 1; i <= this.graph.nbVertex; i++){
            d[i] = this.graph.getInDegree(i);
            if(d[i] == 0)
                S1.push(i);
        }
        let k = 0; // repeat step
        while(S1.length > 0){
            // console.log(S1);
            let S2 = []; //  Empty list that will contain all vertices with no incoming edge in step k
            for(let i = 0; i < S1.length; i++){
                let u = S1[i]; // get the vertices u in S1
                // console.log(u);
                this.state.focusOn = u;
                this.state.rank[u] = k; // ranking for the vertex u
                this.state.listTopoSort.push(u); // pushing the vertex u into listTopoSort
                this.saveState();
                let getAdjList = this.graph.getChildrenVertices(u);
                for(let v of getAdjList){ // traversing all neighbors v of the vertex u
                    d[v]--; // decreasing the degree in of v by 1
                    if(d[v] == 0) // if degree in of a vertex v is zero
                        S2.push(v); // then push it into S2
                }
            }
            k++; // increasing repeat step by 1
            S1 = S2; // copy S2 to S1 
        }
        // console.log(this.state.listTopoSort);
        this.state.focusOn = 0;
    }


    /**
     * override
     */
    run(){
        this.init();
        this.saveState(); // save first state;
        this.toposort(); // start toposort() method
        this.saveState();
    }
}