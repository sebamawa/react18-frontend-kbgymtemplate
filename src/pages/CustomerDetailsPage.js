import { useParams, useLocation } from "react-router-dom";
import { CustomerInvoicesPage } from "./CustomerInvoicesPage";
import { useState } from "react";

function CustomerDetailsPage() {
    const parms = useParams();
    const location = useLocation();
    const { customer } = location.state; 

    const [cust_active, setCustActive] = useState(customer.cust_active);

    console.log(customer);

    return (
        <>
            <div className="row">
                <div className="col-3 mt-3">
                    {/* Customer Card */}
                    <div className="card">
                        <img src={customer.cust_image}  alt={customer.cust_fullname}/>
                        <div className={"card-body"}>
                            <h5 className={"card-title text-black"}>{customer.cust_fullname}</h5> 
                            <h6 className="text-black">{`Identification: ${customer.cust_identification}`}</h6>
                            <h6 className="text-black">{`Phone: ${customer.cust_phone}`}</h6>
                            <div class="form-check">
                                <input className="form-check-input" type="checkbox" value={cust_active} id="cust_active" checked={cust_active}/>
                                <label className="form-check-label text-black" for="cust_active">
                                    <h6>Is active?</h6>
                                </label>
                            </div>            
                        </div>
                    </div>
                </div>
                <div className="col-7">
                    {/* Customer Invoices */}
                    <CustomerInvoicesPage
                        // cust_id={parms.cust_id}
                        customer = {customer}
                    />
                </div>
                <div className="col-2">
                    {/* Customer Debts */}
                    Debts List
                </div>                
            </div>
        </>
    );
}

export default CustomerDetailsPage;