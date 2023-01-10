import { useLocation } from "react-router-dom";
import "../App.css"
import CustomerInvoicesPaginated from "../components/CustomerInvoicesPaginated";


export function CustomerInvoicesPage () {
    const location = useLocation();
    const { customer } = location.state;

    return (
        <>
         {/* <header className="App-header"> */}
    

             
                    <CustomerInvoicesPaginated 
                        itemsPerPage={4}
                        cust_id={customer.cust_id}
                    />
             
          
          {/* </header> */}
        </>
    );
}