import { useLocation } from "react-router-dom";
import "../App.css"
import CustomerInvoicesPaginated from "../components/CustomerInvoicesPaginated";


export function CustomerInvoicesPage () {
    const location = useLocation();
    const { cust_id, cust_fullname, cust_phone, cust_image } = location.state;

    return (
        <>
         {/* <header className="App-header"> */}
            <div className="row">
                <div className="col-3">
                    <div className="card">
                        <img src={cust_image}  alt={cust_fullname}/>
                        <div className={"card-body"}>
                            <h5 className={"card-title text-black"}>{cust_fullname}</h5> 
                            <h6 className="text-black">{`Phone: ${cust_phone}`}</h6> 
                        </div>            
                    </div>
                </div>
                <div className="col-9">
                    <CustomerInvoicesPaginated 
                        itemsPerPage={4}
                        cust_id={cust_id}
                    />
                </div>
            </div>
          {/* </header> */}
        </>
    );
}