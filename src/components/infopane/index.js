import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { G, Rect } from 'react-native-svg'
import { styles } from './style'

/**
 * A instance of this class is a view box in GraphView that show information from a vertex
 * 
 */
export default class InfoPane extends Component{

    /**
     * compute the coordinate of the infopane using node position
     * @param {Node} node: an object present a vertex in DraculaGraph
     */
    computeNode(node){
        const [x,y] = node.point;
        return [x+node.radius*Math.sqrt(2)/2, y+node.radius*Math.sqrt(2)/2];
    }
    render(){
        const {node} = this.props;
        let [x,y] = this.computeNode(node);
        return (
            <G>
                <Rect x={x} y={y} width={100} height={100} style={styles.paneBody} rx={5}/>
            </G>

        )
    }
}