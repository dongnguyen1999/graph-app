export default class Graph{
    constructor(nbVertex,nbEdge,directed){
        this.nbVertex = nbVertex; // number of vertex
        this.nbEdge = nbEdge; // number of edge
        this.isDirected = directed; // check whether graph is directed or undirected
        this.edgeList = [];
         // store list of edge that user input
    }

    display(){
        // printing graph
        // implementation in subclass 
    }

    addEdge(edge){
        this.edgeList.push(edge); // add edge: {u:u, v:v, w:w} on graph
        // implementation in subclass
    }

    getEdges(){
        return this.edgeList; // return array if edges array[]: {u,v,w}
    }

    adjacent(vertex1, vertex2){
        // check whether vertex 1 adjacent to vertex 2
    }

    getAdjacentVertices(vertex){
        // return array of vertices
        let adjList = []; // array that represent adjacency list of an vertex 
        for(let i = 1; i <= this.nbVertex; i++)
            if(this.adjacent(vertex,i) == true)
                adjList.push(i);
        return adjList;
    }
    
    getDegree(vertex){
        return this.getAdjacentVertices(vertex).length;
    }

    getParentVertices(vertex){
        // implementation in subclass
        // just available for directed graph then return adjacency vertex 
        // 1 ---> 2: 1 is parent vertex of 2
        // return array of vertex
    }
   
    getChildrenVertices(vertex){
        // implementation in subclass
        // just available for directed graph then return adjacency vertex
        // 1 ---> 2: 2 is children vertex of 1 
        // return array of vertex
    }

    getInDegree(vertex){
        // just available for directed graph
        // return in-degree of a vertex
        if(this.isDirected == true)
            return this.getParentVertices(vertex).length;
        return this.getDegree(vertex);
    }
    
    getOutDegree(vertex){
        // just available for directed graph
        // return out-degree of a vertex
        if(this.isDirected == true)
            return this.getChildrenVertices(vertex).length;
        return this.getDegree(vertex);
    }
}