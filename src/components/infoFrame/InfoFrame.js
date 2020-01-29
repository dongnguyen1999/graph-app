import React, { Component } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { d2PixcelUtils } from '../../tool/graph_drawing'

export default class InfoFrame extends Component{
    shouldComponentUpdate(newProps){
        const currentState = this.props.state;
        const newState = newProps.state;
        let currentStorage = currentState.stack || currentState.queue;
        let newStorage = newState.stack || newState.queue;
        return currentStorage.inStorage.length != newStorage.inStorage.length;
    }

    /**
     * Function to get data of stack from state in Algorithm class (src/graph_theory/algorithms/Algorithm)
     * Get data from storage and keep which element is currently in storage, which one is deleted
     * Compute height of content
     * Return an object that wraps values, inStorage and height
     */
    prepareContent(){
        let vGap = 5;
        let rowHeight = styles.elements.fontSize + vGap;
        const MAX_HEIGHT = 500;
        let values = []; // init empty array
        let inStorage = [];
        let height = 0; // init height counter
        const { state } = this.props; // to get nodeId and state data

        //get data from state.stack || state.queue
        let storage = undefined;
        storage = state.stack || state.queue;
        // console.log(storage.values);
        // console.log(storage.inStack);
        if(storage){
            values = storage.values;
            height = values.length * rowHeight;
            if (height)  height += vGap;
            inStorage = storage.inStorage;
        }
        return {values,inStorage,height};
    }

    /**
     * Render content in the array which return from prepareContent()
     * @param {Map} content: data from stack
     * Return an array of views
     */
    renderTextElements(values, inStorage){
        let views = [];
        for (let i = 0; i < values.length; i++){ // loop through each line
            let view = <Text style = {styles.elements}> { values[i] } </Text>
            if (!inStorage.includes(i)){// index i is not in storage
                view = <Text style = { [styles.elements, styles.deletedElements] }> { values[i] } </Text>
            }
            views.push(view);
        }
        return views;
    }
    
    render(){
        // console.log("rerender infoframe");
        let content = this.prepareContent();
        if (content.height == 0) return(<View></View>);
        return(
            <View style = {styles.frameContainer}>
                <View style = { [styles.frame, {height: content.height}] }>
                    { this.renderTextElements(content.values, content.inStorage) }
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
        width: 70,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: 'pink',
        marginRight: 16,
        marginTop: 20,
        alignItems: 'center'
    },
    elements: {
        fontSize: 15,
    },
    deletedElements: {
        textDecorationLine: "line-through",
    }
});