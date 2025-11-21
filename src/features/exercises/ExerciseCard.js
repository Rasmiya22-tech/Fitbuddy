import React from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function ExerciseCard({ item, onPress }) {
  if (!item) return null;
  
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {item.image ? <Image source={{uri:item.image}} style={styles.img}/> : <View style={[styles.img,{backgroundColor:'#ddd'}]}/>}
      <View style={{flex:1,marginLeft:10}}>
        <Text style={styles.title}>{item.title || 'No title'}</Text>
        <Text numberOfLines={2} style={styles.desc}>{item.description || 'No description'}</Text>
      </View>
      <Feather name="chevron-right" size={20}/>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card:{flexDirection:'row',padding:10,margin:8,backgroundColor:'#fff',borderRadius:10,elevation:3},
  img:{width:64,height:64,borderRadius:8},
  title:{fontWeight:'600'},
  desc:{color:'#666'}
});
