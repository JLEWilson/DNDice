import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import {useNavigation} from '@react-navigation/native'
import { testMacros } from '../db'
import { RootTabParamList } from './MyTabBar';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type MacroEditNavigationProp = BottomTabNavigationProp<RootTabParamList, 'MacroEdit'>;


const MacrosList = () => {
  const navigation = useNavigation<MacroEditNavigationProp>();

  const handleMacroSelect = (id: string) => {
    navigation.navigate('MacroEdit', {
      macroId: id,
    });
  };

  return (
    <View style={styles.container}>
      {testMacros.map((m) => (
        <TouchableOpacity key={m.id} onPress={() => handleMacroSelect(m.id)}>
            <Text>{m.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

export default MacrosList

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        marginHorizontal: 6,
        marginTop: 20,
        alignItems: "center",
        justifyContent: "center",
    },
})