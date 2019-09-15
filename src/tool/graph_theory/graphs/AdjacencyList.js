import Graph from './Graph';

// Representation Graph by using Adjacency List
export default class AdjacencyListGraph extends Graph{
    constructor(nbVertex,nbEdge,directed){
        super(nbVertex,nbEdge,directed);
        this.adjList = new Map();
        for(let i = 1; i <= this.nbVertex; i++)
            this.adjList.set(i,[]);
    }
    // override parent method
    addEdge(edge){
        super.addEdge(edge);
        let u = edge.u;
        let v = edge.v;
        let w = edge.w | 1;
        if(this.isDirected == false){
            this.adjList.get(u).push(v);
            this.adjList.get(v).push(u);
        }
        else{
            this.adjList.get(u).push(v);
        }
    }
    // override parent method
    display(){
        console.log(this.adjList);
    }
    // override parent method
    adjacent(vertex1, vertex2){
        let edges = super.getEdges();
        for(edge of edges){
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
        let childrenVertices = [];
        let edges = super.getEdges();
        for(let edge of edges){
            if(edge.u == vertex)
                childrenVertices.push(edge.v);
        }
        return childrenVertices;
    }
}