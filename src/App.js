// import logo from './logo.svg';
import './App.css';
// import { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

import bluegymImg from './logo-bluefitness.png';

// Router Components
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { CustomersPage } from './pages/CustomersPage';
import { CustomerInvoicesPage } from './pages/CustomerInvoicesPage';
import { NotFoundPage } from './pages/NotFoundPage';
import CustomerDetailsPage from './pages/CustomerDetailsPage';

function App() {

  return (
    <div className='App'>

      {/* Menu de navegación */}
      <nav className="navbar navbar-expand-lg navbar-light p-2">
        
          <Link to="/" className="navbar-brand h3 text-white">Home</Link> 
        
          <Link to="/customers" className="navbar-brand h3 text-white">Customers</Link>

          <img src={bluegymImg} className="App-logo navbar-nav ms-auto" alt="logo" />
        
      </nav>     
      {/* Contenido de la página */}
      <div className='App-header background-gradient'>
        <div className='container'>                  
          {/* Route Configuration */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/customer-details/:cust_id" element={<CustomerDetailsPage />} />
            <Route path="/customer_invoices" element={<CustomerInvoicesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div> 
      </div>
    </div>
  );
}

export default App;
