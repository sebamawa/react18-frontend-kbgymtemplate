import { useEffect } from "react";

function MonthlySummaries({}) {

    

    useEffect(() => {
        (async () => {
            try {

                // if (!firstRender) {
                //     setFirstRender(true);
                //     return;
                // }
    
               // setLoadingCustomer(true);
               
               const response =  await fetch(`http://192.168.1.5:8080/KBGymTemplateJavaMySQL/MonthlySummariesAPI/List`);
                   
               const json = await response.json();
               console.log(json);
               //setCustomer(json);
               
               //setLoadingCustomer(false);
             } catch (error) {
               console.log(error);
               alert(error);
             }            
        })();
    });

    return (
        <h3>Monthly Summaries component</h3>
    );
}

export default MonthlySummaries;