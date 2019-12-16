import { createStackNavigator, createAppContainer } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { Test, DrawGraph, InputGraph, StringInputGraph, HomeScreen, SettingScreen, TutorialScreen, ForumScreen} from "./src/components"

const MainNavigator = createStackNavigator({
    Home: { screen: HomeScreen },
    Input: { screen: InputGraph },
    //Drawing: { screen: DrawGraph },
    //Input: { screen: StringInputGraph },
    //First: {screen: Test}
});
const SettingStack = createStackNavigator({
    Setting: { screen: SettingScreen },
    //Input: { screen: InputGraph }
});
const TutorialStack = createStackNavigator({
    Tutorial: { screen: TutorialScreen },
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