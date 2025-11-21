import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'favourites',
  initialState: { items: [] },
  reducers: {
    addFavourite:(s,a)=>{
      if(!s.items.find(i=>i.id===a.payload.id)) s.items.push(a.payload);
    },
    removeFavourite:(s,a)=>{
      s.items = s.items.filter(i=>i.id!==a.payload);
    }
  }
});

export const { addFavourite, removeFavourite } = slice.actions;
export default slice.reducer;
