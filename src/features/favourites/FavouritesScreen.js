import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import ExerciseCard from '../exercises/ExerciseCard';

export default function FavouritesScreen({ navigation }) {
  const items = useSelector(s=>s.favourites.items);
  if(!items.length) return <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text>No favourites yet</Text></View>;
  return (
    <FlatList
      data={items}
      keyExtractor={i=>i.id.toString()}
      renderItem={({item})=>(
        <ExerciseCard item={item} onPress={()=>navigation.navigate('Details',{item})}/>
      )}
    />
  );
}
