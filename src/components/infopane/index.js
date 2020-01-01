import React, { Component } from 'react'
import { G, Rect, Text, TSpan} from 'react-native-svg'
import { styles } from './style'
import { object, array } from 'prop-types';
import { d2PixcelUtils } from '../../tool/graph_drawing'

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

    /**
     * Get data from state match this vertex,
     * store those key-value pair in a Map 
     * also compute and return Width and Height of the content (require to draw pane)
     * return {content, width, height}
     */
    prepareContent(){
        const { fontSize, vGap } = styles.text;
        const { padding } = styles.paneBody;
        let content = new Map(); //init empty array
        let width = height = 0; //init width and height of infopane at 0
        const { node, state } = this.props;// to get nodeId and state data
        for (let prop in state) {// loop through props of state
            if (Object.prototype.hasOwnProperty.call(state, prop)) {
                let kvPair = undefined;//init an object to record key-value pair added into content array
                if (typeof state[prop] != "object"){//if prop is a non-object variable 
                    kvPair = {key: prop,value: state[prop]};//record key-value pair
                    // if (prop == "focusOn"){
                    //     kvPair = {key: "customKey",value: state[prop]};//record key-value pair
                    // }
                } else if (Array.isArray(state[prop]) //else if prop is an array of non-object variable
                    && state[prop].length > 1
                    && typeof state[prop][1] != "object"){
                    //get data match with node id and add to content
                    let key = prop + "[" + node.id + "]";
                    kvPair = {key: key,value: state[prop][node.id]};//record key-value pair
                }

                if (kvPair){
                    content.set(kvPair.key, kvPair.value);//add to content
                    //update width and height
                    height++;
                    let line = kvPair.key + ": " + kvPair.value;
                    let textWidth = d2PixcelUtils.measureText(line, fontSize);//compute width of the line in pixcel
                    if (textWidth > width) width = textWidth;
                }
            }
        }
        //scale width and height
        width = width + 2*padding;//add padding
        height = height * (vGap + fontSize) + 2*padding;//scale with vGap+fonsize, add padding
        return {content, width, height}
        
    }

    /**
     * Render an array of react-native-svg-tspans with each key-value pairs from content
     * @param {Map} content: a map contain key-value pairs need to show in pane
     * @param {Array[2]} originCoord: a coordinate stored in an array. Ex: [2,3]
     * return an array of views
     */
    renderTextElements(content, originCoord){
        const { vGap, fontSize } = styles.text;//vGap is the space between 2 lines
        let [x, y] = originCoord;//get original coordinate of text view
        let views = []//init list of Tspan 
        y += fontSize;
        for (let [key, value] of content){// loop through each line
            views.push(
                <TSpan key = { key } x = { x } y = { y }>
                    {key + ": " + value}
                </TSpan>
            );
            y += parseInt(vGap) + parseInt(fontSize);
        }
        return views;
    }

    render(){
        const {node} = this.props;
        let [x,y] = this.computeNode(node);
        let {padding} = styles.paneBody;
        let {content, width, height} = this.prepareContent();
        return (
            <G>
                <Rect x={x} y={y} width={width} height={height} style={styles.paneBody} rx={5}/>
                <Text x={x + padding} y={y + padding} style={styles.text}>
                    {this.renderTextElements(content, [x + padding, y + padding])}
                </Text>
            </G>

        )
    }
}