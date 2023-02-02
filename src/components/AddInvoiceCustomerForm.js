import { useState } from "react";

function AddinvoiceCustomerForm() {

    const [inv_date, setInv_date] = useState("");
    const [inv_total, setInv_total] = useState(0);

    const submit = e => {}

    return (
        <>
            <form onSubmit={submit}>
                <input type="date" name="inv_date" value={inv_date} onChange={e => setInv_date(e.target.value)} />
            </form>    
        </>
    );
}

export default AddinvoiceCustomerForm;
