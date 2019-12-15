import {createStackNavigator, createAppContainer} from 'react-navigation';
import {Test, DrawGraph, InputGraph, StringInputGraph,Tutorial } from "./src/components"
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs"



/**
 * Create navigation screen for 2 screens Graph Drawing and Tutorial
 */
var executeAlgorithmScreen = createMaterialBottomTabNavigator(
  {
    Drawing: { screen: DrawGraph },
    Tutorial: { screen: Tutorial },
  },
  {//style the MaterialBottomTabNavigator
    initialRouteName: 'Drawing',
    activeColor: '#004ede',
    inactiveColor: '#858585',
    barStyle: { backgroundColor: '#b3b3b3' },
  }
)

const MainNavigator = createStackNavigator({
  // First: {screen: Test},
  // Input: {screen: InputGraph},
  // Input: {screen: StringInputGraph},
  // Drawing: {screen: DrawGraph},
  ExecuteAlgorithm: { // this element will show a MaterialBottomTabNavigator
    screen: executeAlgorithmScreen,// the prepared sceen
    navigationOptions: ( {navigation} ) => {//function to set the header title automatically
      let tabTitle = ['Graph Drawing', 'Tutorial']
      return { title: tabTitle[navigation.state.index]}
    }
  }
});


const App = createAppContainer(MainNavigator);

export default App;