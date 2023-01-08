import { useLocation } from "react-router-dom";


export function CustomerInvoices () {
    const location = useLocation();
    const { cust_id, cust_fullname } = location.state;

    return (
        <div>
            <h1>[Customer Invoices]</h1>
            <h2>{cust_fullname}</h2>
        </div>
    );
}