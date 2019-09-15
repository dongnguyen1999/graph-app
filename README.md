##Requirements

* Install Node
* Install expo

##Development

* npm install
* Fix file /node_modules/graphdracula/lib/index.js
    ``` 
  'use strict';
        
        // Core
        var dracula = require('./dracula').default;
        
        // Layouts
        var spring = require('./layout/spring').default;
        var orderedTree = require('./layout/ordered_tree').default;
        var tournamentTree = require('./layout/tournament_tree').default;
        
        // Renderers
        var renderer = require('./renderer/renderer').default;
        
        module.exports.DraculaGraph = dracula;
        
        module.exports.Layout = {
            OrderedTree: orderedTree,
            Spring: spring,
            TournamentTree: tournamentTree
        };
        
        module.exports.Renderer = renderer;
  ```
* Delete file /node_modules/graphdracula/lib/renderer/raphael.js
* npm start
### src/tool/graph_drawing
```drawGraph (node) {
    node.connections = []; // Init connections is array
    //Add padding for graph
      if(node.point[0] + this.radius > this.widthPhone){
          node.point[0] -= this.radius*2;
      }
      if(node.point[0] < this.radius){
          node.point[0] += this.radius*2;
      }
      if(node.point[1] + this.radius > this.heightPhone){
          node.point[1] -= this.radius*2;
      }
      if(node.point[1] < this.radius){
          node.point[1] += this.radius*2;
      }
    //Structure of node variables
        node = {
            connections: [],
            edges: Array [
                attraction : 1,
                source : [Circular],
                style : {Object},
                target : {
                    edges: {...},
                    id: ...,
                    layoutForceX: 0,
                    layoutForceY: 0,
                    layoutPosX: -1,123,
                    layoutPosY: 1.03846 
                }
            ],
            id : 4 //id of node
            layoutForceX: 0,
            layoutForceY : 0,
            layoutPosX: 1.46,
            layoutPosY: 0.453
            point: [
                380.
                313
            ]   
        }//
    node.shape = true; // Tick node drew
    this.nodes.set(node.id, node); // set node.id is name of per node
}
drawEdge(edge) {
    //edge : [
            attraction: 1,
            shape: true,
            source: {
                connections: [
                    "1-2", //edge.source.id+"-"+edge.target.id
                    "1-3",
                    "1-4"
                ],
                edges: [
                    [Circular],{
                       attraction: 1,
                       source: [Circular].
                       style: Object { },
                       target: {
                            connections: [],
                            edges: []     
                       }
                    },
                    id: ...,
                    layoutForceX: 0,
                    layoutForceY: 0,
                    layoutPosX: -0.2985,
                    layoutPosY: -1.500,
                    point: [
                        138,20
                    ]
                    shape: true
                ]
            }
    ]//
    if (!edge.shape) { //If shape is not draw
        edge.shape = true ;
        let key = edge.source.id+"-"+edge.target.id;
        // edge.source.id is position start
        // edge.target.id is position end
        this.edges.set(key, edge);// Push into connections array
        key (Ex: "1-2", "1-3");
        edge.source.connections.push(key);
        edge.target.connections.push(key);
        console.log('drawing an edge');
   }
}
```
## Grapview (/src/components/graphview/index.js)
```
    constructor(props){
        let layout = new Layout.Spring(graph);
        layout.layout();// Create layout graph
        //Create Graph graph, width = width-(2*nodeRadius), height= height-(2*nodeRadius)
        //Radius = nodeRadius // 
        const renderer = new GraphRenderer(graph, width-(2*nodeRadius), height-(2*nodeRadius), nodeRadius);
        renderer.draw(); //Draw graph
    }
    updateEdges(node,connection){ //connection is id of an edge
        var points = connection.split("-");//conection: "sourceNodeId-targetNodeId"
        // Split (Ex: 1-2 => 1 2, 1-> source(position start), 2 -> target (position end));
        let [source, target] = points; //Destructruring
        [Destructruring](https://viblo.asia/p/destructuring-assignment-in-es6-xlbRBNQgRDM)
        var edge = this.state.edges.get(connection);
        if (node.id === source) edge.source = node;
        else if (node.id == target) edge.target = node;
        this.setState({
            edges: this.state.edges.set(connection, edge),
            views: this.rerenderEdge(connection,edge)
        });
    }
    validatePoint(point){ // Check drag is overflowing
            var {width, height, nodeRadius } = this.props;
            let [x,y] = point;
            if (x < nodeRadius) x = nodeRadius;
            if (y < nodeRadius) y = nodeRadius;
            if (x > width-nodeRadius) x = width-nodeRadius;
            if (y > height-nodeRadius) y = height-nodeRadius;
            return [x,y];
        }

    rerenderNode(id, node){// Only render node with key is id
            return this.state.views.set(id,
                <Vertex
                    key={id}
                    node={node}
                    r={this.props.nodeRadius}
                    updatingCallback={this.refresh}
                >{id}</Vertex>
            );
        }
    rerenderEdge(id, edge){// Only render node edge key is id
            return this.state.views.set(id,
                <Edge
                    key={id}
                    source={edge.source}
                    target={edge.target}
                    r={this.props.nodeRadius}
                />
            );
      }

     renderGraph(nodes, edges){
        let views = new Map(); //Init views

        for (let [id, node] of nodes){ //Init to draw nodes with react-native-svg
            views.set(id,
                <Vertex
                    key={id}
                    node={node}
                    r={this.props.nodeRadius}
                    updatingCallback={this.refresh.bind(this)}>
                    {id}
                </Vertex>
            );
        }

        for (let [id,edge] of edges){//Init to draw edges with react-native-svg
            views.set(id,
                <Edge
                    key={id}
                    source={edge.source}
                    target={edge.target}
                    r={this.props.nodeRadius}
                />
            );
        }
        return views;
    }
    applyViews(){
        let edges = []; 
        let nodes = [];
        for (let [key, view] of this.state.views){
            if (key.includes("-"))
                edges.push(view);
            else nodes.push(view);
        }
        return edges.concat(nodes); //Concat edges array with nodes array
        // If reverse nodes.concat(edges), edges will overlap nodes
    }
    
```
