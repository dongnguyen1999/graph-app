import React, { Component } from 'react'
import { TextInput, StyleSheet } from 'react-native'

// export default class ListItem extends Component {
//
//     render(){
//         const { id,placeholder,onChangeTextListener } = this.props;
//         return (
//             <TextInput
//                 placeholder = {placeholder}
//                 style = {styles.input}
//                 onChangeText = {(text) => {
//                     onChangeTextListener(id,text);
//                 }}
//             />
//         )
//     }
// }
export default function ListItem(props){
    const { id,placeholder,onChangeTextListener } = props;
    return (
        <TextInput
            placeholder = {placeholder}
            style = {styles.input}
            onChangeText = {(text) => {
                onChangeTextListener(id,text);
            }}
        />
    )
}
const styles = StyleSheet.create({
    input:{
        width:200,
        borderWidth:1,
        marginTop:20,
        marginLeft:10,
        height: 40, 
        paddingLeft:10
    },
});
