import { useEffect, useState } from "react";

function MonthlySummaries({}) {

    const [monthlySummaries, setMonthlySummaries] = useState([]);
    const [loadingSummaries, setLoadingSummaries] = useState(false);

    useEffect(() => {
        (async () => {
            try {

                // if (!firstRender) {
                //     setFirstRender(true);
                //     return;
                // }
    
               setLoadingSummaries(true);
               
               const response =  await fetch(`http://192.168.1.5:8080/KBGymTemplateJavaMySQL/MonthlySummariesAPI/List`);
                   
               const json = await response.json();
               //console.log(json);
               setMonthlySummaries(json);
               
               setLoadingSummaries(false);
             } catch (error) {
               console.log(error);
               alert(error);
             }            
        })();
    }, []);

    return (
        <>
        {loadingSummaries ?         
            <div className="spinner-border text-warning mx-auto" role="status">
                <span className="sr-only"></span>
            </div>
        :
        <table className={'table table-dark table-striped-columns table-hover'}>
            <thead>
                <tr>
                    <th scope='col'>Year</th>
                </tr>
            </thead>
            <tbody>
                {monthlySummaries && monthlySummaries.map((d)=> 
                    <>
                        <tr>
                            <td><h3>{d.Year}</h3></td>
                            {d.MonthItem.map((m) => 
                                <td>{m.MonthName}</td>                     
                            )} 
                        </tr>
                        <tr>
                            <td>Total Month</td>
                            {d.MonthItem.map((m) => 
                                <td>{m.MonthTotal}</td>                     
                            )} 
                        </tr>
                    </>
                )}
            </tbody>
        </table>
        }
    </>
    );
}

export default MonthlySummaries;