import { View, Text, TouchableOpacity } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import type { Macro } from '../db';

export type RootTabParamList = {
  MacrosList: undefined;
  MacroEdit: { macrosList: Macro[],  macroId: string | undefined};
};

export default function MyTabBar({ state, descriptors, navigation }:BottomTabBarProps) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel.toString()
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            key={`NavButton: ${index}`}
            style={[styles.button, {backgroundColor: isFocused ? "darkseagreen" : "darkolivegreen"}]}
          >
            <Text key={`NavButtonText: ${index}`} style={{ color: isFocused ? '#2c3d0d' : 'darkseagreen' }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    paddingHorizontal: 5,
    gap: 80,
    flexDirection: "row",
    backgroundColor: "#2c3d0d",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    borderRadius: 5,
    padding: 6,
    justifyContent: "center",
    alignItems: "center"
  },
});