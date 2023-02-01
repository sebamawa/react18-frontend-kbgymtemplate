import { useState, useEffect } from "react";

function DisplayItems({ currentItems }) {

    // to render the month name
    const months = ["Enero", "Febrero", "Merzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const getMonth = (dateString) => { // dateString: "XXXX-XX-XX"
        const monthString = months[parseInt(dateString.substring(5, 7)) - 1];
        return monthString;
    } 

    return(
        <>
            <table className="table table-dark table striped">
                <thead>
                    <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Month</th>
                        <th scope="col">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((d) =>
                     <>
                        <tr key={d.inv_id}>
                            <td>{d.inv_date}</td>
                            <td>{getMonth(d.inv_date)}</td>
                            <td>{d.inv_total}</td>
                        </tr>    
                     </>
                    )} 
                </tbody>
            </table>
        </>
    );
}

function CustomerInvoicesPaginated({ cust_id, itemsPerPage }) {
    const [currentInvoices, setCurrentInvoices] = useState([]);
    const [loadingInvoices, setLoadingInvoices] = useState(false);
    // intercambia entre la lista de facturas y el formulario para añadir una factura
    const [swapCustomerInvoicesAddInvoice, setSwapCustomerInvoicesAddInvoice] = useState(false);

    const swapInvoicesAddInvoice = () => {
        setSwapCustomerInvoicesAddInvoice(!swapCustomerInvoicesAddInvoice);
    }

    useEffect(() => {

        try {
            const fetchInvoices = async () => {
              setLoadingInvoices(true);
              const response = await fetch(`http://192.168.1.5:8080/KBGymTemplateJavaMySQL/InvoicesAPI/List?cust_id=${cust_id}&page_number=1&page_size=${itemsPerPage}`);
              const json = await response.json();
              console.log(json);
              setCurrentInvoices(json.SDTInvoices); 
              setLoadingInvoices(false);
            }
            fetchInvoices();
          } catch (error) {
            console.log(error);
          }
    }, []);

    return (
        <>    
            <div className="row">
               <div className="col-10"><h3>{!swapCustomerInvoicesAddInvoice ? "Invoices List" : "Add Invoice"}</h3></div> 
               <div className="col-2"><i class={!swapCustomerInvoicesAddInvoice ? "bi bi-plus-circle" : "bi bi-arrow-left-circle"} onClick={() => swapInvoicesAddInvoice()}></i></div>
            </div> 
            {swapCustomerInvoicesAddInvoice 
                ? <h1>{'Form to add invoice'}</h1> 
                :       
                loadingInvoices ? <h1>{'Loading Invoices'}</h1> :
                    <>
                        <DisplayItems 
                            currentItems={currentInvoices} 
                        /> 
                    </>
                
            } 
        </>
    );
}

export default CustomerInvoicesPaginated;