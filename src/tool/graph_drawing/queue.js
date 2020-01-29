
export default class Queue {
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

    enqueue(value){
        this.values.push(parseInt(value));
        this.inStorage.push(this.values.length-1);
    }

    dequeue(){
        return this.values[this.inStorage.shift()];
    }
}