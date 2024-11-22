import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import MacroView from "./App/MacroView";
import MacrosList from "./App/MacrosList";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyTabBar from "./App/MyTabBar"
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'darkolivegreen'
  },
};

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer theme={MyTheme}>
      <Tab.Navigator tabBar={props => <MyTabBar {...props} />}>
        <Tab.Screen name="Home" component={MacrosList} options={{headerShown: false}}/>
        <Tab.Screen name="New Macro" component={MacroView} options={{headerShown: false}}/>
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
