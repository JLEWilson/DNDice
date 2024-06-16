import { View, Text, Pressable, TextInput, ScrollView } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { DiceIcons, ValueIcons } from "../icons";
import { Dice, DiceRolls } from "../db";
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
  const [rolls, setRolls] = React.useState<DiceRolls>({
    D4: [],
    D6: [],
    D8: [],
    D10: [],
    D12: [],
    D20: [],
    D100: [],
  });
  const [allRolls, setAllRolls] = React.useState<DiceRolls[]>([]);
  const [increment, setIncrement] = React.useState<number>(0  );
  const [showIncrement, setShowIncrement] = React.useState(false);
  const [decrement, setDecrement] = React.useState<number>(0);
  const [showDecrement, setShowDecrement] = React.useState(false);
  const [formattedRolls, setFormattedRolls] =  React.useState<JSX.Element[]>([]);
  const scrollViewRef = React.useRef<ScrollView>(null)

  const clearDecrement = () => {
    setShowDecrement(false);
    setDecrement(0);
  };
  const clearIncrement = () => {
    setShowIncrement(false);
    setIncrement(0);
  };

  const hasNumbers = (diceRolls: DiceRolls) => {
    if (Array.isArray(diceRolls)) {
      return diceRolls.length > 0;
    } else {
      return Object.values(diceRolls).some((dice) => dice.length > 0);
    }
  };

  const total = hasNumbers(rolls) ? sumAllDiceRolls(rolls) : null;

  const rollMacro = (macro: Dice) => {
    const x = MacroRandomizer(macro);
    setRolls(x);
    setAllRolls((prevAllRolls) => [...prevAllRolls, x]);
  };

  const formatRolls = (numbers: number[]) => {
    if (numbers.length === 0) {
      return "";
    } else if (numbers.length === 1) {
      return numbers[0].toString();
    } else {
      return numbers.join(", ");
    }
  };

  const formatAllRolls = (allRolls: DiceRolls[]) => {
    const rollEntries: JSX.Element[] = allRolls.map((rollSet, index) => {
      let totalForSet = sumAllDiceRolls(rollSet);
      totalForSet += increment
      return (
        <View key={index} style={styles.outputBlock}>
          {Object.keys(rollSet).map((key) => {
            if (rollSet[key as keyof DiceRolls].length > 0) {
              return (
                <View  key={key}>
                  <Text>{`${key}: ${formatRolls(rollSet[key as keyof DiceRolls])}`}</Text>
                </View>
              );
            }
            return null;
          })}
          {increment > 0 &&<Text>`+ ${increment}`</Text>}
          <Text style={{fontSize: 20,fontWeight: "bold"}}>{`Total: ${totalForSet}`}</Text>
        </View>
      );
    });
    
    setFormattedRolls(rollEntries);
  };

  React.useEffect(() => {
    formatAllRolls(allRolls);
  }, [allRolls]);

  function sumAllDiceRolls(diceRolls: DiceRolls): number {
    let sum = 0;

    if (Array.isArray(diceRolls)) {
      // If diceRolls is a single array of numbers
      sum = diceRolls.reduce((acc: number, val: number) => acc + val, 0);
    } else {
      // If diceRolls is an object of arrays of numbers
      Object.values(diceRolls).forEach((dice) => {
        sum += dice.reduce((acc: number, val: number) => acc + val, 0);
      });
    }

    return sum;
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

      <View style={styles.box1}>
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
        <View style={styles.diceIncrementDecrement}>
          <Pressable
            key={"showIncrementButton"}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
              },
              styles.button,
            ]}
            onPress={() => setShowIncrement(true)}
          >
            {ValueIcons.addValue}
          </Pressable>
          <Pressable
            key={"showDecrementButton"}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
              },
              styles.button,
            ]}
            onPress={() => setShowDecrement(true)}
          >
            {ValueIcons.addValue}
          </Pressable>
        </View>
      </View>

      <Text style={styles.macroTitle}>Macro</Text>
      <View style={styles.box2}>
        <View style={styles.macroContainer}>
          {Object.entries(macro).map(
            ([key, value]) =>
              value > 0 && (
                <Pressable
                  key={key}
                  style={styles.macroItem}
                  onPress={() => decrementMacro(key as keyof Dice)}
                >
                  {DiceIcons[key as keyof typeof DiceIcons]}
                  <Text>{`: ${value}`}</Text>
                </Pressable>
              )
          )}
          {showDecrement && (
            <View style={styles.plusMinusContainer}>
              <Pressable
                key={"DecrementFalse"}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
                  },
                  styles.button,
                ]}
                onPress={() => clearDecrement()}
              >
                {ValueIcons.addValue}
              </Pressable>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                onChangeText={(text) => setDecrement(parseInt(text))}
                value={decrement?.toString()}
                maxLength={4}
              />
            </View>
          )}
          {showIncrement && (
            <View style={styles.plusMinusContainer}>
              <Pressable
                key={"IncrementFalse"}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
                  },
                  styles.button,
                ]}
                onPress={() => clearIncrement()}
              >
                {ValueIcons.addValue}
              </Pressable>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                onChangeText={(text) => setIncrement(parseInt(text))}
                value={increment?.toString()}
                maxLength={4}
              />
            </View>
          )}
        </View>
      </View>

      <View style={styles.box3}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          onContentSizeChange={() => {scrollViewRef.current?.scrollToEnd()}}
        >
          {formattedRolls}
        </ScrollView>
      </View>  
      
      <View style={styles.box4}>
          <Pressable style={styles.rollButton} onPress={() => rollMacro(macro)}>
            <Text style={styles.rollButtonText}>Roll</Text>
          </Pressable>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    marginHorizontal: 6,
    marginVertical: 15,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  diceContainer: {
    flex: 2,
    backgroundColor: "green",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  diceIncrementDecrement: {
    flex: 1,
    backgroundColor: "red",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  macroContainer: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  box1: {
    flex: 1,
    alignSelf: "stretch",
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
    box2: {
      flex: 1,
      alignSelf: "stretch",
      backgroundColor: "red",
    },
  macroTitle: {
    fontSize: 20,
    marginRight: "auto",
  },
  plusMinusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  box4: {
    flex: 1,
    alignSelf: "stretch",
    backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center",
  },
  rollButton: {
    width: 100,
    height: 50,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
    justifyContent: "center"
    },
  rollButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
    textAlign: "center"
  },
  box3: {
    flex: 3,
    alignSelf: "stretch",
    alignItems: "flex-start",
    borderWidth: 3,
    borderColor: "Black",
    backgroundColor: "blue",
    justifyContent: "center",
  },
  scrollContainer: {
    flex: 1,
    padding: 35,
    alignSelf: "stretch",
  },
  scrollContent: {
    paddingBottom:30
  },
  outputBlock: {
    marginBottom: 20
  },
  textInput: {
    height: 40,
    width: 50,
    fontWeight: "bold",
    marginTop: 4,
    borderWidth: 1,
    padding: 10,
    textAlign: "center",
  },
});
