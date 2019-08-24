export default class Graph{
  constructor(nbVertex, directed){
    this.nbVertex = nbVertex; //number of vertices
    this.nbEdge = 0; //number of edges
    this.directed = directed; //true if the graph is directed graph

    //implement more properties in subclass
  }

  initGraphFromString(str){
    var inputs = str.split("\n");
    var firstLine = inputs[0].split(" ");
    var vertex = firstLine[0];
    var edge = firstLine[1];
    for (var i = 1; i < inputs.length; i++){
      var chars = inputs[i].trim().split(" ");
      var u = parseInt(chars[0]);
      var v = parseInt(chars[1]);
      var w = undefined;
      if (chars.length > 2) w = parseInt(chars[2]);
      this.addEdge({u: u, v: v, w: w});
    }
    this.nbVertex = parseInt(vertex);
    this.nbEdge = parseInt(edge);
  }

  display(){
      console.log(this.nbVertex + " | " + this.nbEdge + " | " + this.isDirected());
      //implement in subclass
  }

  addEdge(edge){
    this.nbEdge++;
    //implement in subclass
  }

  getAdjacentVetices(vertex){
    //implement in subclass
    //return array of vertices
  }
  getDegree(vertex){
      return this.getAdjacentVetices(vertex).length;
  }

  //just avaiable for directed graph else return adjacent vertices
  //1 ---> 2: 1 is parent vertex of 2
  getParentVertices(vertex){
    //implement in subclass
    //return array of vertices
  }
  getInDegree(vertex){
      return this.getParentVertices().length;
  }

  //just avaiable for directed graph else return adjacent vertices
  //1 ---> 2: 2 is children vertex of 1
  getChildrenVertices(vertex){
    //implement in subclass
    //return array of vertices
  }
  getOutDegree(vertex){
    return this.getChildrenVertices().length;
  }

  getEdges(){
      //implement in subclass
      //return array if edges array[]: {u,v,w}
  }

  getNbVertex(){
      return this.nbVertex;
  }
  getNbEdge(){
      return this.nbEdge;
  }
  isDirected(){
      return this.directed;
  }

}
