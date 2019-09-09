import {createStackNavigator, createAppContainer} from 'react-navigation';
import {Test, DrawGraph, InputGraph, StringInputGraph } from "./src/components"
const MainNavigator = createStackNavigator({
  // First: {screen: Test},
  Input: {screen: InputGraph},
  // Input: {screen: StringInputGraph},
  Drawing: {screen: DrawGraph},
  
});

const App = createAppContainer(MainNavigator);

export default App;