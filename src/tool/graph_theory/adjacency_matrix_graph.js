import Graph from "./graph"
export default class AdjacencyMatrixGraph extends Graph {
    constructor(nbVertex, directed){
        super(nbVertex,directed);
        //maxtrix[u][v]: 0 (not exist) , w (weight w)  u,v in [1,nbVertex]
        this.adjacencyMatrix = []; 
        //init matrix (nbVertex X nbVertex), fill with false(0)
        for (var i = 0; i <= nbVertex; i++){
            var line = [];
            for(var j = 0; j <= nbVertex; j++){
                line.push(0);
            }
            this.adjacencyMatrix.push(line);
        }
    }

    //overide parent method
    addEdge(edge){
        super.addEdge(edge);
        var u = edge.u;
        var v = edge.v;
        var w = edge.w || 1; // if the edge has no weight value store true(1)
        this.adjacencyMatrix[u][v] = w;
        if (!super.isDirected()) this.adjacencyMatrix[v][u] = w;
    }

    //overide parent method
    getAdjacentVetexs(vertex){
        var adjacentVerties = [];
        for (var i = 1; i <= super.getNbVertex(); i++){
            if (this.adjacencyMatrix[vertex][i] != 0 
                || this.adjacencyMatrix[i][vertex] != 0) adjacentVerties.push(i);
        }
        return adjacentVerties;
    }

    //overide parent method
    getParentVertices(vertex){
        if (super.isDirected()){
            var parentVertices = [];
            for (var i = 1; i <= super.getNbVertex(); i++){
                if ( this.adjacencyMatrix[i][vertex] != 0) parentVertices.push(i);
            }
            return parentVertices;
        }
        return this.getAdjacentVetexs(vertex);
    }   

    //overide parent method
    getChildrenVertices(vertex){
        if (super.isDirected()){
            var childrenVertices = [];
            for (var i = 1; i <= super.getNbVertex(); i++){
                if ( this.adjacencyMatrix[vertex][i] != 0) childrenVertices.push(i);
            }
            return childrenVertices;
        }
        return this.getAdjacentVetexs(vertex);
    }   

    //overide parent method
    display(){
        super.display();
        for (var i = 1; i <= super.getNbVertex(); i++){
            var line = "";
            for(var j = 1; j <= super.getNbVertex(); j++){
                line += this.adjacencyMatrix[i][j] + "  ";
            }
            console.log(i +": " + line);
        }
    }

  
}
