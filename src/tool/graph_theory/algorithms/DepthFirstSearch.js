import Algorithms from "./Algorithm";

/**
 * A graph view
 */
export default class DepthFirstSearch extends Algorithms{
    constructor(graph, startingNode){
        super(graph);// call super.constructor to record graph for this algorithm
        this.s = startingNode;//this variable need for algorithm but not need to show on GraphView
        this.setState({
            mark: this.initArray(0),//require for coloring marked node on GraphView
            focusOn: 0,//require for coloring focusing node on GraphView
            step: 0,//require for counter steps of travelling, info need to show
            listOfTraverse: this.initArray(0)//require for keeping the order of travelling, info need to show
        });
    }

    /**
     * return an array is 'nbVertex+1' length, fill with initValue
     * @param {Number} initValue
     */
    initArray(initValue){
        array = [];
        for (var i = 1; i <= this.graph.nbVertex; i++){
            array.push(initValue);
        }
        return array;
    }

    /**
     * recursive visit a node, use in run() method to record states
     * @param {Number} u: id of the node that will be visit soon
     */
    dfs(s){
        this.state.focusOn = s;
        this.saveState();
        let stack = [0];
        let top = 0;
        stack[top++] = s; // push s into Stack
        this.saveState();
        while(top != 0){
            let u = stack[--top];
            if(this.state.mark[u] == 1)
                continue;
            this.state.mark[u] = 1;
            this.state.listOfTraverse[u] = ++this.state.step;
            this.saveState();
            let getAdjList = this.graph.getChildrenVertices(u);
            for(let v of getAdjList){
                stack[top++] = v;
            }
        }
    }

    /**
     * override
     */
    run(){
        this.saveState();//save first state;
        this.dfs(this.s);//start recursive method from node 's'
    }
}