import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import MacroEdit from "./App/MacroEdit";
import MacrosList from "./App/MacrosList";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyTabBar, { RootTabParamList } from "./App/MyTabBar"
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'darkolivegreen'
  },
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  return (
    <NavigationContainer theme={MyTheme}>
      <StatusBar/>
      <Tab.Navigator tabBar={props => <MyTabBar {...props} />}>
        <Tab.Screen name="MacrosList" component={MacrosList} options={{headerShown: false}}/>
        <Tab.Screen name="MacroEdit" component={MacroEdit} options={{headerShown: false}}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "darkolivegreen",
    alignItems: "center",
    justifyContent: "center",
  },
});
