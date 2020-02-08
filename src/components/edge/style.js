import {StyleSheet, PixelRatio} from "react-native"
import {colors} from "./color"
export const styles = {
    normalEdgeStyle: {
        stroke: colors.normalEdgeColor, // color of border
        strokeWidth: 3, // thickness of the border
        fill: "transparent", // fill color of the line
    },
    focusOnEdgeStyle: {
        stroke: colors.focusOnEdgeColor,
        strokeWidth: 5,
        fill: "transparent",
    },
    focusOnMarkEdgeStyle: {
        stroke: colors.focusOnMarkEdgeColor,
        strokeWidth: 5,
        fill: "transparent",
    },
    markedStyle: {
        stroke: colors.markedEdgeColor,
        strokeWidth: 5,
        fill: "transparent",
    },
};
