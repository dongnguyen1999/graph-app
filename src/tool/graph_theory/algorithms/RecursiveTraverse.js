import Algorithms from "./Algorithm";

/**
 * A graph view
 */
export default class RecursiveTraverse extends Algorithms{
    constructor(graph, startingNode){
        super(graph);// call super.constructor to record graph for this algorithm
        this.s = startingNode;//this variable need for algorithm but not need to show on GraphView
        this.setState({
            mark: this.initArray(0),//require for coloring marked node on GraphView
            focusOn: 0,//require for coloring focusing node on GraphView
            k: 0,//require for counter steps of travelling, info need to show
            n: this.initArray(0)//require for keeping the order of travelling, info need to show
        });
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
     * recursive visit a node, use in run() method to record states
     * @param {Number} u: id of the node that will be visit soon
     */
    recursive(u){
        this.state.focusOn = u;//set working on node u;
        this.saveState();//save the state when first jump to new node
        if (this.state.mark[u]) return;//do nothing if node is marked 
        //visit and mark u
        this.state.mark[u] = 1;
        this.state.n[u] = ++this.state.k;
        this.saveState();//save the state when marking the new node
        for (var v of this.graph.getChildrenVertices(u)){//loop through children of u
            this.recursive(v);
        }
        this.state.focusOn = u;//set jump back parent node
        this.saveState();//save the state when jumping back parent
    }

    /**
     * override
     */
    run(){
        this.saveState();//save first state;
        this.recursive(this.s);//start recursive method from node 's'
    }
}