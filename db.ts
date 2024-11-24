import AsyncStorage from "@react-native-async-storage/async-storage";

export const testMacros: Macro[] = [
  {
    id: "1",
    name: "Fireball",
    dice: { D4: 4, D6: 6, D8: 3, D10: 0, D12: 0, D20: 0, D100: 0 },
    add: 2,
    subtract: 1,
  },
  {
    id: "2",
    name: "Healing Light",
    dice: { D4: 5, D6: 3, D8: 0, D10: 1, D12: 0, D20: 0, D100: 0 },
    add: 3,
    subtract: 0,
  },
  {
    id: "3",
    name: "Lightning Strike",
    dice: { D4: 0, D6: 4, D8: 2, D10: 3, D12: 1, D20: 0, D100: 0 },
    add: 4,
    subtract: 2,
  },
  {
    id: "4",
    name: "Shield of Faith",
    dice: { D4: 3, D6: 0, D8: 1, D10: 0, D12: 0, D20: 5, D100: 0 },
    add: 1,
    subtract: 1,
  },
  {
    id: "5",
    name: "Blade Storm",
    dice: { D4: 6, D6: 2, D8: 1, D10: 1, D12: 0, D20: 0, D100: 0 },
    add: 2,
    subtract: 2,
  },
];


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
