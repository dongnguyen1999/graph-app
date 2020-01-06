import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { d2PixcelUtils } from '../../tool/graph_drawing'

export default class InfoFrame extends Component{
    /**
     * Function to get data of stack from state in Algorithm class (src/graph_theory/algorithms/Algorithm)
     * Store these data in an array
     * Return this array
     */
    prepareContent(){
        let content = []; // init empty array
        const { state } = this.props; // to get nodeId and state data
        let prop = undefined;
        prop = state.stack || state.queue;
        if(prop){
            for(item of prop){
                // console.log(item);
                if(item != 0)
                    content.push(item);
            }
        }
        return content;   
    }

    /**
     * Render content in the array which return from prepareContent()
     * @param {Map} content: data from stack
     * Return an array of views
     */
    renderTextElements(content){
        let views = [];
        for (item of content){ // loop through each line
            views.push(
                <Text style = {{ fontSize: 20 }}> { item } </Text>
            );
        }
        return views;
    }
    
    render(){
        let content = this.prepareContent();
        return(
            <View style = {styles.frameContainer}>
                <View style = { styles.frame }>
                    { this.renderTextElements(content) }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    frameContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    frame: {
        width: 100,
        height: 200,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: 'pink',
        marginRight: 16,
        marginTop: 20,
        alignItems: 'center'
    }
});