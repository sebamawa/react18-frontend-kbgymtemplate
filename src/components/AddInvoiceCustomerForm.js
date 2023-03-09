import { useState, useEffect } from "react";
import './AddInvoiceCustomerForm.css';

function AddinvoiceCustomerForm(
    {customer, 
    updateCustomerInvoices = f => f,
    swapInvoicesListAddInvoice = f => f}) {

    const [services, setServices] = useState([]);
    const [loadingServices, setLoadingServices] = useState(false);
    const [selectedService, setSelectedService] = useState({});

    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState({});

    const [changeBeetweenServiceProduct, setChangeBeetweenServiceProduct] = useState(true);

    const [itemsInvoice, setItemsInvoice] = useState([]);
    const [countItemsInvoice, setCountItemsInvoice] = useState(0);

    const [loadingInvoiceInserted, setLoadingInvoiceInserted] = useState(false);

    const[invitem_descrip, setInvitem_descrip] = useState('');
    const[invitem_descrip_disabled, setInvitem_descrip_disabled] = useState(true);
    const [invitem_price, setInvitem_price] = useState(0);

    const today = (new Date()).toISOString().substring(0, 10);
    //const today = (new Date()).toLocaleDateString();   //toISOString().substring(0, 10);

    const [inv_date, setInv_date] = useState(today);
    const [inv_total, setInv_total] = useState(0);

    const addInvoiceItem = () => {
        if (invitem_descrip === "") {
            alert(`You must enter a descripction for the service or product.`);
            return
        }
        if (invitem_price === 0) {
            alert(`You must enter a value greater than zero for the service/product.`);
            return
        }

        // calculate serv_id or prod_id
        let s_id = 0;
        let p_id = 0;
        if (changeBeetweenServiceProduct) { // changeBeetweenServiceProduct = true => service
            s_id = selectedService.serv_descrip === invitem_descrip ? selectedService.serv_id : 0;
            p_id = 0;
        } else {
            p_id = selectedProduct.prod_descrip === invitem_descrip ? selectedProduct.prod_id : 0;
            s_id = 0;
        }

        setCountItemsInvoice(countItemsInvoice + 1); // 1 linea de factura mas
        setItemsInvoice([...itemsInvoice, 
            {
                id: countItemsInvoice, // agrego id de linea a item (para agregado/borrado en el front)

                // mejorar esta condicion para enviar el serv_id al backend en caso de que corresponda
                invitem_serv_id: s_id,
                invitem_prod_id: p_id,
                invitem_descrip: invitem_descrip,
                invitem_price: parseInt(invitem_price),
                invitem_quantity: 1
            }]); 

        console.log(itemsInvoice);    

        const total = inv_total + parseInt(invitem_price);
        setInv_total(total); // update total TODO: * serv_quantity 
    }

    const removeInvoiceItem = (id) => {
        setCountItemsInvoice(countItemsInvoice - 1); // 1 linea de factura menos
        // update total
        const itemLine = itemsInvoice.find(item => item.id === id); 
        setItemsInvoice(itemsInvoice.filter(item => item.id !== id)); // elimino item de itemsInvoice
        setInv_total(inv_total - parseInt(itemLine.invitem_price));
    }

    const submit = async (e) => {
        e.preventDefault();

        setLoadingInvoiceInserted(true);

        // armo items de la factura para enviar al backend
        // const Items = [
        //     {
        //         invitem_serv_id: selectedService.serv_descrip === invitem_descrip ? selectedService.serv_id : 0,
        //         invitem_descrip: "Servicio 1",
        //         invitem_quantity: 1,
        //         invitem_price: 3600
        //     },
        //     {
        //         invitem_serv_id: 5,
        //         invitem_descrip: "Servicio 2",
        //         invitem_quantity: 1,
        //         invitem_price : 4000
        //     }
        // ];

        // remuevo id de los objetos del array de items
        const itemsToSend = itemsInvoice.map(({id, ...keepAttrs}) => keepAttrs);
        
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
                        Items : itemsToSend // Items
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
                alert(`Invoice inserted successfully for customer ${customer.cust_fullname}`);
                // navigate(`/customer-details/${customer.cust_id}`, {state: {customer: customer}, replace: true}); 
            } else {
                alert(`Error inserting invoice for customer ${customer.cust_fullname}`);    
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
         (async() => {   
          try {
            setLoadingServices(true);
            
            const response = await fetch(`http://192.168.1.5:8080/KBGymTemplateJavaMySQL/ServicesAPI/List?serv_type_id=2`);
           
            const json = await response.json();
            setServices(json.SDTServices);
            const firstServ = json.SDTServices[0];
            setSelectedService(firstServ);
            setInvitem_descrip(firstServ.serv_descrip);
            setInvitem_price(firstServ.serv_price);
            setLoadingServices(false);
          } catch (error) {
            console.log(error);
            // setErrorMsg(`Un error ha ocurrido, pruebe recargar la página. 
            //              Descripción: ${error.message}`);
          }  
    })(); 
    }, []);   

    useEffect(() => {
        (async() => {   
         try {
           //setLoadingServices(true);
           
           const response = await fetch(`http://192.168.1.5:8080/KBGymTemplateJavaMySQL/APIProducts/List?prod_type_id=2`);
          
           const json = await response.json();
           //console.log(json);
           setProducts(json.SDTProducts);
           const firstProd = json.SDTProducts[0];
           setSelectedProduct(firstProd);
         } catch (error) {
           console.log(error);
         }  
   })(); 
   }, []);   
   
   

    return (
        <div className="form-background rounded"> 

            <form onSubmit={submit} className="p-3 mb-2 text-white">
                <div class="row">
                    <label for="inv_date" class="col-sm-2 col-form-label"><small>Date*:</small></label>
                    <div class="col-10">
                        <input type="date" class="form-control" id="inv_date" value={inv_date} onChange={e => setInv_date(e.target.value)}/>
                    </div>
                </div>
                <hr/>
                <div class="row">
                    <label for="cust_fullname" className="col-sm-2 col-form-label"><small>Name*:</small></label>
                    <div className="col-4">
                        <input type="text" readOnly className="form-control-plaintext text-light" id="cust_fullname" defaultValue={customer.cust_fullname}/>
                    </div>

                    <label for="cust_identification" className="col-sm-3 col-form-label"><small>Identification*:</small></label>
                    <div className="col-3">
                        <input type="text" readOnly className="form-control-plaintext text-light" id="cust_identification" defaultValue={customer.cust_identification}/>
                    </div>                    
                </div> 
                <hr/>    
                {/* <fieldset className="col-form-label">
                    <legend><h5>Add Items</h5></legend> */}
                    <div className="row">
                        
                        <div className="col-6">
                            <div className="form-group">
                                <select className="form-select form-control"
                                        onChange={ e => {
                                            setChangeBeetweenServiceProduct(!changeBeetweenServiceProduct);
                                            if (changeBeetweenServiceProduct) {
                                                setInvitem_descrip(selectedProduct.prod_descrip);
                                                setInvitem_price(selectedProduct.prod_price);
                                            } else {
                                                setInvitem_descrip(selectedService.serv_descrip);
                                                setInvitem_price(selectedService.serv_price);
                                            }
                                        }}>
                                
                                    <option value="1">Services</option>
                                    <option value="2">Products</option>
                                </select>
                            </div>

                            { changeBeetweenServiceProduct ?                
                            <div className="form-group">
                                <label for="serv_id">Service</label>
                                <select className="form-select form-control" id="serv_id" 
                                        onChange={ e => {
                                            const actualServ = services.find((serv) => serv.serv_id === parseInt(e.target.value));
                                            setSelectedService(actualServ);
                                            setInvitem_descrip(actualServ.serv_descrip);
                                            setInvitem_price(actualServ.serv_price);
                                }}>
                                    {loadingServices ? <option value="" readOnly>Loading...</option> :
                                    
                                    services.map((service) => {
                                        return (
                                            <option value={service.serv_id} key={service.serv_id}>{service.serv_descrip}</option>
                                        );
                                    })}
                                    {/* <option value='0' key='0' >None</option>  */}
                                </select>   
                            </div>
                            :
                            <div className="form-group">
                                <label for="prod_id">Product</label>
                                <select className="form-select form-control" id="prod_id" 
                                        onChange={ e => {
                                            const actualProd = products.find((prod) => prod.prod_id === parseInt(e.target.value));
                                            setSelectedProduct(actualProd);
                                            setInvitem_descrip(actualProd.prod_descrip);
                                            setInvitem_price(actualProd.prod_price);
                                }}>
                                    {/* {loadingServices ? <option value="" readOnly>Loading...</option> : */}
                                    
                                    {products.map((prod) => {
                                        return (
                                            <option value={prod.prod_id} key={prod.prod_id}>{prod.prod_descrip}</option>
                                        );
                                    })} 
                                </select>   
                            </div> 
                            }                           
                        </div>
                    
                        <div className="col-6">
                        <div className="col-1 mx-auto">
                            <i className="bi bi-plus-circle" style={{fontSize:2+'rem'}} disabled={loadingServices} role="button" onClick={() => {
                                //const newItem = services.find((service) => service.serv_id === selectedServiceId);
                                addInvoiceItem();
                            }}></i>
                        </div>  
                    </div>    
                    <div className="row">
                            <div className="col-6">
                                <div className="form-group">
                                        <textarea 
                                            class="form-control" id="invitem_descrip" 
                                            rows="3" 
                                            disabled = {invitem_descrip_disabled}
                                            value={invitem_descrip}
                                            placeholder={"Descripction of service or product (required)"}
                                            onChange={e => setInvitem_descrip(e.target.value)}>
                                        </textarea>
                                </div>
                            </div>
                            <div className="col-1 d-flex">
                                <p className="float-start">
                                    <i 
                                        class="bi bi-pencil" 
                                        role='button' 
                                        style={{fontSize: 1.0+'rem'}}
                                        onClick={() => setInvitem_descrip_disabled(!invitem_descrip_disabled)}>  
                                    </i>
                                    <br></br>
                                    <i 
                                        class="bi bi-trash"
                                        role='button'
                                        style={{fontSize: 1.0+'rem'}}
                                        onClick={() => {
                                            setInvitem_descrip('')
                                            // setInvitem_price(0);
                                        }}>    
                                    </i>
                                </p>
                            </div>
                            <div className="col-5">
                                <div className="form-group">
                                    <label for="invitem_price">Price</label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        id="invitem_price" 
                                        value={invitem_price} 
                                        placeholder={"Line price (required)"}
                                        onChange={e => setInvitem_price(e.target.value)}
                                    />
                                    {/* <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small> */}
                                </div>
                            </div>           
                        </div>
                    </div>          
                                        
               {/* </fieldset>  */}
           

               <button type="button" class="btn btn-success" disabled={itemsInvoice.length === 0 || loadingServices} onClick={submit}>Register Invoice</button>             
            </form> 

            <div className="row">
                <table className='table table-dark table-striped'>
                    <tbody>
                        {
                            itemsInvoice.map((item) => {
      
                                return (
                                    <tr>
                                        <td>{item.invitem_descrip}</td>
                                        <td>{item.invitem_price}</td>
                                        <td><i class="bi bi-x-circle" role='button' style={{fontSize: 1.5+'rem'}} onClick={() => removeInvoiceItem(item.id)}></i></td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>  
            <hr></hr>

            <p>Total: $ {inv_total}</p>     
            {loadingInvoiceInserted ?
                <div class="spinner-border" role="status">
                            <span class="sr-only"></span>
                </div>
                :
                <p></p>   
            }  
            
        </div>
    );
}

export default AddinvoiceCustomerForm;
