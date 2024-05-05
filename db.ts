import AsyncStorage from "@react-native-async-storage/async-storage";

interface MyMacro {
  id: string;
  name: string;
  dice: {
    2: number;
    4: number;
    6: number;
    8: number;
    10: number;
    12: number;
    20: number;
    100: number;
  };
}

const STORAGE_KEY = "@my_objects";

export const createObject = async (newObject: MyMacro): Promise<void> => {
  try {
    const existingObjects = await getAllObjects();
    const updatedObjects = [...existingObjects, newObject];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedObjects));
  } catch (error) {
    console.error("Error creating object:", error);
    throw error;
  }
};

export const getAllObjects = async (): Promise<MyMacro[]> => {
  try {
    const storedObjects = await AsyncStorage.getItem(STORAGE_KEY);
    return storedObjects ? JSON.parse(storedObjects) : [];
  } catch (error) {
    console.error("Error getting objects:", error);
    throw error;
  }
};

export const updateObject = async (updatedObject: MyMacro): Promise<void> => {
  try {
    const existingObjects = await getAllObjects();
    const index = existingObjects.findIndex(
      (obj) => obj.id === updatedObject.id
    );
    if (index !== -1) {
      existingObjects[index] = updatedObject;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existingObjects));
    } else {
      throw new Error("Object not found");
    }
  } catch (error) {
    console.error("Error updating object:", error);
    throw error;
  }
};

export const deleteObject = async (objectId: string): Promise<void> => {
  try {
    const existingObjects = await getAllObjects();
    const updatedObjects = existingObjects.filter((obj) => obj.id !== objectId);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedObjects));
  } catch (error) {
    console.error("Error deleting object:", error);
    throw error;
  }
};
