// import logo from './logo.svg';
import './App.css';
// import { useState, useEffect } from 'react';

import PaginatedItems from './components/PaginatedItems';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <PaginatedItems 
          itemsPerPage={4} 
        />
      </header>
    </div>
  );
}

export default App;
