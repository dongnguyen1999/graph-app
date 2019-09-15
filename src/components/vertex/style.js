import {colors} from "./color"

/**
 * An object styles for a node.
 * @prop {Object} body: style for node body
 * @prop {Object} label: style for node label
 */
export const styles = {
    normal:{
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
    }
    
    
};
