import {StyleSheet, PixelRatio} from "react-native"
import {colors} from "./color"
export const styles = StyleSheet.create({
    graphViewPane: {
        
        backgroundColor: colors.graphViewBackground
    },
    nextButton: {
        borderWidth:1,
        backgroundColor:'grey',
        width:100,
        alignItems:'center',
        marginTop:10,
        marginLeft:10
      },
});
