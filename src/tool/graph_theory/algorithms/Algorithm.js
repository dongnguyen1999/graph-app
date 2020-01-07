import cloneDeep from "lodash/cloneDeep"

/**
 * Instance of classes extended this class can be able to save states of algorithms data in its runtime
 * A state of an algorithm is an object that stores data to control graph drawing on GraphView
 * State can have some props as following:
 * @prop {Number} focusOn: keeping the id of a node that this algorithm is working on
 * @prop {Array<Boolean>} mark: array of boolean bit, mark[i]=true that means node 'i' is marked by the algorithm
 * @prop {Array<Number>} predecessor: array store  predecessor of current node. It useful for finding shortest path algorithms
 * @prop {Array<Number>} distance: array store distance to begin point. It useful for finding shortest path algorithms
 * @prop {Array<Number>} rank: array of numbers shows rank of a node,use in ranking
 * @prop {Array<Number>} t: array of numbers presents times, use in project planning
 * @prop {Array<Number>} T: array of numbers presents times, use in project planning
 * ...
 * using these props in state when you want to display these informations on GraphView
 */
export default class Algorithm {
    constructor(graph){ // an instance of basic graph (src/tool/graph_theory/graphs/Graph) or its subclass
        this.graph = graph; // recording a graph as property
        this.state = {}; // initializing a state as an empty object
        // the state can contain props such as distance[], predecessor[], mark[],... 
        // Ex: { focusOn: 1, mark: new Array() }
        this.states = []; // an array save states(State objects) every step in runtime
        this.config = {
            // Implement in subclass
            /** algorithm.config is an object
             *  @prop {Array<String} hidden an array of strings that are props in State you want to hide
             *  @prop {Object} representName an object contains 'props: representName' pairs
             *      representName is what you want to display instead of name of props
             *      Ex: {
             *          focusOn: "Working at",
             *          mark: (state, node) => { function using data from state and node return a string }
             *      }
             *      InfoPane will show "Working at: ..." instead of "focusOn: ..."
             *      Or pass a function that return a represent name for this props
             */
        }
        this.statesCursor = undefined; // set cursor to nothing
    }

    /**
     * set state using a fully state object or just update some props of state
     * Ex1: setState({ focusOn: 1, mark: new Array(), predecessor: new Array()});
     * Ex2: setState({ focusOn: 3 }); //just update
     * while coding you can assign value directly,
     *      like that: this.state.focusOn = 3;
     *                 this.state.mark[3] = true;
     * @param {State} state: a fully state object or an object with some props need to be updated
     * 
     * A state of an algorithm is an object that stores data to control graph drawing on GraphView
     * State can have some props as following:
     * @prop {Number} focusOn: keeping the id of a node that this algorithm is working on
     * @prop {Array<Boolean>} mark: array of boolean bit, mark[i]=true that means node 'i' is marked by the algorithm
     * @prop {Array<Array<Number>>} next: 2D-array store the next vertex of a vertex on a path. It useful for finding shortest path of Floyd-Warshall algorithm
     * @prop {Array<Number>} predecessor: array store  predecessor of current node. It useful for finding shortest path algorithms
     * @prop {Array<Number>} distance: array store distance to begin point. It useful for finding shortest path algorithms
     * @prop {Array<Number>} path: array store the shortest path of a graph. It useful for finding shortest path algorithms
     * @prop {Array<Number>} rank: array of numbers shows rank of a node,use in ranking
     * @prop {Array<Number>} t: array of numbers presents times, use in project planning
     * @prop {Array<Number>} T: array of numbers presents times, use in project planning
     * @prop {Array<Number>} traversingList: array store the order of traversing of a vertex
     * @prop {Number} step: recording the current step while traversing
     * @prop {Graph} minimumSpanningTree: a graph store a minimum spanning tree
     * @prop {Array<Number>} listTopoSort: array store list of topological sorting
     * @prop {Array<Array<Number>>} flow: a 2D-array store flow in flow network
     * @prop {Array<Array<Number>>} capacity: an array store capacity which is available on all edges in the path
     * @prop {Array<Number>} dir: an array store the direction of an edge (=1: edge, =-1: reverse edge)
     * @prop {Array<Number>} sigma: an array store the amount of maximal flow which can increase
     * @prop {Array<Array<Number>>} hamiltonCycle: 2D-array store all hamilton cycles on a graph (Ex: if a graph exists a cycle 1 2 3 4 5 1, then this cycle will store in this 2D-array)
     * @prop {Array<Number>} color: array store color of a vertex. It useful for detecting a cycle or checking a graph which is a bigraph or not.
     * @prop {Array<Number>} stack: array store all vertices which are not found strong connection
     * @prop {Array<Number>} queue: 
     * @prop {Array<Number>} num: array save index of v vertex
     * @prop {Array<Number>} minNum: array save index smallest
     * @prop {Array<Number>} onStack: array use for checking x in stack
     * @prop {Number} counter: counter number of strong connection
     * @prop {Number} k: index use to assign for num[] of all vertices
     * ...
     * using these props in state when you want to display these informations on GraphView
     */
    setState(state){
        // state can contain some props such as distance[], predecessor[], mark[],... 
        // Ex: { focusOn: 1, mark: new Array() }
        for (let prop in state) {
            if (Object.prototype.hasOwnProperty.call(state, prop)) {
                this.state[prop] = state[prop];
            }
        }
    }

    /**
     * Function to get state pointed to by statesCursor
     * It return a state object or undefined if the cursor is pointing to nothing
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
     * Function to get list of state objects
     */
    getStates(){ 
        return this.states;//array of objects
    }

    /**
     * Function to save runtime State in array of states as a deep clone
     */
    saveState(){
        if (this.state != undefined){
            this.states.push(cloneDeep(this.state));
        }
    }

    /**
     * Function to run an entire algorithms and save states
     * It must implement in subclass: run the algorithm and update this.state
     * Calling saveState() everytime you want to save data as one step that presents in GraphView
     */
    run(){
        // This function will implement in sub class
    }

    /**
     * set states cursor to the first state and return this state
     */
    start(){
        //console.log(this.getState());
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
     * return next state or undefined (if this state is at the end)
     */
    next(){
        if (this.statesCursor == undefined) return undefined;
        if (this.statesCursor < this.states.length-1) this.statesCursor++;
        else this.statesCursor = undefined
        return this.getState();
    }

    /**
     * set states cursor to the previous state and return this state, limit at start
     * return previous state or undefined (if this state is at the first)
     */
    previous(){
        if (this.statesCursor == undefined) return undefined;
        if (this.statesCursor > 0) this.statesCursor--;
        else this.statesCursor = undefined
        return this.getState();
    }

    /**
     * set states cursor and return this state
     * @param {Number} index: index of state in state array
     * if index is out of bounds, statesCursor is set to point to nothing
     */
    setCursor(index){
        this.statesCursor = index;
        return this.getState();
    }
} 
