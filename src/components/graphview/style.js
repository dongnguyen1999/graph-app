import {StyleSheet, PixelRatio} from "react-native"
import {colors} from "./color"
export const styles = StyleSheet.create({
    graphViewPane: {
        width: 400,
        height: 600,
        backgroundColor: colors.graphViewBackground
    },
    nextButton: {
        marginTop: 10,
        alignSelf: "center",
        width: 100,
        height: 20
      },
});
