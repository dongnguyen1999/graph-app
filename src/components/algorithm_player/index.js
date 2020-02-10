import React, { Component } from "react";
import { TouchableOpacity,Text,View, Dimensions } from "react-native";
import { Icon } from "react-native-elements";
import { styles } from './style';
import DialogInput from 'react-native-dialog-input';
/**
 * This class make a UI component using in GraphView when algorithm running on it
 * @prop {Algorithm} algorithm: a reference of the algorithm running on GraphView
 * @prop {function} rerenderCallback: a callback function from GraphView, the major role of this callback is call the graph rerender
 */
export default class AlgorithmPlayer extends Component{
    constructor(props){
        super(props)
        this.delayTime = 1000;//delay time in millisecond when playing
        this.state = {
            isPlaying: false,// to keep the state whether the algorithm is running automatically or not
            isSleeping: true,// to keep the state system is sleeping during delayTime
        }
        const { algorithm, keyAlgo, rerenderCallback, dataCallback, showResultCallback, removeResultCallback, removeInfoPaneCallback} = this.props;
        this.algorithm = algorithm;
        this.keyAlgo = keyAlgo;
        this.rerenderCallback = rerenderCallback;
        this.showResultCallback = showResultCallback;
        this.removeResultCallback = removeResultCallback;   
        this.removeInfoPaneCallback = removeInfoPaneCallback;
        // this.dataCallback = dataCallback; //R.I.P

        this.state = {
            dialogVisible: false,
            sourceNode: 0,
        }
    }

    /**
     * define what to do whenever the play/stop button was pressed
     * if player is not playing tell it to start playing
     * else stop it
     */
    clickPlayButtonListener(){
        // this.removeInfoPaneCallback();
        // if (!this.state.isPlaying){
        //     if(this.algorithm.statesCursor == 0){
        //         if(this.keyAlgo == "Kruskal"){
        //             this.dataCallback(true);
        //             this.setState({dialogVisible: false, isPlaying: true});
        //         }
        //         else
        //             this.setState({dialogVisible: true});
        //     }
        //     else {
        //         this.dataCallback(true);
        //         this.setState({isPlaying: true});// set to playing
        //     }
        // } 
        // else{
        //     this.dataCallback(false);
        //     this.setState({isPlaying: false});
        // }

        this.removeInfoPaneCallback();
        if (!this.state.isPlaying){
            if(this.algorithm.statesCursor == 0){
                if(this.keyAlgo == "Kruskal"){
                    this.setState({dialogVisible: false, isPlaying: true});
                }
                else{
                    this.setState({dialogVisible: true});
                }
            }
            else {
                this.setState({isPlaying: true});// set to playing
            }
        } else this.setState({isPlaying: false});
    }

    handleGraphViewChanging(){
        const { graphViewIsChanging } = this.props;
        // console.log(graphViewIsChanging);
        if (graphViewIsChanging && this.state.isPlaying){
            this.state.isPlaying = false;
        }
    }

    renderDialog(){
        return(
            <DialogInput 
                isDialogVisible = {this.state.dialogVisible}
                title = {"Notification"}
                message = {"Enter source node: "}
                hintInput = {'1'} 
                submitInput = {(sourceNode) => {
                    this.setState({dialogVisible: false});
                    // console.log(sourceNode);
                    this.algorithm.run(sourceNode);
                    this.algorithm.start();
                    this.setState({isPlaying: true});// set to playing
                    }}
                closeDialog = {() => {false}}
                />
            );
    }

    /**
     * define what to do whenever the next button was pressed
     * call this.algorithm.next(), rerender the graph
     * through false everytime the next() method return undefined
     * require to stop the player automatically
     */
    clickNextButtonListener(){
        if (this.algorithm.next() == undefined) {
            let state = this.algorithm.end();
            this.showResultCallback(state);
            return false;
        }
        this.rerenderCallback();
        this.removeInfoPaneCallback();
    }

    /**
     * define what to do whenever the previous button was pressed
     * call this.algorithm.previous(), rerender the graph
     */
    clickPreviousButtonListener(){
        this.removeResultCallback();
        if (this.algorithm.previous() == undefined) this.algorithm.start();
        this.rerenderCallback();
        this.removeInfoPaneCallback();
    }

    /**
     * define what to do whenever the jump-to-starting button was pressed
     * call this.algorithm.start(), rerender the graph
     */
    clickStartButtonListener(){
        this.removeResultCallback();
        this.algorithm.start();
        this.rerenderCallback();
        this.removeInfoPaneCallback();
    }

    /**
     * define what to do whenever the jump-to-ending button was pressed
     * call this.algorithm.end(), rerender the graph with result graph
     */
    clickEndButtonListener(){
        let state = this.algorithm.end();
        this.showResultCallback(state);
        this.removeInfoPaneCallback();
    }

    /**
     * render the middle button in algorithm player
     * if system is playing show the pause icon
     * else show the play icon
     */
    renderPlayButton(){
        if (this.state.isPlaying){
            return <Icon 
                    name='pause'
                    size={styles.button.size}
                    color={styles.button.color}
                    onPress={() => this.clickPlayButtonListener()}
                />
        } else return <Icon 
                    name='play-arrow'
                    size={styles.button.size}
                    color={styles.button.color}
                    onPress={() => this.clickPlayButtonListener()}
                />
    }

    /**
     * run algorithm automatically by the way call clickNextButtonListener every delay time
     */
    runAlgorithm(){
        console.disableYellowBox = true; // just demiss all warning if everything work fine
        // clickNextButtonListener is a function bind GraphView -> read more in GraphView class    
        // console.log(this.props.graphViewIsChanging);
        this.handleGraphViewChanging();
        if (this.state.isPlaying){
            if (!this.state.isSleeping){// if it is playing and not sleeping
                if (this.clickNextButtonListener() == false) {//click next button
                    // faild in clicking next button 
                    // this is the last state
                    this.state.isPlaying = false;// stop playing
                    // this.dataCallback(false);
                }
                this.setState({isSleeping: true});//tell the system to sleep
            } else {// if it is playing and sleeping
                setTimeout(() => {//delay amount delayTime millisecond and wake the system up
                    this.setState({isSleeping: false})    
                },this.delayTime);
            }
        }
    }

    render(){
        this.runAlgorithm(); // press next button automatically
        return (
            <View style = {styles.body}>
                {this.renderDialog()}
                <Icon 
                    name='skip-previous'
                    size={styles.button.size}
                    color={styles.button.color}
                    onPress={() => this.clickStartButtonListener()}
                />
                <Icon 
                    name='fast-rewind'
                    size={styles.button.size}
                    color={styles.button.color}
                    onPress={() => this.clickPreviousButtonListener()}
                />
                {this.renderPlayButton()}
                <Icon 
                    name='fast-forward'
                    size={styles.button.size}
                    color={styles.button.color}
                    onPress={() => this.clickNextButtonListener()}
                />
                <Icon 
                    name='skip-next'
                    size={styles.button.size}
                    color={styles.button.color}
                    onPress={() => this.clickEndButtonListener()}
                />
            </View>
        );
    }
}
