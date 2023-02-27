import { useParams, useLocation } from "react-router-dom";
import { CustomerInvoicesPage } from "./CustomerInvoicesPage";
import { useState, useEffect } from "react";

function CustomerDetailsPage() {
    // const parms = useParams();
    const location = useLocation();
    const { customer } = location.state;

    const [cust_active, setCustActive] = useState(customer.cust_active);
    const [firstRender, setFirstRender] = useState(false); 
    const [loadingChangeStatus, setLoadingChangeStatus] = useState(false);

    useEffect(() => {

         (async() => {   
          try {
            //setLoading(true);
            if (!firstRender) {
                setFirstRender(true);
                return;
            }

            setLoadingChangeStatus(true);
            
            const response =  await fetch(`http://192.168.1.5:8080/KBGymTemplateJavaMySQL/CustomersAPI/UpdateStatus`, {
                method: 'PUT',
                // crossDomain: true,
                headers: { 
                    'Content-Type': 'application/json'
                },
                //mode: 'no-cors',
                body: JSON.stringify({
                    cust_id: customer.cust_id,
                    cust_active: cust_active
                })
            });

            const json = await response.json();
            console.log(json);
            
            setLoadingChangeStatus(false);
          } catch (error) {
            console.log(error);
            alert(error);
            // setErrorMsg(`Un error ha ocurrido, pruebe recargar la página. 
            //              Descripción: ${error.message}`);
          }  
          })(); 
      }, [cust_active]);

    return (
        <>
            <div className="row">
                <div className="col-3 mt-3">
                    <h3>Customer</h3>
                    <div className={"card " + (customer.cust_has_debt ? "bg-warning border border-5 border-danger" : "")}>
                        <img src={customer.cust_image}  alt={customer.cust_fullname}/>
                        <div className={"card-body"}>
                            <h5 className="card-title text-black">{customer.cust_fullname}</h5> 
                            <h6 className="text-black">{`Identification: ${customer.cust_identification}`}</h6>
                            <h6 className="text-black">{`Phone: ${customer.cust_phone}`}</h6>
                            {customer.cust_active ? <h6 className={"text-black rounded " + (customer.cust_has_debt ? "bg-danger" : "bg-warning")}>{"Payday limit: " + (customer.cust_pay_out_of_period ? customer.cust_payday_limit : "before 10")}</h6> : null}
                            <h4 className="text-black rounded "><i className={customer.cust_has_debt ? "bi bi-exclamation-triangle text-danger" : ""}></i></h4>
                            <div class="form-check">
                                
                                <input className="form-check-input" type="checkbox" value={cust_active} id="cust_active" checked={cust_active} 
                                    onClick={() => {
                                        const msg = cust_active ? `inactive` : `active`;
                                        const confirmation = window.confirm(`Are you sure you want to change the status of ${customer.cust_fullname} to ${msg}?`);
                                        if (confirmation)
                                            // setConfirmChangeStatus(confirmation);
                                            setCustActive(!cust_active);
                                    }}
                                    onChange={() => {
                                        // setCustActive(!cust_active);
                                        // alert(`Status changed`);
                                    }}
                                />
                                {!loadingChangeStatus ? 
                                
                                    <label className="form-check-label text-black" for="cust_active">
                                        <h6>Is active?</h6>
                                    </label>
                                :
                                <label className="form-check-label text-warning" for="cust_active">
                                <div class="spinner-border" role="status">
                                    <span class="sr-only"></span>
                                </div>
                            </label>
                                }
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