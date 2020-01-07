import {StyleSheet, PixelRatio} from "react-native"
import {colors} from "./color"
export const styles = StyleSheet.create({
    graphViewPane: {
        backgroundColor: colors.graphViewBackground
    },
    resultTextContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center'
    },
    resultTextView: {
        color: colors.resultIntroText,
        fontSize: 20,
        alignItems: 'center'
    }
});
