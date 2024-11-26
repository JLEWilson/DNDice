import AsyncStorage from "@react-native-async-storage/async-storage";


export interface Macro {
  id: string;
  name: string;
  dice: Dice
  add: number
  subtract: number
}

export interface Dice {
  D4: number;
  D6: number;
  D8: number;
  D10: number;
  D12: number;
  D20: number;
  D100: number;
}
export interface DiceRolls {
  D4: number[];
  D6: number[];
  D8: number[];
  D10: number[];
  D12: number[];
  D20: number[];
  D100: number[];
}

const STORAGE_KEY = "@my_macros";

export const createMacro = async (newMacro: Macro): Promise<void> => {
  try {
    const allMacros = await getAllMacros();
    const updatedMacros = [...allMacros, newMacro];
    console.log(updatedMacros)
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMacros));
  } catch (error) {
    console.error("Error creating macro:", error);
    throw error;
  }
};

export const getAllMacros = async (): Promise<Macro[]> => {
  try {
    const storedMacros = await AsyncStorage.getItem(STORAGE_KEY);
    return storedMacros ? JSON.parse(storedMacros) : [];
  } catch (error) {
    console.error("Error getting macros:", error);
    throw error;
  }
};

// export const getMacroById = async (): Promise<Macro> => (
//   try {
//     const storedMacro = await AsyncStorage.getItem
//   } catch (error) {
    
//   }
// );

export const updateMacro = async (updatedMacro: Macro): Promise<void> => {
  try {
    const existingMacros = await getAllMacros();
    const index = existingMacros.findIndex(
      (m) => m.id === updatedMacro.id
    );
    if (index !== -1) {
      existingMacros[index] = updatedMacro;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existingMacros));
    } else {
      throw new Error("Object not found");
    }
  } catch (error) {
    console.error("Error updating macro:", error);
    throw error;
  }
};

export const deleteMacro = async (macroId: string): Promise<void> => {
  try {
    const existingMacros = await getAllMacros();
    const updatedMacros = existingMacros.filter((m) => m.id !== macroId);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMacros));
  } catch (error) {
    console.error("Error deleting macro:", error);
    throw error;
  }
};
