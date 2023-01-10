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
            <div className="row">
               <div className="col-10"><h3>Invoices List</h3></div> 
               <div className="col-2"><i class="bi bi-plus-circle" onClick={() => alert("aun no se ingresan facturas")}></i></div>
            </div>
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
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        try {
            const fetchInvoices = async () => {
              setLoading(true);
              const response = await fetch(`http://192.168.1.5:8080/KBGymTemplateJavaMySQL/InvoicesAPI/List?cust_id=${cust_id}&page_number=1&page_size=${itemsPerPage}`);
              const json = await response.json();
              console.log(json);
              setCurrentInvoices(json.SDTInvoices); 
              setLoading(false);
            }
            fetchInvoices();
          } catch (error) {
            console.log(error);
          }
    }, []);

    return (
        <>        
            { loading ? <h1>{'Loading Invoices'}</h1> :
                <>
                    <DisplayItems currentItems={currentInvoices} /> 
                </>
            }
        </>
    );
}

export default CustomerInvoicesPaginated;