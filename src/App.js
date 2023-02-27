// import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

import { Link } from 'react-router-dom';

import bluegymImg from './logo-bluefitness.png';

// Router Components
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { CustomersPage } from './pages/CustomersPage';
import { CustomerInvoicesPage } from './pages/CustomerInvoicesPage';
import { NotFoundPage } from './pages/NotFoundPage';
import CustomerDetailsPage from './pages/CustomerDetailsPage';
import { useEffect } from 'react';

function App() {

  // maneja la cantidad de usuarios con deuda y setea el background de la página
  const [thereAreCustomersWithDebt, setThereAreCustomersWithDebt] = useState(false); 
  const [customersWithDebt, setCustomersWithDebt] = useState(0);
  const [loadingCountCustomersWithDebt, setLoadingCountCustomersWithDebt] = useState(false);
  const [updateCustomersWithDebt, setUpdateCustomersWithDebt] = useState(false);

  // actualiza la cantidad de usuarios con deuda al navegar por el menú
  const updateCustomersWithDebtCount = () => {
    setUpdateCustomersWithDebt(!updateCustomersWithDebt)
  }

  useEffect(() => {

     (async() => {   
      try {
        setLoadingCountCustomersWithDebt(true);

        const response = await fetch(`http://192.168.1.5:8080/KBGymTemplateJavaMySQL/CustomersAPI/CountCustomersWithDebt?cust_active=true`);

        const json = await response.json(); 
        setCustomersWithDebt(json.CustomersWithDebt);
        if (customersWithDebt === 0)
          setThereAreCustomersWithDebt(false);

        setLoadingCountCustomersWithDebt(false);
      } catch (error) {
        console.log(error);
        // setErrorMsg(`Un error ha ocurrido, pruebe recargar la página. 
        //              Descripción: ${error.message}`);
      }  
      })(); 
    }, [thereAreCustomersWithDebt, updateCustomersWithDebt]);

  return (
    <div className='App'>

      {/* Menu de navegación */}
      <nav className="navbar navbar-expand-lg navbar-light p-2 background-navbar-gradient">
        
          <Link to="/" 
                className="navbar-brand h3 text-white"
                onClick={() => updateCustomersWithDebtCount()} 
          >Home</Link> 
        
          <Link to="/customers" 
                className="navbar-brand h3 text-white"
                onClick={() => updateCustomersWithDebtCount()}      
          >Customers</Link>

          <Link to="/customers" className="navbar-brand h3 text-white mx-auto" >      
            <button type="button" 
                className={"btn " + (customersWithDebt>0 ? "visible " : "invisible ") +"btn mt-3 " + (thereAreCustomersWithDebt ?  "btn-danger" : "btn-primary")}
                // aria-pressed={thereAreCustomersWithDebt ? "true" : "false"}
                onClick={() => setThereAreCustomersWithDebt(!thereAreCustomersWithDebt)}   
            >
                Customers with debt: {
                  !loadingCountCustomersWithDebt 
                    ? <span className={customersWithDebt > 0 ? "badge bg-danger": "badge bg-primary"}>{customersWithDebt}</span>
                    : <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                }
            </button>
          </Link>  
                   

          <img src={bluegymImg} className="App-logo navbar-nav ms-auto" alt="logo" />
        
      </nav>     
      {/* Contenido de la página */}
      <div className={"App-header " + (thereAreCustomersWithDebt ? "background-customers-with-debts-gradient" : "background-gradient") }>
        <div className='container'>                  
          {/* Route Configuration */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/customers" element={<CustomersPage thereAreCustomersWithDebt={thereAreCustomersWithDebt}/>} />
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
