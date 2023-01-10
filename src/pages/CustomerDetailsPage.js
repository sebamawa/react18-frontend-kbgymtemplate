import { useParams, useLocation } from "react-router-dom";
import { CustomerInvoicesPage } from "./CustomerInvoicesPage";

function CustomerDetailsPage() {
    const parms = useParams();
    const location = useLocation();
    const { customer } = location.state;        

    // console.log(parms);

    return (
        <>
            <div className="row">
                <div className="col-3">
                    {/* Customer Card */}
                    <div className="card">
                        <img src={customer.cust_image}  alt={customer.cust_fullname}/>
                        <div className={"card-body"}>
                            <h5 className={"card-title text-black"}>{customer.cust_fullname}</h5> 
                            <h6 className="text-black">{`Phone: ${customer.cust_phone}`}</h6> 
                        </div>            
                    </div>
                </div>
                <div className="col-7">
                    {/* Customer Invoices */}
                    <CustomerInvoicesPage
                        cust_id={parms.cust_id}
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