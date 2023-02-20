import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AddinvoiceCustomerForm(
    {customer, 
    updateCustomerInvoices = f => f,
    swapInvoicesListAddInvoice = f => f}) {

    const [services, setServices] = useState([]);
    const [loadingServices, setLoadingServices] = useState(false);
    const [selectedService, setSelectedService] = useState(0);

    const [itemsInvoice, setItemsInvoice] = useState([]);
    const [countItemsInvoice, setCountItemsInvoice] = useState(0);

    const [loadingInvoiceInserted, setLoadingInvoiceInserted] = useState(false);

    const today = (new Date()).toISOString().substring(0, 10);
    //const today = (new Date()).toLocaleDateString();   //toISOString().substring(0, 10);

    const [inv_date, setInv_date] = useState(today);
    const [inv_total, setInv_total] = useState(0);

    const navigate = useNavigate();

    const addInvoiceItem = (newItem) => {
        setCountItemsInvoice(countItemsInvoice + 1); // 1 linea de factura mas
        setItemsInvoice([...itemsInvoice, {...newItem, id: countItemsInvoice}]); // agrego id de linea a item
        const total = inv_total + parseInt(newItem.serv_price);
        setInv_total(total); // update total TODO: * serv_quantity 
    }

    const removeInvoiceItem = (id) => {
        setCountItemsInvoice(countItemsInvoice - 1); // 1 linea de factura menos
        // update total
        const itemLine = itemsInvoice.find(item => item.id === id); 
        setItemsInvoice(itemsInvoice.filter(item => item.id !== id)); // elimino item de itemsInvoice
        setInv_total(inv_total - parseInt(itemLine.serv_price));
    }

    const submit = async (e) => {
        e.preventDefault();

        setLoadingInvoiceInserted(true);

        // armo items de la factura para enviar al backend
        const Items = [
            {
                invitem_serv_id : 3,
                invitem_quantity: 1,
                invitem_price : 3600
            },
            {
                invitem_serv_id : 5,
                invitem_quantity: 1,
                invitem_price : 4000
            }
        ];
        
        try {
            const response =  await fetch(`http://192.168.1.5:8080/KBGymTemplateJavaMySQL/InvoicesAPI/Insert`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    SDTInvoice: {
                        inv_date : inv_date,
                        inv_cust_id : customer.cust_id,
                        Items : Items
                    }
                })
            });

            const json = await response.json();
            //console.log(json);
            const msgTypeResponse = json.Messages[0].Type;
            if (msgTypeResponse === 2) {
                setLoadingInvoiceInserted(false);
                updateCustomerInvoices(); // update invoices list in CustomerDetailsPage
                swapInvoicesListAddInvoice(); // swap to invoices list
                // alert(`Invoice inserted successfully for customer ${customer.cust_fullname}`);
                // navigate(`/customer-details/${customer.cust_id}`, {state: {customer: customer}, replace: true}); 
            }

        } catch (error) {
            alert(error);
        }

        // "Items" : [
        //     {
        //         "invitem_serv_id" : 3,
        //         "invitem_quantity": 1,
        //         "invitem_price" : 3600
        //     },
        //     {
        //         "invitem_serv_id" : 5,
        //         "invitem_quantity": 1,
        //         "invitem_price" : 4000
        //     }
        // ]
    }

    useEffect(() => {
         (async() => {   
          try {
            setLoadingServices(true);
            
            const response = await fetch(`http://192.168.1.5:8080/KBGymTemplateJavaMySQL/ServicesAPI/List?serv_type_id=2`);
           
            const json = await response.json();
            setServices(json.SDTServices);
            setSelectedService(json.SDTServices[0]);
            setLoadingServices(false);
          } catch (error) {
            console.log(error);
            // setErrorMsg(`Un error ha ocurrido, pruebe recargar la página. 
            //              Descripción: ${error.message}`);
          }  
    })(); 
    }, []);   

    return (
        <>

            <form onSubmit={submit} className="p-3 mb-2 bg-primary text-white bg-gradient rounded">
                <div class="form-group row">
                    <label for="inv_date" class="col-sm-2 col-form-label"><small>Date*:</small></label>
                    <div class="col-sm-10">
                        <input type="date" class="form-control" id="inv_date" value={inv_date} onChange={e => setInv_date(e.target.value)}/>
                    </div>
                </div>
                <hr/>
                <div class="form-group row">
                    <label for="cust_fullname" className="col-sm-2 col-form-label"><small>Name*:</small></label>
                    <div className="col-sm-4">
                        <input type="text" readOnly className="form-control-plaintext text-light" id="cust_fullname" defaultValue={customer.cust_fullname}/>
                    </div>

                    <label for="cust_identification" className="col-sm-3 col-form-label"><small>Identification*:</small></label>
                    <div className="col-sm-3">
                        <input type="text" readOnly className="form-control-plaintext text-light" id="cust_identification" defaultValue={customer.cust_identification}/>
                    </div>                    
                </div> 
                <hr/>    
                <fieldset className="col-form-label">
                    <legend><h5>Add Items</h5></legend>
                    <div className="form-group row">
                        
                        <label for="serv_id" className="col-sm-2 col-form-label"><small>Service*:</small></label>
                        <div className="col-sm-5">
                            <select className="form-select" aria-label=".form-select-sm example" id="serv_id" onChange={e => {setSelectedService(services.find((serv) => serv.serv_id === parseInt(e.target.value)) )}}>
                                {loadingServices ? <option value="" readonly>Loading...</option> :
                                
                                services.map((service) => {
                                    return (
                                        <option value={service.serv_id} key={service.serv_id}>{service.serv_descrip}</option>
                                    );
                                })}
                            </select>   
                        </div>
                        <div className="col-sm-3">
                            <small>Precio: $ </small>{selectedService.serv_price} 
                        </div>
                        <div className="col-sm-2">
                            <i className="bi bi-plus-circle" style={{fontSize:2+'rem'}} role="button" onClick={() => {
                                //const newItem = services.find((service) => service.serv_id === selectedServiceId);
                                addInvoiceItem(selectedService);
                            }}></i>
                        </div>                            
                    </div>                         
               </fieldset> 
               <button type="button" class="btn btn-success" disabled={itemsInvoice.length === 0 || loadingServices} onClick={submit}>Register Invoice</button>             
            </form> 

            <div className="row">
                <table className='table table-dark table-striped'>
                    <tbody>
                        {
                            itemsInvoice.map((item) => {
      
                                return (
                                    <tr>
                                        <td>{item.serv_descrip}</td>
                                        <td>{item.serv_price}</td>
                                        <td><i class="bi bi-x-circle" role='button' style={{fontSize: 1.5+'rem'}} onClick={() => removeInvoiceItem(item.id)}></i></td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>  
            <hr></hr>

            <p>Total: {inv_total}</p>     
            {loadingInvoiceInserted ?
                <div class="spinner-border" role="status">
                            <span class="sr-only"></span>
                </div>
                :
                <p></p>   
            }  

<button type="button" className="btn btn-primary" id="liveToastBtn">Show live toast</button>

<div className="toast-container position-fixed bottom-0 end-0 p-3">
  <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
    <div classname="toast-header">
      <img src="..." class="rounded me-2" alt="..."/>
      <strong className="me-auto">Bootstrap</strong>
      <small>11 mins ago</small>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div className="toast-body">
      Hello, world! This is a toast message.
    </div>
  </div>
</div>                 
            
        </>
    );
}

export default AddinvoiceCustomerForm;
