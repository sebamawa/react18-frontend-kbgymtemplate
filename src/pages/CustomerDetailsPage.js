import { useLocation } from "react-router-dom";
import { CustomerInvoicesPage } from "./CustomerInvoicesPage";
import  { CustomerDebtsPage } from "./CustomerDebtsPage";
import CustomerCardPage from "./CustomerCardPage";
import { useState } from "react";

function CustomerDetailsPage() {
    // const parms = useParams();
    const location = useLocation();
    const { customer } = location.state;

    const [updateCustomerFromDebtsBool, setUpdateCustomerFromDebts] = useState(false);
    
    return (
        <>
            <div className="row">
                <div className="col-3">
                    <h3>Customer</h3>
                    <CustomerCardPage 
                        customer = {customer}
                        updateCustomerFromDebtsBool = {updateCustomerFromDebtsBool}
                    />
                </div>
                <div className="col-6">
                    {/* <h3>Invoices List</h3> */}
                    <CustomerInvoicesPage
                        // cust_id={parms.cust_id}
                        customer = {customer}
                    />
                </div>
                <div className="col-3">
                    <h3>Debts List</h3>
                    < CustomerDebtsPage
                        customer = {customer}
                        updateCustomerFromDebtsBool = {() => setUpdateCustomerFromDebts(!updateCustomerFromDebtsBool)}
                    />
                </div>                
            </div>
        </>
    );
}

export default CustomerDetailsPage;