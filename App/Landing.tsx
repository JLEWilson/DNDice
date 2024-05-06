import { View, Text, Pressable } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import DiceIcons from "../icons";
import { Dice } from "../db";
import { MacroRandomizer } from "./Utils";

export default function Landing() {
 const [macro, setMacro] = React.useState<Dice>({
    D4: 0,
    D6: 0,
    D8: 0,
    D10: 0,
    D12: 0,
    D20: 0,
    D100: 0,
  });
  const [roll, setRoll] = React.useState<number>(0)

  const rollMacro = (macro: Dice) => {
    const x = MacroRandomizer(macro)
    setRoll(x)
  }

  const incrementMacro = (key: keyof Dice) => {
    setMacro((prevMacro) => ({
      ...prevMacro,
      [key]: prevMacro[key] + 1,
    }));
  };

  const decrementMacro = (key: keyof Dice) => {
    setMacro((prevMacro) => ({
      ...prevMacro,
      [key]: Math.max(0, prevMacro[key] - 1),
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
            onPress={() => incrementMacro(key as keyof Dice)}
          >
            {value}
          </Pressable>
        ))}
      </View>
      <Text style={styles.macroTitle}>Macro</Text>
      <View style={styles.macroContainer}>
        {Object.entries(macro).map(([key, value]) => (
          value > 0 &&
          <Pressable key={key} style={styles.macroItem} onPress={() => decrementMacro(key as keyof Dice)}>
            {DiceIcons[key as keyof typeof DiceIcons]}
            <Text>{`: ${value}`}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.buttonContainer}>
          <Pressable onPress={() => rollMacro(macro)}>
            <Text>Roll</Text>
          </Pressable>
      </View>
      <View style={styles.outputContainer}>
        {
          roll > 0 &&
          <Text style={styles.outputText}>{roll}</Text>
        }
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
  macroContainer: {
    flex: 1,
    flexWrap: "wrap",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  macroTitle: {
    fontSize: 20,
    marginRight: "auto"
  },
  macroItem: {
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
  buttonContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  }, 
  outputContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  }, 
  outputText : {
    fontSize: 40
  }
});
