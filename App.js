import { createStackNavigator, createAppContainer } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { Test, DrawGraph, InputGraph, StringInputGraph, HomeScreen, SettingScreen, VideoScreen, ForumScreen, Tutorial} from "./src/components"

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
    Home: { screen: HomeScreen },
    Input: { screen: InputGraph },
    //Drawing: { screen: DrawGraph },
    //Input: { screen: StringInputGraph },
    //First: {screen: Test}
    ExecuteAlgorithm: { // this element will show a MaterialBottomTabNavigator
    screen: executeAlgorithmScreen,// the prepared sceen
    navigationOptions: ( {
                             navigation}) =>
    {//function to set the header title automatically
      let tabTitle = ['Graph Drawing', 'Tutorial']
      return {
          title: tabTitle[navigation.state.index],
          headerLayoutPreset: 'center'
      }
      }
    }
});
const SettingStack = createStackNavigator({
    Setting: { screen: SettingScreen },
    //Input: { screen: InputGraph }
});
const TutorialStack = createStackNavigator({
    Tutorial: { screen: VideoScreen },
    //Input: { screen: InputGraph }
});
const ForumStack = createStackNavigator({
    Forum: { screen: ForumScreen },
    //Input: { screen: InputGraph }
});
const TabNavigator = createMaterialBottomTabNavigator({
    Home: { screen: MainNavigator },
    Setting: { screen: SettingStack },
    Tutorial: { screen: TutorialStack },
    Forum: { screen: ForumStack }
});

const App = createAppContainer(TabNavigator);
export default App;