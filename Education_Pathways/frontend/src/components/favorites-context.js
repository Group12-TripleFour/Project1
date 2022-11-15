/*
This file is used to record the feedback items submitted by the users. 
Code Reference: https://github.com/academind/react-complete-guide-code/blob/zz-reactjs-summary/code/19-finished/src/
*/

import { createContext, useState } from 'react';

const FavoritesContext = createContext({
  favorites: [],
  totalFavorites: 0,
  addFavorite: (favoriteItem) => {},
  removeFavorite: (coursename) => {},
  itemIsFavorite: (coursename) => {}
});

export function FavoritesContextProvider(props) {
  const [userFavorites, setUserFavorites] = useState([]);

  function addFavoriteHandler(favoriteItem) {
    setUserFavorites((prevUserFavorites) => {
      return prevUserFavorites.concat(favoriteItem);
    });
  }

  function removeFavoriteHandler(coursename) {
    setUserFavorites(prevUserFavorites => {
      return prevUserFavorites.filter(course => course.coursename !== coursename);
    });
  }

  function itemIsFavoriteHandler(coursename) {
    return userFavorites.some(course => course.coursename === coursename);
  }

  const context = {
    favorites: userFavorites,
    totalFavorites: userFavorites.length,
    addFavorite: addFavoriteHandler,
    removeFavorite: removeFavoriteHandler,
    itemIsFavorite: itemIsFavoriteHandler
  };

  return (
    <FavoritesContext.Provider value={context}>
      {props.children}
    </FavoritesContext.Provider>
  );
}

export default FavoritesContext;
