// import logo from './logo.svg';
import './App.css';
// import { useState, useEffect } from 'react';

// Router Components
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { CustomersPage } from './pages/CustomersPage';
import { CustomerInvoices } from './pages/CustomerInvoices';

function App() {

  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <PaginatedItems 
  //         itemsPerPage={4} 
  //       />
  //     </header>
  //   </div>
  // );

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/customer_invoices" element={<CustomerInvoices />} />
      </Routes>
    </div> 
  );
}

export default App;
