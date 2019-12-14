import React, { Component } from "react"
import { TouchableOpacity,Text,View } from "react-native"
import { Icon } from "react-native-elements"
import { styles } from "./style"

export default class AlgorithmPlayer extends Component{
    constructor(props){
        super(props)
        this.delayTime = 2000;//delay time in millisecond
        this.state = {
            isPlaying: false,// to keep the state whether the algorithm is running automatically or not
            isSleeping: true,// to keep the state system is sleeping during delayTime
        }
    }

    /**
     * define what to do whenever the play/stop button was pressed
     * if player is not playing tell it to start playing
     * else stop it
     */
    clickPlayButtonListener(){
        if (!this.state.isPlaying){
            this.setState({isPlaying: true})
        } else this.setState({isPlaying: false})
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
                    color='black'
                    size={60}
                    onPress={() => this.clickPlayButtonListener()}
                />
        } else return <Icon 
                    name='play-arrow'
                    color='black'
                    size={60}
                    onPress={() => this.clickPlayButtonListener()}
                />
    }



    /**
     * run algorithm automatically by the way call clickNextButtonListener every delay time
     */
    runAlgorithm(){
        console.disableYellowBox = true;//just demiss all warning =))
            //if everything work fine
        const { clickNextButton } = this.props;
        // clickNextButtonListener is a function bind GraphView -> read more in GraphView class
        if (this.state.isPlaying){
            if (!this.state.isSleeping){// if it is playing and not sleeping
                if (clickNextButton() == false) this.state.isPlaying = false;//click next button
                this.setState({isSleeping: true});//tell the system to sleep
            } else {// if it is playing and sleeping
                setTimeout(() => {//delay amount delayTime millisecond and wake the system up
                    this.setState({isSleeping: false})    
                },this.delayTime);
            }
        }
    }

    render(){
        const { clickNextButton, clickPreviousButton, clickStartButton, clickEndButton } = this.props;
        this.runAlgorithm();//press next button automatically
        return (
            <View
                style = {styles.playerBody}
                >
                <Icon 
                    name='skip-previous'
                    color='black'
                    size={60}
                    onPress={() => clickStartButton()}
                />
                <Icon 
                    name='fast-rewind'
                    color='black'
                    size={60}
                    onPress={() => clickPreviousButton()}
                />
                {this.renderPlayButton()}
                <Icon 
                    name='fast-forward'
                    color='black'
                    size={60}
                    onPress={() => clickNextButton()}
                />
                <Icon 
                    name='skip-next'
                    color='black'
                    size={60}
                    onPress={() => clickEndButton()}
                />
            </View>
        );
    }
}
