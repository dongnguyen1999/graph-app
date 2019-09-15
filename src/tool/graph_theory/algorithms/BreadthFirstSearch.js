import Algorithms from "./Algorithm";

/**
 * A graph view
 */
export default class BreadthFirstSearch extends Algorithms{
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
    bfs(s){
        this.state.focusOn = s;
        this.saveState();
        let queue = [];
        let front = 0, rear = 0;
        queue[rear++] = s; // push s into Queue
        this.state.mark[s] = 1; // visited u
        this.state.listOfTraverse[s] = ++this.state.step;
        this.saveState();
        while(front < rear){
            let u = queue[front++];
            let getAdjList = this.graph.getChildrenVertices(u);
            for(let v of getAdjList){
                if(this.state.mark[v] != 1){
                    this.state.mark[v] = 1;
                    queue[rear++] = v;
                    this.state.listOfTraverse[v] = ++this.state.step;
                    this.saveState();
                }
            }
        }
    }

    /**
     * override
     */
    run(){
        this.saveState();//save first state;
        this.bfs(this.s);//start recursive method from node 's'
    }
}