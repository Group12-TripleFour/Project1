import React from 'react'
import NavbarComp from "./components/Navbar.js";
import ReactComp from "./components/Footer.js";
import './App.css';
import {FavoritesContextProvider} from './components/favorites-context.js';

function App() {

  return (
    <div>
    
    <div className="App">
      <FavoritesContextProvider>
        <NavbarComp />
      </FavoritesContextProvider>
    </div>

    <div className="App">
      <ReactComp />
    </div>
    </div>
  );

 

}


export default App;