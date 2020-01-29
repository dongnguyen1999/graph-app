
export default class Stack {
    constructor(){
        this.init();
    }

    init(){
        this.values = []; // store data (nodeId) that are everything has ever been inserted to the storage
        this.inStorage = []; // store indices of this.values 's elements, they are in the stack => array of indices
    }

    empty(){
        return this.inStorage.length == 0;
    }

    push(value){
        this.values.push(parseInt(value));
        this.inStorage.push(this.values.length-1);
    }

    pop(){
        return this.values[this.inStorage.pop()];
    }
}