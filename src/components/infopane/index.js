import React, { Component } from 'react'
import { G, Rect, Text, TSpan} from 'react-native-svg'
import { styles } from './style'
import { object, array } from 'prop-types';

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
     * Compute width of a string in pixcel
     * @param {String} string: a string need to be measured
     * @param {Number} fontSize: font size of a string in number
     * return a number: the width of the string in pixcel
     * Base on: https://bl.ocks.org/tophtucker/62f93a4658387bb61e4510c37e2e97cf
     */
    measureText(string, fontSize = 10) {
        const widths = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.2796875,0.2765625,0.3546875,0.5546875,0.5546875,0.8890625,0.665625,0.190625,0.3328125,0.3328125,0.3890625,0.5828125,0.2765625,0.3328125,0.2765625,0.3015625,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.2765625,0.2765625,0.584375,0.5828125,0.584375,0.5546875,1.0140625,0.665625,0.665625,0.721875,0.721875,0.665625,0.609375,0.7765625,0.721875,0.2765625,0.5,0.665625,0.5546875,0.8328125,0.721875,0.7765625,0.665625,0.7765625,0.721875,0.665625,0.609375,0.721875,0.665625,0.94375,0.665625,0.665625,0.609375,0.2765625,0.3546875,0.2765625,0.4765625,0.5546875,0.3328125,0.5546875,0.5546875,0.5,0.5546875,0.5546875,0.2765625,0.5546875,0.5546875,0.221875,0.240625,0.5,0.221875,0.8328125,0.5546875,0.5546875,0.5546875,0.5546875,0.3328125,0.5,0.2765625,0.5546875,0.5,0.721875,0.5,0.5,0.5,0.3546875,0.259375,0.353125,0.5890625]
        const avg = 0.5279276315789471
        return string
          .split('')
          .map(c => c.charCodeAt(0) < widths.length ? widths[c.charCodeAt(0)] : avg)
          .reduce((cur, acc) => acc + cur) * fontSize
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
                    let textWidth = this.measureText(line, fontSize);//compute width of the line in pixcel
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