import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { Close, DiceIcons, ValueIcons } from "../icons";
import { Dice, DiceRolls, getAllMacros } from "../db";
import { MacroRandomizer } from "./Utils";
import { BlurView } from "expo-blur";
import type { Macro, } from "../db";
import { v4 as uuidv4 } from 'uuid';
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { RootTabParamList } from "./MyTabBar";

export type MacroEditScreenProps = BottomTabScreenProps<RootTabParamList, 'MacroEdit'>;

function MacroEdit( {route}: MacroEditScreenProps ){
  const {macroId} = route.params || {}
  const [selectedMacro, setSelectedMacro] = React.useState<Macro | undefined>(undefined)

  React.useEffect(() => {
    const fetchMacros = async () => {
      try {
        const storedMacros = await getAllMacros();
        const target = storedMacros.find(a => a.id === macroId)
        setSelectedMacro(target);
      } catch (err) {
        console.error('Failed to fetch macros. Please try again.');
      }
    };

    fetchMacros();
  }, []);

  const [macro, setMacro] = React.useState<Dice>({
    D4: 0,
    D6: 0,
    D8: 0,
    D10: 0,
    D12: 0,
    D20: 0,
    D100: 0,
  } );
  const [rolls, setRolls] = React.useState<DiceRolls>({
    D4: [],
    D6: [],
    D8: [],
    D10: [],
    D12: [],
    D20: [],
    D100: [],
  });
  const [macroName, setMacroName] = React.useState("");
  const [allRolls, setAllRolls] = React.useState<DiceRolls[]>([]);
  const [increment, setIncrement] = React.useState<number>(0);
  const [showIncrement, setShowIncrement] = React.useState(false);
  const [decrement, setDecrement] = React.useState<number>(0);
  const [showDecrement, setShowDecrement] = React.useState(false);
  const [formattedRolls, setFormattedRolls] = React.useState<JSX.Element[]>([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  React.useEffect(() => {
    if (selectedMacro) {
      // Populate fields with selectedMacro data
      setMacro(selectedMacro.dice || {
        D4: 0,
        D6: 0,
        D8: 0,
        D10: 0,
        D12: 0,
        D20: 0,
        D100: 0,
      });
      setMacroName(selectedMacro.name || "");
      setIncrement(selectedMacro.add || 0);
      setDecrement(selectedMacro.subtract || 0);
    } else {
      clearFields()
    }
  }, [selectedMacro])
  const scrollViewRef = React.useRef<ScrollView>(null);

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
      totalForSet += increment;
      totalForSet -= decrement;
      return (
        <View key={index} style={styles.outputBlock}>
          {Object.keys(rollSet).map((key) => {
            if (rollSet[key as keyof DiceRolls].length > 0) {
              return (
                <View key={key}>
                  <Text>{`${key}: ${formatRolls(
                    rollSet[key as keyof DiceRolls]
                  )}`}</Text>
                </View>
              );
            }
            return null;
          })}
          {increment > 0 && <Text>+ ${increment}</Text>}
          {decrement > 0 && <Text> - ${decrement}</Text>}
          <Text
            style={{ fontSize: 20, fontWeight: "bold" }}
          >{`Total: ${totalForSet}`}</Text>
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

  const saveMacro = () => {
    if(selectedMacro !== undefined) {
      //macro is being edited
    } else {
      //macro is being created
      let newMacro: Macro = {
        id: uuidv4(),
        name: macroName,
        dice: macro,
        add: increment,
        subtract: decrement
      }
    }
  
  }
  const clearFields = () => {
    setSelectedMacro(undefined)
    setMacro({
      D4: 0,
      D6: 0,
      D8: 0,
      D10: 0,
      D12: 0,
      D20: 0,
      D100: 0,
    });
    setRolls({
      D4: [],
      D6: [],
      D8: [],
      D10: [],
      D12: [],
      D20: [],
      D100: [],
    });
    setMacroName("");
    setAllRolls([]);
    setIncrement(0);
    setDecrement(0);
    setShowIncrement(false);
    setShowDecrement(false);
  }
  const handleSubmitModal = () => {
    saveMacro()
    clearFields
    setModalVisible(false)
  }

  return (
    <View style={styles.container}>
      <View style={styles.box1}>
        <View style={styles.diceContainer}>
          {Object.entries(DiceIcons).map(([key, value]) => (
            <Pressable
              key={key}
              style={styles.button}
              onPress={() => incrementMacro(key as keyof Dice)}
            >
              {value}
            </Pressable>
          ))}
        </View>
        <View style={styles.diceIncrementDecrement}>
          <Pressable
            key={"showDecrementButton"}
            style={styles.button}
            onPress={() => setShowDecrement(true)}
          >
            {ValueIcons.subtractValue}
          </Pressable>
          <Pressable
            key={"showIncrementButton"}
            style={styles.button}
            onPress={() => setShowIncrement(true)}
          >
            {ValueIcons.addValue}
          </Pressable>
        </View>
      </View>

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
                style={styles.button}
                onPress={() => clearDecrement()}
              >
                {ValueIcons.subtractValue}
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
                style={styles.button}
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
          onContentSizeChange={() => {
            scrollViewRef.current?.scrollToEnd();
          }}
        >
          {formattedRolls}
        </ScrollView>
      </View>

      <View style={styles.box4}>
        <Pressable style={styles.rollButton} onPress={() => rollMacro(macro)}>
          <Text style={styles.rollButtonText}>Roll</Text>
        </Pressable>
        <Pressable
          style={styles.saveMacroButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.saveMacroButtonText}>Save Macro</Text>
        </Pressable>
      </View>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ScrollView
        style={{flex: 1}} contentContainerStyle={{minHeight: '100%'}}
        >
          <BlurView intensity={100} tint={"dark"} style={{ flex: 1 }}>
            <View style={styles.modal} >
              <Pressable
                onPress={() => setModalVisible(false)}
                style={{ position: "absolute", top: 3, right: 3 }}
              >
                <Text>{Close}</Text>
              </Pressable>
              <Text style={{fontWeight: "bold", fontSize: 20}}>Macro Name</Text>
              <TextInput 
                style={styles.modalTextInput} 
                maxLength={25} 
                onChangeText={(text) => setMacroName(text)}
              />
              <View style={{flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 50}}>
                {Object.entries(macro).map(
                  ([key, value]) =>
                    value > 0 && (
                      <Text key={`modal macro text ${key}`}>
                        {DiceIcons[key as keyof typeof DiceIcons]}: {value}
                      </Text>
                    )
                )}
                {showIncrement && (
                  <Text>
                    {ValueIcons.addValue}: {increment}
                  </Text>
                )}
                {showDecrement && (
                  <Text>
                    {ValueIcons.subtractValue}: {decrement}
                  </Text>
                )}
              </View>
              <Pressable
                style={[styles.rollButton, {position: "absolute", bottom: 5}]}
                onPress={handleSubmitModal}
              >
                <Text style={styles.saveMacroButtonText}>Save Macro</Text>
              </Pressable>
            </View>
          </BlurView>
        </ScrollView>
      </Modal>
    </View>
  );
}

export default MacroEdit

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    marginHorizontal: 6,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  diceContainer: {
    flexDirection: "row",
    gap: 5,
  },
  diceIncrementDecrement: {
    gap: 5,
    flexDirection: "row",
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
    backgroundColor: "#2c3d0d",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  box2: {
    flex: 1,
    padding: 5,
    alignSelf: "stretch",
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
    paddingVertical: 3,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  saveMacroButton: {
    width: 300,
    height: 50,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
    justifyContent: "center",
  },
  saveMacroButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
    textAlign: "center",
  },
  box3: {
    flex: 3,
    alignSelf: "stretch",
    alignItems: "flex-start",
    borderWidth: 3,
    backgroundColor: "darkseagreen",
    borderColor: "black",
    justifyContent: "center",
  },
  scrollContainer: {
    flex: 1,
    padding: 35,
    alignSelf: "stretch",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  outputBlock: {
    marginBottom: 20,
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
  rollButton: {
    width: 100,
    height: 50,
    paddingVertical: 12,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
    justifyContent: "center",
  },
  rollButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
    textAlign: "center",
  },
  modal: {
    alignItems: "center",
    justifyContent: "flex-start",
    top: "25%",
    left: "15%",
    height: "50%",
    width: "70%",
    backgroundColor: "darkolivegreen",
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 2,
  },
  modalTextInput: {
    width: 200,
    height: 40,
    textAlign: "center",
    backgroundColor: "darkseagreen",
    borderWidth: 1,
  },
});
