import React from "react";
import {Text, TextInput, View} from "react-native";
import {Header, SearchBar } from 'react-native-elements';
const HeaderComponent = () => {
  const search = '';
  return <SearchBar
      placeholder="Type Here..."
      onChangeText={this.updateSearch}
      value={search}
  />
};
export default HeaderComponent;