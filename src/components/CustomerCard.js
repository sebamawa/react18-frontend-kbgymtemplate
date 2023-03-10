import { useState, useEffect } from "react";


function CustomerCard({customerInit, updateCustomerFromDebtsBool}) {

    const [customer, setCustomer] = useState(customerInit);
    const [cust_active, setCustActive] = useState(customerInit.cust_active); // checkbox
    const [loadingChangeStatus, setLoadingChangeStatus] = useState(false);
    const [firstRender, setFirstRender] = useState(false); 
    const [loadingCustomer, setLoadingCustomer] = useState(false);

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
           setCustomer(json.SDTCustomer);
           // console.log(json.SDTCustomer);
           
           setLoadingChangeStatus(false);
         } catch (error) {
           console.log(error);
           alert(error);
         }  
         })(); 
     }, [cust_active]);    

    useEffect(() => {

        (async() => {   
         try {

            if (!firstRender) {
                setFirstRender(true);
                return;
            }

           setLoadingCustomer(true);
           
           const response =  await fetch(`http://192.168.1.5:8080/KBGymTemplateJavaMySQL/CustomersAPI/GetById?cust_id=${customer.cust_id}`);
               
           const json = await response.json();
           setCustomer(json);
           
           setLoadingCustomer(false);
         } catch (error) {
           console.log(error);
           alert(error);
         }  
         })(); 
     }, [updateCustomerFromDebtsBool]);  
     
     return (
         <>
         {loadingCustomer ? 
            <div className="spinner-border text-warning float-start" role="status">
                <span className="sr-only"></span>
            </div>
        :
        (
            <div className={"card " + (customer.cust_has_debt ? "bg-danger border border-5 border-danger" : (customer.cust_monthly_serv_pending ? "bg-warning" : ""))}>
            <img src={customer.cust_image}  alt={customer.cust_fullname}/>
            <div className={"card-body"}>
                <h5 className="card-title text-black">{customer.cust_fullname}</h5> 
                <h6 className="text-black">{`Identification: ${customer.cust_identification}`}</h6>
                <h6 className="text-black">{`Phone: ${customer.cust_phone}`}</h6>
                {customer.cust_active ? <h6 className={"text-black rounded " + (customer.cust_has_debt || customer.cust_monthly_serv_pending ? "bg-info" : "bg-warning")}>{"Payday limit: " + (customer.cust_pay_out_of_period ? customer.cust_payday_limit : "before 10")}</h6> : null}
                <h4 className="text-black rounded "><i className={customer.cust_has_debt ? "bi bi-exclamation-triangle text-danger" : ""}></i></h4>
                <div className="form-check">
                    {!loadingChangeStatus
                    ?
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
                    :
                    <div className="form-check-input">
                    <label className="form-check-label text-success" for="cust_active">
                        <div className="spinner-border" role="status">
                            <span className="sr-only"></span>
                        </div>
                    </label>
                    </div>
                    }
                    
                    <label className="form-check-label text-black" for="cust_active">
                        <h6>Is active?</h6>
                    </label>
                    </div>            
                </div>
            </div>  
        )} 
        </>      
    );

}

export default CustomerCard;