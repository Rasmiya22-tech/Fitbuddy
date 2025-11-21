import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addFavourite, removeFavourite } from '../favourites/favouritesSlice';

export default function DetailsScreen({ route }) {
  const { item } = route.params;
  const dispatch = useDispatch();
  const favs = useSelector(s=>s.favourites.items);
  const isFav = favs.some(f=>f.id===item.id);

  return (
    <View style={styles.container}>
      <Image source={{uri:item.image}} style={styles.image}/>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.description}</Text>
      <Button
        title={isFav?'Remove from Favourites':'Add to Favourites'}
        onPress={()=>isFav?dispatch(removeFavourite(item.id)):dispatch(addFavourite(item))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,padding:16},
  image:{width:'100%',height:220,borderRadius:10},
  title:{fontSize:22,fontWeight:'700',marginVertical:10},
  desc:{color:'#444',marginBottom:15}
});
