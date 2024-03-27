import { StyleSheet, Pressable, Text } from 'react-native'
import React from 'react'
import { MaterialIcons }  from '@expo/vector-icons';

export default function IconButton({icon, label, onPress}) {
  return (
        <Pressable style={styles.iconButton} onPress={onPress}>
        <MaterialIcons name={icon} size={24} color="#fff" />
        <Text style={styles.iconButtonLabel}>{label} </Text>
        </Pressable>
  )
}

const styles = StyleSheet.create({
 iconButton : {
    justifyContent: 'center',
    alignItems: 'center',
 },
 iconButtonLabel: {
  color: '#fff',
  marginTop: 12,
 }
});