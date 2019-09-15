import cloneDeep from "lodash/cloneDeep"

/**
 * Instance of classes extended this class can be able to save states of algorithms data in its runtime
 * A state of an algorithm is an object that stores data to control graph drawing on GraphView
 * State can have below props:
 * @prop {Number} focusOn: id of a node that this algorithm is working on
 * @prop {Array<Boolean>} mark: array of boolean bit. mark[i]=true that means node 'i' is marked by the algorithm
 * @prop {Array<Number>} p: array of nodeIds tells that parent of node 'i' is p[i]
 * @prop {Array<Number>} pi: array of numbers shows value at a node, may useful for algorithm
 * @prop {Array<Number>} rank: array of numbers shows rank of a node,use in ranking
 * @prop {Array<Number>} t: array of numbers presents times, use in project planning
 * @prop {Array<Number>} T: array of numbers presents times, use in project planning
 * ...
 * use these props in state when you want to display these informations on GraphView
 */
export default class Algorithm {
    constructor(graph){// an instance of basic graph (src/tool/graph_theory/graphs/Graph) or its subclass
        this.graph = graph; // record graph as property
        this.state = {};// init state as an empty object
        //state can contain props such as pi[], p[], mark[],... 
        //Ex: { focusOn: 1, mark: new Array() }
        this.states = []; //an array save states(State objects) every step in runtime
        this.statesCursor = undefined;//set cursor to nothing
    }

    /**
     * set state using a fully state object or just update some props of state
     * Ex1: setState({ focusOn: 1, mark: new Array(), p: new Array()});
     * Ex2: setState({ focusOn: 3 }); //just update
<<<<<<< HEAD
     * in coding you can assign value directly,
=======
     * in codeing you can assign value directly,
>>>>>>> graphview-edits
     *      like that: this.state.focusOn = 3;
     *                 this.state.mark[3] = true;
     * @param {State} state: a fully state object or an object with some props need to be updated
     * 
     * A state of an algorithm is an object that stores data to control graph drawing on GraphView
     * State can have below props:
     * @prop {Number} focusOn: id of a node that this algorithm is working on
     * @prop {Array<Boolean>} mark: array of boolean bit. mark[i]=true that means node 'i' is marked by the algorithm
     * @prop {Array<Number>} p: array of nodeIds tells that parent of node 'i' is p[i]
     * @prop {Array<Number>} pi: array of numbers shows value at a node, may useful for algorithm
     * @prop {Array<Number>} rank: array of numbers shows rank of a node,use in ranking
     * @prop {Array<Number>} t: array of numbers presents times, use in project planning
     * @prop {Array<Number>} T: array of numbers presents times, use in project planning
<<<<<<< HEAD
     * @prop {Array<Number>} listOfTraverse: luu thu thu duyet cua dinh
     * @prop {Number} step: buoc duyet hien tai
=======
>>>>>>> graphview-edits
     * ...
     * use these props in state when you want to display these informations on GraphView
     */
    setState(state){
        //state can contain props such as pi[], p[], mark[],... 
        //Ex: { focusOn: 1, mark: new Array() }
<<<<<<< HEAD
        for (let prop in state) {
=======
        for (var prop in state) {
>>>>>>> graphview-edits
            if (Object.prototype.hasOwnProperty.call(state, prop)) {
                this.state[prop] = state[prop];
            }
        }
    }

    /**
     * get state pointed to by statesCursor
     * return state object || undefined if cursor is pointing to nothing
     */
    getState(){
        if (this.statesCursor == undefined
            || this.statesCursor < 0 || this.statesCursor >= this.states.length){
                this.statesCursor = undefined;
                return undefined; //cursor is pointing to nothing;
            }
        return this.states[this.statesCursor];
    }

    /**
     * get list of state objects
     */
    getStates(){ 
        return this.states;//array of objects
    }

    /**
     * save runtime State in array of states as a deep clone
     */
    saveState(){
        if (this.state != undefined){
            this.states.push(cloneDeep(this.state));
        }
    }

    /**
     * run an entire algorithms and save states
     * must implement in subclass: run the algorithm and update this.state
     * call saveState() everytime you want to save data as one step that presents in GraphView
     */
    run(){
        //implement in sub class
    }

    /**
     * set states cursor to the first state and return this state
     */
    start(){
        this.statesCursor = 0;
        return this.getState();
    }

    /**
     * set states cursor to the last state and return this state
     */
    end(){
        this.statesCursor = this.states.length-1;
        return this.getState();
    }

    /**
     * set states cursor to the next state and return this state, limit at end
     */
    next(){
        if (this.statesCursor == undefined) return undefined;
        if (this.statesCursor < this.states.length-1) this.statesCursor++;
        return this.getState();
    }

    /**
     * set states cursor to the previous state and return this state, limit at start
     */
    previous(){
        if (this.statesCursor == undefined) return undefined;
        if (this.statesCursor > 0) this.statesCursor--;
        return this.getState();
    }

    /**
     * set states cursor and return this state
     * @param {Number} index: index of state in state array
     *          if index is out of bounds, statesCursor is set to point to nothing
     */
    setCursor(index){
        this.statesCursor = index;
        return this.getState();
    }

<<<<<<< HEAD
} 
=======
}
>>>>>>> graphview-edits
