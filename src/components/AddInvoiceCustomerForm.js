import { useState, useEffect } from "react";

function AddinvoiceCustomerForm({customer}) {

    const [services, setServices] = useState([]);

    const today = new Date().toISOString().substring(0, 10);

    const [inv_date, setInv_date] = useState(today);
    // const [inv_total, setInv_total] = useState(0);

    const submit = e => {
        alert("Aun no se ingresan facturas...");
    }

    useEffect(() => {
         (async() => {   
          try {
            // setLoading(true);
            
            const response = await fetch(`http://192.168.1.5:8080/KBGymTemplateJavaMySQL/ServicesAPI/List?serv_type_id=2`);
           
            const json = await response.json();
            setServices(json.SDTServices);
            // console.log(json.SDTServices);
            // setLoading(false);
            // setErrorMsg("");
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
                    
                <div className="row">
                    <div className="form-group col-md-6">
                        <label for="inv_date"><small>Date</small></label>
                        <input type="date" className="form-control" id="inv_date" name="inv_date" value={inv_date} onChange={e => setInv_date(e.target.value)}/>
                    </div>
                </div>
                <hr/>
                <fieldset class="col-form-label">
                    <legend>Customer Data*</legend>
                    <div className="row">
                        <div className="form-group col-md-6">
                            <label for="cust"><small>Customer Name*</small></label>
                            <input type="input" className="form-control" id="cust" value={customer.cust_fullname} required disabled/>
                        </div>                    
                        <div className="form-group col-md-6">
                            <label for="cust_identification"><small>Identification*</small></label>
                            <input type="input" className="form-control" id="cust_identification" value={customer.cust_identification} disabled/>                    
                        </div>
                    </div>
                    <hr/>
                </fieldset>
            </form>


            {/* <input type="date" name="inv_date" value={inv_date} onChange={e => setInv_date(e.target.value)} />
            <button type="button" onClick={submit} className="btn btn-primary">Submit</button> */}
        </>
    );
}

export default AddinvoiceCustomerForm;
