import Graph from './Graph';

// Representation Graph by using Edge list
export default class EdgeListGraph extends Graph{
    constructor(nbVertex,nbEdge,directed){
        super(nbVertex,nbEdge,directed);
        this.listOfEdges = []; // array that store edges {u, v, w}
    }
    // override parent method
    addEdge(edge){
        super.addEdge(edge);
        let u = edge.u;
        let v = edge.v;
        let w = edge.w;
        this.listOfEdges.push({u:u,v:v,w:w});
    }
    // override parent method
    display(){
        console.log(this.listOfEdges);
    }
    // override parent method
    adjacent(vertex1, vertex2){
        let edges = super.getEdges();
        for(var edge of edges){
            if((edge.u == vertex1 && edge.v == vertex2) || (edge.u == vertex2 && edge.v == vertex1))
                return true;
        }
        return false;
    }
    // override parent method
    getParentVertices(vertex){
        let parentVertices = [];
        let edges = super.getEdges();
        for(let edge of edges){
            if(edge.v == vertex)
                parentVertices.push(edge.u);
        }
        return parentVertices;
    }
    // override parent method
    getChildrenVertices(vertex){
        let childVertices = [];
        let edges = super.getEdges();
        for(let edge of edges){
            if(edge.u == vertex)
                childVertices.push(edge.v);
        }
        return childVertices;
    }
}