import { useState } from "react";

function AddinvoiceCustomerForm({customer}) {

    console.log(customer);

    const today = new Date().toISOString().substring(0, 10);

    const [inv_date, setInv_date] = useState(today);
    // const [inv_total, setInv_total] = useState(0);

    const submit = e => {
        alert("Aun no se ingresan facturas...");
    }

    return (
        <>
            <form onSubmit={submit}>
                    
                <div className="row">
                    <div className="form-group col-md-6">
                        <label for="inv_date">Date</label>
                        <input type="date" className="form-control" id="inv_date" name="inv_date" value={inv_date} onChange={e => setInv_date(e.target.value)}/>

                        <label for="cust_identification">Identification</label>
                        <input type="input" className="form-control" id="cust_identification" value={customer.cust_identification} disabled/>                    </div>
                    <div className="form-group col-md-6">
                        <label for="cust">Customer</label>
                            <input type="input" className="form-control" id="cust" value={customer.cust_fullname} disabled/>
                    </div>
                </div>
            </form>


            {/* <input type="date" name="inv_date" value={inv_date} onChange={e => setInv_date(e.target.value)} />
            <button type="button" onClick={submit} className="btn btn-primary">Submit</button> */}
        </>
    );
}

export default AddinvoiceCustomerForm;
