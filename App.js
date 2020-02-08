import React from "react";
import { Button, Dimensions, TouchableOpacity } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { createDrawerNavigator, DrawerActions } from 'react-navigation-drawer';
import { Test, DrawGraph,
  InputGraph,
  StringInputGraph,
  HomeScreen,
  SettingScreen,
  VideoScreen, ForumScreen,
  Tutorial} from "./src/components";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ContentComponent from './src/components/content_component/ContentComponent';
import { Icon } from 'react-native-elements';

/**
 * Create navigation screen for 2 screens Graph Drawing and Tutorial
 */
let executeAlgorithmScreen = createMaterialBottomTabNavigator(
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
);

const tabNavigator = createMaterialBottomTabNavigator({
    First: { 
        screen: HomeScreen,
        navigationOptions: {
            tabBarIcon: <MaterialIcons style={{fontSize: 20, color: "rgb(149,151,203)"}} name={'home'}/>
        } 
    },
    Video: {
        screen: VideoScreen,
        navigationOptions: {
            tabBarIcon: <MaterialIcons style={{fontSize: 20, color: "rgb(149,151,203)"}} name={'receipt'}/>
        }
    },
    Forum: {
        screen: ForumScreen,
        navigationOptions: {
            tabBarIcon: <MaterialIcons style={{fontSize: 20, color: "rgb(149,151,203)"}} name={'school'}/>
        }
    },
    Setting: {
        screen: SettingScreen,
        navigationOptions: {
            tabBarIcon: <MaterialIcons style={{fontSize: 20, color: "rgb(149,151,203)"}} name={'settings'}/>
        }
    }
},
{
    initialRouteName: 'First',
    activeColor: '#ECF4F9',
    // inactiveColor: 'gray',
    shifting : false,
    labeled: false,
    barStyle: {
        backgroundColor: 'rgb(55,56,105)',
        padding: 0
    }
});

const WIDTH = Dimensions.get('window').width;

const DrawerConfig = {
    initialRouteName: 'Drawer',
    drawerWidth: WIDTH*0.83,
    drawerPosition: 'right',
    contentComponent: ContentComponent
};

const DrawerNavigator = createDrawerNavigator({
    Drawer: {
        screen: InputGraph
    }
},
    DrawerConfig
);

const MainNavigator = createStackNavigator({
    Home: { 
        screen: tabNavigator,
        navigationOptions: ( {navigation}) => { //function to set the header title automatically
            let tabTitle = ['Home', 'Video', 'Forum', 'Settings']
            return {
                title: tabTitle[navigation.state.index],
                headerStyle: {
                    backgroundColor: 'rgb(55,57,106)'
                },
                headerTintColor: '#fff',
                headerRight: 
                    (<Button 
                        title = 'edit'
                        onPress = {() => {navigation.navigate('Input')}}
                        style = {{ paddingRight: 5}}
                        color = 'rgb(55,57,106)'
                    />)}}
    },
    Input: { 
        screen:  DrawerNavigator,
        navigationOptions: ( {navigation}) => { //function to set the header title automatically
            let tabTitle = ['Graph Input']
            return {
                title: tabTitle[navigation.state.index],
                headerStyle: {
                    backgroundColor: 'rgb(55,57,106)'
                },
                headerTintColor: '#fff',
                //headerRight: 
                    // (<TouchableOpacity onPress = {() => navigation.dispatch(DrawerActions.openDrawer())}>
                    //     <Icon name = 'menu' size = {32} color = 'white'/>
                    // </TouchableOpacity> 
                //)
            }}
    },
    // this element will show a MaterialBottomTabNavigator
    ExecuteAlgorithm: { 
        screen: executeAlgorithmScreen, // the prepared sceen
        navigationOptions: ( {navigation}) => { //function to set the header title automatically
            let tabTitle = ['Graph Drawing', 'Tutorial']
            return {
                title: tabTitle[navigation.state.index],
                headerStyle: {
                    backgroundColor: 'rgb(55,57,106)'
                },
                headerTintColor: '#fff'
            }}}},
{
    headerLayoutPreset: 'center'
});

const App = createAppContainer(MainNavigator);
export default App;