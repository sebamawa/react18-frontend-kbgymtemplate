import { useState, useEffect } from "react";

function AddinvoiceCustomerForm({customer}) {

    const [services, setServices] = useState([]);
    const [loadingServices, setLoadingServices] = useState(false);
    const [selectedService, setSelectedService] = useState(0);

    const [itemsInvoice, setItemsInvoice] = useState([]);
    const [countItemsInvoice, setCountItemsInvoice] = useState(0);

    const today = new Date().toISOString().substring(0, 10);

    const [inv_date, setInv_date] = useState(today);
    // const [inv_total, setInv_total] = useState(0);

    const addItemInvoice = (newItem) => {
        setCountItemsInvoice(countItemsInvoice + 1); // 1 linea de factura mas
        setItemsInvoice([...itemsInvoice, {...newItem, id: countItemsInvoice}]); // agrego id de linea a item
    }

    const submit = e => {
        alert("Aun no se ingresan facturas...");
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

            <form onSubmit={submit}>
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
                        <input type="text" readonly className="form-control-plaintext text-light" id="cust_identification" defaultValue={customer.cust_identification}/>
                    </div>                    
                </div> 
                <hr/>    
                <fieldset className="col-form-label">
                    <legend>Add Items</legend>
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
                                addItemInvoice(selectedService);
                            }}></i>
                        </div>                            
                    </div>                         
               </fieldset>            
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
                                        <td><i class="bi bi-x-circle" role='button' style={{fontSize: 1.5+'rem'}}></i></td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>       

            {/* <input type="date" name="inv_date" value={inv_date} onChange={e => setInv_date(e.target.value)} />
            <button type="button" onClick={submit} className="btn btn-primary">Submit</button> */}
        </>
    );
}

export default AddinvoiceCustomerForm;
