import { View, Text, Pressable } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import dice from "../icons";

export default function Landing() {
  const [output, setOutput] = React.useState<React.ReactNode[]>([]);

  const addToOutput = (value: React.ReactNode) => {
    setOutput((prevOutput) => [...prevOutput, value]);
  };

  const removeFromOutput = (index: number) => {
    setOutput((prevOutput) => prevOutput.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <View style={styles.diceContainer}>
        {Object.entries(dice).map(([key, value]) => (
          <Pressable
            key={key}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
              },
              styles.button,
            ]}
            onPress={() => addToOutput(value)}
          >
            {value}
          </Pressable>
        ))}
      </View>
      <View style={styles.outputContainer}>
        {output.map((item, index) => (
          <Pressable
            key={index}
            style={styles.outputItem}
            onPress={() => removeFromOutput(index)}
          >
            {item}
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
  outputItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 2,
    padding: 2,
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 2,
    padding: 2,
  },
});
