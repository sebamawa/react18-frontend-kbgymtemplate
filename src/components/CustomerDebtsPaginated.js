import { useState, useEffect } from 'react';

function CustomerDebtsPaginated({customer}) {

    const [currentDebts, setCurrentDebts] = useState([]);
    const [loadingDebts, setLoadingDebts] = useState(false);
    const [debtToChangeStatus, setDebtToChangeStatus] = useState({});
    const [firstRender, setFirstRender] = useState(false);
    const [loadingDebtUpdated, setLoadingDebtUpdated] = useState(false);

    // to render the month name
    const months = ["Enero", "Febrero", "Merzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const getMonth = (dateString) => { // dateString: "YYYY-MM-DD"
        const monthString = months[parseInt(dateString.substring(5, 7)) - 1];
        return monthString;
    }     

    useEffect(() => {

        (async() => {   
         try {
           
              setLoadingDebts(true);
              const response = await fetch(`http://192.168.1.5:8080/KBGymTemplateJavaMySQL/DebtsAPI/List?cust_id=${customer.cust_id}`);
              const json = await response.json();
              // console.log(json);
              setCurrentDebts(json.SDTDebts); 
              setLoadingDebts(false);
         } catch (error) {
           console.log(error);
           alert(error);           
         }  
         })(); 
     }, []);    


    useEffect(() => {

        (async() => {   
         try {
           //setLoading(true);
           if (!firstRender) {
               setFirstRender(true);
               return;
           }

           setLoadingDebtUpdated(true);

           const response =  await fetch(`http://192.168.1.5:8080/KBGymTemplateJavaMySQL/DebtsAPI/UpdateCustomerDebtStatus`, {
               method: 'PUT',
               headers: { 
                   'Content-Type': 'application/json'
               },
               body: JSON.stringify({
                   debt_id: debtToChangeStatus.debt_id,
                   debt_cancelled: debtToChangeStatus.debt_cancelled 
               })
           });

           const json = await response.json();
           
           setLoadingDebtUpdated(false);
         } catch (error) {
           console.log(error);
           alert(error);           
         }  
         })(); 
     }, [debtToChangeStatus]);    
    

    return (
        <>
        <h3>Debts List</h3>
        { loadingDebts ? <h3>Loading debts</h3> :   
             
            <div className='mt-3'>
                <table className="table table-striped table-light table-sm table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Date</th>
                            <th scope="col">Month</th>
                            <th scope="col">Descrip</th>
                            <th>Active/Cancelled 
                                <i className="bi bi-square" style={{fontSize:1+'rem'}}></i> &nbsp;
                                <i className="bi bi-check2-square" style={{fontSize:1+'rem'}}></i>
                            </th>
                        </tr>
                    </thead> 
                    <tbody>
                        { currentDebts && currentDebts.map((item) => 
                                <tr className={item.debt_cancelled ? "table-success" : "table-danger"} key={item.debt_id}>
                                    <td>{item.debt_date}</td>
                                    <td>{getMonth(item.debt_date)}</td>
                                    <td>{item.debt_descrip}</td>
                                    {loadingDebtUpdated && item.debt_id === debtToChangeStatus.debt_id
                                        ? 
                                        <td>
                                            <label className="form-check-label text-warning" for="cust_active">
                                                <div className="spinner-border" role="status">
                                                    <span className="sr-only"></span>
                                                </div>
                                            </label>
                                        </td> 
                                        :
                                        <td>
                                            <input className="form-check-input" type="checkbox" value={item.debt_cancelled} id="debt_cancelled" checked={item.debt_cancelled} 
                                                onClick = {() => {
                                                    const confirmation = window.confirm(`Are you sure you want to change the status of the debt to: ${item.debt_cancelled ? "Active" : "Cancelled"}?`);
                                                    if (confirmation) {
                                                    
                                                        // update debt status
                                                        const auxCurrentDebts = currentDebts.map(d => {
                                                            if (d.debt_id === item.debt_id) {
                                                                //const dCopy = {...d, debt_cancelled: !item.debt_cancelled}
                                                                d.debt_cancelled = !item.debt_cancelled; // modifica d?
                                                                setDebtToChangeStatus(d);
                                                                return d;
                                                                //return dCopy;
                                                            }
                                                            return d;
                                                        }); 
                                                        setCurrentDebts(auxCurrentDebts);
                                                    }
                                                }}
                                                onChange = {() => {

                                                }}
                                            />
                                        </td>
                                    }
                                </tr>
                        )}    
                    </tbody>
                </table>
            </div>
            }
    </>
    );
}

export default CustomerDebtsPaginated;