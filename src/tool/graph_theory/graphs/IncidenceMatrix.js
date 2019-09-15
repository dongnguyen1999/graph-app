import Graph from './Graph';

// Representation Graph by using Incidence Matrix
export default class IncidenceMatrixGraph extends Graph{
    constructor(nbVertex,nbEdge,directed){
        super(nbVertex,nbEdge,directed);
        // create a matrix
        this.incidenceMatrix = [];
        for(let i = 1; i <= nbEdge; i++)
            this.incidenceMatrix[i] = []; 
    }
    // override parent method
    display(){
        let i, j;
        for(i = 1; i <= this.nbVertex; i++){
            line = '';
            for(j = 1; j <= this.nbEdge; j++)
                line += this.incidenceMatrix[i][j] + ' ';
            console.log(line);
        }
    }
    // override parent method
    addEdge(edge){
        super.addEdge(edge);
        let e = edge.e; // edge: e1, e2, e3, ..., em
        let u = edge.u;
        let v = edge.v;
        let w = edge.w | 1;
        if(this.isDirected == false){
            this.incidenceMatrix[u][e] = w;
            this.incidenceMatrix[v][e] = w;
        }
        else
            this.incidenceMatrix[u][e] = w;
    }
    // override parent method
    adjacent(vertex1,vertex2){
        let e;
        for(e = 1; e <= this.nbEdge; e++)
            if(this.incidenceMatrix[vertex1][e] != undefined && this.incidenceMatrix[vertex2][e] != undefined)
                return true;
            return false;
    }
    // override parent method
    getParentVertices(vertex){
        let parentVertices = [];
        let edges = super.getEdges();
        for(let edge of edges)
            if(edge.v == vertex)
                parentVertices.push(edge.u);
        return parentVertices;
    }
    // override parent method
    getChildrenVertices(vertex){
        let childrenVertices = [];
        let edges = super.getEdges();
        for(let edge of edges)
            if(edge.u == vertex)
                childrenVertices.push(edge.v);
        return childrenVertices;
    } 
}
