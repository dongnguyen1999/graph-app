import Graph from './Graph';

// Representation Graph by using Adjacency Matrix
export default class AdjacencyMatrixGraph extends Graph{
    constructor(nbVertex,nbEdge,directed){
        super(nbVertex,nbEdge,directed);
        // create a matrix
        this.adjacencyMatrix = [];
        for(let i = 1; i <= nbVertex; i++){
            var line = []
            for (let j = 1; j <= nbVertex; j++){
                line[j] = 0;
            }
            this.adjacencyMatrix[i] = line;
        }
    }

    // override parent method
    display(){
        let i, j;
        for(i = 1; i <= this.nbVertex; i++){
            line = '';
            for(j = 1; j <= this.nbVertex; j++)
                line += this.adjacencyMatrix[i][j] + ' ';
            console.log(line);
        }
    }
    // override parent method
    addEdge(edge){
        super.addEdge(edge);
        let u = edge.u;
        let v = edge.v;
        let w = edge.w || 1;
        if(this.isDirected == false){
            this.adjacencyMatrix[u][v] = w;
            this.adjacencyMatrix[v][u] = w;
        } 
        else
            this.adjacencyMatrix[u][v] = w;
    }
    // override parent method
    adjacent(vertex1, vertex2){
        return this.adjacencyMatrix[vertex1][vertex2] != 0;
    }
    // override parent method
    getParentVertices(vertex){
        if(this.isDirected == true){
            let parentVertices = [];
            for(let i = 1; i <= this.nbVertex; i++){
                if(this.adjacent(i,vertex) == true)
                    parentVertices.push(i);
            }
            return parentVertices;   
        }
        return this.getAdjacentVertices(vertex);
    }
    // override parent method
    getChildrenVertices(vertex){
       return this.getAdjacentVertices(vertex);
    }
}

