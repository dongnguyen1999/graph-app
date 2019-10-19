import {colors} from "./color"

/**
 * An object styles for a node.
 * @prop {Object} body: style for node body
 * @prop {Object} label: style for node label
 */
export const styles = {
    normal:{//style for a node that not on focus and not marked yet
        body: {
            fill: colors.normalBackground,
            strokeWidth: 3,
            stroke: colors.normalBorder,
            zIndex: 10,
            position: 'relative'
        },
        label: {
            fontWeight: 'bold',
            fontSize: 20,
        },
    },
    focusOn: {// style for a node that is on focus but not mark yet
        body: {
            fill: colors.focusOnBackground,
            strokeWidth: 3,
            stroke: colors.focusOnBorder,
            zIndex: 10,
            position: 'relative'
        },
        label: {
            fontWeight: 'bold',
            fontSize: 20,
        },
    },
    focusOnMarked: { // style for a node that is on focus and is marked
        body: {
            fill: colors.focusOnMarkedBackground,
            strokeWidth: 3,
            stroke: colors.focusOnMarkedBorder,
            zIndex: 10,
            position: 'relative'
        },
        label: {
            fontWeight: 'bold',
            fontSize: 20,
        },
    }, 
    marked: {
        body: {
            fill: colors.markedBackground,
            strokeWidth: 3,
            stroke: colors.markedBorder,
            zIndex: 10,
            position: 'relative'
        },
        label: {
            fontWeight: 'bold',
            fontSize: 20,
        },
    }
    
    
};
