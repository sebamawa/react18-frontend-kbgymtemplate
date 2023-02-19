import { useLocation } from "react-router-dom";
import "../App.css"
import CustomerInvoicesPaginated from "../components/CustomerInvoicesPaginated";


export function CustomerInvoicesPage (updateInvoicesList) {
    const location = useLocation();
    const { customer } = location.state;

    // console.log(customer);

    return (
        <>
         {/* <header className="App-header"> */}
             
                    <CustomerInvoicesPaginated 
                        itemsPerPage={4}
                        // cust_id={customer.cust_id}
                        customer = {customer}
                    />
             
          
          {/* </header> */}
        </>
    );
}