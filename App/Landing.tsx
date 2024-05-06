import { View, Text, Pressable } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import DiceIcons from "../icons";
import { Dice } from "../db";

export default function Landing() {
 const [output, setOutput] = React.useState<Dice>({
    D4: 0,
    D6: 0,
    D8: 0,
    D10: 0,
    D12: 0,
    D20: 0,
    D100: 0,
  });

  const incrementOutput = (key: keyof Dice) => {
    setOutput((prevOutput) => ({
      ...prevOutput,
      [key]: prevOutput[key] + 1,
    }));
  };

  const decrementOutput = (key: keyof Dice) => {
    setOutput((prevOutput) => ({
      ...prevOutput,
      [key]: Math.max(0, prevOutput[key] - 1),
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.diceContainer}>
        {Object.entries(DiceIcons).map(([key, value]) => (
          <Pressable
            key={key}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
              },
              styles.button,
            ]}
            onPress={() => incrementOutput(key as keyof Dice)}
          >
            {value}
          </Pressable>
        ))}
      </View>
      <Text style={styles.outputTitle}>Macro</Text>
      <View style={styles.outputContainer}>
        {Object.entries(output).map(([key, value]) => (
          value > 0 &&
          <Pressable key={key} style={styles.outputItem} onPress={() => decrementOutput(key as keyof Dice)}>
            {DiceIcons[key as keyof typeof DiceIcons]}
            <Text>{`: ${value}`}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  diceContainer: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  outputContainer: {
    flex: 1,
    flexWrap: "wrap",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  outputTitle: {
    fontSize: 20,
    marginRight: "auto"
  },
  outputItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    marginHorizontal: 5,
    marginVertical: 2,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 2,
    padding: 5,
  },
});
