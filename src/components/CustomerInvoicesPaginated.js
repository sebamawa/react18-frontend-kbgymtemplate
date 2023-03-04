import { useState, useEffect } from "react";
import AddInvoiceCustomerForm from "./AddInvoiceCustomerForm";

function DisplayItems({ currentItems }) {

    // to render the month name
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const getMonth = (dateString) => { // dateString: "YYYY-MM-DD"
        const monthString = months[parseInt(dateString.substring(5, 7)) - 1];
        return monthString;
    } 

    // to check if the invoice customer is from today
    const today = (new Date()).toISOString().substring(0, 10);

    return(
        <>
            <table className="table table-dark table-striped table-hover">
                <thead>
                    <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Month</th>
                        <th scope="col">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((d) =>
                     
                        <tr key={d.inv_id} className={today === d.inv_date ? "table-success" : ''}> 
                            <td>{d.inv_date}</td>
                            <td>{getMonth(d.inv_date)}</td>
                            <td>{d.inv_total}</td>
                        </tr>    
                     
                    )} 
                </tbody>
            </table>
        </>
    );
}

function CustomerInvoicesPaginated({ customer, itemsPerPage }) {
    const [currentInvoices, setCurrentInvoices] = useState([]);
    const [loadingInvoices, setLoadingInvoices] = useState(false);
    // to update the list of invoices when a new invoice is inserted from AddInvoiceCustomerForm
    const [updateInvoicesList, setUpdateInvoicesList] = useState(false); // to update the list of invoices
    // intercambia entre la lista de facturas y el formulario para añadir una factura
    const [swapCustomerInvoicesAddInvoice, setSwapCustomerInvoicesAddInvoice] = useState(false);

    useEffect(() => {

        try {
            const fetchInvoices = async () => {
              setLoadingInvoices(true);
              const response = await fetch(`http://192.168.1.5:8080/KBGymTemplateJavaMySQL/InvoicesAPI/List?cust_id=${customer.cust_id}&page_number=1&page_size=${itemsPerPage}`);
              const json = await response.json();
              // console.log(json);
              setCurrentInvoices(json.SDTInvoices); 
              setLoadingInvoices(false);
            }
            fetchInvoices();
          } catch (error) {
            console.log(error);
          }
    }, [updateInvoicesList]);

    return (
        <>    
            <div className="row">
               <div className="col-8"><h3>{!swapCustomerInvoicesAddInvoice ? "Invoices List" : "Add Invoice"}</h3></div> 
               <div className="col-4"><i role="button" className={!swapCustomerInvoicesAddInvoice ? "bi bi-plus-circle" : "bi bi-arrow-left-circle"} onClick={() => setSwapCustomerInvoicesAddInvoice(!swapCustomerInvoicesAddInvoice)}></i>{!swapCustomerInvoicesAddInvoice ? " Add Invoice" : " Invoices List"}</div>
            </div> 
            {swapCustomerInvoicesAddInvoice 
                ? <AddInvoiceCustomerForm 
                    customer={customer} 
                    updateCustomerInvoices = {() => setUpdateInvoicesList(!updateInvoicesList)}
                    swapInvoicesListAddInvoice = {() => setSwapCustomerInvoicesAddInvoice(!swapCustomerInvoicesAddInvoice)}
                  /> 
                :       
                loadingInvoices ? 
                    <div className="row">  
                        <div className="col-6"><h3 className="float-end">Loading invoices</h3></div>
                        <div class="spinner-border text-warning float-start" role="status">
                            <span class="sr-only"></span>
                        </div>
                    </div> 
                    :
                    <DisplayItems 
                        currentItems={currentInvoices} 
                    /> 
                
                
            } 
        </>
    );
}

export default CustomerInvoicesPaginated;