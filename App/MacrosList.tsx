import React, {useState} from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, Pressable, TouchableWithoutFeedback } from 'react-native'
import {useNavigation} from '@react-navigation/native'
import { RootTabParamList } from './MyTabBar';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { getAllMacros, deleteMacro } from '../db';
import type { Macro } from '../db';
import { useFocusEffect } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { Close } from '../icons';

type MacroEditNavigationProp = BottomTabNavigationProp<RootTabParamList, 'MacroEdit'>;


const MacrosList = () => {
  const navigation = useNavigation<MacroEditNavigationProp>();
  const [allMacros, setAllMacros] = useState<Macro[]>([]);
  const [deleteModalVisible, setdeleteModalVisible] = useState(false)
  const [selectedMacroId, setSelectedMacroId] = useState('');
  const [selectedMacroName, setSelectedMacroName] = useState('')

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
    }, [allMacros])
  );
  const handleDeleteModal = (id: string) => {
    setSelectedMacroId(id);
    const macro = allMacros.find(a => a.id === id);
    if(macro) {
      setSelectedMacroName(macro.name);
    }else {
      setSelectedMacroId("Error Retrieving Macro Name")
    }
    setdeleteModalVisible(true);
  }
  const handleDeleteMacro = (id:string) => {
    deleteMacro(id)
    setdeleteModalVisible(false)
    setSelectedMacroId('')
    setSelectedMacroName('')
  }

  return (
    <View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
      <Text style={{fontSize: 20, marginTop: 20}}>All Macros</Text>
      <ScrollView contentContainerStyle={styles.container}>
        {allMacros.length >= 1 ? allMacros.map((m) => (
          <TouchableOpacity 
            style={styles.macroButton} 
            key={m.id} 
            onPress={() => handleMacroSelect(m.id)}
            onLongPress={() => handleDeleteModal(m.id)}
            >
              <Text style={styles.macroButtonText}>{m.name}</Text>
          </TouchableOpacity>
        )) : 
        <TouchableOpacity style={styles.macroButton} key={1} onPress={() => navigation.navigate('MacroEdit', {macrosList: allMacros, macroId: undefined})}>
              <Text style={styles.macroButtonText}>Create your first Macro!</Text>
        </TouchableOpacity>}
      </ScrollView>
      <Modal
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setdeleteModalVisible(false)}
        >
          <BlurView intensity={100} tint={"dark"} style={{ flex: 1 }}>
            <Pressable style={{width:'auto', height:'auto'}} onPress={()=> setdeleteModalVisible(false)}>
              <TouchableWithoutFeedback>
                <View style={styles.modal}>
                  <Pressable
                  onPress={() => setdeleteModalVisible(false)}
                  style={{ position: "absolute", top: 3, right: 3 }}
                  >
                  <Text>{Close}</Text>
                  </Pressable>
                  <Text style={styles.modalText}>Delete Macro:</Text>
                  <Text style={styles.modalText}>{selectedMacroName}</Text>
                  <Pressable style={styles.deleteButton} onPress={() => handleDeleteMacro(selectedMacroId)}>
                    <Text style={styles.deleteButtonText}>Confirm Delete</Text>
                  </Pressable>
                </View>
              </TouchableWithoutFeedback>
            </Pressable>
          </BlurView>
      </Modal>
    </View>
  )
}

export default MacrosList

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    gap: 20,
    marginHorizontal: 6,
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
  modal: {
    alignItems: "center",
    justifyContent: "flex-start",
    top: "50%",
    left: "15%",
    height: "60%",
    width: "70%",
    backgroundColor: "darkolivegreen",
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 2,
  },
  modalText: {
    fontSize: 20,
    fontWeight: '600'
  },
  deleteButton: {
    width: 150,
    height: 50,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "red",
    flex: 1,
    justifyContent: "center",
    alignItems: 'center',
    position: 'absolute',
    bottom: 5
  },
  deleteButtonText: {
    fontSize: 18,
    fontWeight: 'bold'
  }
})