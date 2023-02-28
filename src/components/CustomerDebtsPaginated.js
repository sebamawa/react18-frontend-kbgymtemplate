import { useState, useEffect } from 'react';

function DisplayItems({currentItems}) {
    console.log(currentItems);
    return (
        <>  
            <table className="table table-dark table striped table-hover">
                <thead>
                    <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Descrip</th>
                    </tr>
                </thead> 
                <tbody>

                    { currentItems && currentItems.map((item) => 
                            <tr key={item.debt_id}>
                                <td>{item.debt_date}</td>
                                <td>{item.debt_descrip}</td>
                            </tr>
                    )} 
                </tbody>
            </table>
        </>    
    );
}

function CustomerDebtsPaginated({customer}) {

    const [currentDebts, setCurrentDebts] = useState([]);

    useEffect(() => {

        try {
            const fetchDebts = async () => {
              //setLoadingInvoices(true);
              const response = await fetch(`http://192.168.1.5:8080/KBGymTemplateJavaMySQL/DebtsAPI/List?cust_id=${customer.cust_id}`);
              const json = await response.json();
              // console.log(json);
              setCurrentDebts(json.SDTDebts); 
              //console.log(json.SDTDebts);
              //console.log(currentDebts);
              //setLoadingInvoices(false);
            }
            fetchDebts();
          } catch (error) {
            console.log(error);
          }
    }, []); 
    
    return (
        <>
            <DisplayItems 
                currentItems = {currentDebts} 
            /> 
        </>
    );
}

export default CustomerDebtsPaginated;