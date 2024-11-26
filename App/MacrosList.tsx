import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import {useNavigation} from '@react-navigation/native'
import { RootTabParamList } from './MyTabBar';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { getAllMacros } from '../db';
import type { Macro } from '../db';
import { useFocusEffect } from '@react-navigation/native';

type MacroEditNavigationProp = BottomTabNavigationProp<RootTabParamList, 'MacroEdit'>;


const MacrosList = () => {
  const navigation = useNavigation<MacroEditNavigationProp>();
  const [allMacros, setAllMacros] = React.useState<Macro[]>([]);
  
  const handleMacroSelect = (id: string) => {
    navigation.navigate('MacroEdit', {
      macrosList: allMacros,
      macroId: id,
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchMacros = async () => {
        try {
          const storedMacros = await getAllMacros();
          setAllMacros(storedMacros)
        } catch (error) {
          console.error(error);
        }
      };

      fetchMacros();

      return () => {
        // Cleanup function (optional)
        // This runs when the screen goes out of focus
      };
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {allMacros.length > 1 ? allMacros.map((m) => (
        <TouchableOpacity style={styles.macroButton} key={m.id} onPress={() => handleMacroSelect(m.id)}>
            <Text style={styles.macroButtonText}>{m.name}</Text>
        </TouchableOpacity>
      )) : 
      <TouchableOpacity style={styles.macroButton} key={1} onPress={() => navigation.navigate('MacroEdit', {macrosList: allMacros, macroId: undefined})}>
            <Text style={styles.macroButtonText}>Create your first Macro!</Text>
      </TouchableOpacity>}
    </ScrollView>
  )
}

export default MacrosList

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    gap: 10,
    marginHorizontal: 6,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  macroButton: {
    width: 300,
    height: 50,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
    justifyContent: "center",
  },
  macroButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
    textAlign: "center",
  },
})