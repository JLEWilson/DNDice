import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { testMacros } from '../db'

const MacrosList = () => {
  return (
    <View style={styles.container}>
      {testMacros.map((m) => (
        <View key={m.id}>
            <Text>{m.name}</Text>
        </View>
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